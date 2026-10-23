import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
import {publishVix,validatePublishedVixReceipt} from './lib/vix-publication.mjs';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const parent=path.join(project,'.cache/vix-publication-checks');
await mkdir(parent,{recursive:true});
const temp=await mkdtemp(path.join(parent,'fixture-'));
const relative=path.relative(parent,temp);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));
const sha=value=>createHash('sha1').update(value).digest('hex');
const blobSha=bytes=>sha(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes]));
const canonicalDigest=value=>createHash('sha256').update(canonicalSourcePackage(value)).digest('hex');
const input='a'.repeat(40),inputTree='b'.repeat(40),date='2099-01-01';
let totalCalls=0,cases=0;
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{throw Error('Publication checks cannot call a real service');};

async function fixture(name){
  const root=path.join(temp,name),vixDir=path.join(root,'vix-marking'),selectionFile=path.join(root,'selection.json'),receiptFile=path.join(root,'vix-publication.json');
  const selection={studyDate:date,vixInputCommit:input,vixMarkLabel:date.slice(2),mainWords:Array.from({length:50},(_,i)=>({entryId:`fixture-${i+1}`,globalRank:i+1,text:`word${i+1}`,family:[]}))};
  const manifest={protocol:'vix-seed-access/2',scope:{domainId:'domain_general_english',section:'word',records:50},counts:{records:50},binding:{marks:{labelFormat:'YY-MM-DD',externalDateMeaning:true,yearBase:2000}},recordTuple:['entryId','globalRank','text','markDates'],records:[{path:'data/seed-access/records/fixture.json'}]};
  const bodies=new Map([
    ['data/seed-access/manifest.json',JSON.stringify(manifest)],
    ['data/seed-access/records/fixture.json',JSON.stringify(selection.mainWords.map(item=>[item.entryId,item.globalRank,item.text,[date.slice(2)]]))],
    [`data/seed-access/dates/${date.slice(2)}.json`,JSON.stringify({date:date.slice(2),globalRanks:selection.mainWords.map(item=>item.globalRank)})],
    ['data/seed-access/mark-hash.json','{"fixture":"marks"}'],['data/seed-access/structure.json','{"fixture":"structure"}'],
    ['tools/build-seed-access.mjs',"// Self-written check fixture: no network or production content.\n"],
    ['vix-marking-workspace.json',JSON.stringify({protocol:'second-language-vix-marking/1',studyDate:date,inputCommit:input,selectionDigest:canonicalDigest(selection)})]
  ]);
  for(const [file,text] of bodies){const target=path.join(vixDir,file);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,text);}
  await writeFile(selectionFile,JSON.stringify(selection));
  const state={head:input,calls:[],commits:new Map([[input,{sha:input,tree:{sha:inputTree}}]]),trees:new Map(),commitPosts:0,patches:0,patchMode:'normal',descendants:new Set(),tamperTree:false};
  async function api(target,method='GET',body){
    totalCalls++;const url=new URL(target);assert.equal(url.origin,'https://api.github.com');state.calls.push({path:url.pathname,method});
    const route=url.pathname.replace('/repos/Gual-Wells/IELTS-Vocabulary-Index-List','');
    if(method==='GET'&&route==='/branches/main')return {commit:{sha:state.head}};
    if(method==='GET'&&route.startsWith('/git/commits/')){const result=state.commits.get(route.split('/').at(-1));assert(result,'Only known exact commits can be read');return structuredClone(result);}
    if(method==='POST'&&route==='/git/blobs')return {sha:blobSha(Buffer.from(body.content,'base64'))};
    if(method==='POST'&&route==='/git/trees'){assert.equal(body.base_tree,inputTree);const id=sha(JSON.stringify(body));state.trees.set(id,structuredClone(body.tree));return {sha:id};}
    if(method==='POST'&&route==='/git/commits'){state.commitPosts++;assert.deepEqual(body.parents,[input]);const id=sha(JSON.stringify(body)+state.commitPosts);state.commits.set(id,{sha:id,tree:{sha:body.tree},parents:body.parents.map(sha=>({sha})),message:body.message});return {sha:id};}
    if(method==='GET'&&route.startsWith('/git/trees/')){const id=route.split('/').at(-1),tree=structuredClone(state.trees.get(id));assert(tree);if(state.tamperTree)tree[0].sha='0'.repeat(40);return {sha:id,truncated:false,tree};}
    if(method==='PATCH'&&route==='/git/refs/heads/main'){
      state.patches++;assert.equal(body.force,false);assert(state.commits.has(body.sha));assert.equal(state.head,input);
      if(state.patchMode==='fail-before-update')throw Error('Simulated lost request before branch update');
      state.head=body.sha;if(state.patchMode==='lost-after-update')throw Error('Simulated response lost after branch update');return {object:{sha:state.head}};
    }
    if(method==='GET'&&route.startsWith('/compare/')){const [base,head]=route.slice('/compare/'.length).split('...');assert.equal(head,state.head);return {base_commit:{sha:base},merge_base_commit:{sha:state.descendants.has(base)?base:input},status:state.descendants.has(base)?'ahead':'diverged',behind_by:state.descendants.has(base)?0:1,ahead_by:1};}
    throw Error(`Unexpected isolated API request: ${method} ${route}`);
  }
  const publish=()=>publishVix({vixDir,selectionFile,api,now:()=>date+'T00:00:00Z'});
  return {root,vixDir,selectionFile,receiptFile,selection,state,publish};
}
try{
  const success=await fixture('success');
  const first=await success.publish();assert.equal(first.markedRecords,50);assert.equal(first.reused,false);assert.equal(success.state.head,first.vixCommit);
  const saved=JSON.parse(await readFile(success.receiptFile,'utf8'));assert.equal(saved.status,'published');assert.equal(saved.inputCommit,input);assert.equal(saved.files.length,5);assert.equal(saved.selectionDigest,canonicalDigest(success.selection));cases++;
  const chapterIdentity={studyDate:date,inputCommit:input,selectionDigest:canonicalDigest(success.selection),vixCommit:first.vixCommit};
  assert.equal(validatePublishedVixReceipt(saved,chapterIdentity),saved);
  for(const changed of [{studyDate:'2099-01-02'},{inputCommit:'0'.repeat(40)},{selectionDigest:'0'.repeat(64)},{vixCommit:'0'.repeat(40)}])assert.throws(()=>validatePublishedVixReceipt(saved,{...chapterIdentity,...changed}),/回执与本次章节/);
  for(const changed of [{status:'prepared'},{repository:'other/repo'},{verifiedAt:'not-a-time'},{filesDigest:'0'.repeat(64)}])assert.throws(()=>validatePublishedVixReceipt({...saved,...changed},chapterIdentity),/回执/);
  cases++;
  const writes=success.state.calls.filter(item=>item.method!=='GET').length,again=await success.publish();assert.equal(again.vixCommit,first.vixCommit);assert.equal(again.reused,true);assert.equal(success.state.calls.filter(item=>item.method!=='GET').length,writes);assert.equal(success.state.commitPosts,1);assert.equal(success.state.patches,1);cases++;

  const lost=await fixture('lost-response');lost.state.patchMode='lost-after-update';const recovered=await lost.publish();assert.equal(lost.state.head,recovered.vixCommit);assert.equal(lost.state.commitPosts,1);assert.equal(lost.state.patches,1);assert.equal(JSON.parse(await readFile(lost.receiptFile,'utf8')).status,'published');cases++;

  const uncertain=await fixture('uncertain');uncertain.state.patchMode='fail-before-update';await assert.rejects(uncertain.publish(),/更新结果未确认/);const prepared=JSON.parse(await readFile(uncertain.receiptFile,'utf8'));assert.equal(prepared.status,'prepared');assert.equal(uncertain.state.head,input);uncertain.state.patchMode='normal';const resumed=await uncertain.publish();assert.equal(resumed.vixCommit,prepared.vixCommit);assert.equal(uncertain.state.commitPosts,1,'Resume must reuse the exact pre-PATCH commit');assert.equal(uncertain.state.patches,2);cases++;

  const advanced=await fixture('unrelated-before');advanced.state.head='c'.repeat(40);await assert.rejects(advanced.publish(),/main 已变化且没有本次发布回执/);assert.equal(advanced.state.commitPosts,0);assert.equal(advanced.state.patches,0);cases++;

  const diverged=await fixture('unrelated-after-preparation');diverged.state.patchMode='fail-before-update';await assert.rejects(diverged.publish(),/更新结果未确认/);const before=await readFile(diverged.receiptFile,'utf8');diverged.state.head='c'.repeat(40);await assert.rejects(diverged.publish(),/不包含本次精确提交/);assert.equal(diverged.state.commitPosts,1);assert.equal(diverged.state.patches,1);assert.equal(await readFile(diverged.receiptFile,'utf8'),before);cases++;

  success.state.head='d'.repeat(40);success.state.descendants.add(first.vixCommit);const descendant=await success.publish();assert.equal(descendant.vixCommit,first.vixCommit);assert.equal(success.state.commitPosts,1);assert.equal(success.state.patches,1);cases++;
  await writeFile(path.join(success.vixDir,'data/seed-access/structure.json'),'{"fixture":"changed"}');const callsBefore=success.state.calls.length;await assert.rejects(success.publish(),/回执与冻结选词、原输入或拟提交文件不一致/);assert.equal(success.state.calls.length,callsBefore);cases++;

  const changed=await fixture('changed-selection');await changed.publish();await writeFile(changed.selectionFile,JSON.stringify({...changed.selection,mainWords:[...changed.selection.mainWords].reverse()}));const previous=changed.state.calls.length;await assert.rejects(changed.publish(),/工作副本与冻结 selection/);assert.equal(changed.state.calls.length,previous);cases++;

  const corrupt=await fixture('remote-file-mismatch');corrupt.state.tamperTree=true;await assert.rejects(corrupt.publish(),/远端发布文件与冻结回执不一致/);assert.equal(corrupt.state.patches,0);assert.equal(JSON.parse(await readFile(corrupt.receiptFile,'utf8')).status,'prepared');cases++;

  console.log(JSON.stringify({passed:cases,isolatedApiCalls:totalCalls,realNetworkCalls:0,checks:['first publication','chapter receipt identity bound; old or other chapter rejected','same success reused without writes','lost PATCH response reconciled','unconfirmed PATCH resumes exact commit','unrelated main rejected','prepared receipt retained on divergent main','verified descendant reused','changed files rejected','changed selection rejected','remote files verified before PATCH']}));
}finally{globalThis.fetch=originalFetch;await rm(temp,{recursive:true,force:true});}

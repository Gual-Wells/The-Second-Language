// Offline, author-owned fixtures. No historical chapter, VIX, paid API or cloud writes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createEvidenceFixture} from './check-chapter-evidence.mjs';
import {canonicalSourcePackage as canonical} from '../protocol/current-affairs.mjs';
import {AUTHORING_REVISION_KIND,validateAuthoringRevision,loadAuthoringContract} from './lib/chapter-authoring-revision.mjs';
import {assembleRun} from './lib/teaching-authoring.mjs';
import {prepareChapterEvidence,readChapterEvidence} from './lib/chapter-evidence.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex'),clone=structuredClone;
const put=async(file,value)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value,null,2)+'\n');};
const parent=path.resolve('.cache/authoring-revision-checks');await fs.mkdir(parent,{recursive:true});const root=await fs.mkdtemp(path.join(parent,'isolated-'));
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('Offline revision QA forbids network');};
let count=0;const check=async(name,fn)=>{await fn();count++;console.log('PASS '+name);};
try{
  const fixture=await createEvidenceFixture(root),{date,run,folder,sources,markdown}=fixture;
  const selection=clone(fixture.selection);delete selection.authoringPolicy;
  const selectionText=JSON.stringify(selection,null,2)+'\n',lockText=JSON.stringify({commit:selection.vixInputCommit},null,2)+'\n';
  await fs.writeFile(path.join(run,'selection.json'),selectionText);await fs.writeFile(path.join(run,'vix-source.json'),lockText);
  const oldMarkdown='<!-- PART:one -->\nAn author-owned old-format baseline fixture, not a learning chapter.\n';
  const oldSource={schemaVersion:1,studyDate:date,chapterDigest:hash(oldMarkdown),selectionDigest:hash(canonical(selection)),vixInputCommit:selection.vixInputCommit,sources,context:'Self-authored baseline fixture.'};
  const oldMeta={date,runId:date,authoringPolicy:'sourced-collection-v1',sourcePolicy:'current-affairs-v1',contentPolicy:'etymology-fused-v1',vixInputCommit:selection.vixInputCommit,vixCommit:'b'.repeat(40),sourceDigest:hash(canonical(oldSource))};
  await put(path.join(folder,'meta.json'),oldMeta);
  await check('old frozen selection cannot silently use new author objects',()=>assert.rejects(()=>assembleRun(root,date),/旧冻结/));
  const baselineText=JSON.stringify({schemaVersion:1,kind:'chapter-revision-baseline-v1',selection,meta:oldMeta,markdown:oldMarkdown,sourcePackage:oldSource});
  const revision={schemaVersion:1,kind:AUTHORING_REVISION_KIND,studyDate:date,runId:date,fromChapterDigest:hash(oldMarkdown),fromSourceDigest:hash(canonical(oldSource)),selectionDigest:hash(canonical(selection)),vixInputCommit:selection.vixInputCommit,vixCommit:oldMeta.vixCommit,fromAuthoringPolicy:'sourced-collection-v1',toAuthoringPolicy:'authentic-context-v1',authorizedAt:'2099-01-29T01:00:00Z',authorization:'Self-authored test authorization only.',baselineFile:`work/runs/${date}/revisions/offline-fixture/baseline.json`,baselineDigest:hash(baselineText)};
  const meta={...oldMeta,authoringPolicy:'authentic-context-v1',authoringRevision:revision};
  const baselineFile=path.join(root,revision.baselineFile);await fs.mkdir(path.dirname(baselineFile),{recursive:true});await fs.writeFile(baselineFile,baselineText);await put(path.join(folder,'meta.json'),meta);
  await check('explicit revision uses authentic policy with unchanged old selection',async()=>{assert.equal((await loadAuthoringContract(root,date,selection)).policy,'authentic-context-v1');assert.equal((await assembleRun(root,date)).markdown,markdown);assert.equal(await fs.readFile(path.join(run,'selection.json'),'utf8'),selectionText);assert.equal(await fs.readFile(path.join(run,'vix-source.json'),'utf8'),lockText);});
  for(const [name,change] of [
    ['main word',value=>value.mainWords[0].text='different'],
    ['family',value=>value.mainWords[0].family.push({text:'extra'})],
    ['new policy field',value=>value.authoringPolicy='authentic-context-v1'],
    ['VIX input',value=>value.vixInputCommit='c'.repeat(40)]
  ])await check('revision rejects changed '+name,()=>{const changed=clone(selection);change(changed);assert.throws(()=>validateAuthoringRevision(revision,{selection:changed,baselineText,meta,date}),/selection|选词|基线/);});
  await check('revision rejects cross-run use',()=>assert.throws(()=>validateAuthoringRevision(revision,{selection,baselineText,runId:'different'}),/跨日期或运行/));
  await check('revision rejects cross-date use',()=>assert.throws(()=>validateAuthoringRevision(revision,{selection,baselineText,date:'2099-01-30'}),/跨日期或运行/));
  await check('revision rejects altered baseline bytes',()=>assert.throws(()=>validateAuthoringRevision(revision,{selection,baselineText:baselineText+' ',meta}),/摘要/));
  await check('revision rejects altered original chapter identity',()=>{const changed={...revision,fromChapterDigest:'d'.repeat(64)};assert.throws(()=>validateAuthoringRevision(changed,{selection,baselineText}),/基线/);});
  await check('revision rejects altered original source identity',()=>{const changed={...revision,fromSourceDigest:'d'.repeat(64)};assert.throws(()=>validateAuthoringRevision(changed,{selection,baselineText}),/基线/);});
  await check('revision rejects path traversal',()=>assert.throws(()=>validateAuthoringRevision({...revision,baselineFile:'../baseline.json'},{selection,baselineText}),/授权|绑定/));
  await check('revision requires explicit authorization record',()=>assert.throws(()=>validateAuthoringRevision({...revision,authorization:''},{selection,baselineText}),/授权/));
  await check('revision rejects inconsistent current metadata',()=>assert.throws(()=>validateAuthoringRevision(revision,{selection,baselineText,meta:{...meta,vixCommit:'e'.repeat(40)}}),/元数据/));
  const evidence=await prepareChapterEvidence(root,date,{markdown,selection,sources,inputSources:[{...sources[0],readRecord:path.relative(root,fixture.original.recordPath)}]});
  const objects=new Map(evidence.objects.map(item=>[item.digest,JSON.parse(item.text)]));
  const chapter={...fixture.chapter,sourcePackage:{...fixture.chapter.sourcePackage,selectionDigest:revision.selectionDigest,evidenceDigest:evidence.digest}};
  await check('sealed evidence preserves and verifies original unmodified selection',async()=>{const restored=await readChapterEvidence({chapter,readAsset:async digest=>clone(objects.get(digest))});assert.equal(restored.manifest.selectionDigest,revision.selectionDigest);assert.equal(restored.authoring.length,50);});
  await fs.unlink(baselineFile);
  await check('sealed revision recovers without historical local baseline path',async()=>{const restored=await readChapterEvidence({chapter,readAsset:async digest=>clone(objects.get(digest))});assert.equal(restored.authoring.length,50);});
  await check('unsealed new edits still require original baseline on disk',()=>assert.rejects(()=>assembleRun(root,date),/ENOENT/));
  console.log(`Authoring revision QA: ${count}/${count} passed; no network, publication, VIX writes or paid calls.`);
}finally{globalThis.fetch=originalFetch;}

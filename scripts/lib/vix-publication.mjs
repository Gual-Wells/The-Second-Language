import {createHash,randomUUID} from 'node:crypto';
import {link,mkdir,readFile,rename,rm,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {loadVixIndex,familyRecords} from './vix-index.mjs';
import {validateVixDate} from './vix-date.mjs';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';

const protocol='second-language-vix-publication/1';
const repo='Gual-Wells/IELTS-Vocabulary-Index-List';
const sha=value=>/^[a-f0-9]{40}$/.test(value||'');
const digest=value=>createHash('sha256').update(canonicalSourcePackage(value)).digest('hex');
const blobSha=bytes=>createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
export function validatePublishedVixReceipt(receipt,{studyDate,inputCommit,selectionDigest,vixCommit}){
  const hex64=value=>/^[a-f0-9]{64}$/.test(value||'');
  if(!receipt||receipt.protocol!==protocol||receipt.repository!==repo||receipt.status!=='published'||receipt.studyDate!==studyDate||!sha(inputCommit)||receipt.inputCommit!==inputCommit||!hex64(selectionDigest)||receipt.selectionDigest!==selectionDigest||!sha(vixCommit)||receipt.vixCommit!==vixCommit||!sha(receipt.tree)||!sha(receipt.verifiedHead)||typeof receipt.verifiedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(receipt.verifiedAt)||!Number.isFinite(Date.parse(receipt.verifiedAt)))throw Error('VIX 已发布回执与本次章节、冻结选词或标注提交不一致；不得发布章节');
  validateVixDate({studyDate,vixMarkLabel:receipt.vixMarkLabel});
  if(!Array.isArray(receipt.files)||!receipt.files.length||new Set(receipt.files.map(item=>item.path)).size!==receipt.files.length||receipt.files.some(item=>!/^data\/seed-access\//.test(item.path||'')||item.path.includes('\\')||item.path.split('/').some(part=>!part||part==='.'||part==='..')||!sha(item.sha)||!Number.isSafeInteger(item.size)||item.size<0)||receipt.filesDigest!==digest(receipt.files))throw Error('VIX 已发布回执的拟提交文件摘要无效；不得发布章节');
  return receipt;
}
async function readReceipt(file){try{return JSON.parse(await readFile(file,'utf8'));}catch(error){if(error.code==='ENOENT')return null;throw error;}}
async function installReceipt(file,value){
  const temp=`${file}.${randomUUID()}.tmp`;
  try{await writeFile(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});try{await link(temp,file);}catch(error){if(error.code!=='EEXIST')throw error;}}
  finally{await rm(temp,{force:true});}
  return readReceipt(file);
}
async function finishReceipt(file,value){
  const temp=`${file}.${randomUUID()}.tmp`;
  try{await writeFile(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});await rename(temp,file);}
  finally{await rm(temp,{force:true});}
}

// The transport is injected so recovery can be checked entirely offline. A prepared
// receipt is installed before PATCH; retries reuse that exact commit, never mint a
// second business publication after an uncertain branch-update response.
export async function publishVix({vixDir,selectionFile,api,now=()=>new Date().toISOString()}){
  const root=path.resolve(vixDir),selection=JSON.parse(await readFile(selectionFile,'utf8'));
  validateVixDate(selection);
  if(!sha(selection.vixInputCommit))throw Error('selection 缺少 VIX 输入 commit');
  const selectionDigest=digest(selection),index=await loadVixIndex(root),chosen=familyRecords(selection);
  const marker=JSON.parse(await readFile(path.join(root,'vix-marking-workspace.json'),'utf8'));
  if(marker.protocol!=='second-language-vix-marking/1'||marker.studyDate!==selection.studyDate||marker.inputCommit!==selection.vixInputCommit||marker.selectionDigest!==selectionDigest)throw Error('VIX 标注工作副本与冻结 selection/原输入不一致；不得发布');
  for(const item of chosen){const actual=index.byRank.get(item.globalRank);if(!actual||actual.entryId!==item.entryId||actual.text!==item.text||!actual.markDates.includes(selection.vixMarkLabel))throw Error(`VIX 标注尚未生成或身份不匹配: ${item.text}`);}
  const check=spawnSync(process.execPath,['tools/build-seed-access.mjs','--check'],{cwd:root,encoding:'utf8',windowsHide:true});
  if(check.status!==0)throw Error(`VIX 索引校验失败:\n${check.stderr||check.stdout}`);
  const paths=[`data/seed-access/dates/${selection.vixMarkLabel}.json`,'data/seed-access/manifest.json','data/seed-access/mark-hash.json','data/seed-access/structure.json',...index.manifest.records.map(item=>item.path)];
  if(new Set(paths).size!==paths.length||paths.some(file=>!/^data\/seed-access\//.test(file)||file.includes('\\')||file.split('/').some(part=>!part||part==='.'||part==='..')))throw Error('VIX 拟发布文件路径无效或重复');
  const bodies=new Map(),files=[];
  for(const file of paths){const bytes=await readFile(path.join(root,...file.split('/')));bodies.set(file,bytes);files.push({path:file,sha:blobSha(bytes),size:bytes.length});}
  files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  const identity={protocol,repository:repo,studyDate:selection.studyDate,inputCommit:selection.vixInputCommit,selectionDigest,vixMarkLabel:selection.vixMarkLabel,filesDigest:digest(files),files,markedRecords:new Set(chosen.map(item=>item.globalRank)).size};
  const receiptFile=path.join(path.dirname(path.resolve(selectionFile)),'vix-publication.json');
  await mkdir(path.dirname(receiptFile),{recursive:true});
  const base=`https://api.github.com/repos/${repo}`;
  const message=`Mark Second Language ${selection.studyDate} vocabulary`;
  function validate(receipt){
    if(!receipt||Object.entries(identity).some(([key,value])=>canonicalSourcePackage(receipt[key]??null)!==canonicalSourcePackage(value))||!sha(receipt.vixCommit)||!sha(receipt.tree)||!['prepared','published'].includes(receipt.status))throw Error('VIX 发布回执与冻结选词、原输入或拟提交文件不一致；保留待查，不覆盖或重发');
    return receipt;
  }
  async function branchSha(){const result=await api(`${base}/branches/main`);if(!sha(result.commit?.sha))throw Error('VIX main 身份无效');return result.commit.sha;}
  async function verifyCommit(receipt){
    const commit=await api(`${base}/git/commits/${receipt.vixCommit}`);
    if(commit.sha!==receipt.vixCommit||commit.tree?.sha!==receipt.tree||commit.message!==message||commit.parents?.length!==1||commit.parents[0].sha!==identity.inputCommit)throw Error('VIX 远端提交与本次预备回执不一致；保留待查');
    const tree=await api(`${base}/git/trees/${receipt.tree}?recursive=1`);
    if(tree.truncated||tree.sha!==receipt.tree||!Array.isArray(tree.tree))throw Error('VIX 远端发布树不能完整核对；保留回执待查');
    const entries=new Map(tree.tree.filter(item=>item.type==='blob').map(item=>[item.path,item]));
    for(const file of files){const entry=entries.get(file.path);if(entry?.sha!==file.sha||entry.mode!=='100644')throw Error(`VIX 远端发布文件与冻结回执不一致: ${file.path}`);}
  }
  async function contains(receipt,head){
    if(head===receipt.vixCommit)return true;
    if(head===identity.inputCommit)return false;
    const compared=await api(`${base}/compare/${receipt.vixCommit}...${head}`);
    return compared.base_commit?.sha===receipt.vixCommit&&compared.merge_base_commit?.sha===receipt.vixCommit&&compared.status==='ahead'&&compared.behind_by===0&&compared.ahead_by>0;
  }
  let receipt=await readReceipt(receiptFile),reused=!!receipt;
  if(receipt)validate(receipt);
  else{
    const head=await branchSha();
    if(head!==identity.inputCommit)throw Error('VIX main 已变化且没有本次发布回执；保留原输入和选词待核对，不刷新或重选');
    const parent=await api(`${base}/git/commits/${head}`);
    if(!sha(parent.tree?.sha))throw Error('VIX 原输入 tree 身份无效');
    const elements=[];
    for(const file of files){const blob=await api(`${base}/git/blobs`,'POST',{content:bodies.get(file.path).toString('base64'),encoding:'base64'});if(blob.sha!==file.sha)throw Error(`VIX 上传 blob 摘要不符: ${file.path}`);elements.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});}
    const tree=await api(`${base}/git/trees`,'POST',{base_tree:parent.tree.sha,tree:elements});
    if(!sha(tree.sha))throw Error('VIX 拟发布 tree 身份无效');
    const commit=await api(`${base}/git/commits`,'POST',{message,tree:tree.sha,parents:[head]});
    if(!sha(commit.sha))throw Error('VIX 拟发布 commit 身份无效');
    const intended={...identity,status:'prepared',tree:tree.sha,vixCommit:commit.sha,preparedAt:now()};
    receipt=validate(await installReceipt(receiptFile,intended));
    // A concurrent winner's immutable prepared receipt owns the single update.
    reused=receipt.vixCommit!==intended.vixCommit;
  }
  await verifyCommit(receipt);
  let head=await branchSha();
  if(!await contains(receipt,head)){
    if(head!==identity.inputCommit)throw Error('VIX main 已变化且不包含本次精确提交；保留原输入、选词及发布回执，不刷新或重选');
    if(receipt.status==='published')throw Error('VIX 已发布回执对应提交已不在 main；保留待查，不重新推送');
    try{await api(`${base}/git/refs/heads/main`,'PATCH',{sha:receipt.vixCommit,force:false});}
    catch(error){
      // The HTTP response can be lost after GitHub has applied PATCH. Read before
      // deciding: neither a new commit nor another PATCH is made in this call.
      try{head=await branchSha();if(!await contains(receipt,head))throw Error('本次提交尚不能确认位于 main');}
      catch(verification){throw Error(`VIX 更新结果未确认；预备回执已保存 ${receiptFile}。下次先核对同一提交，不重选或新造发布提交。${verification.message}`,{cause:error});}
    }
    head=await branchSha();
    if(!await contains(receipt,head))throw Error(`VIX 发布后 main 尚不能核对；保留预备回执 ${receiptFile}，不重新生成提交`);
  }else reused=true;
  receipt={...receipt,status:'published',verifiedAt:now(),verifiedHead:head};
  await finishReceipt(receiptFile,receipt);
  return {vixCommit:receipt.vixCommit,markedRecords:identity.markedRecords,reused,receipt:receiptFile};
}

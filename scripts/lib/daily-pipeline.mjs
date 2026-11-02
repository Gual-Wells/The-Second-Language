// Chapter-domain ownership, immutable inputs and artifact barriers only.
// No model evaluation, DIGR lifecycle, selection heuristic or publication bypass.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {teachingScope,prepareTeachingMaterials,readTeachingMaterials,checkMaterialDisposition,assertTeachingAuthoringVersions,assembleRun} from './teaching-authoring.mjs';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {validatePublishedVixReceipt} from './vix-publication.mjs';
import {studyDate} from './digr-project.mjs';
import {authenticityPolicy} from '../../protocol/authentic-context-coverage.mjs';
import {auditAuthenticity} from './authenticity-audit.mjs';
import {DAILY_WORD_COUNT,WORDS_PER_TASK,selectedWordCount} from '../../protocol/chapter-size.mjs';
import {FALLBACK_APPEALS_POLICY} from '../../protocol/fallback-appeals.mjs';

export const PIPELINE_VERSION='three-by-ten-v1';
export const TASK_IDS=Object.freeze(['task-1','task-2','task-3']);
const LEGACY_TASK_IDS=Object.freeze([...TASK_IDS,'task-4','task-5']);
function division(selection,lock){const wordCount=selectedWordCount(selection,lock);return {wordCount,version:wordCount===DAILY_WORD_COUNT?PIPELINE_VERSION:'five-by-ten-v1',taskIds:wordCount===DAILY_WORD_COUNT?TASK_IDS:LEGACY_TASK_IDS};}
export const sha256=x=>createHash('sha256').update(x).digest('hex');
const digest=x=>sha256(canonical(x));
const json=file=>fs.readFile(file,'utf8').then(JSON.parse);
export async function optionalJson(file){try{return await json(file);}catch(e){if(e.code==='ENOENT')return null;throw e;}}
export async function atomicJson(file,value){await fs.mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';await fs.writeFile(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});try{await fs.rename(temp,file);}finally{await fs.unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}}
export async function immutableJson(file,value){await fs.mkdir(path.dirname(file),{recursive:true});const bytes=JSON.stringify(value,null,2)+'\n';try{await fs.writeFile(file,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(await fs.readFile(file,'utf8')!==bytes)throw Error('不可变流水线原件冲突：'+file);}return file;}
export async function pipelineRoot(root){root=await fs.realpath(root);if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('日课流水线须实存D盘');return root;}
export function pipelinePaths(root,date){studyDate(date);const run=path.join(root,'work/runs',date),base=path.join(run,'teaching/pipeline');return {root,date,run,base,plan:path.join(base,'plan.json'),task:id=>{if(!LEGACY_TASK_IDS.includes(id))throw Error('任务编号无效');return path.join(base,'tasks',id);}};}
async function contained(root,file){const real=await fs.realpath(file),relative=path.relative(root,real);if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('流水线文件越出项目');return real;}
async function ref(root,file){file=await contained(root,file);const bytes=await fs.readFile(file);return {path:path.relative(root,file).replaceAll('\\','/'),sha256:sha256(bytes),bytes:bytes.length};}
async function verifyRefs(root,refs){if(!Array.isArray(refs))throw Error('缺少原件绑定');for(const r of refs){if(typeof r.path!=='string'||path.isAbsolute(r.path))throw Error('原件路径无效');const actual=await ref(root,path.join(root,r.path));if(actual.sha256!==r.sha256||actual.bytes!==r.bytes)throw Error('流水线原件已改变：'+r.path);}}

export async function dailyMode(root,date){
  root=await pipelineRoot(root);const p=pipelinePaths(root,date),control=await json(path.join(p.run,'control.json'));
  if(control.date!==date||control.runId!==date||typeof control.rest!=='boolean')throw Error('需真实已领取的同日control');
  if(control.rest)return 'rest';
  if(await optionalJson(p.plan))return 'pipeline';
  const selection=await optionalJson(path.join(p.run,'selection.json'));
  const inputLock=await optionalJson(path.join(p.run,'vix-source.json'));
  // A content migration or an unrelated temporary request is not authorized by
  // changing the scheduler. Restore the exact pre-existing daily route instead.
  if(control.temporaryRequest||selection&&selection.authoringPolicy!=='authentic-context-v1'||inputLock&&(inputLock.authoringPolicy!=='authentic-context-v1'||inputLock.teachingLayoutVersion!==2||inputLock.quickGlossVersion!==1))return 'legacy';
  const authored=await fs.readdir(path.join(p.run,'teaching/authored')).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
  if(authored.some(n=>/^word-.*\.json$/.test(n)))return 'legacy';
  return 'pipeline';
}

export async function createPipelinePlan(root,date){
  root=await pipelineRoot(root);const p=pipelinePaths(root,date);
  if(await optionalJson(p.plan))return inspectPipelinePlan(root,date);
  if(await dailyMode(root,date)!=='pipeline')throw Error('休息或旧运行不建立新分工');
  const selection=await json(path.join(p.run,'selection.json')),lock=await json(path.join(p.run,'vix-source.json')),receipt=await json(path.join(p.run,'vix-publication.json'));
  const scope=teachingScope(selection);
  const shape=division(selection,lock);
  if(selection.studyDate!==date||selection.authoringPolicy!=='authentic-context-v1'||scope.length!==shape.wordCount||lock.teachingLayoutVersion!==2||lock.quickGlossVersion!==1)throw Error('新流水线须保冻结词数及现行单正文/快释合同');
  authenticityPolicy(selection,lock);
  validatePublishedVixReceipt(receipt,{studyDate:date,inputCommit:lock.commit,selectionDigest:digest(selection),vixCommit:receipt.vixCommit});
  const {manifest}=await readTeachingMaterials(root,date,selection);
  const materialSnapshot=path.join(p.base,'inputs/materials.json');await immutableJson(materialSnapshot,manifest);
  const inputs=[];
  for(const name of ['control.json','selection.json','vix-source.json','vix-publication.json'])inputs.push(await ref(root,path.join(p.run,name)));
  inputs.push(await ref(root,materialSnapshot));
  for(const packet of manifest.packets)inputs.push(await ref(root,path.join(p.run,packet.file)));
  const words=scope.map((w,i)=>({...w,wordId:'W'+String(i+1).padStart(3,'0')}));
  const tasks=shape.taskIds.map((taskId,i)=>({taskId,words:words.slice(i*WORDS_PER_TASK,(i+1)*WORDS_PER_TASK)}));
  const plan={schemaVersion:1,version:shape.version,date,createdAt:new Date().toISOString(),inputs,tasks,assemblyOwner:'task-1',wordCount:shape.wordCount,fallbackAppealsPolicy:FALLBACK_APPEALS_POLICY};
  // Each worker owns a manifest, author drafts and handoff. Only immutable
  // content-addressed textbook packets and existing source acquisition are shared.
  for(const task of tasks){
    const owned=new Set(task.words.map(w=>w.text)),taskScope=scope.filter(w=>owned.has(w.text));
    const view={...manifest,scope:taskScope,scopeDigest:digest(taskScope),additionalTerms:Object.fromEntries(Object.entries(manifest.additionalTerms||{}).filter(([w])=>owned.has(w))),packets:manifest.packets.filter(r=>owned.has(r.word))};
    await immutableJson(path.join(p.task(task.taskId),'materials.json'),view);
    await fs.mkdir(path.join(p.task(task.taskId),'authored'),{recursive:true});
  }
  await immutableJson(p.plan,plan);return inspectPipelinePlan(root,date);
}

export async function inspectPipelinePlan(root,date){
  root=await pipelineRoot(root);const p=pipelinePaths(root,date),plan=await json(p.plan);
  if(plan.schemaVersion!==1||!['five-by-ten-v1',PIPELINE_VERSION].includes(plan.version)||plan.date!==date||plan.assemblyOwner!=='task-1')throw Error('分工合同无效');
  if(plan.fallbackAppealsPolicy!==undefined&&plan.fallbackAppealsPolicy!==FALLBACK_APPEALS_POLICY)throw Error('分工申诉交接版本无效');
  await verifyRefs(root,plan.inputs);
  const initial=await json(path.join(p.base,'inputs/materials.json'));
  const required=['control.json','selection.json','vix-source.json','vix-publication.json'].map(n=>path.relative(root,path.join(p.run,n)).replaceAll('\\','/'));
  required.push(path.relative(root,path.join(p.base,'inputs/materials.json')).replaceAll('\\','/'),...initial.packets.map(r=>path.relative(root,path.join(p.run,r.file)).replaceAll('\\','/')));
  if(canonical([...new Set(plan.inputs.map(r=>r.path))].sort())!==canonical([...new Set(required)].sort()))throw Error('分工合同缺少原冻结或教材绑定');
  const control=await json(path.join(p.run,'control.json'));if(control.rest)throw Error('休息运行不能制作');
  const selection=await json(path.join(p.run,'selection.json')),scope=teachingScope(selection),lock=await json(path.join(p.run,'vix-source.json')),shape=division(selection,lock);
  if(plan.version!==shape.version||plan.wordCount!==shape.wordCount||plan.tasks?.length!==shape.taskIds.length)throw Error('分工合同与冻结词数不一致');
  const expected=shape.taskIds.map((taskId,i)=>({taskId,words:scope.slice(i*WORDS_PER_TASK,(i+1)*WORDS_PER_TASK).map((w,j)=>({...w,wordId:'W'+String(i*WORDS_PER_TASK+j+1).padStart(3,'0')}))}));
  if(scope.length!==shape.wordCount||canonical(expected)!==canonical(plan.tasks))throw Error('分工丢词、重复或改变原冻结词族');
  return {...p,plan,planDigest:sha256(await fs.readFile(p.plan)),selection};
}

export async function prepareTaskMaterials(root,date,taskId,{additionalFile,books}={}){
  const p=await inspectPipelinePlan(root,date),task=p.plan.tasks.find(t=>t.taskId===taskId);if(!task)throw Error('未知任务');
  return prepareTeachingMaterials(p.root,date,{wordTexts:task.words.map(w=>w.text),manifestFile:path.join(p.task(taskId),'materials.json'),additionalFile,books});
}

async function taskArtifacts(p,taskId){
  const task=p.plan.tasks.find(t=>t.taskId===taskId);if(!task)throw Error('未知任务');
  const folder=p.task(taskId),manifestFile=path.join(folder,'materials.json'),wordTexts=task.words.map(w=>w.text);
  const {manifest,packets}=await readTeachingMaterials(p.root,p.date,p.selection,{wordTexts,manifestFile});
  const names=(await fs.readdir(path.join(folder,'authored'))).filter(n=>n.endsWith('.json')).sort();
  const expected=task.words.map(w=>'word-'+w.wordId+'.json').sort();if(canonical(names)!==canonical(expected))throw Error(taskId+'须且仅须交齐本任务10份词族稿');
  const words=await Promise.all(expected.map(n=>json(path.join(folder,'authored',n))));
  for(const word of words)if(!task.words.some(w=>w.wordId===word.wordId&&w.text===word.text))throw Error('作者稿词头不属于任务');
  assertTeachingAuthoringVersions(await json(path.join(p.run,'vix-source.json')),{},words);
  const result=assembleUsageContextCollection(words,{expectedWordCount:10});
  const prefixes=task.words.map(w=>w.wordId.slice(1));
  for(const [letter,ids] of [['U',[...result.parsed.uses.keys()]],['C',result.parsed.contexts.map(c=>c.id)],['S',result.parsed.sentences.map(s=>s.id)]])if(ids.some(id=>!prefixes.some(pre=>id.startsWith(letter+pre))))throw Error('USE/CONTEXT/SENTENCE须使用本任务词号命名空间，避免并发碰撞');
  for(const word of words)checkMaterialDisposition(word,packets.find(p=>p.word===word.text),result.parsed);
  const handoffFile=path.join(folder,'handoff.json'),handoff=await json(handoffFile);
  if(handoff.planDigest!==p.planDigest||handoff.taskId!==taskId||canonical([...(handoff.wordIds||[])].sort())!==canonical(task.words.map(w=>w.wordId).sort())||!Array.isArray(handoff.unresolved)||typeof handoff.notes!=='string'||!handoff.notes.trim())throw Error('需真实十词交接、事实/原件定位和未决问题；不接收空结论');
  if(handoff.unresolved.length)throw Error(taskId+'仍有未决问题，不进入汇总');
  const files=[await ref(p.root,manifestFile),await ref(p.root,handoffFile)];
  // New plans seal the evidence handoff as well as the displayed draft.
  // Frozen older plans/receipts retain their original artifact contract;
  // final publication still requires actual individual appeal approval.
  if(p.plan.fallbackAppealsPolicy===FALLBACK_APPEALS_POLICY){
    const appealFile=path.join(folder,'appeals.json'),appeals=await json(appealFile),examples=words.flatMap(w=>w.contexts.filter(c=>c.kind==='example'));
    if(!Array.isArray(appeals)||appeals.length!==examples.length||new Set(appeals.map(a=>a?.contextId)).size!==examples.length||examples.some(c=>!appeals.some(a=>a?.contextId===c.id&&typeof a.reason==='string'&&a.reason.trim()&&typeof a.searchConclusion==='string'&&a.searchConclusion.trim()&&typeof a.teachingBenefit==='string'&&a.teachingBenefit.trim()&&Array.isArray(a.refs)&&a.refs.length&&a.refs.every(r=>typeof r?.sourceId==='string'&&r.sourceId.trim()&&typeof r.quote==='string'&&r.quote.trim()))))throw Error('每份教学回退须交齐逐例申诉申请和原件引用；交接不代表批准');
    files.push(await ref(p.root,appealFile));
  }
  for(const name of names)files.push(await ref(p.root,path.join(folder,'authored',name)));
  for(const packet of manifest.packets)files.push(await ref(p.root,path.join(p.run,packet.file)));
  // Retain actual used originals, not just URL-shaped evidence. Full publisher
  // validation later checks acquisition semantics, rights and exact body binding.
  for(const word of words)for(const c of word.contexts)for(const e of c.sourceEvidence||[]){
    const recordFile=path.resolve(p.root,e.readRecord),record=await json(await contained(p.root,recordFile));
    const textFile=await contained(p.root,path.resolve(p.root,record.textPath));
    if(sha256(await fs.readFile(textFile))!==record.textDigest)throw Error('采用原文摘要不符');
    files.push(await ref(p.root,recordFile),await ref(p.root,textFile));
    if(record.responseBodyPath)files.push(await ref(p.root,path.resolve(p.root,record.responseBodyPath)));
  }
  const unique=[...new Map(files.map(f=>[f.path,f])).values()];
  const authenticity=authenticityPolicy(p.selection,await json(path.join(p.run,'vix-source.json')))?await auditAuthenticity(p.root,words):null;
  return {task,words,manifest,result,files:unique,handoff,authenticity};
}

export async function sealPipelineTask(root,date,taskId){
  const p=await inspectPipelinePlan(root,date),artifacts=await taskArtifacts(p,taskId);
  const receipt={schemaVersion:1,version:p.plan.version,date,taskId,planDigest:p.planDigest,files:artifacts.files,wordIds:artifacts.task.words.map(w=>w.wordId),notice:'Artifact completeness only; this receipt does not certify semantic correctness.'};
  const receiptDigest=digest(receipt),file=path.join(p.task(taskId),'receipts',receiptDigest+'.json');await immutableJson(file,receipt);
  await atomicJson(path.join(p.task(taskId),'complete.json'),{receiptDigest,file:path.relative(p.root,file).replaceAll('\\','/')});return {taskId,receiptDigest};
}
export async function inspectPipelineTask(root,date,taskId){
  const p=await inspectPipelinePlan(root,date),pointer=await optionalJson(path.join(p.task(taskId),'complete.json'));if(!pointer)return null;
  const receiptFile=path.join(p.task(taskId),'receipts',pointer.receiptDigest+'.json');
  if(pointer.file!==path.relative(p.root,receiptFile).replaceAll('\\','/'))throw Error('任务完成指针越界');
  const receipt=await json(receiptFile);if(digest(receipt)!==pointer.receiptDigest||receipt.planDigest!==p.planDigest||receipt.taskId!==taskId||receipt.version!==p.plan.version)throw Error('任务完成回执身份不符');
  await verifyRefs(p.root,receipt.files);const artifacts=await taskArtifacts(p,taskId);
  if(canonical(receipt.files)!==canonical(artifacts.files))throw Error('任务回执未覆盖当前完整原件');
  return {...artifacts,receipt,receiptDigest:pointer.receiptDigest,receiptFile};
}
export async function pipelineBarrier(root,date){
  const p=await inspectPipelinePlan(root,date);
  const tasks=await Promise.all(p.plan.tasks.map(async({taskId})=>{try{const result=await inspectPipelineTask(root,date,taskId);return {taskId,ready:!!result,receiptDigest:result?.receiptDigest||null};}catch(error){return {taskId,ready:false,error:error.message};}}));
  return {ready:tasks.every(t=>t.ready),tasks};
}

export async function mergePipelineTasks(root,date){
  const p=await inspectPipelinePlan(root,date),tasks=[];
  for(const {taskId} of p.plan.tasks){const task=await inspectPipelineTask(root,date,taskId);if(!task)throw Error('分组未齐，不装配：'+taskId);tasks.push(task);}
  const words=tasks.flatMap(t=>t.words);assembleUsageContextCollection(words,{expectedWordCount:p.plan.wordCount});
  const initial=await json(path.join(p.base,'inputs/materials.json'));
  if(tasks.some(t=>canonical(t.manifest.books)!==canonical(initial.books)))throw Error('分任务教材版本不一致');
  const scope=teachingScope(p.selection),manifest={...initial,scope,scopeDigest:digest(scope),additionalTerms:Object.assign({},...tasks.map(t=>t.manifest.additionalTerms)),packets:tasks.flatMap(t=>t.manifest.packets).sort((a,b)=>a.word.localeCompare(b.word,'en'))};
  const prior=await optionalJson(path.join(p.base,'merged.json')),incoming=[];
  for(const task of tasks)for(const word of task.words){const source=path.join(p.task(task.task.taskId),'authored','word-'+word.wordId+'.json'),target=path.join(p.run,'teaching/authored','word-'+word.wordId+'.json'),bytes=await fs.readFile(source);incoming.push({target,bytes,sha256:sha256(bytes),wordId:word.wordId});}
  // A partially written import is resumable. A later coordinator edit cannot be
  // overwritten by an old producer receipt merely because a scheduler restarted.
  for(const row of incoming){try{const currentBytes=await fs.readFile(row.target),current=sha256(currentBytes),baseline=prior?.words.find(w=>w.wordId===row.wordId)?.sha256;if(current!==row.sha256&&current!==baseline){if(row.sha256===baseline){row.bytes=currentBytes;row.sha256=current;}else throw Error('返修和总装同时改动同一词，拒绝覆盖：'+row.wordId);}}catch(e){if(e.code!=='ENOENT')throw e;}}
  const prospective=incoming.map(row=>JSON.parse(row.bytes)),checked=assembleUsageContextCollection(prospective,{expectedWordCount:p.plan.wordCount});
  assertTeachingAuthoringVersions(await json(path.join(p.run,'vix-source.json')),{},prospective);
  for(const word of prospective){const packetRef=manifest.packets.find(p=>p.word===word.text),packet=await json(path.join(p.run,packetRef.file));checkMaterialDisposition(word,{...packet,materialDigest:packetRef.materialDigest},checked.parsed);}
  await fs.mkdir(path.join(p.run,'teaching/authored'),{recursive:true});
  for(const row of incoming){const temp=row.target+'.'+randomUUID()+'.tmp';await fs.writeFile(temp,row.bytes,{flag:'wx'});await fs.rename(temp,row.target);}
  await atomicJson(path.join(p.run,'teaching/materials.json'),manifest);
  const result=await assembleRun(p.root,date);
  await fs.writeFile(path.join(p.run,'teaching/chapter.md'),result.markdown);
  await atomicJson(path.join(p.run,'teaching/context-sources.json'),result.contextSources);
  if(authenticityPolicy(p.selection,await json(path.join(p.run,'vix-source.json'))))await atomicJson(path.join(p.base,'authenticity-status.json'),await auditAuthenticity(p.root,prospective));
  const merged={version:p.plan.version,planDigest:p.planDigest,tasks:tasks.map(t=>({taskId:t.task.taskId,receiptDigest:t.receiptDigest})),words:incoming.map(({wordId,sha256})=>({wordId,sha256}))};
  await atomicJson(path.join(p.base,'merged.json'),merged);return merged;
}

export async function requestPipelineRepair(root,date,request){
  const p=await inspectPipelinePlan(root,date);if(!Array.isArray(request.tasks)||!request.tasks.length)throw Error('返修须定位具体词和真实问题');
  const seen=new Set(),tasks=[];
  for(const item of request.tasks){const task=await inspectPipelineTask(root,date,item.taskId);if(!task||seen.has(item.taskId)||!Array.isArray(item.wordIds)||!item.wordIds.length||new Set(item.wordIds).size!==item.wordIds.length||item.wordIds.some(id=>!task.task.words.some(w=>w.wordId===id))||typeof item.reason!=='string'||!item.reason.trim())throw Error('返修范围或依据无效');seen.add(item.taskId);tasks.push({...item,baselineReceipt:task.receiptDigest,baselineFiles:task.receipt.files});}
  const repair={schemaVersion:1,planDigest:p.planDigest,tasks},repairDigest=digest(repair);
  await immutableJson(path.join(p.base,'repairs',repairDigest+'.json'),repair);
  await atomicJson(path.join(p.base,'repair-request.json'),{repairDigest});return {repairDigest};
}
export async function inspectPipelineRepair(root,date){
  const p=await inspectPipelinePlan(root,date),pointer=await optionalJson(path.join(p.base,'repair-request.json'));if(!pointer)return null;
  if(!/^[a-f0-9]{64}$/.test(pointer.repairDigest))throw Error('返修指针无效');
  const repair=await json(path.join(p.base,'repairs',pointer.repairDigest+'.json'));if(digest(repair)!==pointer.repairDigest||repair.planDigest!==p.planDigest)throw Error('返修身份不符');
  return {...repair,repairDigest:pointer.repairDigest};
}

export async function verifyRepairBoundary(root,date,item){
  const p=await inspectPipelinePlan(root,date);
  for(const file of item.baselineFiles.filter(f=>/\/authored\/word-/.test(f.path)&&!item.wordIds.some(id=>f.path.endsWith('/word-'+id+'.json'))))await verifyRefs(p.root,[file]);
}

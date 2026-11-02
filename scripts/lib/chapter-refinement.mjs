// An explicitly requested revision of a completed draft. It never changes the
// original daily engine, selection/VIX, producer receipts or execution window.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {selectedWordCount} from '../../protocol/chapter-size.mjs';
import {authenticityAlarm} from '../../protocol/fallback-appeals.mjs';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {readTeachingMaterials,prepareTeachingMaterials,checkMaterialDisposition,assertTeachingAuthoringVersions} from './teaching-authoring.mjs';
import {auditAuthenticity} from './authenticity-audit.mjs';
import {pipelineRoot,optionalJson,immutableJson,atomicJson,sha256} from './daily-pipeline.mjs';
import {runNativeGoal,verifyGoalInputs} from './codex-goal-runner.mjs';
export const REFINEMENT_ID='authentic-real-first-20261103';
const json=file=>fs.readFile(file,'utf8').then(JSON.parse);
const protocols=['AGENTS.md','protocol/CONTEXT_REFINEMENT.md','protocol/AUTHENTIC_CONTEXT_APPEALS.md','protocol/AUTHENTIC_CONTEXT.md','protocol/VIX_CONTEXT_DISCOVERY.md','protocol/TEACHING_AUTHORING.md','protocol/TEACHING_LAYOUT_V2.md','protocol/CONTENT.md','protocol/CURRENT_AFFAIRS.md','protocol/PUBLICATION_REVIEW.md','protocol/QUALITY_WORKFLOW.md','protocol/ANNOTATIONS.md'];
export function refinementPaths(root,date){if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('修订日期无效');const run=path.join(root,'work/runs',date),directory=path.join(run,'revisions',REFINEMENT_ID);return {root,date,run,directory,task:id=>{if(!/^task-[1-3]$/.test(id))throw Error('修订组无效');return path.join(directory,'tasks',id);}};}
async function ref(root,file){const real=await fs.realpath(file),relative=path.relative(root,real);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('修订原件越出项目');const bytes=await fs.readFile(real);return {path:relative.replaceAll('\\','/'),sha256:sha256(bytes),bytes:bytes.length};}
async function copyFixed(root,from,to){const bytes=await fs.readFile(from);await fs.mkdir(path.dirname(to),{recursive:true});try{await fs.writeFile(to,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(!bytes.equals(await fs.readFile(to)))throw Error('修订基线原件冲突');}return ref(root,to);}
export async function prepareRefinement(root,date){
 root=await pipelineRoot(root);const p=refinementPaths(root,date),file=path.join(p.directory,'manifest.json'),prior=await optionalJson(file);if(prior){await verifyGoalInputs(root,prior.inputs);return {...p,manifest:prior};}
 const control=await json(path.join(p.run,'control.json'));if(control.rest||control.date!==date||control.runId!==date)throw Error('原领取为休息或身份不符，不启动修订');
 const invocations=path.join(p.run,'teaching/pipeline/invocations');
 for(const name of await fs.readdir(invocations))if(await optionalJson(path.join(invocations,name,'started.json'))&&!await optionalJson(path.join(invocations,name,'finished.json')))throw Error('原制作仍在途；不热改、不另启修订');
 const started=await json(path.join(invocations,'task-1-plan/started.json')),deadlineAt=Date.parse(started.startedAt)+20*60*60*1000;if(!Number.isFinite(deadlineAt)||deadlineAt<=Date.now())throw Error('原20小时窗口已结束；保留草稿，需明确新执行窗口');
 const selection=await json(path.join(p.run,'selection.json')),lock=await json(path.join(p.run,'vix-source.json'));if(selectedWordCount(selection,lock)!==30)throw Error('本修订只适用于本次完整30词稿，不迁移历史章');
 const {manifest:materials}=await readTeachingMaterials(root,date,selection),names=(await fs.readdir(path.join(p.run,'teaching/authored'))).filter(n=>/^word-[A-Za-z0-9_-]+\.json$/.test(n)),words=await Promise.all(names.map(n=>json(path.join(p.run,'teaching/authored',n))));
 words.sort((a,b)=>a.text.localeCompare(b.text,'en'));const base=assembleUsageContextCollection(words,{expectedWordCount:30});assertTeachingAuthoringVersions(lock,{},words);
 if(new Set(words.map(w=>w.wordId)).size!==30||words.some(w=>!selection.mainWords.some(s=>s.text===w.text)))throw Error('原稿主词身份或冻结范围不完整');
 const inputs=[];
 for(const name of ['control.json','selection.json','vix-source.json','vix-publication.json']){const source=path.join(p.run,name);inputs.push(await ref(root,source));inputs.push(await copyFixed(root,source,path.join(p.directory,'inputs',name)));}
 inputs.push(await copyFixed(root,path.join(p.run,'teaching/materials.json'),path.join(p.directory,'inputs/materials.json')));
 for(const w of words)inputs.push(await copyFixed(root,path.join(p.run,'teaching/authored/word-'+w.wordId+'.json'),path.join(p.directory,'inputs/authored/word-'+w.wordId+'.json')));
 const tasks=[];
 for(let i=0;i<3;i++){
  const id='task-'+(i+1),owned=words.slice(i*10,(i+1)*10),scope=materials.scope.filter(s=>owned.some(w=>w.text===s.text));
  const material={...materials,scope,scopeDigest:sha256(canonical(scope)),packets:materials.packets.filter(m=>owned.some(w=>w.text===m.word)),additionalTerms:Object.fromEntries(Object.entries(materials.additionalTerms||{}).filter(([word])=>owned.some(w=>w.text===word)))};
  await immutableJson(path.join(p.task(id),'materials.json'),material);await fs.mkdir(path.join(p.task(id),'authored'),{recursive:true});
  for(const w of owned)await copyFixed(root,path.join(p.directory,'inputs/authored/word-'+w.wordId+'.json'),path.join(p.task(id),'authored/word-'+w.wordId+'.json'));
  tasks.push({id,words:owned.map(w=>({wordId:w.wordId,text:w.text}))});
 }
 const git=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true});
 const manifest={schemaVersion:1,policy:'context-refinement-v1',date,revision:REFINEMENT_ID,engine:'codex-goal-v1',projectCommit:git.stdout?.trim(),createdAt:new Date().toISOString(),deadlineAt,inputs,tasks,baseUseIds:[...base.parsed.uses.keys()],baseWordIds:words.map(w=>w.wordId),originalDailyEnginePreserved:true};
 await immutableJson(file,manifest);return {...p,manifest};
}
export async function inspectRefinementTask(root,date,id,{requireHandoff=true}={}){
 const p=await prepareRefinement(root,date),scope=p.manifest.tasks.find(t=>t.id===id);if(!scope)throw Error('未知修订组');
 const selection=await json(path.join(p.run,'selection.json')),lock=await json(path.join(p.run,'vix-source.json')),{manifest,packets}=await readTeachingMaterials(root,date,selection,{wordTexts:scope.words.map(w=>w.text),manifestFile:path.join(p.task(id),'materials.json')});
 const words=await Promise.all(scope.words.map(w=>json(path.join(p.task(id),'authored/word-'+w.wordId+'.json'))));assertTeachingAuthoringVersions(lock,{},words);
 for(const w of words)if(!scope.words.some(s=>s.wordId===w.wordId&&s.text===w.text))throw Error('修订组改动了主词或侵占其他组');
 const all=await Promise.all(p.manifest.baseWordIds.map(async wordId=>words.find(w=>w.wordId===wordId)||json(path.join(p.directory,'inputs/authored/word-'+wordId+'.json'))));
 const assembled=assembleUsageContextCollection(all,{expectedWordCount:30});if(p.manifest.baseUseIds.some(id=>!assembled.parsed.uses.has(id)))throw Error('修订删除或重排了原完整义项身份');
 for(const w of words)checkMaterialDisposition(w,packets.find(p=>p.word===w.text),assembled.parsed);
 const coverage=await auditAuthenticity(root,words,{strictWitnesses:true});
 const handoff=await optionalJson(path.join(p.task(id),'handoff.json'));
 if(requireHandoff&&(!handoff||handoff.revision!==REFINEMENT_ID||!Array.isArray(handoff.wordIds)||handoff.wordIds.length!==10||scope.words.some(w=>!handoff.wordIds.includes(w.wordId))||!handoff.notes?.trim()||!Array.isArray(handoff.unresolved)||handoff.unresolved.length))throw Error('修订交接不完整或仍有阻断问题');
 if(requireHandoff){
  const appeals=await json(path.join(p.task(id),'appeals.json')),examples=words.flatMap(w=>w.contexts.filter(c=>c.kind==='example'));
  if(!Array.isArray(appeals)||appeals.length!==examples.length||new Set(appeals.map(a=>a.contextId)).size!==examples.length||examples.some(c=>!appeals.some(a=>a.contextId===c.id&&a.reason?.trim()&&a.searchConclusion?.trim()&&a.teachingBenefit?.trim()&&a.refs?.length)))throw Error('每份回退须有逐例申诉申请；不能仅填fallbackReason');
 }
 const artifactNames=[...words.map(w=>'authored/word-'+w.wordId+'.json'),'materials.json',...(requireHandoff?['handoff.json','appeals.json']:[])];
 const artifacts=await Promise.all(artifactNames.map(name=>ref(root,path.join(p.task(id),name))));
 return {p,scope,words,materials:manifest,coverage,artifacts,alarm:authenticityAlarm(coverage)};
}
async function producerObjective(p,id){const task=p.manifest.tasks.find(t=>t.id===id),folder=path.relative(p.root,p.task(id)).replaceAll('\\','/'),baseline=path.relative(p.root,path.join(p.directory,'inputs')).replaceAll('\\','/');
 return `完成第二语言第一章的真实场景补研究阶段，修订${REFINEMENT_ID}，日期${p.date}，组${id}。这是旧DIGR草稿结束后的新原生Goal，不改原日课引擎或重做选词。先完整读取本阶段goal-packet.json中protocolSnapshots所列领域协议、${baseline}/selection.json、${baseline}/vix-source.json、${folder}/materials.json及本组完整双教材和基线作者稿。\n本组仅以下10个主词及其完整词族/全义：${task.words.map(w=>w.wordId+' '+w.text).join('；')}。只写${folder}/authored/、${folder}/research/、${folder}/appeals.json、${folder}/handoff.json及经专用materials命令更新的本组索引。共享source read/import缓存只经原锁取得，不覆盖他人原件。不要修改脚本/协议、全局作者/教材、选择、VIX、旧任务或其他项目；不发布，不触发音频/外部模型API，不另启生产者。\n从100%真实场景起步，对每个现有教学回退实际按具体义/词形/构式/对象/交际行为寻找高质原始场景。保全部现有USE，确有教材依据的遗漏分支可新增而不能削义凑比例。已有208份合格原文可复用，发现实际语义/来源缺陷才定点修正。真实语境必须原文本来就在用目标词义，不能把主题事实改写并硬植词冒充原文真用；每份sourceEvidence写可重核authenticUse原段、各USE、词形与意义见证。优先保原交际功能的缩编/短摘，实际核采用条件及整块译文。通道按VIX_CONTEXT_DISCOVERY，池外发布者实际准入；不只新闻/RSS，不用搜索摘要当全文。\n80%是警报不是数字闸门；不设20%免审配额，也不以一次403/429、单一体裁失败、笼统罕见或教材更短回退。改变有希望的查询、场景或读取/编辑窗口并实际比较；不无限检索，保真实边界。每份仍保留的example，在${folder}/appeals.json单列{contextId,reason,searchConclusion,teachingBenefit,refs:[{sourceId,quote}],records:[{kind,text}]}。refs引用完整教材entry id、read:实际采用原文textDigest或research:SHA256(实际研究原件text)。records仅保存真正external-search-observation原JSON（kind:search-observation）或{record:真实read-original-text凭据,originalText:同摘要原文}（kind:source-reading或rights-evidence）。保实际查询返回/候选拒绝原因和已读原文，不补造历史。申请不是批准，不能填自批结论。\n确需补查教材用node scripts/refine-chapter.mjs materials ${p.date} ${id} --additional FILE，不能改变全局材料。可复用旧研究目录作线索，不能冒称本次新搜。完整融合解释/音标词性快释/无例后补讲/全部教材原例去向和中文整块译文保持正式规范。\n完成后写handoff.json：{revision:"${REFINEMENT_ID}",wordIds:[本组十个WORD],notes:"实际改动、取材依据、候选和仍需独立审核的回退",unresolved:[]}。未决重大语义或来源问题不得隐藏；通过node scripts/refine-chapter.mjs inspect ${p.date} ${id}只说明范围与原件可核，仍须实际通读成品和必要原件。只有本组完整补研究和有据申诉申请真正交齐才将现有Goal标complete，不将一轮答复、保存文件或结构封存当作完成。不替换/缩小Goal，不改档位或预算；原生Goal自动续作，宿主不追加continue提示。`;
}
async function runProducer(root,date,id,codexExecutable){
 const p=await prepareRefinement(root,date),directory=path.join(p.task(id),'goal'),finished=await optionalJson(path.join(directory,'finished.json'));
 if(finished?.code===0){const completed=await json(path.join(directory,'goal-complete.json'));await verifyGoalInputs(root,completed.verified.artifacts);const checked=await inspectRefinementTask(root,date,id);return {reused:true,id,coverage:checked.coverage};}
 if(await optionalJson(path.join(directory,'started.json')))throw Error(id+'修订已有调用原件，不能建立新线程重复生成；先核原线程');
 if(p.manifest.deadlineAt<=Date.now())throw Error('原20小时窗口已结束，不发起新阶段');
 await fs.mkdir(directory,{recursive:true});const snapshots=[];
 for(const file of protocols){const target=path.join(directory,'project-contracts',file);snapshots.push({original:file,...await copyFixed(root,path.join(root,file),target)});}
 const task=await producerObjective(p,id),packet={schemaVersion:1,date,id,revision:REFINEMENT_ID,model:'gpt-6.1-sol',effort:'high',inputs:p.manifest.inputs,protocolSnapshots:snapshots};
 const packetPath=path.join(directory,'goal-packet.json');await immutableJson(packetPath,packet);
 const objective=`先读取${path.relative(root,packetPath).replaceAll('\\','/')}及同版protocolSnapshots。\n`+task;
 await fs.writeFile(path.join(directory,'objective.txt'),objective,{flag:'wx'});await immutableJson(path.join(directory,'started.json'),{engine:'codex-goal-v1',id,revision:REFINEMENT_ID,startedAt:new Date().toISOString(),objectiveDigest:sha256(objective)});
 try{const result=await runNativeGoal({root,directory,objective,codexExecutable,deadlineAt:p.manifest.deadlineAt,verifyResult:async()=>{await verifyGoalInputs(root,[...p.manifest.inputs,...snapshots]);const r=await inspectRefinementTask(root,date,id);return {wordIds:r.words.map(w=>w.wordId),coverage:r.coverage,alarm:r.alarm,artifacts:r.artifacts,publicationApproved:false};}});await immutableJson(path.join(directory,'finished.json'),{code:0,threadId:result.threadId,finishedAt:new Date().toISOString()});return result;}
 catch(error){await immutableJson(path.join(directory,'finished.json'),{code:1,outcome:'preserved-not-replayed',message:error.message,finishedAt:new Date().toISOString()});throw error;}
}
export async function runRefinement(root,date,codexExecutable){const p=await prepareRefinement(root,date);const results=await Promise.allSettled(p.manifest.tasks.map(t=>runProducer(p.root,date,t.id,codexExecutable)));const summary=results.map((r,i)=>({id:p.manifest.tasks[i].id,state:r.status,...(r.status==='rejected'?{error:r.reason.message}:{threadId:r.value.threadId||null})}));await atomicJson(path.join(p.directory,'producer-results.json'),{recordedAt:new Date().toISOString(),tasks:summary});if(results.some(r=>r.status==='rejected'))throw Error('部分修订未完成，成功组和原线程已保留，不自动重发');return {directory:p.directory,tasks:summary};}
export async function refinementMaterials(root,date,id,additionalFile){const p=await prepareRefinement(root,date),scope=p.manifest.tasks.find(t=>t.id===id);if(!scope)throw Error('未知修订组');return prepareTeachingMaterials(root,date,{wordTexts:scope.words.map(w=>w.text),manifestFile:path.join(p.task(id),'materials.json'),additionalFile});}

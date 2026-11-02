// An explicitly requested revision of a completed draft. It never changes the
// original daily engine, selection/VIX, producer receipts or execution window.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {selectedWordCount} from '../../protocol/chapter-size.mjs';
import {authenticityAlarm} from '../../protocol/fallback-appeals.mjs';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {readTeachingMaterials,prepareTeachingMaterials,checkMaterialDisposition,assertTeachingAuthoringVersions} from './teaching-authoring.mjs';
import {auditAuthenticity} from './authenticity-audit.mjs';
import {pipelineRoot,optionalJson,immutableJson,atomicJson,sha256} from './daily-pipeline.mjs';
import {runNativeGoal,verifyGoalInputs} from './codex-goal-runner.mjs';
import {publisherConfig} from './publisher-config.mjs';
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
export async function runRefinement(root,date,codexExecutable){const p=await prepareRefinement(root,date);const results=await Promise.allSettled(p.manifest.tasks.map(t=>runProducer(p.root,date,t.id,codexExecutable)));const summary=results.map((r,i)=>({id:p.manifest.tasks[i].id,state:r.status,...(r.status==='rejected'?{error:r.reason.message}:{threadId:r.value.threadId||null})}));await atomicJson(path.join(p.directory,'producer-results.json'),{recordedAt:new Date().toISOString(),tasks:summary});if(results.some(r=>r.status==='rejected'))throw Error('部分修订未完成，成功组和原线程已保留，不自动重发');const assembly=await runRefinementAssembly(p.root,date,codexExecutable);return {directory:p.directory,tasks:summary,assembly};}
export async function refinementMaterials(root,date,id,additionalFile){const p=await prepareRefinement(root,date),scope=p.manifest.tasks.find(t=>t.id===id);if(!scope)throw Error('未知修订组');return prepareTeachingMaterials(root,date,{wordTexts:scope.words.map(w=>w.text),manifestFile:path.join(p.task(id),'materials.json'),additionalFile});}
async function replaceFromBaseline(target,text,baselineText){
 let old;try{old=await fs.readFile(target,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;old=null;}
 if(old===text)return;
 if(old!==baselineText)throw Error('全局稿件已被其他操作修改，不覆盖：'+target);
 const temp=target+'.refinement.'+randomUUID()+'.tmp';await fs.mkdir(path.dirname(target),{recursive:true});try{await fs.writeFile(temp,text,{flag:'wx'});await fs.rename(temp,target);}finally{await fs.unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}
}
export async function mergeRefinement(root,date){
 const p=await prepareRefinement(root,date),mergedFile=path.join(p.directory,'merged.json'),prior=await optionalJson(mergedFile);if(prior){await verifyGoalInputs(root,prior.producerArtifacts);return prior;}
 const results=[];
 for(const t of p.manifest.tasks){const d=path.join(p.task(t.id),'goal'),finished=await json(path.join(d,'finished.json')),completed=await json(path.join(d,'goal-complete.json'));if(finished.code!==0||completed.goal?.status!=='complete')throw Error('三个修订Goal尚未实际完成');await verifyGoalInputs(root,completed.verified.artifacts);results.push(await inspectRefinementTask(root,date,t.id));}
 const words=results.flatMap(r=>r.words),baseMaterials=await json(path.join(p.directory,'inputs/materials.json'));
 const assembled=assembleUsageContextCollection(words,{expectedWordCount:30});if(p.manifest.baseUseIds.some(id=>!assembled.parsed.uses.has(id)))throw Error('整合缺少原用法');
 if(results.some(r=>canonical(r.materials.books)!==canonical(baseMaterials.books)))throw Error('修订不能静默切换教材版本');
 const materials={...baseMaterials,additionalTerms:Object.assign({},...results.map(r=>r.materials.additionalTerms)),packets:baseMaterials.scope.map(s=>results.flatMap(r=>r.materials.packets).find(m=>m.word===s.text))};
 const globalMaterials=path.join(p.run,'teaching/materials.json'),materialText=JSON.stringify(materials,null,2)+'\n';
 // A crash halfway through copying can resume only the same desired bytes.
 // Any unrelated global edit is preserved instead of overwritten.
 const changes=[{target:globalMaterials,text:materialText,baseline:await fs.readFile(path.join(p.directory,'inputs/materials.json'),'utf8')}];
 for(const r of results)for(const w of r.words){const source=path.join(p.task(r.scope.id),'authored/word-'+w.wordId+'.json');changes.push({target:path.join(p.run,'teaching/authored/word-'+w.wordId+'.json'),text:await fs.readFile(source,'utf8'),baseline:await fs.readFile(path.join(p.directory,'inputs/authored/word-'+w.wordId+'.json'),'utf8')});}
 for(const c of changes){const old=await fs.readFile(c.target,'utf8');if(old!==c.text&&old!==c.baseline)throw Error('全局稿件已被其他操作修改，不覆盖：'+c.target);}
 for(const c of changes)await replaceFromBaseline(c.target,c.text,c.baseline);
 const coverage=await auditAuthenticity(root,words,{strictWitnesses:true}),value={date,revision:REFINEMENT_ID,mergedAt:new Date().toISOString(),wordIds:words.map(w=>w.wordId),useCount:assembled.parsed.uses.size,coverage,alarm:authenticityAlarm(coverage),materialsDigest:sha256(materialText),producerArtifacts:results.flatMap(r=>r.artifacts),published:false};
 await immutableJson(mergedFile,value);return value;
}
async function verifyRefinementPublished(root,date){
 const chapter=await json(path.join(root,'chapters',date,'chapter.json')),p=await prepareRefinement(root,date),assembled=assembleUsageContextCollection(await Promise.all(p.manifest.baseWordIds.map(id=>json(path.join(p.run,'teaching/authored/word-'+id+'.json')))),{expectedWordCount:30});
 if(chapter.markdown!==assembled.markdown||sha256(chapter.markdown)!==chapter.digest||p.manifest.baseUseIds.some(id=>!assembled.parsed.uses.has(id)))throw Error('最终章节与完整修订作者稿不一致');
 const {base,token}=await publisherConfig(),headers={authorization:'Bearer '+token};
 const catalogue=await fetch(new URL('/api/chapters',base),{headers,signal:AbortSignal.timeout(45000)});if(!catalogue.ok)throw Error('正式目录尚不可核对');const listing=await catalogue.json();if(!listing.chapters?.some(c=>c.id===date&&c.digest===chapter.digest))throw Error('本次修订不是当前正式目录版本，不能仅凭历史原件回读完成');
 const r=await fetch(new URL('/api/chapters/'+date+'?digest='+chapter.digest,base),{headers,signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error('本次正式章节尚未成功发布/回读');const body=await r.json();
 const s=await fetch(new URL('/api/chapters/'+date+'/sources?digest='+chapter.digest,base),{headers,signal:AbortSignal.timeout(45000)});if(!s.ok)throw Error('本次正式来源尚未成功回读');const sources=await s.json();
 if(body.digest!==chapter.digest||sha256(body.markdown)!==chapter.digest||sources.sourceDigest!==chapter.sourceDigest||sha256(canonical(sources.sourcePackage))!==chapter.sourceDigest)throw Error('正式章节或来源回读摘要不符');
 return {published:true,chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,wordCount:30,useCount:assembled.parsed.uses.size,selectionAndVixPreserved:true};
}
export async function runRefinementAssembly(root,date,codexExecutable,{waitForProducers=false}={}){
 const p=await prepareRefinement(root,date),directory=path.join(p.directory,'assembly-goal');
 if(await optionalJson(path.join(directory,'finished.json'))){const result=await json(path.join(directory,'finished.json'));if(result.code!==0)throw Error('总装修订已有失败原件，不自动建立替代线程');return verifyRefinementPublished(root,date);}
 if(await optionalJson(path.join(directory,'started.json')))throw Error('总装已有在途/未知调用，先核原线程，不重复启动');
 for(;;){
  const finished=await Promise.all(p.manifest.tasks.map(t=>optionalJson(path.join(p.task(t.id),'goal/finished.json'))));
  if(finished.some(v=>v&&v.code!==0))throw Error('有修订组未完成，保留其余成功结果，不启动总装');
  if(finished.every(v=>v?.code===0))break;
  if(!waitForProducers)throw Error('三个修订组尚未交齐');
  if(Date.now()>=p.manifest.deadlineAt)throw Error('原执行窗口结束，保留候选，不启动总装');
  await new Promise(resolve=>setTimeout(resolve,5000));
 }
 const merged=await mergeRefinement(root,date);await fs.mkdir(directory,{recursive:true});const snapshots=[];
 for(const file of protocols){snapshots.push({original:file,...await copyFixed(root,path.join(root,file),path.join(directory,'project-contracts',file))});}
 const packet={date,revision:REFINEMENT_ID,model:'gpt-6.1-sol',effort:'high',protocolSnapshots:snapshots,inputs:[...p.manifest.inputs,...merged.producerArtifacts]};
 const packetFile=path.join(directory,'goal-packet.json');await immutableJson(packetFile,packet);
 const objective=`完成第二语言第一章修订的真实总装、逐例独立审核与正式发布回读。先完整读取${path.relative(root,packetFile).replaceAll('\\','/')}及同版protocolSnapshots。三个十词原生Goal已实际完成并经屏障整合，原selection/VIX和完整USE保留；先读${path.relative(root,p.directory).replaceAll('\\','/')}的manifest.json、merged.json、三个handoff.json、appeals.json及全部30词当前全局作者稿/必要完整教材与实际采用原文。逐义实际核语义、词性快释、词源、真实交际功能、候选取舍、全部义项和整块译文；发现问题实质修复，不能把交接、签名、Goal或计数当质量证明。\n本阶段只改work/runs/${date}/teaching/authored及本章必需研究、source-notes、meta/正文/来源/审阅/申诉包，不改原修订组稿、旧回执、选择、VIX、协议、脚本、模型档位或其他项目。不重新选词，不重做成功/unknown收费资产，不生成音频，不另启生产者。完整双教材/词族/现有全部USE不可缩减，必要补查与新增有据分支按现行协议。\n80%只作警报。先补有希望的真实场景缺口，低比例实际检查通道/体裁/读取和模板回退集中问题；所有最终非真实例句都须有实际取材证据、充分申诉及独立审核。按原assemble-teaching、pack-current-affairs、pack-chapter产生本版完整候选；meta wordCount:30、chapterSizePolicy沿原输入，contentPolicy:etymology-fused-v1、authoringPolicy:authentic-context-v1、teachingLayoutVersion:2、quickGlossVersion:1，runId/date保持${date}，第1章；vixCommit沿原vix-publication，不重新标注。source-notes须基于实际采用原文/读件，不能猜测事实或读完声明。\n按PUBLICATION_REVIEW完成本版实际语义审阅。然后node scripts/fallback-appeals.mjs prepare ${date}生成绑定本版申请。把三个appeals.json逐例有据整合到该版requests.json，填真实refs和records而不是代批。独立审核默认为Sol/high：用node scripts/fallback-appeals.mjs review ${date} --codex "${codexExecutable}" --contexts 本批contextIds逐个小范围运行，可按同一词/相关义批量；不得整章超大发送，不伪造/修改审核回执、events或decisions，不自启动审阅模型API。needs-research/rejected必须实际补研究或修复成稿后重新打包；不可删回退、改kind或放宽规则。未变例句可沿已验证的同basis原件复用实际批准；无有效复用时保留原件并仅审受影响范围，不能为了省事自批。确有争议/资源边界向用户即时反馈，保留事实，不假装已发表。\n当每份语境都是真实原文或申诉获准、完整证据/出版审阅/能力和必要移动阅读检查均通过后，执行原publish-chapter ${date}。独立完整验证签名、永久上传和GET摘要回读都要真实成功；真实比例偏低但每项均充分获准时可发并明确报警，不用百分比拒发。不得修改用户默认休息、原空音频。最终在本revision内写release-report.json，列实际前后覆盖、真实改动、申诉批准与退回数、未决、正文/来源/证据身份及线上回读。只有真正发布回读成功、目标成果全交付才把现有Goal标complete；不缩小/替换目标或自设预算，原生Goal自动续作，不用外部continue循环。`;
 await fs.writeFile(path.join(directory,'objective.txt'),objective,{flag:'wx'});await immutableJson(path.join(directory,'started.json'),{engine:'codex-goal-v1',date,revision:REFINEMENT_ID,objectiveDigest:sha256(objective),startedAt:new Date().toISOString()});
 try{const result=await runNativeGoal({root,directory,objective,codexExecutable,deadlineAt:p.manifest.deadlineAt,verifyResult:async()=>{await verifyGoalInputs(root,[...packet.inputs,...snapshots]);return verifyRefinementPublished(root,date);}});await immutableJson(path.join(directory,'finished.json'),{code:0,threadId:result.threadId,finishedAt:new Date().toISOString()});return result;}
 catch(error){await immutableJson(path.join(directory,'finished.json'),{code:1,outcome:'preserved-not-replayed',message:error.message,finishedAt:new Date().toISOString()});throw error;}
}

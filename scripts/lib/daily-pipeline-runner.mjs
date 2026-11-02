import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {backgroundCodexArgs} from '../../protocol/background-codex.mjs';
import {prepareDigrProject,preflightDigrPublication} from './digr-project.mjs';
import {publisherConfig} from './publisher-config.mjs';
import {TASK_IDS,dailyMode,pipelinePaths,pipelineRoot,optionalJson,atomicJson,immutableJson,sha256,createPipelinePlan,inspectPipelinePlan,inspectPipelineTask,pipelineBarrier,mergePipelineTasks,inspectPipelineRepair,verifyRepairBoundary} from './daily-pipeline.mjs';

export function dailyCodexArgs(root){return ['--search','-a','never','exec','-C',root,'-m','gpt-6.1-sol',...backgroundCodexArgs,'-s','danger-full-access','--json','-'];}
export async function invokeDailyCodex({root,date,role,task,inputFiles=[],codexExecutable,spawnImpl=spawn}){
  const p=pipelinePaths(root,date),directory=path.join(p.base,'invocations',role);await fs.mkdir(directory,{recursive:true});
  // A process exit, a completed draft and a published chapter are separate facts.
  // Never replay a started invocation because a cron restarted or a log is old.
  if(await optionalJson(path.join(directory,'started.json')))throw Error(role+'已有调用原件；先恢复结果或核对终态，不自动重发。目录：'+directory);
  const prepared=await prepareDigrProject({root,kind:'daily',date,task,id:'daily-'+role+'-'+randomUUID(),inputFiles});
  if(prepared.skipped)throw Error('领取已休息，停止模型');
  const prompt=await fs.readFile(prepared.prompt,'utf8'),startedFile=path.join(directory,'started.json');
  await immutableJson(startedFile,{role,date,prepared,model:'gpt-6.1-sol',effort:'high',startedAt:new Date().toISOString(),promptDigest:sha256(prompt)});
  const log=await fs.open(path.join(directory,'events.jsonl'),'ax');
  let child;
  try{
    child=spawnImpl(codexExecutable,dailyCodexArgs(root),{cwd:root,env:{...process.env},windowsHide:true,stdio:['pipe',log.fd,log.fd]});
    if(child.pid)await immutableJson(path.join(directory,'process.json'),{pid:child.pid,startedAt:new Date().toISOString()});
    const finished=new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal}));});
    child.stdin.on('error',()=>{});child.stdin.end(prompt);
    const terminal=await finished;await immutableJson(path.join(directory,'finished.json'),{...terminal,finishedAt:new Date().toISOString()});
    if(terminal.code!==0)throw Error(role+'退出失败；保留原稿与调用，不自动重发。');
    return {directory};
  }finally{await log.close();}
}

function planningTask(date){return `你是第二语言五任务流水线的第一条任务，当前仅执行全章规划阶段（${date}）。完整读取protocol/DAILY_RUN.md、RECOMMENDATION、TEACHING_AUTHORING及FIVE_TASK_PIPELINE；恢复真实control及原输入。按原合同完成prepare-vix、feedback-snapshot、完整双教材/真词族候选阅读、50主词的选词取舍、selection一次冻结、原时点VIX标注和核实发布回执，并准备全范围teaching/materials.json。已有冻结输入原样续用；不重选、不重复标注。这里不写50词成稿、不发布章节、不发起音频。五份十词成稿由宿主随后在五个独立上下文启动；你现在只完成规划材料后结束。临时需求或旧合同不在本阶段迁移。保默认high、休息、空音频及收费/unknown保护。不要启动额外生产任务或修改流水线程序。`;}
function workerTask(p,taskId,repair=null){
  const task=p.plan.tasks.find(t=>t.taskId===taskId),folder=path.relative(p.root,p.task(taskId)).replaceAll('\\','/'),owned=task.words.map(w=>w.wordId+' '+w.text+'（词族：'+w.family.join(', ')+'）').join('\n');
  return `你是第二语言五任务流水线的${taskId}，制作日期${p.date}。独立上下文只制作以下10个主词及其完整真词族/全义，不缩减范围：\n${owned}\n\n先运行node scripts/daily-pipeline.mjs scope ${p.date} ${taskId}并完整读取protocol/FIVE_TASK_PIPELINE.md，以及DAILY_RUN、AUTHENTIC_CONTEXT、CONTENT、TEACHING_AUTHORING、CURRENT_AFFAIRS、QUALITY_WORKFLOW、QUALITY_SCALE、USAGE_LABELS、ETYMOLOGY、ANNOTATIONS。实际恢复plan.json与本任务材料，不用摘要冒充双教材原件。仅写${folder}/authored/word-Wxxx.json、${folder}/materials.json、${folder}/handoff.json及该任务研究记录；补查只运行node scripts/daily-pipeline.mjs materials ${p.date} ${taskId} [--additional FILE]，不运行全局prepare-teaching-materials。共享来源原件可走原current-affairs read/import锁；遇来源写锁先等另一读件完成，不移除活锁、不以锁冲突判无真实材料。\n\nWORD使用分配的Wxxx；新USE/CONTEXT/SENTENCE各用Uxxx_/Cxxx_/Sxxx_词号前缀（xxx对应原主词号），不能重排或侵占其他任务ID。任务内自然共享仍按原合同；跨任务自然共享发现后交给总装，不主动追求共享。逐义实际寻找和比较真实场景原文，保话语功能、限定与采用条件；缺合适材料才具体回退，不能为80%目标虚报或硬植词。完整融合解释、词性后快释、无例后补讲、整块译文和完整材料/原例去向均为正式标准，不交摘要/demo。逐词真实自查，保实际来源/教材事实定位、失败边界和未决问题。\n\n不领取control、不改变selection、VIX或全局materials/authored，不发布、不改协议、不启动额外生产任务。交接handoff.json形状：{planDigest:"${p.planDigest}",taskId:"${taskId}",wordIds:[全部10个WORD],notes:"真实教材事实去向、来源原件定位、已完成稿与疑点；可引用本任务实际研究文件",unresolved:[]}。未决问题诚实写入unresolved，不能为过闸清空。完成后运行node scripts/daily-pipeline.mjs seal ${p.date} ${taskId}，修补实际失败后才交付。此为结构完整交付，不冒称独立语义认证或发布成功。\n`+(repair?`\n本次只定点返修${repair.wordIds.join(', ')}：${repair.reason}。其余词稿保字节不变，完整10词仍沿原输入，不重做成功材料或已付费资产。修完重新seal并明确改动和证据。`:'');
}
function assemblyTask(p){return `你是第二语言五任务流水线第一条任务的总装阶段，日期${p.date}。五份10词完整成稿已实际交齐并由宿主装配；先node scripts/daily-pipeline.mjs status ${p.date}核对实际回执。完整读取protocol/FIVE_TASK_PIPELINE.md、DAILY_RUN、CONTENT、QUALITY_WORKFLOW、PUBLICATION_REVIEW及实际冻结内容合同，阅读全部五份handoff、50份完整作者稿及装配正文。统一跨词术语、格式、义项区别、语域、词源尺度、快释、英中对应、ID/自然共享和章节阅读组织，实际查所需教材/原文，不把交接或工具通过当质量证明。保50主词/真词族及全部义，不重新开展一遍50词选词/取材；发现原稿语义或来源问题必须实质解决。\n\n整合修订写既有全局teaching/authored，不覆盖任务原稿或不可变回执。若需原任务补研究，先保存当前整合改动；写真实定点请求JSON {tasks:[{taskId:"task-2",wordIds:["W011"],reason:"问题位置、证据、所需修正"}]}并运行node scripts/daily-pipeline.mjs repair ${p.date} REQUEST.json，随后结束本次总装；宿主只将所列词退回对应任务，最多自动处理一轮，不轮询模型、不自行启动Codex。未决重大问题不得发布。\n\n准备真实source-notes、meta及同源chapter.md，按原assemble/pack-current-affairs/pack-chapter流程执行。总装仍须完成原PUBLICATION_REVIEW的真实本版审阅；各任务自查不自动等于独立审阅，不伪填全章/来源阅读或passed。完成移动验收、能力核对、独立完整验证/签名、永久上传和GET摘要回读，再沿原publish-chapter上线与线上回读。DIGR完成不代替这些资格。领取/选词/VIX只复用原件，音频默认空，旧成功/unknown资源不重做。仅真实发布回读成功才报告完成，否则明确剩余问题。`;}

export async function verifyDailyPublication(root,date){
  const local=await preflightDigrPublication({root,date});
  const chapter=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'chapter.json'),'utf8'));
  const {base,token}=await publisherConfig(),options={headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(45000)};
  const response=await fetch(new URL('/api/chapters/'+date,base),options);if(!response.ok)throw Error('不能确认正式当前章节：HTTP '+response.status);
  const remote=await response.json();if(remote.digest!==chapter.digest||sha256(remote.markdown||'')!==chapter.digest||remote.markdown!==chapter.markdown)throw Error('线上当前正文与本版不一致');
  const sources=await fetch(new URL('/api/chapters/'+date+'/sources?digest='+chapter.digest,base),{...options,signal:AbortSignal.timeout(45000)});if(!sources.ok)throw Error('线上来源包不可读');
  const source=await sources.json();if(source.sourceDigest!==chapter.sourceDigest||source.chapterDigest!==chapter.digest||!source.sourcePackage||sha256(canonical(source.sourcePackage))!==chapter.sourceDigest)throw Error('线上来源包摘要不符');
  return {...local,published:true,verifiedAt:new Date().toISOString()};
}

export async function runDailyPipeline({root,date,codexExecutable,invoke=invokeDailyCodex,verifyPublished=verifyDailyPublication}){
  root=await pipelineRoot(root);const mode=await dailyMode(root,date);if(mode==='rest')return {skipped:true,reason:'rest',modelCalls:0};if(mode==='legacy')throw Error('此运行须沿原入口恢复，不转换内容合同');
  const paths=pipelinePaths(root,date);await fs.mkdir(paths.base,{recursive:true});
  let lock;try{lock=await fs.open(path.join(paths.base,'runner.lock'),'wx');}catch(e){if(e.code==='EEXIST')throw Error('同日流水线已有运行锁；先核对其进程，不能重复启动。');throw e;}
  await lock.writeFile(JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
  try{
    const publishedFile=path.join(paths.base,'published.json');
    if(await optionalJson(publishedFile)){const verified=await verifyPublished(root,date);return {resumed:true,...verified};}
    let p;
    if(await optionalJson(paths.plan))p=await inspectPipelinePlan(root,date);
    else{
      // A planner may have finished its artifacts before the outer process died.
      // Validate/reuse those artifacts before considering any new model call.
      try{p=await createPipelinePlan(root,date);}catch(error){
        if(error.code!=='ENOENT')throw error;
        await invoke({root,date,role:'task-1-plan',task:planningTask(date),codexExecutable});
        p=await createPipelinePlan(root,date);
      }
    }
    const planRelative=path.relative(root,paths.plan).replaceAll('\\','/');
    const initial=await Promise.allSettled(TASK_IDS.map(async taskId=>{
      const ready=await inspectPipelineTask(root,date,taskId);if(ready)return;
      await invoke({root,date,role:taskId,task:workerTask(p,taskId),inputFiles:[planRelative],codexExecutable});
      if(!await inspectPipelineTask(root,date,taskId))throw Error(taskId+'退出但未交齐十词原稿');
    }));
    const failed=initial.filter(r=>r.status==='rejected');if(failed.length)throw Error('部分任务未完成；已完成任务保留：'+failed.map(r=>r.reason.message).join('；'));
    const barrier=await pipelineBarrier(root,date);if(!barrier.ready)throw Error('完整原件屏障未通过，不启动总装');
    const prior=await optionalJson(path.join(paths.base,'merged.json'));if(!prior)await mergePipelineTasks(root,date);
    const assemblyInputs=[planRelative,...await Promise.all(TASK_IDS.map(async id=>path.relative(root,(await inspectPipelineTask(root,date,id)).receiptFile).replaceAll('\\','/')))];
    const assemblyFinished=await optionalJson(path.join(paths.base,'invocations/task-1-assemble/finished.json'));
    if(!assemblyFinished&&await optionalJson(path.join(paths.base,'invocations/task-1-assemble/started.json'))){
      // A final return can be lost after a genuine publication. Recover the
      // current fixed result first; never pay for an invented replacement run.
      const verified=await verifyPublished(root,date);await atomicJson(publishedFile,verified);return {resumed:true,...verified};
    }
    if(!assemblyFinished)await invoke({root,date,role:'task-1-assemble',task:assemblyTask(p),inputFiles:assemblyInputs,codexExecutable});
    const repair=await inspectPipelineRepair(root,date);
    if(repair){
      const repaired=await Promise.allSettled(repair.tasks.map(async item=>{
        const current=await inspectPipelineTask(root,date,item.taskId);
        if(current?.receiptDigest!==item.baselineReceipt){await verifyRepairBoundary(root,date,item);return;}
        await invoke({root,date,role:item.taskId+'-repair-'+repair.repairDigest.slice(0,12),task:workerTask(p,item.taskId,item),inputFiles:[planRelative],codexExecutable});
        await verifyRepairBoundary(root,date,item);if(!await inspectPipelineTask(root,date,item.taskId))throw Error('返修未交齐');
      }));
      if(repaired.some(r=>r.status==='rejected'))throw Error('定点返修未完成；保留其余稿件，不重复全章。');
      await mergePipelineTasks(root,date);
      const finished=await optionalJson(path.join(paths.base,'invocations/task-1-assemble-repaired/finished.json'));
      if(!finished)await invoke({root,date,role:'task-1-assemble-repaired',task:assemblyTask(p)+'\n本次为已交回的定点返修汇总。继续核原整合修改；若仍需返修保存问题并停止，不再自动开启下一轮。',inputFiles:[planRelative],codexExecutable});
      const latest=await inspectPipelineRepair(root,date);if(latest?.repairDigest!==repair.repairDigest)throw Error('返修后仍有新问题，已保存，不循环消耗模型。');
    }
    const verified=await verifyPublished(root,date);await atomicJson(publishedFile,verified);return verified;
  }finally{await lock.close();await fs.unlink(path.join(paths.base,'runner.lock'));}
}

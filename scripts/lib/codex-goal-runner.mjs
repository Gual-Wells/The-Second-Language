// Native Codex Goal lifecycle, with project-owned immutable inputs and receipts.
// There is no local continuation loop: Codex itself schedules subsequent turns.
import fs from 'node:fs/promises';
import syncfs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {CodexAppServer} from './codex-app-server.mjs';
import {currentDigrInputs,studyDate} from './digr-project.mjs';
import {pipelinePaths,pipelineRoot,optionalJson,atomicJson,immutableJson,sha256} from './daily-pipeline.mjs';

export const GOAL_ENGINE='codex-goal-v1';
export const DIGR_ENGINE='digr-v1';
const protocols=['AGENTS.md','protocol/CODEX_GOAL_DAILY.md','protocol/DAILY_RUN.md',
  'protocol/FIVE_TASK_PIPELINE.md','protocol/AUTHENTIC_CONTEXT.md','protocol/CONTENT.md',
  'protocol/RECOMMENDATION.md','protocol/TEACHING_AUTHORING.md','protocol/VIX_CONTEXT_DISCOVERY.md',
  'protocol/QUALITY_WORKFLOW.md','protocol/PUBLICATION_REVIEW.md','protocol/CURRENT_AFFAIRS.md',
  'protocol/BACKGROUND_AUTOMATION.md'];

export async function selectDailyExecution(root,date){
  const p=pipelinePaths(root,date),file=path.join(p.base,'execution.json');
  const prior=await optionalJson(file);
  const engines=new Set();
  try{for(const entry of await fs.readdir(path.join(p.base,'invocations'),{withFileTypes:true})){
    if(!entry.isDirectory())continue;
    const started=await optionalJson(path.join(p.base,'invocations',entry.name,'started.json'));
    if(started)engines.add(started.engine||DIGR_ENGINE);
  }}catch(e){if(e.code!=='ENOENT')throw e;}
  if(prior){
    if(prior.date!==date||![GOAL_ENGINE,DIGR_ENGINE].includes(prior.engine)||[...engines].some(e=>e!==prior.engine))throw Error('日课执行合同或实际调用引擎不符');
    return prior;
  }
  if(engines.has(GOAL_ENGINE))throw Error('已有Goal但缺原执行合同；恢复原件，不改用DIGR或新建Goal');
  // Existing originals, started calls and frozen plans retain their actual engine.
  // Do not reinterpret a previously acquired DIGR run as a Goal.
  let existing=engines.size>0;
  for(const f of ['selection.json','vix-source.json','teaching/pipeline/plan.json'])
    if(await optionalJson(path.join(p.run,f)))existing=true;
  const value={version:1,date,engine:existing?DIGR_ENGINE:GOAL_ENGINE,selectedAt:new Date().toISOString(),
    reason:existing?'Preserve existing input/plan/invocation engine':'User selected native Codex Goals for new daily production'};
  await immutableJson(file,value);return value;
}

function objectiveFor(role,task){
  return `完成第二语言本次独立阶段的实际成果，不以一轮答复、文件存在或结构封存代替目标完成。阶段：${role}。\n\n${task}\n\n`
    +'这是原生 Codex Goal，目标由后台宿主设置。不要另建、清除、替换或缩小目标，不修改 token 预算，不将普通最终答复当作目标完成。原生 Goal 会在目标保持 active 时自行续作。\n'
    +'80%真实语境仍是研究目标，低于仍可发布；可发布资格与研究是否值得继续分别判断。对可用原文尚未核读、常见义只查到词典、单一体裁失败等有希望补齐的缺口，实际改变检索/读取/编辑路线并比较结果，再决定本轮是否回退。不得以“不是硬门槛”“已满足最低投入”或“seal已通过”直接结束研究；也不为比例删义、改标签、堆例句或无限搜索。\n'
    +'结束前实际检查本阶段完整成品、教材事实和所用原段，修正发现的问题；在既有研究/交接记录中说明仍存在的缺口、已经尝试的不同路线，以及继续研究的实际收益或本次真实边界。缺口不能只用统一模板宣称不存在。需要不同视角时，可委托全新上下文作限定范围的只读挑战，向其提供必要原件，实际评估并吸收结果，不为固定次数额外调用。\n'
    +'只有本阶段职责真正完成且可由既有原件核验时，才将现有 Goal 标为 complete。生产者完成不是全章出版完成；总装如果按原流程提出真实定点返修，保留整合结果并明确交接即可结束本阶段，由原宿主接续，不能冒称已发布。网络/额度/权限或未知结果导致无法继续时保留实际状态和原件，不自行重新发起调用。';
}

async function inputRef(root,relative){
  if(typeof relative!=='string'||path.isAbsolute(relative))throw Error('目标原件须位于项目内');
  const file=await fs.realpath(path.join(root,relative)),rel=path.relative(root,file);
  if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw Error('目标原件越出项目');
  const bytes=await fs.readFile(file);return {path:relative,bytes:bytes.length,sha256:sha256(bytes)};
}
export async function verifyGoalInputs(root,refs){
  for(const original of refs){const now=await inputRef(root,original.path);
    if(now.sha256!==original.sha256||now.bytes!==original.bytes)throw Error('目标固定输入改变：'+original.path);}
}
export async function prepareDailyGoal({root,date,role,task,inputFiles=[]}){
  root=await pipelineRoot(root);studyDate(date);
  if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,120}$/.test(role||'')||typeof task!=='string'||!task.trim()||!Array.isArray(inputFiles))throw Error('Goal阶段参数无效');
  const p=pipelinePaths(root,date),control=await optionalJson(path.join(p.run,'control.json'));
  if(!control||control.date!==date||control.runId!==date||typeof control.rest!=='boolean')throw Error('需先恢复真实日课领取');
  if(control.rest)return {skipped:true,reason:'rest'};
  const directory=path.join(p.base,'invocations',role),observed=await currentDigrInputs({root,date});
  const refs=[...observed.refs];
  for(const file of inputFiles)if(!refs.some(r=>r.path===file))refs.push(await inputRef(root,file));
  const snapshots=[];
  for(const file of protocols){const bytes=await fs.readFile(path.join(root,file)),relative=path.relative(root,path.join(directory,'project-contracts',file)).replaceAll('\\','/');
    await fs.mkdir(path.dirname(path.join(root,relative)),{recursive:true});await fs.writeFile(path.join(root,relative),bytes,{flag:'wx'});
    snapshots.push({original:file,...await inputRef(root,relative)});}
  const git=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true});
  const packetRelative=path.relative(root,path.join(directory,'goal-packet.json')).replaceAll('\\','/');
  const objective=`先实际读取本阶段${packetRelative}及其protocolSnapshots中的完整领域协议快照；它们约束本阶段内容和原件，不从后来修改的协议猜测旧合同。\n\n`+objectiveFor(role,task);
  const packet={version:1,engine:GOAL_ENGINE,date,role,root,createdAt:new Date().toISOString(),projectCommit:git.status===0?git.stdout.trim():null,
    model:'gpt-6.1-sol',effort:'high',objective,objectiveDigest:sha256(objective),immutableInputs:refs,protocolSnapshots:snapshots,contentAuthority:observed.contentAuthority};
  await immutableJson(path.join(directory,'goal-packet.json'),packet);
  await fs.writeFile(path.join(directory,'objective.txt'),objective,{flag:'wx'});
  return {directory,packet};
}

export async function runNativeGoal({root,directory,objective,codexExecutable,existingThreadId=null,
  clientFactory=options=>new CodexAppServer(options),verifyResult,pollMs=5000,idleLimitMs=60000,deadlineAt=Date.now()+20*60*60*1000,env=process.env}){
  if(typeof codexExecutable!=='string'||!codexExecutable.trim())throw Error('缺少Codex可执行文件，不启动Goal');
  if(typeof verifyResult!=='function')throw Error('缺少实际交付验收器，不启动Goal');
  if(!Number.isFinite(deadlineAt)||deadlineAt<=Date.now())throw Error('原20小时执行窗口已结束，不启动新Goal工作');
  await fs.mkdir(directory,{recursive:true});
  const log=path.join(directory,'events.jsonl'),stderr=path.join(directory,'stderr.log');
  let threadId=existingThreadId,fatal=null,successfulTurn=false;const submittedTurns=0;
  const client=clientFactory({executable:codexExecutable,root,env,
    onMessage:message=>syncfs.appendFileSync(log,JSON.stringify(message)+'\n'),
    onStderr:chunk=>syncfs.appendFileSync(stderr,chunk)});
  const deadlineTimer=setTimeout(()=>{fatal=Error('原20小时执行窗口已结束；保留原线程和未知结果，不自动重试');void client.stop();},Math.max(1,deadlineAt-Date.now()));
  client.on('failure',error=>{fatal=error;});
  client.on('request',message=>{
    try{syncfs.writeFileSync(path.join(directory,'attention.json'),JSON.stringify({method:message.method,params:message.params,at:new Date().toISOString()},null,2));
      fatal=Error('后台需要交互，已保留实际请求，不代答：'+message.method);
    }catch(error){fatal=Error('后台交互记录写入失败，不代答：'+error.message);}
  });
  client.on('notification',message=>{
    const params=message.params||{};if(threadId&&params.threadId&&params.threadId!==threadId)return;
    if(message.method==='turn/completed'){
      if(params.turn?.status==='completed')successfulTurn=true;
      else fatal=Error('原生Goal轮次未成功结束，保留原线程，不重发：'+params.turn?.status);
    }
    if(message.method==='error'&&!params.willRetry)fatal=Error('原生Goal出错，保留原线程和未知结果：'+(params.error?.message||'see event log'));
  });
  let result;
  try{
    await atomicJson(path.join(directory,'process.json'),{pid:client.child?.pid||null,hostPid:process.pid,startedAt:new Date().toISOString()});
    await client.initialize();
    if(existingThreadId){
      // Read without starting/resuming work first: a completed Goal can be verified for free.
      const current=await client.request('thread/goal/get',{threadId});
      if(!current.goal||current.goal.objective!==objective)throw Error('原生Goal身份/目标不符，不建立替代Goal');
      if(current.goal.status!=='complete'){
        const view=await client.request('thread/read',{threadId,includeTurns:true});
        const latest=view.thread.turns?.at(-1);
        if(latest&&latest.status!=='completed')throw Error('原线程上次轮次结果待核，不能自动恢复生成');
        if(current.goal.status!=='active')throw Error('原生Goal需按其真实状态处理：'+current.goal.status);
        await client.request('thread/resume',{threadId,cwd:root,model:'gpt-6.1-sol',approvalPolicy:'never',sandbox:'danger-full-access',excludeTurns:true});
        // Native Goal resumption is owned by Codex. No replacement prompt/Goal is sent.
      }
    }else{
      const created=await client.request('thread/start',{cwd:root,threadSource:'second-language-daily-goal',model:'gpt-6.1-sol',allowProviderModelFallback:false,approvalPolicy:'never',sandbox:'danger-full-access',
        config:{model_reasoning_effort:'high'},developerInstructions:'执行宿主已设置的原生Goal。只按本阶段职责工作；保留原输入、付费成功/unknown结果及其他项目。不得替换、清除或缩小Goal，不自改模型、档位、预算或流水线。当前阶段必须遵循固定的领域协议快照；Goal完成不替代领域验收。'});
      threadId=created.thread.id;
      if(created.model!=='gpt-6.1-sol'||created.reasoningEffort!=='high')throw Error('后台模型或档位未按授权核实');
      await immutableJson(path.join(directory,'thread.json'),{threadId,model:created.model,effort:created.reasoningEffort,objectiveDigest:sha256(objective)});
      await immutableJson(path.join(directory,'goal-setting.json'),{threadId,objectiveDigest:sha256(objective),createdAt:new Date().toISOString()});
      // Setting an active native Goal already schedules its first model turn.
      // Sending turn/start as well can steer or duplicate that initial input.
      await client.request('thread/goal/set',{threadId,objective,origin:'user'});
    }
    let idleSince=null;
    for(;;){
      if(fatal)throw fatal;
      const {goal}=await client.request('thread/goal/get',{threadId});
      if(!goal||goal.objective!==objective||goal.tokenBudget!=null)throw Error('原生Goal目标或未授权预算发生改变');
      await atomicJson(path.join(directory,'native-goal.json'),goal);
      if(!['active','complete'].includes(goal.status))throw Error('原生Goal停止于 '+goal.status+'；保留状态，不自动重试');
      const {thread}=await client.request('thread/read',{threadId,includeTurns:false});
      if(thread.status.type==='systemError')throw Error('原生Goal线程出现systemError；保留实际状态');
      if(goal.status==='complete'&&(thread.status.type==='idle'||existingThreadId&&thread.status.type==='notLoaded')){
        if(fatal)throw fatal;
        const verified=await verifyResult();
        result={threadId,goal,verified,verifiedAt:new Date().toISOString(),nativeContinuation:true,modelTurnsSubmittedByHost:submittedTurns,successfulTurnObserved:successfulTurn};
        await immutableJson(path.join(directory,'goal-complete.json'),result);break;
      }
      if(goal.status==='active'&&thread.status.type==='idle'){
        idleSince??=Date.now();
        if(Date.now()-idleSince>idleLimitMs)throw Error('原生Goal保持active但未自动续作；保留线程，不用外部轮询重发模型');
      }else idleSince=null;
      await new Promise(resolve=>setTimeout(resolve,pollMs));
    }
    return result;
  }catch(error){
    const reason=fatal||error;
    await atomicJson(path.join(directory,'error.json'),{message:reason.message,threadId,outcome:'preserved-not-replayed',at:new Date().toISOString()});
    throw reason;
  }finally{clearTimeout(deadlineTimer);await client.stop();}
}

export async function invokeDailyGoal({root,date,role,task,inputFiles=[],codexExecutable,verifyResult,clientFactory,deadlineAt}){
  if(typeof verifyResult!=='function')throw Error('Goal缺少真实阶段验收器，不启动模型');
  if(deadlineAt!=null&&(!Number.isFinite(deadlineAt)||deadlineAt<=Date.now()))throw Error('原20小时执行窗口已结束，不建立下一阶段');
  const directory=path.join(pipelinePaths(root,date).base,'invocations',role);
  if(await optionalJson(path.join(directory,'started.json')))throw Error(role+'已有调用原件；先核原生Goal，不建立新线程重发');
  const prepared=await prepareDailyGoal({root,date,role,task,inputFiles});
  if(prepared.skipped)throw Error('已领取休息，不启动Goal');
  await immutableJson(path.join(directory,'started.json'),{engine:GOAL_ENGINE,role,date,model:'gpt-6.1-sol',effort:'high',startedAt:new Date().toISOString(),objectiveDigest:prepared.packet.objectiveDigest,prepared:{directory,packet:path.join(directory,'goal-packet.json')}});
  try{
    const result=await runNativeGoal({root,directory,objective:prepared.packet.objective,codexExecutable,clientFactory,deadlineAt,
      verifyResult:async()=>{await verifyGoalInputs(root,[...prepared.packet.immutableInputs,...prepared.packet.protocolSnapshots]);return verifyResult();}});
    await immutableJson(path.join(directory,'finished.json'),{code:0,signal:null,engine:GOAL_ENGINE,threadId:result.threadId,finishedAt:new Date().toISOString()});
    return {directory,...result};
  }catch(error){await immutableJson(path.join(directory,'finished.json'),{code:1,signal:null,engine:GOAL_ENGINE,outcome:'preserved-not-replayed',finishedAt:new Date().toISOString()});throw error;}
}

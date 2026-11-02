import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {pipelinePaths,optionalJson,atomicJson} from './lib/daily-pipeline.mjs';
import {GOAL_ENGINE,runNativeGoal,verifyGoalInputs,selectDailyExecution} from './lib/codex-goal-runner.mjs';
import {verifyDailyStageResult} from './lib/daily-pipeline-runner.mjs';
const root=await fs.realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const [action,date,role,flag,codexExecutable]=process.argv.slice(2);
if(!['status','resume'].includes(action)||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,120}$/.test(role||''))throw Error('用法：daily-goal.mjs status DATE ROLE 或 resume DATE ROLE --codex EXE');
const p=pipelinePaths(root,date),directory=path.join(p.base,'invocations',role);
const started=await optionalJson(path.join(directory,'started.json'));
if(!started||started.engine!==GOAL_ENGINE)throw Error('不是已启动的原生Goal阶段，不迁移或建立新Goal');
const thread=await optionalJson(path.join(directory,'thread.json'));
const alive=pid=>{if(!Number.isSafeInteger(pid)||pid<=0)return false;try{process.kill(pid,0);return true;}catch(e){if(e.code==='ESRCH')return false;throw e;}};
if(action==='status'){
  const proc=await optionalJson(path.join(directory,'process.json'));
  console.log(JSON.stringify({scope:'last-observed-local-state',role,date,thread,process:proc,processAlive:alive(proc?.pid),hostAlive:alive(proc?.hostPid),goal:await optionalJson(path.join(directory,'native-goal.json')),finished:await optionalJson(path.join(directory,'finished.json')),error:await optionalJson(path.join(directory,'error.json')),recovery:await optionalJson(path.join(directory,'recovery-latest.json'))},null,2));
}else{
  if(flag!=='--codex'||!codexExecutable||process.argv.length!==7)throw Error('恢复需指定原Codex可执行文件');
  if(!thread?.threadId)throw Error('未取得原线程身份；先核真实事件，不能新建替代线程');
  if((await selectDailyExecution(root,date)).engine!==GOAL_ENGINE)throw Error('原日课执行合同不符');
  const runner=await optionalJson(path.join(p.base,'runner.lock')),proc=await optionalJson(path.join(directory,'process.json'));
  if(alive(runner?.pid)||alive(proc?.pid)||alive(proc?.hostPid))throw Error('原宿主或进程仍存在，不干预/重复恢复');
  const control=await optionalJson(path.join(p.run,'control.json'));if(!control||control.rest)throw Error('休息或无真实领取，不恢复生成');
  const packet=await optionalJson(path.join(directory,'goal-packet.json'));
  if(!packet||packet.root!==root||packet.date!==date||packet.role!==role||packet.objectiveDigest!==thread.objectiveDigest)throw Error('原Goal绑定不符');
  await verifyGoalInputs(root,[...packet.immutableInputs,...packet.protocolSnapshots]);
  const lockFile=path.join(directory,'recovery.lock'),lock=await fs.open(lockFile,'wx');
  await lock.writeFile(JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
  try{
    const recovery=path.join(directory,'recoveries',Date.now()+'-'+randomUUID());
    const result=await runNativeGoal({root,directory:recovery,objective:packet.objective,codexExecutable,existingThreadId:thread.threadId,
      verifyResult:async()=>{await verifyGoalInputs(root,[...packet.immutableInputs,...packet.protocolSnapshots]);return verifyDailyStageResult(root,date,role);}});
    await atomicJson(path.join(directory,'recovery-latest.json'),{directory:recovery,...result});
    console.log(JSON.stringify({recovered:true,directory:recovery,threadId:result.threadId,goal:result.goal},null,2));
  }finally{await lock.close();await fs.unlink(lockFile);}
}

// Transport/lifecycle fixtures only. No real models, claims, VIX, publishing or audio.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {fileURLToPath} from 'node:url';
import {CodexAppServer,codexGoalServerArgs} from './lib/codex-app-server.mjs';
import {GOAL_ENGINE,DIGR_ENGINE,selectDailyExecution,prepareDailyGoal,verifyGoalInputs,runNativeGoal,invokeDailyGoal} from './lib/codex-goal-runner.mjs';
import {atomicJson,optionalJson,pipelinePaths} from './lib/daily-pipeline.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const scratch=await fs.mkdtemp('D:/CodexStorage/tmp/codex-goal-check-'),date='2099-02-01',checks=[];
const check=async(name,fn)=>{await fn();checks.push(name);};
let sequence=0;
async function project({rest=false}={}){
 const root=path.join(scratch,'project-'+(++sequence));await atomicJson(path.join(root,'work/runs',date,'control.json'),{runId:date,date,rest});
 for(const file of ['AGENTS.md','protocol/CODEX_GOAL_DAILY.md','protocol/DAILY_RUN.md','protocol/FIVE_TASK_PIPELINE.md','protocol/AUTHENTIC_CONTEXT.md','protocol/CONTENT.md','protocol/RECOMMENDATION.md','protocol/TEACHING_AUTHORING.md','protocol/VIX_CONTEXT_DISCOVERY.md','protocol/QUALITY_WORKFLOW.md','protocol/PUBLICATION_REVIEW.md','protocol/CURRENT_AFFAIRS.md','protocol/BACKGROUND_AUTOMATION.md']){
  await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});await fs.copyFile(path.join(repo,file),path.join(root,file));}
 return root;
}
class FixtureClient extends EventEmitter{
 constructor(options,scenario={}){super();this.options=options;this.scenario=scenario;this.calls=[];this.child={pid:null};this.poll=0;this.status='active';this.threadId='fixture-thread';}
 async initialize(){return {};}
 async request(method,params){
  this.calls.push({method,params});
  if(this.scenario.throwAt===method)throw Error('Fixture unknown RPC outcome');
  if(method==='thread/start')return {model:this.scenario.wrongModel?'wrong-model':'gpt-6.1-sol',reasoningEffort:'high',thread:{id:this.threadId}};
  if(method==='thread/goal/set'){this.objective=params.objective;return {goal:this.goal()};}
  if(method==='turn/start')return {turn:{id:'fixture-turn-1',status:'inProgress'}};
  if(method==='thread/resume'){this.resumed=true;return {thread:{id:this.threadId}};}
  if(method==='thread/goal/get'){
   this.poll++;
   if(this.scenario.interactive&&this.poll===1)this.emit('request',{id:9,method:'item/tool/requestUserInput',params:{questions:[{question:'Fixture needs user input'}]}});
   if(this.scenario.failedTurn&&this.poll===1)this.emit('notification',{method:'turn/completed',params:{threadId:this.threadId,turn:{id:'failed-turn',status:'failed'}}});
   const states=this.scenario.states||['active','active','complete','complete'];
   this.status=states[Math.min(this.poll-1,states.length-1)];
   if(this.poll===2)this.emit('notification',{method:'turn/completed',params:{threadId:this.threadId,turn:{id:'fixture-turn-1',status:'completed'}}});
   return {goal:this.goal()};
  }
  if(method==='thread/read'){
   if(params.includeTurns)return {thread:{status:{type:'notLoaded'},turns:[{id:'prior-turn',status:this.scenario.priorUnknown?'inProgress':'completed'}]}};
   const active=this.status==='active'||(!this.scenario.completeOnFirst&&this.poll===3);
   if(!active)this.emit('notification',{method:'turn/completed',params:{threadId:this.threadId,turn:{id:'fixture-native-continuation',status:'completed'}}});
   return {thread:{status:{type:this.scenario.notLoaded?'notLoaded':active?'active':'idle'}}};
  }
  throw Error('Unexpected fixture method '+method);
 }
 goal(){return {threadId:this.threadId,objective:this.scenario.changedObjective?'Changed scope':this.objective||'Fixture objective',status:this.status,tokenBudget:this.scenario.changedBudget?100:null,tokensUsed:123,timeUsedSeconds:10};}
 async stop(){this.stopped=true;}
}
async function session(scenario={},extra={}){
 const directory=path.join(scratch,'session-'+(++sequence));let client;
 const promise=runNativeGoal({root:scratch,directory,objective:'Fixture objective',codexExecutable:'not-executable',pollMs:1,idleLimitMs:100,
  clientFactory:options=>(client=new FixtureClient(options,scenario)),verifyResult:async()=>({passed:true}),...extra});
 return {promise,directory,get client(){return client;}};
}

await check('new runs pin Goal; subsequent calls preserve exact execution identity',async()=>{
 const root=await project(),first=await selectDailyExecution(root,date),bytes=await fs.readFile(path.join(pipelinePaths(root,date).base,'execution.json'));
 assert.equal(first.engine,GOAL_ENGINE);assert.deepEqual(await selectDailyExecution(root,date),first);assert.deepEqual(await fs.readFile(path.join(pipelinePaths(root,date).base,'execution.json')),bytes);
});
await check('old frozen input and old started calls preserve DIGR',async()=>{
 for(const file of ['vix-source.json','teaching/pipeline/invocations/task-1/started.json']){const root=await project();await atomicJson(path.join(root,'work/runs',date,file),{});assert.equal((await selectDailyExecution(root,date)).engine,DIGR_ENGINE);}
});
await check('lost Goal execution identity or mixed engines fail rather than migrate',async()=>{
 const root=await project(),p=pipelinePaths(root,date);await atomicJson(path.join(p.base,'invocations/task-1/started.json'),{engine:GOAL_ENGINE});await assert.rejects(()=>selectDailyExecution(root,date),/缺原执行合同/);
 await atomicJson(path.join(p.base,'execution.json'),{date,engine:DIGR_ENGINE});await assert.rejects(()=>selectDailyExecution(root,date),/引擎不符/);
});
await check('rest prevents Goal preparation and all model activity',async()=>{
 const root=await project({rest:true});const prepared=await prepareDailyGoal({root,date,role:'task-1',task:'Fixture task'});assert(prepared.skipped);
 let called=false;await assert.rejects(()=>invokeDailyGoal({root,date,role:'task-1',task:'Fixture task',verifyResult:async()=>{},clientFactory:()=>{called=true;}}),/休息/);assert.equal(called,false);
});
await check('Goal packet preserves task, domain originals and frozen protocol bytes',async()=>{
 const root=await project();await fs.writeFile(path.join(root,'fixture-original.txt'),'Original');const prepared=await prepareDailyGoal({root,date,role:'task-1',task:'Fixture full-scope task',inputFiles:['fixture-original.txt']});
 assert(prepared.packet.objective.includes('Fixture full-scope task'));assert(!prepared.packet.objective.startsWith('DIGR'));await verifyGoalInputs(root,[...prepared.packet.immutableInputs,...prepared.packet.protocolSnapshots]);
 await fs.writeFile(path.join(root,'fixture-original.txt'),'Changed');await assert.rejects(()=>verifyGoalInputs(root,prepared.packet.immutableInputs),/改变/);
});
await check('invalid role and outside-root artifacts cannot reach a model',async()=>{
 const root=await project();await assert.rejects(()=>prepareDailyGoal({root,date,role:'../../escape',task:'Fixture'}),/参数无效/);
 await fs.writeFile(path.join(scratch,'outside.txt'),'Outside');await assert.rejects(()=>prepareDailyGoal({root,date,role:'task-1',task:'Fixture',inputFiles:['../outside.txt']}));
});
await check('setting Goal starts native work with zero host turn submissions and waits until idle',async()=>{
 const s=await session();let verifiedAtPoll;
 // The fixture models a second native turn. The host must never submit it.
 const result=await s.promise;verifiedAtPoll=s.client.poll;assert.equal(verifiedAtPoll,4);assert(result.nativeContinuation);
 assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);assert.equal(s.client.calls.filter(c=>c.method==='thread/goal/set').length,1);
 assert.equal(s.client.calls.find(c=>c.method==='thread/goal/set').params.origin,'user');assert(!('tokenBudget' in s.client.calls.find(c=>c.method==='thread/goal/set').params));assert(s.client.stopped);
});
for(const status of ['blocked','paused','usageLimited','budgetLimited'])await check(status+' preserves native state and does not retry generation',async()=>{
 const s=await session({states:[status]});await assert.rejects(()=>s.promise,new RegExp(status));assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);assert.equal((await optionalJson(path.join(s.directory,'native-goal.json'))).status,status);assert(await optionalJson(path.join(s.directory,'error.json')));
});
await check('failed model turn is not auto-replayed',async()=>{
 const s=await session({failedTurn:true});await assert.rejects(()=>s.promise,/未成功结束/);assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);
});
await check('unexpected interactive requests are saved and never answered automatically',async()=>{
 const s=await session({interactive:true});await assert.rejects(()=>s.promise,/需要交互/);assert.equal((await optionalJson(path.join(s.directory,'attention.json'))).method,'item/tool/requestUserInput');
});
await check('native completion does not certify missing actual artifacts',async()=>{
 const s=await session({}, {verifyResult:async()=>{throw Error('Fixture missing sealed original');}});await assert.rejects(()=>s.promise,/missing sealed/);assert.equal(await optionalJson(path.join(s.directory,'goal-complete.json')),null);assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);
});
for(const key of ['changedObjective','changedBudget'])await check(key+' cannot change authorization',async()=>{
 const s=await session({[key]:true});await assert.rejects(()=>s.promise,/未授权预算/);assert.equal(s.client.calls.filter(c=>c.method==='thread/goal/set').length,1);
});
await check('unknown RPC response retains thread/error and never falls back to ordinary exec',async()=>{
 const s=await session({throwAt:'thread/goal/get'});await assert.rejects(()=>s.promise,/unknown RPC/);assert(await optionalJson(path.join(s.directory,'thread.json')));assert(await optionalJson(path.join(s.directory,'error.json')));assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);
});
await check('completed Goal recovery validates originals without another model turn',async()=>{
 const s=await session({states:['complete'],completeOnFirst:true,notLoaded:true},{existingThreadId:'fixture-thread'});await s.promise;
 for(const method of ['thread/start','thread/goal/set','turn/start','thread/resume'])assert.equal(s.client.calls.filter(c=>c.method===method).length,0);
});
await check('unknown prior turn blocks active Goal recovery without new generation',async()=>{
 const s=await session({states:['active'],priorUnknown:true},{existingThreadId:'fixture-thread'});await assert.rejects(()=>s.promise,/上次轮次结果待核/);assert.equal(s.client.calls.filter(c=>c.method==='thread/resume').length,0);assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);
});
await check('same-thread active recovery is delegated to native resume, not a replacement turn',async()=>{
 const s=await session({}, {existingThreadId:'fixture-thread'});await s.promise;assert.equal(s.client.calls.filter(c=>c.method==='thread/resume').length,1);assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);assert.equal(s.client.calls.filter(c=>c.method==='thread/goal/set').length,0);
});
await check('started Goal is never replaced by a fresh invocation',async()=>{
 const root=await project(),directory=path.join(pipelinePaths(root,date).base,'invocations/task-1');await atomicJson(path.join(directory,'started.json'),{engine:GOAL_ENGINE});let called=false;
 await assert.rejects(()=>invokeDailyGoal({root,date,role:'task-1',task:'Fixture',verifyResult:async()=>{},clientFactory:()=>{called=true;}}),/已有调用原件/);assert.equal(called,false);
});
await check('full Goal invocation binds thread, originals and verified terminal receipt',async()=>{
 const root=await project();let client;
 const result=await invokeDailyGoal({root,date,role:'task-1',task:'Fixture owned artifacts only',codexExecutable:'not-executable',
  clientFactory:o=>(client=new FixtureClient(o)),verifyResult:async()=>({scope:'fixture-actual-artifact-check',passed:true})});
 const d=result.directory,started=await optionalJson(path.join(d,'started.json')),thread=await optionalJson(path.join(d,'thread.json')),finished=await optionalJson(path.join(d,'finished.json'));
 assert.equal(started.engine,GOAL_ENGINE);assert.equal(started.objectiveDigest,thread.objectiveDigest);assert.equal(finished.code,0);assert.equal(finished.threadId,thread.threadId);assert.equal(result.verified.passed,true);assert.equal(client.calls.filter(c=>c.method==='turn/start').length,0);
});
await check('completed native Goal cannot hide domain input drift',async()=>{
 const root=await project();let changed=false;
 const factory=o=>{const c=new FixtureClient(o),request=c.request.bind(c);c.request=async(method,params)=>{if(method==='thread/goal/get'&&c.poll===2&&!changed){changed=true;await fs.appendFile(path.join(root,'work/runs',date,'control.json'),' ');}return request(method,params);};return c;};
 await assert.rejects(()=>invokeDailyGoal({root,date,role:'task-1',task:'Fixture',codexExecutable:'not-executable',clientFactory:factory,verifyResult:async()=>({passed:true})}),/固定输入改变/);
 const d=path.join(pipelinePaths(root,date).base,'invocations/task-1');assert.equal((await optionalJson(path.join(d,'finished.json'))).code,1);assert(await optionalJson(path.join(d,'thread.json')));assert.equal(await optionalJson(path.join(d,'goal-complete.json')),null);
});
await check('wrong effective model is rejected before activating Goal',async()=>{
 const s=await session({wrongModel:true});await assert.rejects(()=>s.promise,/模型或档位/);assert.equal(s.client.calls.filter(c=>c.method==='thread/goal/set').length,0);
});
await check('expired original execution window starts no process or Goal',async()=>{
 let called=false;await assert.rejects(()=>runNativeGoal({root:scratch,directory:path.join(scratch,'expired'),objective:'Fixture',codexExecutable:'fixture',verifyResult:async()=>{},deadlineAt:Date.now()-1,clientFactory:()=>{called=true;}}),/执行窗口已结束/);assert.equal(called,false);
});
await check('metadata write failure closes the owned client before any Goal is started',async()=>{
 const directory=path.join(scratch,'metadata-failure');await fs.mkdir(path.join(directory,'process.json'),{recursive:true});let client;
 await assert.rejects(()=>runNativeGoal({root:scratch,directory,objective:'Fixture',codexExecutable:'fixture',verifyResult:async()=>{},clientFactory:o=>(client=new FixtureClient(o))}));
 assert(client.stopped);assert.equal(client.calls.length,0);assert(await optionalJson(path.join(directory,'error.json')));
});
await check('original execution deadline stops only the owned client and preserves unknown work',async()=>{
 const s=await session({states:['active']},{deadlineAt:Date.now()+500});await assert.rejects(()=>s.promise,/执行窗口已结束/);assert(s.client.stopped);assert.equal(s.client.calls.filter(c=>c.method==='thread/goal/set').length,1);assert.equal(s.client.calls.filter(c=>c.method==='turn/start').length,0);
});
await check('actual transport speaks JSON-RPC, exposes native notifications and requests',async()=>{
 const child=new EventEmitter();child.stdin=new PassThrough();child.stdout=new PassThrough();child.stderr=new PassThrough();child.pid=null;child.kill=()=>child.emit('close',0,null);
 const received=[];let buffer='';child.stdin.on('data',chunk=>{buffer+=chunk;let i;while((i=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,i);buffer=buffer.slice(i+1);if(!line)continue;const m=JSON.parse(line);received.push(m);if(m.id!=null)setImmediate(()=>child.stdout.write(JSON.stringify({id:m.id,result:{ok:true}})+'\n'));}});child.stdin.on('end',()=>setImmediate(()=>{child.stdout.end();child.emit('close',0,null);}));
 const transport=new CodexAppServer({executable:'fixture',root:scratch,spawnImpl:(exe,args,options)=>{assert.equal(exe,'fixture');assert.deepEqual(args,codexGoalServerArgs());assert(options.windowsHide);return child;}});
 let notification,request;transport.on('notification',m=>notification=m);transport.on('request',m=>request=m);await transport.initialize();
 child.stdout.write(JSON.stringify({method:'thread/goal/updated',params:{goal:{status:'active'}}})+'\n');child.stdout.write(JSON.stringify({id:99,method:'item/tool/requestUserInput',params:{}})+'\n');await new Promise(r=>setImmediate(r));
 assert.equal(notification.method,'thread/goal/updated');assert.equal(request.id,99);assert.equal(received.filter(m=>m.id===99).length,0);await transport.stop();
});
console.log(JSON.stringify({passed:true,checks,artifacts:scratch},null,2));

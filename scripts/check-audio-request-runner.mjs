import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readAudioResponse,retryAudioRead,prepareAudioUnit,recoverAudioBlocked,reconcileAudioBlocked} from './lib/audio-request-runner.mjs';
const id='a'.repeat(64),unit={id},body={text:'This complete example stays together. This second sentence belongs to it.',kind:'sentence'},wait=async()=>{},checks=[];
const ready={id,state:'ready'},unknown={id,state:'outcome_unknown'},missing=()=>Object.assign(Error('fixture missing'),{status:404}),transport=()=>Object.assign(Error('fixture transport'),{transportUnknown:true});
async function run(name,steps,expected,posts=0,options={}){
 let cursor=0,sent=0;const result=await prepareAudioUnit({unit,body,wait,maxPolls:2,...options,request:async(path,value,{method='POST'}={})=>{
  const step=steps[cursor++];assert(step,name+' unexpected request');assert.equal(method,step[0]);if(method==='POST'){sent++;assert.deepEqual(value,body);assert.equal(path,'/api/practice/pronunciation');}else assert.equal(path,'/api/practice/pronunciation/'+id);
  if(step[1] instanceof Error)throw step[1];return step[1];
 }});assert.equal(result.state,expected);assert.equal(sent,posts);assert.equal(cursor,steps.length);checks.push(name);
}
await run('new unit submits one whole-block POST',[['GET',missing()],['POST',ready]],'ready',1);
await run('saved success is associated with this chapter through its reusable identity',[['GET',ready],['POST',ready]],'ready',1);
await run('existing unknown never replays',[['GET',unknown]],'outcome_unknown');
await run('existing failed never replays',[['GET',{id,state:'failed'}]],'failed');
await run('existing calling is polled and linked',[['GET',{id,state:'calling'}],['GET',ready],['POST',ready]],'ready',1);
await run('explicit credit resume retains the original identity',[['GET',{id,state:'waiting_credit'}],['POST',ready]],'ready',1);
await run('lost paid acknowledgement recovers and links saved success',[['GET',missing()],['POST',transport()],['GET',ready],['POST',ready]],'ready',2);
await run('lost paid acknowledgement with no saved result remains unknown',[['GET',missing()],['POST',transport()],['GET',missing()]],'outcome_unknown',1);
await run('lost acknowledgement polls and links the same running identity',[['GET',missing()],['POST',transport()],['GET',{id,state:'calling'}],['GET',ready],['POST',ready]],'ready',2);
await run('poll deadline leaves unknown',[['GET',{id,state:'calling'}],['GET',{id,state:'calling'}],['GET',{id,state:'calling'}]],'outcome_unknown');
await assert.rejects(prepareAudioUnit({unit,body,wait,request:async()=>({...ready,id:'b'.repeat(64)})}),/声音身份不一致/);checks.push('wrong result identity stops');
let reads=0;await assert.rejects(retryAudioRead(async()=>{reads++;throw transport();},{wait}),/fixture transport/);assert.equal(reads,3);checks.push('safe status retry is bounded');
await assert.rejects(readAudioResponse(new Response('<!DOCTYPE secret fixture>',{status:502})),e=>e.transportUnknown&&e.status===502&&!e.message.includes('secret'));checks.push('HTML error is classified without exposing its body');
assert.deepEqual(await readAudioResponse(Response.json(unknown,{status:502})),unknown);checks.push('saved unknown state is retained despite HTTP 502');
let compactions=0;assert.deepEqual(await retryAudioRead(async()=>readAudioResponse(++compactions<3?Response.json({error:'fixture partial archive'},{status:500}):Response.json({ok:true})),{wait}),{ok:true});assert.equal(compactions,3);checks.push('idempotent saved-audio compaction can recover partial archive acknowledgements');
const job={id:'job',digest:'digest',cursor:2,units:[unit,{id:'b'},unit]};const checkpoint={jobId:'job',digest:'digest',total:3,cursor:2,blocked:[{index:0,id,state:'outcome_unknown'}]};assert.deepEqual(recoverAudioBlocked(checkpoint,job),checkpoint.blocked);assert.equal(recoverAudioBlocked(checkpoint,{...job,cursor:0}).length,0);assert.throws(()=>recoverAudioBlocked({...checkpoint,digest:'wrong'},job));assert.throws(()=>recoverAudioBlocked({...checkpoint,blocked:[{index:0,id:'wrong'}]},job));checks.push('unresolved units survive restart and reject foreign checkpoints');
// Exercise the actual worker orchestration with memory-only files and HTTP.
const workerSource=(await readFile(new URL('./audio-worker.mjs',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
async function workerCase(states,{cursor=0,checkpoint=null,credit=false,resolves=false}={}){
 const units=states.map((_,i)=>({id:String(i+1).repeat(64),kind:'sentence',text:'A complete context block '+i})),job={id:'fixture-job',digest:'fixture-digest',chapterId:'fixture-chapter',units,cursor},files=new Map(),progress=[],posted=[],paid=[],reads=[];
 const file='work/audio-requests/'+job.id+'/';if(checkpoint)files.set(file+'checkpoint.json',JSON.stringify(checkpoint));
 const response=async(url,options)=>{
  const path=new URL(url).pathname,b=options.body?JSON.parse(options.body):null;
  if(path==='/api/audio-config/jobs/claim')return Response.json({job});
  if(path==='/api/audio-config/jobs/progress'){const local=JSON.parse(files.get(file+'checkpoint.json'));assert.equal(local.cursor,b.cursor);assert.equal(local.state,b.state);progress.push(b);return Response.json({ok:true});}
  if(path==='/api/practice/pronunciation'){posted.push(b);const i=units.findIndex(u=>u.text===b.text);if(states[i]==='missing')paid.push(i);return Response.json({id:units[i].id,state:credit?'waiting_credit':'ready'});}
  const i=units.findIndex(u=>path.endsWith(u.id));assert(i>=0);reads.push(i);return states[i]==='missing'?Response.json({error:'missing'},{status:404}):Response.json({id:units[i].id,state:resolves&&states[i]==='outcome_unknown'&&reads.filter(x=>x===i).length>1?'ready':states[i]});
 };
 const fn=new AsyncFunction('randomBytes','mkdir','readFile','writeFile','rename','publisherConfig','finishTaskBalances','readAudioResponse','retryAudioRead','prepareAudioUnit','recoverAudioBlocked','reconcileAudioBlocked','fetch','process','setInterval','clearInterval','console',workerSource);
 const processState={exit(){throw Error('unexpected exit');},exitCode:0};
 await fn(()=>({toString:()=>id}),async()=>{},async path=>{if(!files.has(path))throw Object.assign(Error('missing'),{code:'ENOENT'});return files.get(path);},async(path,value)=>files.set(path,value),async(a,b)=>{files.set(b,files.get(a));files.delete(a);},async()=>({base:'https://fixture.invalid',token:'fixture'}),async()=>{},readAudioResponse,retryAudioRead,prepareAudioUnit,recoverAudioBlocked,reconcileAudioBlocked,response,processState,()=>0,()=>{}, {log(){},error(){}});
 return {job,files,progress,posted,paid,reads,result:JSON.parse(files.get(file+'result.json'))};
}
let worker=await workerCase(['ready','outcome_unknown','missing']);assert.equal(worker.paid.length,1);assert.equal(worker.result.state,'needs_review');assert.equal(worker.result.cursor,3);assert.equal(worker.result.blocked.length,1);assert.equal(worker.result.blocked[0].index,1);checks.push('actual worker isolates unknown and finishes other independent contexts');
const saved=JSON.parse(worker.files.get('work/audio-requests/fixture-job/checkpoint.json'));worker=await workerCase(['ready','outcome_unknown','ready'],{cursor:2,checkpoint:{...saved,cursor:2}});assert.equal(worker.paid.length,0);assert.equal(worker.result.blocked.length,1);assert.equal(worker.result.state,'needs_review');checks.push('actual worker restart retains an earlier unresolved unit');
worker=await workerCase(['outcome_unknown','failed','outcome_unknown','missing']);assert.equal(worker.posted.length,0);assert.equal(worker.result.cursor,3);assert(!worker.reads.includes(3));checks.push('actual worker stops after three consecutive unresolved units');
worker=await workerCase(['missing','missing'],{credit:true});assert.equal(worker.posted.length,1);assert.equal(worker.result.cursor,0);assert.equal(worker.result.state,'waiting_credit');assert(!worker.reads.includes(1));checks.push('actual worker stops immediately on insufficient credit');
worker=await workerCase(['outcome_unknown','ready'],{resolves:true});assert.equal(worker.paid.length,0);assert.equal(worker.result.blocked.length,0);assert.equal(worker.result.state,'completed');checks.push('actual worker recognizes a separately recovered block before completion without generation');
console.log(JSON.stringify({passed:checks.length,checks,providerCalls:0,networkRequests:0}));

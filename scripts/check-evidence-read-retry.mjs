import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {uploadEvidenceObjects} from './lib/publish-chapter-evidence.mjs';
const text='Self-authored immutable evidence read-retry fixture.';
const asset={text,digest:createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text)};
function fixture(steps){
 const calls=[],waits=[],cancelled=[];let stored=false;
 const options={base:'https://fixture.invalid',token:'fixture-only',sleepImpl:async ms=>waits.push(ms),fetchImpl:async(url,options)=>{
  const method=options.method||'GET',step=steps.shift();calls.push(method);assert(step,'unexpected request');assert.equal(method,step.method);
  if(method!=='PUT')assert.equal(new URL(url).searchParams.get('digest'),asset.digest);
  else {assert.equal(options.body,text);stored=true;}
  if(step.error)throw Error('offline network exception');
  if(step.bodyError)return {ok:true,status:200,body:{cancel:async()=>cancelled.push(method)},arrayBuffer:async()=>{throw Error('offline interrupted body');}};
  const status=step.status??200;
  if(method==='PUT'&&status===200)return Response.json({digest:asset.digest,bytes:asset.bytes});
  const body=new ReadableStream({start(controller){if(method==='GET'&&status===200){controller.enqueue(new TextEncoder().encode(step.corrupt?'changed':text));controller.close();}},cancel(){cancelled.push(method+':'+status);}});
  return new Response(body,{status});
 }};
 return {calls,waits,cancelled,options,remaining:()=>steps.length,stored:()=>stored};
}
async function run(f){const result=await uploadEvidenceObjects([asset],f.options);assert.equal(f.remaining(),0);return result;}
test('HEAD/GET transient statuses retry once with 500ms delay and cancel rejected bodies',async()=>{
 for(const method of ['HEAD','GET'])for(const status of [502,503,504]){
  const steps=method==='HEAD'?[{method,status},{method},{method:'GET'}]:[{method:'HEAD'},{method,status},{method}];
  const f=fixture(steps);assert.deepEqual(await run(f),{objects:1});assert.deepEqual(f.waits,[500]);assert(f.cancelled.includes(method+':'+status));assert(!f.calls.includes('PUT'));
 }
});
test('network and interrupted GET body retry once; second failure stops without PUT',async()=>{
 for(const method of ['HEAD','GET']){
  const prefix=method==='GET'?[{method:'HEAD'}]:[];
  const good=fixture([...prefix,{method,error:true},{method},...(method==='HEAD'?[{method:'GET'}]:[])]);await run(good);assert.deepEqual(good.waits,[500]);
  const failed=fixture([...prefix,{method,error:true},{method,error:true}]);await assert.rejects(run(failed),/network/);assert.equal(failed.calls.filter(x=>x===method).length,2);assert.deepEqual(failed.waits,[500]);assert(!failed.calls.includes('PUT'));
 }
 const body=fixture([{method:'HEAD'},{method:'GET',bodyError:true},{method:'GET'}]);await run(body);assert(body.cancelled.includes('GET'));assert.deepEqual(body.waits,[500]);
});
test('persistent transient HTTP failure stops at two reads and cancels both bodies',async()=>{
 for(const method of ['HEAD','GET']){
  const f=fixture([...(method==='GET'?[{method:'HEAD'}]:[]),{method,status:503},{method,status:504}]);await assert.rejects(run(f),/504/);assert.equal(f.calls.filter(x=>x===method).length,2);assert.deepEqual(f.waits,[500]);assert(f.cancelled.includes(method+':503'));assert(f.cancelled.includes(method+':504'));assert(!f.calls.includes('PUT'));
 }
});
test('401/403/429 and GET404 fail immediately; HEAD404 allows exactly one PUT',async()=>{
 for(const method of ['HEAD','GET'])for(const status of [401,403,429,...(method==='GET'?[404]:[])]){
  const f=fixture([...(method==='GET'?[{method:'HEAD'}]:[]),{method,status}]);await assert.rejects(run(f),new RegExp(String(status)));assert.deepEqual(f.waits,[]);assert.equal(f.calls.filter(x=>x===method).length,1);assert(!f.calls.includes('PUT'));assert(f.cancelled.includes(method+':'+status));
 }
 const f=fixture([{method:'HEAD',status:404},{method:'PUT'},{method:'GET'}]);await run(f);assert.deepEqual(f.calls,['HEAD','PUT','GET']);assert.deepEqual(f.waits,[]);assert(f.cancelled.includes('HEAD:404'));
});
test('PUT errors/HTTP failures never retry, and a lost ACK resumes by HEAD+GET on the same identity',async()=>{
 for(const failure of [{error:true},{status:503},{status:403}]){
  const f=fixture([{method:'HEAD',status:404},{method:'PUT',...failure}]);await assert.rejects(run(f));assert.equal(f.calls.filter(x=>x==='PUT').length,1);assert.deepEqual(f.waits,[]);assert.equal(f.stored(),true);if(failure.status)assert(f.cancelled.includes('PUT:'+failure.status));
 }
 const f=fixture([{method:'HEAD',status:404},{method:'PUT',error:true},{method:'HEAD'},{method:'GET'}]);await assert.rejects(()=>uploadEvidenceObjects([asset],f.options),/network/);assert.equal(f.stored(),true);await run(f);assert.deepEqual(f.calls,['HEAD','PUT','HEAD','GET']);assert.deepEqual(f.waits,[]);
});
test('digest mismatch never retries and existing objects always receive full GET verification',async()=>{
 const corrupt=fixture([{method:'HEAD'},{method:'GET',corrupt:true}]);await assert.rejects(run(corrupt),/回读摘要不符/);assert.deepEqual(corrupt.calls,['HEAD','GET']);assert.deepEqual(corrupt.waits,[]);
 const existing=fixture([{method:'HEAD'},{method:'GET'}]);await run(existing);assert.deepEqual(existing.calls,['HEAD','GET']);assert.deepEqual(existing.waits,[]);
});

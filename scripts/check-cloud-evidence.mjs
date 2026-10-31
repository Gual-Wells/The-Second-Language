import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {CLOUD_API_SCHEMA,runCloudResponses,readCloudResult,readCloudUsage} from '../worker/src/shared/cloud-responses.mjs';
import {CLOUD_EVIDENCE_FORMAT,archiveCloudEvidence,readCloudEvidenceResponse,archiveCloudEvidenceFile,readCloudEvidenceFile} from '../worker/src/shared/cloud-evidence.mjs';

const text=new TextEncoder(),sha=value=>createHash('sha256').update(value).digest('hex');
const terminal={id:'resp_evidence_fixture',status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer:'完整答复：保留中文与😀。'})}]}],usage:{input_tokens:12,output_tokens:8}};
const raw='event: response.created\r\ndata: {"type":"response.created"}\r\n\r\ndata: '+JSON.stringify({type:'response.completed',response:terminal})+'\n\n';
function database(){
 const sql=new DatabaseSync(':memory:');sql.exec(CLOUD_API_SCHEMA);let inBatch=false;
 const stats={invocations:0,statements:0,batches:0};
 const db={sql,stats,prepare(query){let args=[];return{query,bind(...values){args=values;return this;},async first(){stats.statements++;if(!inBatch)stats.invocations++;return sql.prepare(query).get(...args)||null;},async all(){stats.statements++;if(!inBatch)stats.invocations++;return{results:sql.prepare(query).all(...args)};},async run(){stats.statements++;if(!inBatch)stats.invocations++;return{meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};},async batch(statements){
  stats.invocations++;stats.batches++;await db.beforeBatch?.();sql.exec('BEGIN');inBatch=true;
  try{const results=[];for(let index=0;index<statements.length;index++){results.push(await statements[index].run());if(db.failAfterStatement===index)throw Error('transaction fault');}sql.exec('COMMIT');return results;}
  catch(error){sql.exec('ROLLBACK');throw error;}finally{inBatch=false;}
 }};return db;
}
const evidenceRPC=store=>({archiveEvidence:request=>archiveCloudEvidenceFile({filesBinding:store,request}),readEvidence:request=>readCloudEvidenceFile({filesBinding:store,request})});
function files({onPut,putError=false,getError=false,wrongReceipt=false,wrongLength=false,corrupt=false}={}){
 const objects=new Map(),calls={puts:0,gets:0};const api={objects,calls,async put(value,mime){calls.puts++;assert.equal(mime,'application/gzip');await onPut?.(value);if(putError)throw Error('private provider credential diagnostic');const digest=sha(value);objects.set(digest,new Uint8Array(value));return{digest:wrongReceipt?'f'.repeat(64):digest,bytes:value.byteLength+(wrongLength?1:0)};},async get(digest){calls.gets++;if(getError)throw Error('private provider credential diagnostic');const stored=objects.get(digest);if(!stored)return null;const bytes=new Uint8Array(stored);if(corrupt&&bytes.length)bytes[0]^=1;return{digest,bytes};}};
 return Object.assign(api,evidenceRPC(api));
}
const options=db=>({db,keyBinding:{get:async()=>'sk-fixture-evidence-only'},project:'test',task:'evidence-test',attempt:'0',instructions:'Fixture instructions',input:'data:image/png;base64,REQUEST_IMAGE_NOT_RETAINED',schema:{type:'object',properties:{answer:{type:'string'}},required:['answer'],additionalProperties:false},config:{timeoutMs:1000}});
const stream=(value=raw)=>new Response(value,{headers:{'content-type':'text/event-stream','x-request-id':'req_fixture'}});
const row=db=>db.sql.prepare('SELECT * FROM api_cloud_runs').get();
const streamCount=db=>db.sql.prepare('SELECT COUNT(*) n FROM api_cloud_streams').get().n;
async function stored(db,extra={}){return runCloudResponses({...options(db),fetchImpl:async()=>stream(),...extra});}
const archiveOptions=db=>({db,project:'test',task:'evidence-test',attempt:'0',response:terminal,responseJSON:JSON.stringify(terminal),rawStream:raw,runKey:sha(JSON.stringify(['test','evidence-test','0'])),streamDigest:sha(raw),responseId:terminal.id});
async function gzip(value){return new Uint8Array(await new Response(new Blob([text.encode(JSON.stringify(value))]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());}

test('full D1 response, usage and streams are durable before any archive write; verified archive then compacts atomically',async()=>{
 const db=database();try{
  const binding=files({onPut:()=>{assert.equal(row(db).outcome,'completed');assert.equal(row(db).response_json,JSON.stringify(terminal));assert(row(db).usage_json);assert(streamCount(db)>0);}});
  const result=await stored(db,{filesBinding:binding});assert.equal(result.value.answer,'完整答复：保留中文与😀。');assert.equal(result.reused,false);
  const pointer=JSON.parse(row(db).response_json);assert.deepEqual(Object.keys(pointer),['archiveFormat','digest']);assert.equal(pointer.archiveFormat,CLOUD_EVIDENCE_FORMAT);assert.equal(pointer.digest,[...binding.objects.keys()][0]);assert(row(db).response_json.length<200);
  assert.equal(streamCount(db),0);assert.equal(db.stats.batches,1);assert.equal(binding.calls.puts,1);assert.equal(binding.calls.gets,1);
  assert.equal((await readCloudUsage({db,project:'test'})).responses,1);
 }finally{db.sql.close();}
});
test('durable terminal receipt stops inference timers before slow archival without reviving a lost business lease',async context=>{
 const db=database();context.mock.timers.enable({apis:['setTimeout','setInterval']});
 try{
  let beats=0,leaseValid=true,signal,posts=0;
  const heartbeat=async()=>{beats++;return leaseValid;};
  const binding=files({onPut:()=>{const before=beats;leaseValid=false;context.mock.timers.tick(800000);assert.equal(beats,before);assert.equal(signal.aborted,false);assert.equal(row(db).outcome,'completed');}});
  const result=await stored(db,{filesBinding:binding,heartbeat,fetchImpl:async(_url,request)=>{posts++;signal=request.signal;return stream();}});
  assert.equal(result.value.answer,'完整答复：保留中文与😀。');assert.equal(beats,1);assert.equal(await heartbeat(),false);assert.equal(beats,2);assert.equal(posts,1);
  assert.equal((await readCloudResult({...options(db),filesBinding:binding})).reused,true);
 }finally{context.mock.timers.reset();db.sql.close();}
});
test('a model timeout also suppresses later interval renewals while a terminal DB write is still settling',async context=>{
 const db=database();context.mock.timers.enable({apis:['setTimeout','setInterval']});
 try{
  const prepare=db.prepare;let beats=0,signal;
  db.prepare=query=>{const statement=prepare(query);if(query.includes('response_json=?,usage_json=?')){const run=statement.run;statement.run=async()=>{context.mock.timers.tick(61000);assert.equal(signal.aborted,true);assert.equal(beats,1);return run.call(statement);};}return statement;};
  assert.equal((await stored(db,{heartbeat:async()=>{beats++;return true;},fetchImpl:async(_url,request)=>{signal=request.signal;return stream();}})).value.answer,'完整答复：保留中文与😀。');assert.equal(beats,1);
 }finally{context.mock.timers.reset();db.sql.close();}
});
test('gzip archive round-trip preserves the exact raw SSE, complete provider object and Unicode without request images',async()=>{
 const db=database();try{
  const binding=files();await stored(db,{filesBinding:binding});const compressed=[...binding.objects.values()][0];
  const evidence=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
  assert.deepEqual(Object.keys(evidence),['format','response','rawStream']);assert.equal(evidence.format,CLOUD_EVIDENCE_FORMAT);assert.equal(evidence.rawStream,raw);assert.deepEqual(evidence.response,terminal);assert(!JSON.stringify(evidence).includes('REQUEST_IMAGE_NOT_RETAINED'));
 }finally{db.sql.close();}
});
test('both completed-result readers recover an archived answer without keys or a second provider POST',async()=>{
 const db=database();try{
  const binding=files();let posts=0;const args={...options(db),filesBinding:binding,fetchImpl:async()=>{posts++;return stream();}};
  await runCloudResponses(args);assert.equal((await readCloudResult({...options(db),filesBinding:binding})).value.answer,'完整答复：保留中文与😀。');
  assert.equal((await runCloudResponses({...args,keyBinding:null})).reused,true);assert.equal(posts,1);assert.equal((await readCloudUsage({db,project:'test'})).responses,1);
 }finally{db.sql.close();}
});
test('legacy full-JSON receipts remain readable without a file binding or additional archive work',async()=>{
 const db=database();try{await stored(db);assert.equal(row(db).response_json,JSON.stringify(terminal));assert(streamCount(db)>0);
  assert.equal((await readCloudResult({...options(db)})).reused,true);assert.equal((await stored(db,{keyBinding:null,fetchImpl:async()=>assert.fail('must reuse')})).reused,true);assert.equal(db.stats.batches,0);
 }finally{db.sql.close();}
});
test('ordinary HTTP paths delegate heavy evidence work and never use gzip, whole-file reads or a second SSE hash',async()=>{
 const db=database(),oldCompression=globalThis.CompressionStream,oldDigest=crypto.subtle.digest;
 try{
  await stored(db);const calls=[],digest='a'.repeat(64),responseDigest=sha(JSON.stringify(terminal));
  const remote={archiveEvidence:async request=>{calls.push(request);return{archiveFormat:CLOUD_EVIDENCE_FORMAT,verified:true,digest,streamDigest:request.streamDigest,responseId:request.responseId,responseDigest,bytes:123};},readEvidence:async request=>({archiveFormat:CLOUD_EVIDENCE_FORMAT,verified:true,...request,responseDigest,response:terminal}),put(){assert.fail('HTTP must not put zip');},get(){assert.fail('HTTP must not get zip');}};
  const hashed=[];crypto.subtle.digest=function(algorithm,bytes){hashed.push(bytes.byteLength);return oldDigest.call(this,algorithm,bytes);};globalThis.CompressionStream=class{constructor(){assert.fail('HTTP must not gzip');}};
  assert.equal((await archiveCloudEvidence({...archiveOptions(db),filesBinding:remote})).archived,true);assert.deepEqual(hashed,[text.encode(JSON.stringify(terminal)).byteLength]);assert.deepEqual(Object.keys(calls[0]).sort(),['rawStream','responseId','responseJSON','streamDigest']);
  assert.equal((await readCloudResult({...options(db),filesBinding:remote})).value.answer,'完整答复：保留中文与😀。');
 }finally{globalThis.CompressionStream=oldCompression;crypto.subtle.digest=oldDigest;db.sql.close();}
});
test('an older file capability cannot trigger HTTP-side archival or prune the durable D1 fallback',async()=>{
 const db=database();try{let calls=0;const oldFiles={put(){calls++;throw Error('must not put');},get(){calls++;throw Error('must not get');}};await stored(db,{filesBinding:oldFiles});assert.equal(calls,0);assert.equal(db.stats.batches,0);assert.equal(row(db).response_json,JSON.stringify(terminal));assert(streamCount(db)>0);}finally{db.sql.close();}
});
test('unverified, mismatched or extra-field DO receipts cannot authorize D1 compaction or deliver a wrong saved response',async()=>{
 const base={archiveFormat:CLOUD_EVIDENCE_FORMAT,verified:true,digest:'a'.repeat(64),streamDigest:sha(raw),responseId:terminal.id,responseDigest:sha(JSON.stringify(terminal)),bytes:123};
 for(const extra of[{verified:false},{digest:'bad'},{streamDigest:'f'.repeat(64)},{responseId:'wrong'},{responseDigest:'f'.repeat(64)},{bytes:-1},{url:'https://foreign.invalid/'}]){
  const db=database();try{await stored(db);assert.equal((await archiveCloudEvidence({...archiveOptions(db),filesBinding:{archiveEvidence:async()=>({...base,...extra})}})).archived,false);assert.equal(row(db).response_json,JSON.stringify(terminal));assert(streamCount(db)>0);assert.equal(db.stats.batches,0);}finally{db.sql.close();}
 }
 const{bytes,...readBase}=base;
 for(const extra of[{verified:false},{digest:'b'.repeat(64)},{streamDigest:'f'.repeat(64)},{responseId:'wrong'},{responseDigest:'f'.repeat(64)},{response:{...terminal,id:'wrong'}},{url:'https://foreign.invalid/'}])await assert.rejects(readCloudEvidenceResponse({storedJSON:JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest:base.digest}),streamDigest:sha(raw),responseId:terminal.id,filesBinding:{readEvidence:async()=>({...readBase,response:terminal,...extra})}}),error=>error.protectedUnavailable);
});
test('DO evidence methods reject extra routing fields, wrong source hashes and malformed identities before storage I/O',async()=>{
 let operations=0;const store={put(){operations++;assert.fail('invalid request reached put');},get(){operations++;assert.fail('invalid request reached get');}};
 const request={responseJSON:JSON.stringify(terminal),rawStream:raw,streamDigest:sha(raw),responseId:terminal.id};
 for(const extra of[{project:'foreign'},{url:'https://foreign.invalid/'},{task:'secret'},{streamDigest:'f'.repeat(64)},{responseId:'wrong'},{responseJSON:'[]'}])await assert.rejects(archiveCloudEvidenceFile({filesBinding:store,request:{...request,...extra}}),error=>error.protectedUnavailable);
 for(const extra of[{project:'foreign'},{url:'https://foreign.invalid/'},{digest:'bad'},{responseId:{}},{streamDigest:null}])await assert.rejects(readCloudEvidenceFile({filesBinding:store,request:{digest:'a'.repeat(64),streamDigest:sha(raw),responseId:terminal.id,...extra}}),error=>error.protectedUnavailable);
 assert.equal(operations,0);
});
test('missing or unavailable archived originals remain protected and never cause a second POST',async()=>{
 const db=database();try{
  const binding=files();await stored(db,{filesBinding:binding});const original=row(db).response_json;
  for(const unavailable of[undefined,{get:async()=>null},{get:async()=>{throw Error('private failure');}}]){
   await assert.rejects(readCloudResult({...options(db),filesBinding:unavailable}),error=>error.protectedUnavailable&&error.archiveUnavailable&&error.outcomeUnknown&&!error.message.includes('private'));
   let posts=0;await assert.rejects(runCloudResponses({...options(db),filesBinding:unavailable,fetchImpl:async()=>{posts++;return stream();}}),error=>error.protectedUnavailable);assert.equal(posts,0);
   assert.equal(row(db).response_json,original);assert.equal(row(db).outcome,'completed');
  }
  assert.equal((await readCloudResult({...options(db),filesBinding:binding})).value.answer,'完整答复：保留中文与😀。');
 }finally{db.sql.close();}
});
test('archive upload, receipt digest, receipt length and readback failures all preserve the entire original D1 receipt',async()=>{
 for(const variant of[{putError:true},{wrongReceipt:true},{wrongLength:true},{getError:true},{corrupt:true}]){
  const db=database();try{const binding=files(variant);const result=await stored(db,{filesBinding:binding});assert.equal(result.value.answer,'完整答复：保留中文与😀。');assert.equal(row(db).response_json,JSON.stringify(terminal));assert(streamCount(db)>0);assert.equal(db.stats.batches,0);assert.equal((await readCloudUsage({db,project:'test'})).responses,1);}finally{db.sql.close();}
 }
});
test('a failed batch rolls back pointer and stream deletion together and leaves paid success usable',async()=>{
 const db=database();try{db.failAfterStatement=0;const binding=files();assert.equal((await stored(db,{filesBinding:binding})).value.answer,'完整答复：保留中文与😀。');assert.equal(row(db).response_json,JSON.stringify(terminal));assert(streamCount(db)>0);assert.equal(db.stats.batches,1);assert.equal((await readCloudResult({...options(db)})).reused,true);}finally{db.sql.close();}
});
test('a concurrent identical pointer cannot authorize stream deletion without this exact CAS changing a row',async()=>{
 const db=database();try{
  await stored(db);const binding=files(),count=streamCount(db);
  db.beforeBatch=()=>{const digest=[...binding.objects.keys()][0];db.sql.prepare('UPDATE api_cloud_runs SET response_json=?').run(JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest}));};
  assert.deepEqual(await archiveCloudEvidence({...archiveOptions(db),filesBinding:binding}),{archived:false,reason:'changed'});assert.equal(streamCount(db),count);
 }finally{db.sql.close();}
});
test('unknown and sending rows never lose their full receipts or streams during a stale archival CAS',async()=>{
 for(const outcome of['unknown','sending']){
  const db=database();try{await stored(db);const binding=files(),original=row(db).response_json,count=streamCount(db);db.beforeBatch=()=>db.sql.prepare('UPDATE api_cloud_runs SET outcome=?').run(outcome);
   assert.equal((await archiveCloudEvidence({...archiveOptions(db),filesBinding:binding})).archived,false);assert.equal(row(db).outcome,outcome);assert.equal(row(db).response_json,original);assert.equal(streamCount(db),count);
  }finally{db.sql.close();}
 }
});
test('unknown network outcomes and rejected terminal results never initiate archival or prune streams',async()=>{
 for(const kind of['network','http500','terminal-failed']){
  const db=database();try{const binding=files();await assert.rejects(stored(db,{filesBinding:binding,fetchImpl:async()=>{if(kind==='network')throw Error('interrupted');if(kind==='http500')return new Response('{}',{status:500});return stream('data: '+JSON.stringify({type:'response.failed',response:{...terminal,status:'failed'}})+'\n\n');}}));assert.equal(binding.calls.puts,0);assert.equal(db.stats.batches,0);assert(!JSON.parse(row(db).response_json||'null')?.archiveFormat);}finally{db.sql.close();}
 }
});
test('the archive costs one D1 batch invocation, never an extra pre-read or per-slice loop',async()=>{
 const plain=database(),archived=database();try{
  await stored(plain);await stored(archived,{filesBinding:files()});assert.equal(archived.stats.invocations,plain.stats.invocations+1);assert.equal(archived.stats.batches,1);assert.equal(archived.stats.statements,plain.stats.statements+2);
  // Project-level near-limit tests established 49 and 43 including timed renewal reserves.
  assert(49+(archived.stats.invocations-plain.stats.invocations)<=50);assert(43+(archived.stats.invocations-plain.stats.invocations)<=50);
 }finally{plain.sql.close();archived.sql.close();}
});
test('a near-limit raw SSE receipt is preserved byte-for-byte after compaction and decompression',async()=>{
 const db=database();try{
  const binding=files(),large=(': '+'x'.repeat(65500)+'\n\n').repeat(31)+raw;assert(text.encode(large).byteLength<2*1024*1024);
  await stored(db,{filesBinding:binding,fetchImpl:async()=>stream(large)});assert.equal(streamCount(db),0);assert.equal(db.stats.batches,1);
  const compressed=[...binding.objects.values()][0],value=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).json();assert.equal(value.rawStream,large);assert.equal((await readCloudResult({...options(db),filesBinding:binding})).value.answer,'完整答复：保留中文与😀。');
 }finally{db.sql.close();}
});
test('the exact 2MiB wire bound including surrogate boundaries fits eight durable slices before archival',async()=>{
 const db=database();try{
  const binding=files(),prefix=(': '+'a'.repeat(262141)+'😀\n\n').repeat(7),padding=2*1024*1024-text.encode(prefix+raw).byteLength;
  const wire=prefix+': '+'x'.repeat(padding-4)+'\n\n'+raw;assert.equal(text.encode(wire).byteLength,2*1024*1024);let slices=0;
  db.beforeBatch=()=>{slices=streamCount(db);};await stored(db,{filesBinding:binding,fetchImpl:async()=>stream(wire)});assert.equal(slices,8);assert.equal(streamCount(db),0);
 }finally{db.sql.close();}
});
test('oversized wire evidence is refused without replacing the already durable D1 original',async()=>{
 const db=database();try{await stored(db);const binding=files(),original=row(db).response_json;const result=await archiveCloudEvidence({...archiveOptions(db),filesBinding:binding,rawStream:'x'.repeat(2*1024*1024+1)});assert.equal(result.archived,false);assert.equal(binding.calls.puts,0);assert.equal(row(db).response_json,original);assert(streamCount(db)>0);}finally{db.sql.close();}
});
test('a large valid provider response retains every byte through archival and the reuse path',async()=>{
 const db=database();try{
  const binding=files(),answer='x'.repeat(1_400_000),response={...terminal,output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer})}]}]};
  const wire='data: '+JSON.stringify({type:'response.completed',response})+'\n\n';assert(text.encode(JSON.stringify(response)).byteLength<1_500_000);
  assert.equal((await stored(db,{filesBinding:binding,fetchImpl:async()=>stream(wire)})).value.answer.length,answer.length);assert.equal(streamCount(db),0);
  assert.equal((await readCloudResult({...options(db),filesBinding:binding})).value.answer,answer);
 }finally{db.sql.close();}
});
test('24MiB file bounds, malformed gzip, altered stream digest and mismatched response IDs fail protected',async()=>{
 const envelope={format:CLOUD_EVIDENCE_FORMAT,response:terminal,rawStream:raw};
 const good=await gzip(envelope),digest=sha(good),pointer=JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest}),binding=evidenceRPC({get:async()=>({digest,bytes:good})});
 await assert.rejects(readCloudEvidenceResponse({storedJSON:pointer,filesBinding:binding,streamDigest:'f'.repeat(64),responseId:terminal.id}),error=>error.protectedUnavailable);
 await assert.rejects(readCloudEvidenceResponse({storedJSON:pointer,filesBinding:binding,streamDigest:sha(raw),responseId:'wrong_response'}),error=>error.protectedUnavailable);
 for(const bytes of[new Uint8Array(24*1024*1024+1),text.encode('not gzip')]){const hash=sha(bytes);await assert.rejects(readCloudEvidenceResponse({storedJSON:JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest:hash}),streamDigest:sha(raw),responseId:terminal.id,filesBinding:evidenceRPC({get:async()=>({digest:hash,bytes})})}),error=>error.protectedUnavailable);}
});
test('archive envelope and pointer fields are versioned and never accept arbitrary URLs, keys or routing',async()=>{
 const digest='a'.repeat(64);for(const pointer of[{archiveFormat:CLOUD_EVIDENCE_FORMAT,digest,url:'https://other.invalid/'},{archiveFormat:'unknown',digest},{archiveFormat:CLOUD_EVIDENCE_FORMAT,digest:'bad'}]){
  let reads=0;await assert.rejects(readCloudEvidenceResponse({storedJSON:JSON.stringify(pointer),streamDigest:sha(raw),responseId:terminal.id,filesBinding:{readEvidence:async()=>{reads++;throw Error('must not read');}}}),error=>error.protectedUnavailable);assert.equal(reads,0);
 }
 const compressed=await gzip({format:CLOUD_EVIDENCE_FORMAT,response:terminal,rawStream:raw,project:'foreign'}),hash=sha(compressed);
 await assert.rejects(readCloudEvidenceResponse({storedJSON:JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest:hash}),streamDigest:sha(raw),responseId:terminal.id,filesBinding:evidenceRPC({get:async()=>({digest:hash,bytes:compressed})})}),error=>error.protectedUnavailable);
});
test('decompression stops at a bounded expanded size and corrupt legacy JSON is protected rather than replayed',async()=>{
 const compressed=await gzip('x'.repeat(15*1024*1024)),digest=sha(compressed);
 await assert.rejects(readCloudEvidenceResponse({storedJSON:JSON.stringify({archiveFormat:CLOUD_EVIDENCE_FORMAT,digest}),streamDigest:sha(raw),responseId:terminal.id,filesBinding:evidenceRPC({get:async()=>({digest,bytes:compressed})})}),error=>error.protectedUnavailable);
 for(const storedJSON of['not JSON','null','[]','42'])await assert.rejects(readCloudEvidenceResponse({storedJSON}),error=>error.protectedUnavailable);
});

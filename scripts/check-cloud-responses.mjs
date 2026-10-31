import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import {CLOUD_API_SCHEMA,runCloudResponses,readCloudResult,readCloudUsage,withCloudLock} from '../worker/src/shared/cloud-responses.mjs';
function database(){
 const sql=new DatabaseSync(':memory:');sql.exec(CLOUD_API_SCHEMA);
 return {sql,prepare(query){return {bind(...values){return {async first(){return sql.prepare(query).get(...values)||null;},async run(){const result=sql.prepare(query).run(...values);return {meta:{changes:Number(result.changes)}};},async all(){return {results:sql.prepare(query).all(...values)};}};}};}};
}
const terminal={id:'resp_fake',status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer:'模拟回答'})}]}],usage:{input_tokens:10,output_tokens:20}};
const response=()=>new Response('event: response.created\r\ndata: {"type":"response.created"}\r\n\r\nevent: response.completed\r\ndata: '+JSON.stringify({type:'response.completed',response:terminal})+'\r\n\r\n',{headers:{'content-type':'text/event-stream','x-request-id':'req_fake'}});
const base=db=>({db,keyBinding:{get:async()=>'sk-fake_test_value'},project:'test',task:'test-only',attempt:'1',instructions:'Test',input:'fake content',schema:{type:'object',properties:{answer:{type:'string'}},required:['answer'],additionalProperties:false},config:{model:'gpt-6.1-sol',reasoningEffort:'xhigh',timeoutMs:1000}});
const cases=[];async function check(name,run){await run();cases.push(name);}
await check('complete provider receipt is durable before caller receives answer; same attempt reuses it',async()=>{
 const db=database();let calls=0;const run=()=>runCloudResponses({...base(db),fetchImpl:async(url,init)=>{calls++;assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(init.body);assert.equal(body.store,false);assert.equal(body.stream,true);assert.equal(body.reasoning.effort,'xhigh');assert(!('tools' in body));return response();}});
 assert.equal((await run()).value.answer,'模拟回答');assert.equal(calls,1);assert.equal((await run()).reused,true);assert.equal(calls,1);
 assert.equal(db.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'completed');
 assert.equal((await readCloudResult({...base(db)})).value.answer,'模拟回答');
});
await check('image input is not copied into request marker or saved stream; only response is retained',async()=>{
 const db=database(),needle='data:image/jpeg;base64,UNIQUE_IMAGE_BYTES';await runCloudResponses({...base(db),input:needle,fetchImpl:async()=>response()});
 const rows=JSON.stringify(db.sql.prepare('SELECT * FROM api_cloud_runs').all())+JSON.stringify(db.sql.prepare('SELECT * FROM api_cloud_streams').all());assert(!rows.includes(needle));
});
await check('connection loss becomes unknown and same identity never sends a second POST',async()=>{
 const db=database();let calls=0;const run=()=>runCloudResponses({...base(db),fetchImpl:async()=>{calls++;throw Error('fake connection loss');}});
 await assert.rejects(run,e=>e.outcomeUnknown===true);await assert.rejects(run,e=>e.outcomeUnknown===true);assert.equal(calls,1);
});
await check('HTTP 500 remains unknown, while a known HTTP 400 is saved as rejected',async()=>{
 for(const status of [500,400]){const db=database();await assert.rejects(()=>runCloudResponses({...base(db),fetchImpl:async()=>new Response('{}',{status})}),e=>e.outcomeUnknown===(status===500));assert.equal(db.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,status===500?'unknown':'rejected');}
});
await check('missing or refused key does not create a sending marker',async()=>{
 for(const keyBinding of [null,{get:async()=>{throw Error('unavailable protected store');}}]){const db=database();await assert.rejects(()=>runCloudResponses({...base(db),keyBinding}),e=>e.configurationMissing===true);assert.equal(db.sql.prepare('SELECT count(*) AS n FROM api_cloud_runs').get().n,0);}
});
await check('changed frozen request refuses reuse before a provider call',async()=>{
 const db=database();await runCloudResponses({...base(db),fetchImpl:async()=>response()});let calls=0;
 await assert.rejects(()=>runCloudResponses({...base(db),input:'changed',fetchImpl:async()=>{calls++;return response();}}),/输入发生变化/);assert.equal(calls,0);
});
await check('partial output without terminal event is never adopted or automatically retried',async()=>{
 const db=database();await assert.rejects(()=>runCloudResponses({...base(db),fetchImpl:async()=>new Response('data: {"type":"response.output_text.delta","delta":"partial"}\n\n')}),e=>e.outcomeUnknown===true);
 assert.equal(db.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'unknown');
});
await check('live sending marker blocks concurrent POST and stale marker becomes unknown',async()=>{
 const db=database();let release;const held=new Promise(resolve=>release=resolve),first=runCloudResponses({...base(db),fetchImpl:async()=>{await held;return response();}});
 await new Promise(resolve=>setTimeout(resolve,30));await assert.rejects(()=>runCloudResponses({...base(db)}),e=>e.inProgress===true);release();await first;
 const stale=database();stale.sql.prepare('INSERT INTO api_cloud_runs(project,task,attempt,request_digest,model,outcome,started_at) SELECT ?,?,?,?,?,?,?').run('test','other','1','old','gpt-6.1-sol','sending',0);
 // Digest mismatch is conservative too: no request can be replayed under a changed body.
 await assert.rejects(()=>runCloudResponses({...base(stale),task:'other'}));
});
await check('project single-flight is durable across overlapping executions',async()=>{
 const db=database();let release;const held=new Promise(resolve=>release=resolve);
 const first=withCloudLock({db,project:'test',run:async()=>{await held;return 'ok';}});await new Promise(resolve=>setTimeout(resolve,20));
 assert.equal((await withCloudLock({db,project:'test',run:async()=>assert.fail('overlap')})).busy,true);release();assert.equal(await first,'ok');
 assert.equal(await withCloudLock({db,project:'test',run:async()=>'released'}),'released');
});
await check('lost business claim before send does not spend and does not create a marker',async()=>{
 const db=database();await assert.rejects(()=>runCloudResponses({...base(db),heartbeat:async()=>false}),e=>e.claimLost===true);assert.equal(db.sql.prepare('SELECT count(*) AS n FROM api_cloud_runs').get().n,0);
});
await check('terminal receipt is adopted immediately without waiting for a later network close',async()=>{
 const db=database();let reads=0;const stream=new ReadableStream({pull(controller){if(reads++===0)controller.enqueue(new TextEncoder().encode('data: '+JSON.stringify({type:'response.completed',response:terminal})+'\n\n'));else controller.error(Error('network after terminal'));}});
 const result=await runCloudResponses({...base(db),fetchImpl:async()=>new Response(stream)});assert.equal(result.value.answer,'模拟回答');assert.equal(db.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'completed');
});
await check('pinned parser handles split CRLF and legal multi-line SSE data',async()=>{
 const db=database(),parts=['data: {"type":"response.completed",\r','\ndata: "response":'+JSON.stringify(terminal)+'}\r','\n\r','\n'];let index=0;
 const stream=new ReadableStream({pull(controller){if(index<parts.length)controller.enqueue(new TextEncoder().encode(parts[index++]));else controller.close();}});
 assert.equal((await runCloudResponses({...base(db),fetchImpl:async()=>new Response(stream)})).value.answer,'模拟回答');
});
await check('temporary stream-write failure keeps original bytes available for bounded preservation',async()=>{
 const db=database(),original=db.prepare.bind(db);let failed=false;
 db.prepare=query=>{const statement=original(query);if(!query.includes('INSERT OR IGNORE INTO api_cloud_streams'))return statement;return {bind(...args){const bound=statement.bind(...args);return {...bound,async run(){if(!failed){failed=true;throw Error('simulated write failure');}return bound.run();}};}};};
 await assert.rejects(()=>runCloudResponses({...base(db),fetchImpl:async()=>response()}),e=>e.outcomeUnknown===true);
 assert.match(db.sql.prepare('SELECT data FROM api_cloud_streams').get().data,/response.completed/);
});
await check('usage aggregate counts a saved provider receipt once and exposes no private task fields',async()=>{
 const db=database(),args={...base(db),fetchImpl:async()=>response()};await runCloudResponses(args);await runCloudResponses(args);
 const usage=await readCloudUsage({db,project:'test'});assert.equal(usage.responses,1);assert.equal(usage.inputTokens,10);assert.equal(usage.outputTokens,20);assert.equal(usage.revision,1);
 assert.deepEqual(Object.keys(usage).sort(),['inputTokens','outputTokens','cachedInputTokens','responses','unknownCalls','inProgressCalls','revision','checkedAt'].sort());
});
await check('stale sending markers count as unknown, not perpetual in-progress usage',async()=>{
 const db=database();db.sql.prepare("INSERT INTO api_cloud_runs(project,task,attempt,request_digest,model,outcome,started_at) VALUES('test','stale','1','x','gpt-6.1-sol','sending',0)").run();
 const usage=await readCloudUsage({db,project:'test',now:()=>900000});assert.equal(usage.unknownCalls,1);assert.equal(usage.inProgressCalls,0);
});
await check('bounded receipt slices preserve Unicode pairs and use fewer than the free-query headroom',async()=>{
 const db=database(),raw=': '+('a'.repeat(262141))+'😀\n\n'+'data: '+JSON.stringify({type:'response.completed',response:terminal})+'\n\n';
 await runCloudResponses({...base(db),fetchImpl:async()=>new Response(raw)});
 const rows=db.sql.prepare('SELECT data FROM api_cloud_streams ORDER BY seq').all();assert.equal(rows.map(r=>r.data).join(''),raw);assert(rows.every(r=>new TextEncoder().encode(r.data).length<1100000));assert(rows.length<=3);
});
process.stdout.write(JSON.stringify({ok:true,checks:cases.length,cases,paidCalls:0},null,2)+'\n');

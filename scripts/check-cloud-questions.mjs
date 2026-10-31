import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {questionsRoute,questionJobAction} from '../worker/src/questions.js';
import {runCloudChapterQuestions,heartbeatCloudQuestion,QUESTION_CLOUD_PROJECT} from '../worker/src/cloud-questions.js';
import {CLOUD_API_SCHEMA,runCloudResponses} from '../worker/src/shared/cloud-responses.mjs';

function fixture(){
 const sql=new DatabaseSync(':memory:');
 for(const name of readdirSync('worker/migrations').filter(n=>n.endsWith('.sql')).sort())sql.exec(readFileSync('worker/migrations/'+name,'utf8'));
 sql.exec('PRAGMA foreign_keys=ON');
 const DB={prepare(text){let args=[];return {bind(...values){args=values;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return {results:sql.prepare(text).all(...args)};},async run(){if(/^\s*(SELECT|WITH)/i.test(text))return {results:sql.prepare(text).all(...args),meta:{changes:0}};return {meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};},async batch(items){sql.exec('BEGIN');try{const results=[];for(const item of items)results.push(await item.run());sql.exec('COMMIT');return results;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 const markdown='The original full chapter.',digest=createHash('sha256').update(markdown).digest('hex');
 sql.prepare('INSERT INTO chapter_revisions(chapter_id,digest,content_key,title,number,subtitle,word_count,study_date,created_at,run_id,vix_commit,protocol_commit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run('chapter-1',digest,'original','固定原版','第1章','',40,'2026-10-27',0,'fixture','a'.repeat(40),'b'.repeat(40));
 sql.prepare('INSERT INTO chapter_sources VALUES(?,?,?,?,?)').run(digest,'e'.repeat(64),'source-package','current-affairs-v1',0);
 sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run('chapter-1','2026-10-27',digest,0);
 let keyReads=0;
 const env={DB,API_QUESTIONS_ENABLED:'true',API_CLOUD_ENABLED:'true',CHAPTERS:{async get(key){assert.equal(key,'original');return markdown;}},SECOND_SERIES_OPENAI_KEY:{async get(){keyReads++;return 'sk-offline-fixture';}}};
 async function request(path,body,context={session:true,sameOrigin:true}){const r=await questionsRoute(new Request('https://example.test/api/questions'+path,{method:'POST',body:JSON.stringify(body)}),env,context);return {status:r.status,data:await r.json()};}
 async function enqueue(question='解释原句',id=crypto.randomUUID()){assert.equal((await request('',{id,chapterId:'chapter-1',digest,question})).status,201);return id;}
 const job=id=>sql.prepare('SELECT * FROM chapter_question_jobs WHERE id=?').get(id);
 return {sql,env,request,enqueue,job,digest,keyReads:()=>keyReads};
}
function completed(answer='固定原文解释'){
 const response={id:'resp_fixture',model:'gpt-6.1-sol',status:'completed',usage:{input_tokens:20,output_tokens:3},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({answer})}]}]};
 return new Response('data: '+JSON.stringify({type:'response.completed',response})+'\n\n',{headers:{'content-type':'text/event-stream','x-request-id':'offline-fixture'}});
}
const noNotify=async()=>({sent:0});

test('runtime schema migration is the unmodified shared SQL',()=>{
 assert.equal(readFileSync('worker/migrations/0024_cloud_api_runtime.sql','utf8'),CLOUD_API_SCHEMA);
});
test('cloud is opt-in; missing binding does not claim or mark a request as sent',async()=>{
 const f=fixture();try{const id=await f.enqueue();let calls=0;const options={fetchImpl:async()=>{calls++;throw Error('network forbidden');},notify:noNotify};
 f.env.API_CLOUD_ENABLED='false';assert.deepEqual(await runCloudChapterQuestions(f.env,options),{enabled:false});
 f.env.API_CLOUD_ENABLED='true';delete f.env.SECOND_SERIES_OPENAI_KEY;assert.deepEqual(await runCloudChapterQuestions(f.env,options),{configured:false});
 assert.equal(f.job(id).status,'pending');assert.equal(f.job(id).attempts,0);assert.equal(calls,0);assert.equal(f.keyReads(),0);assert.equal(f.sql.prepare('SELECT count(*) n FROM api_cloud_runs').get().n,0);
 }finally{f.sql.close();}
});
test('migration preserves legacy routing and cloud enqueue idempotency; legacy cannot claim cloud',async()=>{
 const f=fixture();try{
 f.env.API_CLOUD_ENABLED='false';const old=await f.enqueue('旧问题');assert.equal(f.job(old).execution_route,'legacy');
 f.env.API_CLOUD_ENABLED='true';const next=await f.enqueue('新问题');assert.equal(f.job(next).execution_route,'cloud-v1');
 f.env.API_CLOUD_ENABLED='false';assert.equal((await f.request('',{id:next,chapterId:'chapter-1',digest:f.digest,question:'新问题'})).data.reused,true);assert.equal(f.job(next).execution_route,'cloud-v1');f.env.API_CLOUD_ENABLED='true';
 let calls=0;assert.deepEqual(await runCloudChapterQuestions(f.env,{fetchImpl:async()=>{calls++;return completed();},notify:noNotify}),{empty:true});assert.equal(calls,0,'earlier legacy request blocks following cloud question');
 const claim='f'.repeat(64),claimed=await f.request('/jobs/claim',{claim,questionsOnly:true},{isPublisher:true});assert.equal(claimed.data.job.id,old);
 await questionJobAction(f.env,{id:old,claim,action:'complete',answer:'已保存旧答案'});
 assert.equal((await f.request('/jobs/claim',{claim,questionsOnly:true},{isPublisher:true})).data.job,null);
 assert.equal((await runCloudChapterQuestions(f.env,{fetchImpl:async()=>{calls++;return completed();},notify:noNotify})).completed,true);assert.equal(calls,1);
 }finally{f.sql.close();}
});
test('fixed full chapter, prompt, schema and model reach one paid POST; following questions include saved replies',async()=>{
 const f=fixture();try{const one=await f.enqueue('解释原句'),two=await f.enqueue('再解释搭配');const inputs=[];let notices=0;
 const options={fetchImpl:async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(init.method,'POST');const body=JSON.parse(init.body);assert.equal(body.store,false);assert.equal(body.stream,true);assert.equal(body.model,'gpt-6.1-sol');assert.equal(body.reasoning.effort,'xhigh');assert.equal(body.max_output_tokens,16384);assert.equal(body.tools,undefined);assert.equal(body.text.format.name,'chapter_question');inputs.push(JSON.parse(body.input));return completed();},notify:async()=>{notices++;throw Error('push delivery unavailable');}};
 assert.equal((await runCloudChapterQuestions(f.env,options)).completed,true);assert.equal(f.job(one).status,'answered');assert.equal(f.job(two).status,'pending');
 assert.equal((await runCloudChapterQuestions(f.env,options)).completed,true);assert.equal(f.job(two).status,'answered');
 assert.equal(inputs[0].chapter.markdown,'The original full chapter.');assert.equal(inputs[0].chapter.digest,f.digest);assert(inputs[1].messages.some(m=>m.role==='assistant'&&m.content==='固定原文解释'));
 assert.deepEqual(await runCloudChapterQuestions(f.env,options),{empty:true});assert.equal(inputs.length,2);assert.equal(f.keyReads(),2);assert.equal(notices,2);
 assert.equal(f.sql.prepare('SELECT count(*) n FROM api_cloud_runs WHERE outcome=\'completed\' AND usage_json IS NOT NULL').get().n,2);
 }finally{f.sql.close();}
});
test('incomplete streams remain unknown and cannot be retried or paid again by cron',async()=>{
 const f=fixture();try{const id=await f.enqueue();let calls=0;const options={fetchImpl:async()=>{calls++;return new Response('data: {"type":"response.created"}\n\n',{headers:{'content-type':'text/event-stream'}});},notify:noNotify};
 assert.equal((await runCloudChapterQuestions(f.env,options)).outcomeUnknown,true);assert.equal(f.job(id).status,'failed');assert.match(f.job(id).error,/结果待核对/);
 assert.equal((await f.request('/'+id+'/retry',{})).status,409);await runCloudChapterQuestions(f.env,options);assert.equal(calls,1);assert.equal(f.job(id).attempts,1);
 assert.equal(f.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'unknown');
 }finally{f.sql.close();}
});
test('only explicit user retry permits a new attempt after a definite rejection',async()=>{
 const f=fixture();try{const id=await f.enqueue();let calls=0;const options={fetchImpl:async()=>{calls++;return calls===1?new Response('{"error":{"code":"fixture_rejection"}}',{status:400}):completed();},notify:noNotify};
 const failed=await runCloudChapterQuestions(f.env,options);assert.equal(failed.outcomeUnknown,false);assert.equal(f.job(id).status,'failed');
 await runCloudChapterQuestions(f.env,options);assert.equal(calls,1);assert.equal((await f.request('/'+id+'/retry',{})).status,200);
 assert.equal((await runCloudChapterQuestions(f.env,options)).completed,true);assert.equal(calls,2);assert.equal(f.job(id).attempts,2);assert.equal(f.sql.prepare('SELECT count(*) n FROM api_cloud_runs').get().n,2);
 }finally{f.sql.close();}
});
test('saved response survives a rolled-back answer/outbox commit and recovers without key or another POST',async()=>{
 const f=fixture();try{const id=await f.enqueue();f.sql.prepare('INSERT INTO push_subscriptions VALUES(?,?,?,?,?,?)').run('device','https://push.example.test/one','public','auth',0,0);
 f.sql.exec("CREATE TRIGGER fail_cloud_notice BEFORE INSERT ON question_push_outbox BEGIN SELECT RAISE(ABORT,'fixture outbox failure'); END;");let calls=0;
 const options={fetchImpl:async()=>{calls++;return completed();},notify:noNotify};assert.equal((await runCloudChapterQuestions(f.env,options)).outcomeUnknown,true);
 assert.equal(f.job(id).status,'failed');assert.equal(f.sql.prepare("SELECT count(*) n FROM chapter_messages WHERE role='assistant'").get().n,0);assert.equal(f.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'completed');
 assert.equal((await f.request('/'+id+'/retry',{})).status,409);f.sql.exec('DROP TRIGGER fail_cloud_notice');delete f.env.SECOND_SERIES_OPENAI_KEY;
 assert.deepEqual(await runCloudChapterQuestions(f.env,options),{completed:true,reused:true});assert.equal(calls,1);assert.equal(f.job(id).attempts,1);assert.equal(f.job(id).status,'answered');
 assert.equal(f.sql.prepare('SELECT count(*) n FROM question_push_outbox').get().n,1);assert.equal(f.sql.prepare("SELECT count(*) n FROM chapter_messages WHERE role='assistant'").get().n,1);
 }finally{f.sql.close();}
});
test('expired cloud leases stop as unknown; legacy leases are not touched by cloud cron',async()=>{
 const f=fixture();try{f.env.API_CLOUD_ENABLED='false';const legacy=await f.enqueue('旧任务');f.env.API_CLOUD_ENABLED='true';const cloud=await f.enqueue('云任务');
 for(const id of [legacy,cloud])f.sql.prepare("UPDATE chapter_question_jobs SET status='running',attempts=1,claim='old',lease_until=? WHERE id=?").run(Date.now()-1,id);
 let calls=0;await runCloudChapterQuestions(f.env,{fetchImpl:async()=>{calls++;return completed();},notify:noNotify});assert.equal(calls,0);assert.equal(f.job(legacy).status,'running');assert.equal(f.job(cloud).status,'failed');assert.match(f.job(cloud).error,/结果待核对/);
 await f.request('/jobs/claim',{claim:'f'.repeat(64),questionsOnly:true},{isPublisher:true});assert.equal(f.job(legacy).status,'failed');assert.equal(f.job(cloud).status,'failed');
 }finally{f.sql.close();}
});
test('inProgress does not fail a live task or allocate a second attempt',async()=>{
 const f=fixture();try{const id=await f.enqueue();const result=await runCloudChapterQuestions(f.env,{runResponses:async()=>{throw Object.assign(Error('in progress'),{inProgress:true});},notify:noNotify});
 assert.deepEqual(result,{inProgress:true});assert.equal(f.job(id).status,'running');assert.equal(f.job(id).attempts,1);assert.equal(f.job(id).error,null);
 }finally{f.sql.close();}
});
test('overlapping cron callbacks share a durable project lock and only one invokes the API',async()=>{
 const f=fixture();let release;try{const id=await f.enqueue();let entered;const ready=new Promise(resolve=>{entered=resolve;}),gate=new Promise(resolve=>{release=resolve;});let calls=0;
 const options={fetchImpl:async()=>{calls++;entered();await gate;return completed();},notify:noNotify};const first=runCloudChapterQuestions(f.env,options);await ready;
 assert.deepEqual(await runCloudChapterQuestions(f.env,options),{busy:true});assert.equal(calls,1);release();assert.equal((await first).completed,true);assert.equal(f.job(id).status,'answered');
 assert.equal(f.sql.prepare('SELECT count(*) n FROM api_cloud_locks WHERE project=?').get(QUESTION_CLOUD_PROJECT).n,0);
 }finally{release?.();f.sql.close();}
});
test('explicit known-failure retry adopts cloud when enabled; unknown history never migrates',async()=>{
 const f=fixture();try{f.env.API_CLOUD_ENABLED='false';const known=await f.enqueue('明确失败'),unknown=await f.enqueue('旧未知');
 f.sql.prepare("UPDATE chapter_question_jobs SET status='failed',error='已知失败',attempts=1 WHERE id=?").run(known);
 f.sql.prepare("UPDATE chapter_question_jobs SET status='failed',error='API结果待核对，暂不重复生成',attempts=1 WHERE id=?").run(unknown);
 f.env.API_CLOUD_ENABLED='true';assert.equal((await f.request('/'+known+'/retry',{})).status,200);assert.equal(f.job(known).execution_route,'cloud-v1');assert.equal(f.job(known).attempts,1);
 assert.equal((await f.request('/'+unknown+'/retry',{})).status,409);assert.equal(f.job(unknown).execution_route,'legacy');
 }finally{f.sql.close();}
});
test('retry CAS cannot clear a newer unknown attempt that appears after its initial read',async()=>{
 const f=fixture();try{const id=await f.enqueue();f.sql.prepare("UPDATE chapter_question_jobs SET status='failed',error='已知失败',attempts=1 WHERE id=?").run(id);
 const prepare=f.env.DB.prepare;let raced=false;f.env.DB.prepare=function(query){const statement=prepare(query);if(query.startsWith("UPDATE chapter_question_jobs SET status='pending'")){const run=statement.run;statement.run=async()=>{if(!raced){raced=true;f.sql.prepare("UPDATE chapter_question_jobs SET error='API结果待核对，暂不重复生成',attempts=2 WHERE id=?").run(id);}return run.call(statement);};}return statement;};
 assert.equal((await f.request('/'+id+'/retry',{})).status,409);assert.equal(f.job(id).status,'failed');assert.match(f.job(id).error,/结果待核对/);assert.equal(f.job(id).attempts,2);
 }finally{f.sql.close();}
});
test('cloud heartbeat is one fenced D1 operation and rejects lost claims or archived revisions',async()=>{
 const f=fixture();try{const id=await f.enqueue(),claim='e'.repeat(64);f.sql.prepare("UPDATE chapter_question_jobs SET status='running',claim=?,lease_until=? WHERE id=?").run(createHash('sha256').update(claim).digest('hex'),Date.now()+300000,id);
 const prepare=f.env.DB.prepare;let calls=0;f.env.DB.prepare=function(query){calls++;return prepare(query);};
 assert.equal(await heartbeatCloudQuestion(f.env,{id,claim}),true);assert.equal(calls,1);assert.equal(await heartbeatCloudQuestion(f.env,{id,claim:'a'.repeat(64)}),false);
 f.sql.prepare('INSERT INTO chapter_withdrawals VALUES(?,?,?,?,?,?,?,?)').run(f.digest,'chapter-1','fixture','a'.repeat(64),'b'.repeat(40),Date.now(),'fixture withdrawal','{}');assert.equal(await heartbeatCloudQuestion(f.env,{id,claim}),false);
 }finally{f.sql.close();}
});
test('API executor D1 budget stays below 50 with ten renewals, sixteen wire chunks and usage reporting',async()=>{
 const f=fixture();try{await f.enqueue();const db=f.env.DB,prepare=db.prepare,batch=db.batch;let calls=0,inBatch=false;
 db.prepare=function(query){const statement=prepare(query);for(const method of ['first','all','run']){const original=statement[method];statement[method]=async function(){if(!inBatch)calls++;return original.call(this);};}return statement;};
 db.batch=async items=>{calls++;inBatch=true;try{return await batch(items);}finally{inBatch=false;}};
 const wire=':'+ 'x'.repeat(131069)+'\n\n';const chunks=Array.from({length:15},()=>wire);const final=completed();chunks.push(await final.text());let index=0;
 const result=await runCloudChapterQuestions(f.env,{runResponses:async options=>{for(let n=0;n<10;n++)assert.equal(await options.heartbeat(),true);return runCloudResponses(options);},fetchImpl:async()=>new Response(new ReadableStream({pull(controller){if(index<chunks.length)controller.enqueue(new TextEncoder().encode(chunks[index++]));else controller.close();}}),{headers:{'content-type':'text/event-stream'}})});
 const savedChunks=f.sql.prepare('SELECT count(*) n FROM api_cloud_streams').get().n;
 assert.equal(result.completed,true);assert(savedChunks>0&&savedChunks<=16);const conservative=calls+(16-savedChunks);assert(conservative<50,'API executor conservative budget used '+conservative+' D1 operations');
 console.log('Language API executor mock D1 operations: '+calls+'; conservative 16-chunk allowance: '+conservative+' (notification delivery uses its original separate cron)');
 }finally{f.sql.close();}
});
test('an archived saved result stays preserved without blocking a different eligible chapter',async()=>{
 const f=fixture();try{const old=await f.enqueue();f.sql.exec("CREATE TRIGGER fail_saved_reply BEFORE INSERT ON chapter_messages WHEN NEW.role='assistant' BEGIN SELECT RAISE(ABORT,'fixture interrupted commit'); END;");let calls=0;
 const options={fetchImpl:async()=>{calls++;return completed();},notify:noNotify};assert.equal((await runCloudChapterQuestions(f.env,options)).outcomeUnknown,true);f.sql.exec('DROP TRIGGER fail_saved_reply');
 f.sql.prepare('INSERT INTO chapter_withdrawals VALUES(?,?,?,?,?,?,?,?)').run(f.digest,'chapter-1','fixture','a'.repeat(64),'b'.repeat(40),Date.now(),'fixture archive','{}');
 const text='The other original full chapter.',digest=createHash('sha256').update(text).digest('hex');f.sql.prepare('INSERT INTO chapter_revisions(chapter_id,digest,content_key,title,number,subtitle,word_count,study_date,created_at,run_id,vix_commit,protocol_commit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run('chapter-2',digest,'other','另一固定原版','第2章','',40,'2026-10-28',0,'fixture-other','a'.repeat(40),'b'.repeat(40));
 f.sql.prepare('INSERT INTO chapter_sources VALUES(?,?,?,?,?)').run(digest,'d'.repeat(64),'other-source','current-affairs-v1',0);f.sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run('chapter-2','2026-10-28',digest,0);f.env.CHAPTERS.get=async key=>key==='other'?text:'The original full chapter.';
 const next=crypto.randomUUID();assert.equal((await f.request('',{id:next,chapterId:'chapter-2',digest,question:'新章问题'})).status,201);assert.equal((await runCloudChapterQuestions(f.env,options)).completed,true);assert.equal(f.job(next).status,'answered');assert.equal(f.job(old).status,'failed');assert.equal(f.sql.prepare('SELECT outcome FROM api_cloud_runs WHERE task=?').get(old).outcome,'completed');assert.equal(calls,2,'old paid response was preserved, never sent again');
 }finally{f.sql.close();}
});

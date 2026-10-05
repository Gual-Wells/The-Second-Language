import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {collectNext} from '../worker/speaking/collector.mjs';
import {enqueueSupplement,controlRequest,retryCreditJob} from '../worker/speaking/control.mjs';
import {contractSnapshot,contractVersion} from './lib/speaking/collect.mjs';
import {collectionSchema,detailSchema} from '../protocol/speaking/contract.mjs';
const sql=new DatabaseSync(':memory:');
sql.exec('PRAGMA foreign_keys=ON;CREATE TABLE practice_questions(id TEXT PRIMARY KEY);INSERT INTO practice_questions VALUES(\'q\');');
sql.exec(await readFile(new URL('../worker/practice_migrations/0004_speaking_live.sql',import.meta.url),'utf8'));
const db={prepare(query){return{bind(...values){const stmt=sql.prepare(query);return{first:async()=>stmt.get(...values)??null,all:async()=>({results:stmt.all(...values)}),run:async()=>({meta:{changes:Number(stmt.run(...values).changes)}})};}};}};
db.batch=async statements=>{sql.exec('BEGIN');try{const result=[];for(const stmt of statements)result.push(await stmt.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}};
const bytes=value=>typeof value==='string'?new TextEncoder().encode(value):new Uint8Array(value);
const hash=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');
const objects=new Map();
const bucket={put:async(key,value)=>objects.set(key,bytes(value)),head:async key=>objects.has(key)?{}:null,get:async key=>{const b=objects.get(key);return b?{arrayBuffer:async()=>b.slice().buffer,json:async()=>JSON.parse(new TextDecoder().decode(b))}:null;}};
function fixture(schema){if(schema.enum)return schema.enum[0];const type=Array.isArray(schema.type)?schema.type[0]:schema.type;if(type==='string')return'evidence';if(type==='number')return 0;if(type==='boolean')return true;if(type==='array')return[];if(type==='object')return Object.fromEntries(Object.entries(schema.properties).map(([k,v])=>[k,fixture(v)]));return null;}
let phase='qwen-unfunded',requests=[];
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{
 if(url.endsWith('/credits'))return Response.json({data:{total_credits:phase==='no-funds'?0:10,total_usage:0}});
 if(url.endsWith('/key'))return Response.json({data:{limit_remaining:null}});
 const body=JSON.parse(options.body);requests.push(body.model);
 if(phase==='qwen-unfunded'&&body.model.includes('qwen'))return Response.json({error:{message:'fixture wallet exhausted'}},{status:402});
 const data=fixture(body.response_format?.json_schema.schema??detailSchema);
 data.verbatim_transcript='Actual full speech.';
 return Response.json({model:body.model,choices:[{finish_reason:'stop',message:{content:JSON.stringify(data)}}],usage:{cost:.01}});
};
const env={PRACTICE_DB:db,SPEAKING_ASSETS:bucket,OPENROUTER_API_KEY:'fixture-only',AI:{run:async()=>({text:'Actual full speech.',segments:[{words:[{word:'Actual',start:0,end:1}]}]})}};
const permanent=process.argv.includes('--permanent');if(permanent)env.ONEDRIVE_ENABLED='true';
async function drain(){for(let i=0;i<12;i++){const result=await collectNext(env);if(result.state!=='queued')return result;}throw Error('分批采集未收敛');}
try{
 await bucket.put('audio',new Uint8Array([1,2,3]));await bucket.put('contract',JSON.stringify(contractSnapshot()));
 sql.prepare("INSERT INTO speaking_attempts(id,question_id,question_snapshot_key,original_audio_key,original_digest,status,submitted_at)VALUES('a','q','snapshot','audio','digest','collecting',0)").run();
 sql.prepare("INSERT INTO speaking_jobs(id,attempt_id,contract_version,contract_digest,contract_key,audio_key,audio_digest,audio_seconds,audio_format,status,created_at,updated_at)VALUES('j','a',?,?,'contract','audio',?,1,'wav','queued',0,0)").run(contractVersion,await hash(JSON.stringify(contractSnapshot())),await hash(new Uint8Array([1,2,3])));
 await drain();
 assert.equal(sql.prepare("SELECT status FROM speaking_jobs WHERE id='j'").get().status,'waiting_credit');
 assert.equal(sql.prepare("SELECT status FROM speaking_attempts WHERE id='a'").get().status,'waiting_credit');
 assert.equal(requests.length,3);if(!permanent)assert.ok(objects.has('speaking/a/jobs/j/manifest.json'));
 assert.equal(sql.prepare("SELECT next_retry_at FROM speaking_jobs WHERE id='j'").get().next_retry_at,null);
 phase='no-funds';sql.prepare("UPDATE speaking_jobs SET next_retry_at=0 WHERE id='j'").run();
 assert.equal((await collectNext(env)).idle,true);assert.equal(requests.length,3);
 phase='funded';sql.prepare("UPDATE speaking_jobs SET next_retry_at=0 WHERE id='j'").run();
 assert.equal((await collectNext(env)).idle,true);await retryCreditJob(env,'j');
 await drain();
 assert.equal(requests.length,4);assert.equal(requests.filter(m=>m.includes('qwen')).length,2);
 assert.equal(sql.prepare("SELECT status FROM speaking_jobs WHERE id='j'").get().status,'collected');
 const plan={jobId:'detail',attemptId:'a',parentJobId:'j',tasks:[{id:'literal-followup',focusPrompt:'Check a specific audible repair.'}]};
 await enqueueSupplement(env,plan);
 assert.equal((await enqueueSupplement(env,plan)).reused,true);
 await assert.rejects(enqueueSupplement(env,{...plan,tasks:[{id:'literal-followup',focusPrompt:'Different request.'}]}),/不同计划/);
 await drain();
 assert.equal(requests.length,5);assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM speaking_calls WHERE job_id='detail' AND task_id='literal-followup'").get().n,1);
 assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM speaking_calls WHERE job_id='detail' AND reused_call_id IS NOT NULL AND cost_usd IS NOT NULL").get().n,0);
 // A supplemental job must not silently repeat an unresolved paid baseline call.
 const old=sql.prepare("SELECT * FROM speaking_calls WHERE job_id='j' AND route_id='or-gpt-audio'").get();
 sql.prepare("UPDATE speaking_calls SET state='outcome_unknown' WHERE id=?").run(old.id);
 await bucket.put(old.metadata_key,JSON.stringify({state:'outcome_unknown'}));
 await enqueueSupplement(env,{jobId:'unknown-supplement',attemptId:'a',parentJobId:'j',tasks:[{id:'new-detail',focusPrompt:'Independent additional detail.'}]});
 await drain();assert.equal(requests.length,6);assert.equal(requests.filter(m=>m==='openai/gpt-audio').length,1);
 assert.equal((await controlRequest(new Request('https://fixture/speaking/details',{method:'POST'}),env)).status,404);
 console.log(JSON.stringify({explicitCreditContinuationPassed:true,fourPrimaryCalls:true,paidSuccessesReused:true,noAutomaticCreditRetry:true,focusedRepeatAllowed:true,independentProductionWrites:false,providerCalled:false}));
}finally{globalThis.fetch=originalFetch;sql.close();}

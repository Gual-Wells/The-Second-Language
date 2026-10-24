// Isolated migration/API checks: no credentials, provider calls or live writes.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir} from 'node:fs/promises';
import worker from '../worker/src/index.js';

const sql=new DatabaseSync(':memory:'),migration='0021_opt_in_daily_and_audio.sql';
for(const file of (await readdir('worker/migrations')).filter(x=>x.endsWith('.sql')&&x!==migration).sort())sql.exec(await readFile('worker/migrations/'+file,'utf8'));
sql.exec(`UPDATE study_settings SET rest_requested=0,rest_revision=5 WHERE id=1;
 UPDATE audio_next_config SET parts='["three"]',revision=7 WHERE id=1;
 INSERT INTO run_claims(run_id,study_date,rest_requested,rest_revision,claimed_at) VALUES('2026-10-24','2026-10-24',0,5,100);
 INSERT INTO audio_requests(id,chapter_id,chapter_digest,parts,source,state,created_at,cursor,total,error)
 VALUES('stopped-job','2026-10-24','${'a'.repeat(64)}','["three"]','next','needs_review',100,321,2143,'Explicit user stop');`);
const priorClaim=sql.prepare('SELECT * FROM run_claims').get(),priorAudio=sql.prepare('SELECT * FROM audio_requests').get();
sql.exec(await readFile('worker/migrations/'+migration,'utf8'));
assert.deepEqual({...sql.prepare('SELECT rest_requested,rest_revision FROM study_settings').get()},{rest_requested:1,rest_revision:6});
assert.deepEqual({...sql.prepare('SELECT parts,revision FROM audio_next_config').get()},{parts:'[]',revision:8});
assert.deepEqual(sql.prepare('SELECT * FROM run_claims').get(),priorClaim,'Migration preserves the already enabled run');
assert.deepEqual(sql.prepare('SELECT * FROM audio_requests').get(),priorAudio,'Migration preserves stopped work, progress and billing state');

const db={prepare(query){const wrap=(params=[])=>({bind(...values){return wrap(values);},first:async()=>sql.prepare(query).get(...params)||null,all:async()=>({results:sql.prepare(query).all(...params)}),run:async()=>({meta:{changes:Number(sql.prepare(query).run(...params).changes)}})});return wrap();},async batch(items){sql.exec('BEGIN');try{const result=[];for(const item of items)result.push(await item.run());sql.exec('COMMIT');return result;}catch(error){sql.exec('ROLLBACK');throw error;}}};
const env={DB:db,PUBLISH_TOKEN:'isolated-controls',APP_ORIGIN:'https://fixture'},originalFetch=globalThis.fetch;
let externalCalls=0;globalThis.fetch=async()=>{externalCalls++;throw Error('No external request is permitted');};
async function call(path,body,method=body===undefined?'GET':'POST',authorized=true){
 const headers={'content-type':'application/json',origin:env.APP_ORIGIN};if(authorized)headers.authorization='Bearer '+env.PUBLISH_TOKEN;
 const response=await worker.fetch(new Request(env.APP_ORIGIN+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env);
 return{status:response.status,data:await response.json()};
}
const claim=date=>call('/api/runs/claim',{runId:date,date});
const rest=value=>call('/api/settings',{restRequested:value},'PUT');
try{
 assert.equal((await call('/api/settings')).data.restRequested,true,'Rest is visible by default');
 assert.equal((await call('/api/settings',undefined,'GET',false)).status,401);
 const asleep=await claim('2026-10-25');assert.equal(asleep.data.rest,true);
 assert.deepEqual((await claim('2026-10-25')).data,asleep.data,'Same-day claims are immutable and idempotent');
 assert.equal((await rest(false)).data.restRequested,false);
 const [enabled,next]=await Promise.all([claim('2026-10-26'),claim('2026-10-27')]);
 assert.equal(enabled.data.rest,false);assert.equal(next.data.rest,true,'Concurrent dates cannot both consume a single opt-in');
 assert.equal((await call('/api/settings')).data.restRequested,true,'First claim atomically restores rest');
 assert.equal((await claim('2026-10-24')).data.rest,false,'An older non-rest run stays enabled');

 await rest(false);const nextSetting=sql.prepare('SELECT rest_requested,rest_revision FROM study_settings').get();
 assert.equal((await claim('2026-10-26')).data.rest,false);
 assert.deepEqual(sql.prepare('SELECT rest_requested,rest_revision FROM study_settings').get(),nextSetting,'Retry cannot consume a new user arrangement');
 sql.prepare('INSERT INTO run_rest_overrides VALUES(?,?,?,?)').run('2026-10-25',asleep.data.claimedAt,Date.now(),'Explicit isolated resumption');
 assert.equal((await claim('2026-10-25')).data.rest,false);
 assert.deepEqual(sql.prepare('SELECT rest_requested,rest_revision FROM study_settings').get(),nextSetting,'A date-specific override cannot consume a later arrangement');
 assert.equal((await claim('2026-10-28')).data.rest,false);assert.equal((await call('/api/settings')).data.restRequested,true);

 await rest(false);const fresh=sql.prepare('SELECT rest_revision FROM study_settings').get().rest_revision;
 sql.prepare('INSERT INTO run_claims(run_id,study_date,rest_requested,rest_revision,claimed_at) VALUES(?,?,?,?,?)').run('2026-10-29','2026-10-29',1,fresh-1,Date.now());
 assert.equal((await call('/api/settings')).data.restRequested,false,'An older revision cannot reset a newer arrangement');
 assert.equal((await claim('2026-10-30')).data.rest,false);assert.equal((await claim('2026-10-31')).data.rest,true);
 assert.equal((await call('/api/runs/claim',{runId:'bad',date:'bad'})).status,400);
 assert.equal(sql.prepare('SELECT count(*) n FROM audio_requests').get().n,1,'Claiming and resting do not enqueue audio');

 const audio=(await call('/api/audio-config')).data;assert.deepEqual(audio.next,[]);
 const selected=await call('/api/audio-config/next',{parts:['two'],revision:audio.revision},'PUT');
 assert.equal(selected.status,200);assert.deepEqual(selected.data.next,['two']);
 assert.equal((await call('/api/audio-config/next',{parts:['three'],revision:audio.revision},'PUT')).status,409,'Concurrent stale audio saves cannot overwrite a newer selection');
 assert.deepEqual((await call('/api/audio-config')).data.next,['two']);
 assert.deepEqual(sql.prepare('SELECT * FROM audio_requests').get(),priorAudio,'No setting change resumes or mutates stopped audio work');
 sql.exec('DELETE FROM study_settings WHERE id=1');
 assert.equal((await call('/api/settings')).data.restRequested,true,'Missing settings never display an implied opt-in');
 assert.equal(externalCalls,0);
 console.log('通过：默认休息与空音频、迁移保留原件、并发单次放行、幂等重领、版本保护、原休息恢复授权和停止任务保留；零外部调用。');
}finally{globalThis.fetch=originalFetch;sql.close();}

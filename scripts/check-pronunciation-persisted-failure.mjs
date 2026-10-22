import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {pronunciationRoute} from '../worker/src/pronunciation.js';
const db=new DatabaseSync(':memory:');
for(const file of ['worker/practice_migrations/0005_pronunciation.sql','worker/practice_migrations/0006_permanent_audio.sql','worker/practice_migrations/0007_compact_pronunciation.sql','worker/practice_migrations/0008_compact_chapter_links.sql'])db.exec(await readFile(file,'utf8'));
db.exec('CREATE TABLE chapter_revisions(chapter_id TEXT,digest TEXT,content_key TEXT);CREATE TABLE published_chapters(chapter_id TEXT);CREATE TABLE chapter_audio_work(chapter_id TEXT,chapter_digest TEXT,requested_at INTEGER,PRIMARY KEY(chapter_id,chapter_digest));');
const markdown=['<!-- PART:two -->','<!-- EXAMPLE:U001 -->','Keep a record.','`保留记录。`'].join('\n');
const digest=createHash('sha256').update(markdown).digest('hex');
db.prepare('INSERT INTO chapter_revisions VALUES(?,?,?)').run('chapter',digest,'fixture');db.exec("INSERT INTO published_chapters VALUES('chapter')");
let failAssociation=true,providerFails=false,providerCalls=0;
const adapter={prepare(sql){let args=[];return{bind(...v){args=v.map(x=>x instanceof ArrayBuffer?new Uint8Array(x):x);return this;},async first(){return db.prepare(sql).get(...args)||null;},async all(){return{results:db.prepare(sql).all(...args),meta:{size_after:327680}};},async run(){if(failAssociation&&sql.startsWith('INSERT INTO chapter_audio_work')){failAssociation=false;throw Error('fixture D1 failure after paid audio was persisted');}const r=db.prepare(sql).run(...args);return{meta:{changes:r.changes}};}};}};
const env={DB:adapter,PRACTICE_DB:adapter,CHAPTERS:{get:async()=>markdown},OPENROUTER_API_KEY:'fixture-only'},audio=Buffer.concat([Buffer.from('ID3'),Buffer.alloc(500,41)]),original=globalThis.fetch;
globalThis.fetch=async url=>{
 if(url==='https://openrouter.ai/api/v1/credits')return Response.json({data:{total_credits:10,total_usage:0}});
 if(url==='https://openrouter.ai/api/v1/key')return Response.json({data:{limit_remaining:null}});
 if(url==='https://openrouter.ai/api/v1/audio/speech'){providerCalls++;if(providerFails)throw Error('fixture lost provider response');return new Response(audio,{headers:{'content-type':'audio/mpeg','x-generation-id':'fixture-generation'}});}
 throw Error('Unmocked network forbidden');
};
const post=body=>pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify(body)}),env,{isPublisher:true});
try{
 const body={text:'Keep a record.',kind:'sentence',chapterId:'chapter',digest};
 const first=await(await post(body)).json();assert.equal(first.state,'ready','A later association failure must not erase a successfully stored paid result');
 const row=db.prepare('SELECT * FROM pronunciation_audio WHERE id=?').get(first.id);assert.equal(row.state,'ready');assert.deepEqual(Buffer.from(row.audio),audio);assert.equal(JSON.parse(row.response_json).generationId,'fixture-generation');
 const again=await(await post(body)).json();assert.equal(again.state,'ready');assert.equal(again.id,first.id);assert.equal(providerCalls,1,'Saved audio must never be synthesized twice');
 providerFails=true;
 const lost=await(await post({text:'A genuinely unknown response.',kind:'sentence'})).json();assert.equal(lost.state,'outcome_unknown');assert.equal(db.prepare('SELECT audio FROM pronunciation_audio WHERE id=?').get(lost.id).audio,null);
 assert.equal((await(await post({text:'A genuinely unknown response.',kind:'sentence'})).json()).state,'outcome_unknown');assert.equal(providerCalls,2,'Genuinely unknown paid calls still require review');
 console.log('Passed: persisted paid bytes survive later D1 errors; generation metadata preserved; reused once; genuinely unknown calls remain protected. No real API calls.');
}finally{globalThis.fetch=original;db.close();}

import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir} from 'node:fs/promises';
import {firstPartUpgradeRoute} from '../worker/src/chapter-upgrade.js';
import {validateFirstPartUpgrade} from '../protocol/first-part-upgrade.mjs';
import {digestText} from '../protocol/chapter-quality-contract.mjs';
import worker from '../worker/src/index.js';

const sql=new DatabaseSync(':memory:');
for(const f of (await readdir('worker/migrations')).filter(f=>f.endsWith('.sql')).sort())sql.exec(await readFile('worker/migrations/'+f,'utf8'));
for(const f of ['0005_pronunciation.sql','0006_permanent_audio.sql','0007_compact_pronunciation.sql','0008_compact_chapter_links.sql'])sql.exec(await readFile('worker/practice_migrations/'+f,'utf8'));
const db={prepare(q){const wrap=(args=[])=>({bind(...a){return wrap(a);},async first(){return sql.prepare(q).get(...args)||null;},async all(){return{results:sql.prepare(q).all(...args)};},async run(){return{meta:{changes:Number(sql.prepare(q).run(...args).changes)}};}});return wrap();},async batch(items){sql.exec('BEGIN');try{const out=[];for(const item of items)out.push(await item.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const files=new Map(),bucket={async put(k,v){files.set(k,v);},async get(k){return files.has(k)?{text:async()=>files.get(k)}:null;}},env={DB:db,PRACTICE_DB:db,PUBLISH_TOKEN:'fixture',CHAPTERS:{get:async k=>files.get(k)??null,put:async(k,v)=>files.set(k,v)}};
const original=await readFile('chapters/2026-10-02/chapter.md','utf8'),boundary=original.indexOf('<!-- PART:two -->');
function changed(text){const i=text.indexOf('<!-- PART:two -->');return text.slice(0,i).replace(/(^# [^\n]+\n)/gm,'$1\n**词源**：隔离结构夹具，不是教学说明。\n')+text.slice(i);}
async function seed(chapterId,suffix=''){const markdown=original+suffix,baseDigest=await digestText(markdown),target=changed(markdown),targetDigest=await digestText(target),key=chapterId+'/old';files.set(key,markdown);sql.prepare('INSERT INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(baseDigest,chapterId,chapterId,'第 1 章','夹具','',40,key,chapterId,'a'.repeat(40),'b'.repeat(40),1);sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run(chapterId,chapterId,baseDigest,123);sql.prepare('INSERT INTO daily_runs(run_id,study_date,phase,chapter_digest,updated_at) VALUES(?,?,?,?,?)').run(chapterId,chapterId,'PUBLISHED',baseDigest,1);return{chapterId,runId:'upgrade-20261018-'+chapterId,baseDigest,targetDigest,markdown:target,vixCommit:'821651446af60912b242ea389bd6891b00381a47',protocolCommit:'c'.repeat(40),manifest:{scope:'first-part',baseDigest,targetDigest}};}
const post=async(b,store=bucket,publisher=true,environment=env)=>{const r=await firstPartUpgradeRoute(new Request('https://fixture/api/publish/upgrade-first-part',{method:'POST',body:JSON.stringify(b)}),environment,publisher,store);return{status:r.status,value:await r.json()};};
const b=await seed('2026-10-02');assert.equal((await post(b,bucket,false)).status,403);assert.equal((await post(null)).status,400);
assert.throws(()=>validateFirstPartUpgrade(original,changed(original)+'\n'),/逐字节/);
assert.throws(()=>validateFirstPartUpgrade(original,changed(original).replace('USE:U001','USE:TEMP').replace('USE:U002','USE:U001').replace('USE:TEMP','USE:U002')),/USE 身份/);
sql.prepare('INSERT INTO chapter_audio_scopes(chapter_id,chapter_digest) VALUES(?,?)').run(b.chapterId,b.baseDigest);
sql.prepare('INSERT INTO pronunciation_results(generation_digest,content_digest,record_digest,bytes,created_at) VALUES(?,?,?,?,?)').run(Buffer.alloc(32,1),Buffer.alloc(32,2),Buffer.alloc(32,3),123,1);
sql.exec('INSERT INTO chapter_audio_clips(scope_id,result_id) VALUES(1,1)');
const settings=JSON.stringify(sql.prepare('SELECT * FROM audio_next_config').get());
assert.equal((await post(b)).status,200);assert.equal((await post(b)).value.reused,true);
assert.equal(sql.prepare('SELECT COUNT(*) n FROM chapter_audio_clips').get().n,2);assert.equal(sql.prepare('SELECT COUNT(*) n FROM pronunciation_results').get().n,1);
assert.equal(sql.prepare('SELECT published_at FROM published_chapters WHERE chapter_id=?').get(b.chapterId).published_at,123);
assert.equal(sql.prepare('SELECT chapter_digest FROM daily_runs WHERE run_id=?').get(b.chapterId).chapter_digest,b.baseDigest);
assert.equal(JSON.stringify(sql.prepare('SELECT * FROM audio_next_config').get()),settings);assert.equal(sql.prepare('SELECT COUNT(*) n FROM audio_requests').get().n,0);assert.equal(sql.prepare('SELECT COUNT(*) n FROM push_outbox').get().n,0);
assert.equal(files.get(b.chapterId+'/old'),original);assert.ok(files.get('chapters/'+b.chapterId+'/'+b.targetDigest+'.md').endsWith(original.slice(boundary)));
const replay=await worker.fetch(new Request('https://fixture/api/publish/commit',{method:'POST',headers:{authorization:'Bearer fixture','content-type':'application/json'},body:JSON.stringify({runId:b.chapterId,digest:b.baseDigest})}),env);assert.equal(replay.status,409);
const race=await seed('2026-10-06','\n');let raced=false;const racing={...bucket,async put(k,v){await bucket.put(k,v);if(!raced){raced=true;sql.prepare('UPDATE published_chapters SET digest=? WHERE chapter_id=?').run(b.targetDigest,race.chapterId);}}};assert.equal((await post(race,racing)).status,409);assert.equal(sql.prepare('SELECT COUNT(*) n FROM chapter_first_part_upgrades WHERE chapter_id=?').get(race.chapterId).n,0);
const failure=await seed('2026-10-09','\n\n');assert.equal((await post(failure,bucket,true,{...env,PRACTICE_DB:{...db,batch:async()=>{throw Error('isolated audio-link outage');}}})).status,503);assert.equal(sql.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').get(failure.chapterId).digest,failure.baseDigest);
// A normal publisher can pass its early lookup immediately before an upgrade.
// Even a later staged row must not win inside that publisher's SQL transaction.
const late=await seed('2026-10-11','\n\n\n'),normalDigest='f'.repeat(64);
for(const [digest,run,key]of [[late.targetDigest,late.runId,'prepared-upgrade'],[normalDigest,late.chapterId,'later-normal-stage']])sql.prepare('INSERT INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(digest,late.chapterId,late.chapterId,'第 1 章','夹具','',40,key,run,'a'.repeat(40),'b'.repeat(40),2);
let interleaved=false;const interleaving={...db,prepare(q){const statement=db.prepare(q);if(!q.startsWith('SELECT 1 FROM chapter_first_part_upgrades'))return statement;return{bind(){return this;},async first(){assert.equal(interleaved,false);interleaved=true;assert.equal((await post(late)).status,200);return null;}};}};
const stale=await worker.fetch(new Request('https://fixture/api/publish/commit',{method:'POST',headers:{authorization:'Bearer fixture','content-type':'application/json'},body:JSON.stringify({runId:late.chapterId,digest:normalDigest})}),{...env,DB:interleaving});assert.equal(stale.status,409);assert.equal(sql.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').get(late.chapterId).digest,late.targetDigest);
console.log(JSON.stringify({scopeAndByteProtection:true,immutableOldRecords:true,audioReusedWithoutGeneration:true,idempotence:true,preservedDateAndSettings:true,noPushOrAudioRequests:true,oldPublisherReplayBlocked:true,concurrentPointerProtected:true,audioLinkFailureDoesNotPublish:true,paidCalls:0}));sql.close();

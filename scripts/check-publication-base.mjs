// Exact baseline and actual publication UPSERT race regression; no live data.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {assertPublicationReviewBase} from '../worker/src/publication-review.js';
const sql=new DatabaseSync(':memory:');
sql.exec('CREATE TABLE published_chapters(chapter_id TEXT PRIMARY KEY,study_date TEXT,digest TEXT,published_at INTEGER);CREATE TABLE chapter_revisions(digest TEXT PRIMARY KEY);CREATE TABLE chapter_sources(digest TEXT PRIMARY KEY,source_digest TEXT);CREATE TABLE chapter_first_part_upgrades(chapter_id TEXT);');
const db={prepare(query){return{bind(...args){return{first:async()=>sql.prepare(query).get(...args)||null};}};}};
const baseline='a'.repeat(64),candidate='b'.repeat(64),intervening='c'.repeat(64),source='d'.repeat(64),id='2099-01-29';
for(const digest of [baseline,intervening,candidate])sql.prepare('INSERT INTO chapter_revisions VALUES(?)').run(digest);
sql.prepare('INSERT INTO chapter_sources VALUES(?,?)').run(baseline,source);
const reset=digest=>{sql.prepare('DELETE FROM published_chapters').run();sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run(id,id,digest,1);};
const review={basis:{mode:'teaching-delta-v1',chapterDigest:baseline,sourceDigest:source}};
assert.equal(await assertPublicationReviewBase({DB:db},{},id,candidate),null);
reset(baseline);assert.equal(await assertPublicationReviewBase({DB:db},review,id,candidate),baseline);
await assert.rejects(assertPublicationReviewBase({DB:db},{basis:{...review.basis,sourceDigest:'e'.repeat(64)}},id,candidate),e=>e.code==='PUBLICATION_BASE_CHANGED');
reset(intervening);await assert.rejects(assertPublicationReviewBase({DB:db},review,id,candidate),e=>e.code==='PUBLICATION_BASE_CHANGED');
reset(candidate);assert.equal(await assertPublicationReviewBase({DB:db},review,id,candidate),baseline);
const code=await readFile(new URL('../worker/src/index.js',import.meta.url),'utf8');
const statement=/env\.DB\.prepare\(`(INSERT INTO published_chapters \(chapter_id,[^`]+)`\)/.exec(code)?.[1];assert(statement,'Use the actual Worker publication statement');
const prepared=sql.prepare(statement),publish=(time=2)=>prepared.run(id,id,candidate,time,baseline,id,baseline,candidate,baseline,baseline),current=()=>sql.prepare('SELECT digest FROM published_chapters WHERE chapter_id=?').get(id)?.digest||null;
reset(baseline);publish();assert.equal(current(),candidate);
// The candidate has a later revision rowid, so only its exact-baseline guard can
// prevent overwriting a concurrent release that happened after the first check.
reset(intervening);publish();assert.equal(current(),intervening);
reset(candidate);publish(3);assert.equal(sql.prepare('SELECT published_at FROM published_chapters WHERE chapter_id=?').get(id).published_at,1);
reset(baseline);await assertPublicationReviewBase({DB:db},review,id,candidate);sql.prepare('DELETE FROM published_chapters').run();publish();assert.equal(current(),null,'Concurrent withdrawal cannot turn delta UPDATE into a fresh INSERT');
sql.exec('CREATE TABLE audio_requests(id TEXT PRIMARY KEY,chapter_id TEXT,chapter_digest TEXT,parts TEXT,source TEXT,state TEXT,created_at INTEGER);CREATE TABLE audio_next_config(id INTEGER,parts TEXT,revision INTEGER,updated_at INTEGER);INSERT INTO audio_next_config VALUES(1,\'["contexts"]\',1,0);');
const audio=/env\.DB\.prepare\(`(INSERT OR IGNORE INTO audio_requests[^`]+)`\)/.exec(code)?.[1],next=/env\.DB\.prepare\(`(UPDATE audio_next_config SET parts='\[\]'[^`]+)`\)/.exec(code)?.[1];assert(audio&&next);
sql.prepare(audio).run(id,id,candidate,2,baseline,id,'["contexts"]');sql.prepare(next).run(2,baseline,id);
assert.equal(sql.prepare('SELECT COUNT(*) n FROM audio_requests').get().n,0);assert.equal(sql.prepare('SELECT parts FROM audio_next_config').get().parts,'["contexts"]','Rejected delta must not consume next-chapter paid audio selection');
sql.close();console.log('PASS exact delta baseline, source binding, replay, actual SQL concurrent replacement/withdrawal and untouched audio selection (10 cases; zero live calls)');

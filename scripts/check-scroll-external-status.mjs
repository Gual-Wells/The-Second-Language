// Isolated real SQLite route checks. The certification/job rows below are
// artificial status-lookup fixtures, not evidence of a real learner passing.
// All production migrations are applied first. Foreign keys are disabled ONLY
// for direct fixture seeding; the grading/award lifecycle is tested separately.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {scrollsRoute} from '../worker/src/scrolls.js';
import {recipient} from '../worker/src/chapter-certifications.js';

const sql=new DatabaseSync(':memory:'),hash=value=>createHash('sha256').update(value).digest('hex');
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('No live network in scroll external status QA');};
let changes=0,bucketReads=0,tests=0;
const db={prepare(statement){let args=[];return{
 bind(...values){args=values;return this;},
 async first(){return sql.prepare(statement).get(...args)||null;},
 async all(){return{results:sql.prepare(statement).all(...args)};},
 runSync(){const result=sql.prepare(statement).run(...args);changes+=Number(result.changes);return{meta:{changes:Number(result.changes)}};},
 async run(){return this.runSync();}
 };},async batch(items){sql.exec('BEGIN IMMEDIATE');try{const values=items.map(item=>item.runSync());sql.exec('COMMIT');return values;}catch(error){sql.exec('ROLLBACK');throw error;}}};
const bucket={getContent:async()=>{bucketReads++;throw Error('Status lookup must not fetch source or call model assets');}};
const now=Date.now(),jobId='11111111-1111-4111-8111-111111111111',certId='22222222-2222-4222-8222-222222222222';
const chapterId='isolated-status-fixture',markdown='Self-authored chapter bytes for a status-only fixture.',chapterDigest=hash(markdown),claim='a'.repeat(64),publisher={isPublisher:true};
const env={DB:db,CHAPTERS:{get:async key=>key===chapterDigest?markdown:null}};
const ledgerRows=()=>sql.prepare('SELECT * FROM scroll_external_calls ORDER BY stage,input_digest').all();
async function status(body={},context=publisher,{expected=200,id=jobId}={}){
 assert.equal(sql.prepare('PRAGMA foreign_keys').get().foreign_keys,1,'The actual route runs with normal FK enforcement');
 const before=sql.prepare('SELECT total_changes() AS n').get().n,rows=ledgerRows(),writes=changes;
 const response=await scrollsRoute(new Request('https://fixture.invalid/api/scrolls/jobs/'+id+'/external',{method:'POST',body:JSON.stringify({claim,stage:'art',action:'status',...body})}),env,context,bucket);
 const value=await response.json();assert.equal(response.status,expected,JSON.stringify(value));
 assert.equal(sql.prepare('SELECT total_changes() AS n').get().n,before,'Status route including rejected requests must not change any row');assert.equal(changes,writes);assert.deepEqual(ledgerRows(),rows);assert.equal(bucketReads,0);
 return value;
}
async function test(label,fn){await fn();tests++;console.log('PASS '+label);}

try{
 const migrations=(await fs.readdir(new URL('../worker/migrations/',import.meta.url))).filter(name=>name.endsWith('.sql')).sort();
 for(const name of migrations)sql.exec(await fs.readFile(new URL('../worker/migrations/'+name,import.meta.url),'utf8'));
 sql.exec('PRAGMA foreign_keys=OFF');
 sql.prepare('INSERT INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
  .run(chapterDigest,chapterId,'2099-01-01','第 1 章','Status-only fixture','',50,chapterDigest,'fixture-run','a'.repeat(40),'b'.repeat(40),now);
 sql.prepare('INSERT INTO chapter_sources(digest,source_digest,source_key,policy,created_at) VALUES(?,?,?,?,?)').run(chapterDigest,'c'.repeat(64),'fixture-source','current-affairs-v1',now);
 sql.prepare('INSERT INTO chapter_certifications(id,recipient_id,recipient_name,chapter_id,chapter_digest,chapter_number,chapter_title,attempt_id,assessment_version,paper_digest,result_digest,passed_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
  .run(certId,recipient.id,'Artificial fixture recipient',chapterId,chapterDigest,'第 1 章','Status-only fixture','unissued-fixture-attempt','fixture-only','d'.repeat(64),'e'.repeat(64),now);
 sql.prepare('INSERT INTO scroll_jobs(id,certification_id,recipient_id,status,stage,claim,lease_until,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(jobId,certId,recipient.id,'running','art',hash(claim),now+300000,now,now);
 sql.prepare('INSERT INTO scroll_external_calls(job_id,stage,input_digest,state,output_digest,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').run(jobId,'art','1'.repeat(64),'complete','2'.repeat(64),now,now);
 sql.prepare('INSERT INTO scroll_external_calls(job_id,stage,input_digest,state,output_digest,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').run(jobId,'art','3'.repeat(64),'outcome_unknown',null,now,now);
 sql.exec('PRAGMA foreign_keys=ON');
 await test('publisher with a valid claim reads original complete and unknown identities without writes',async()=>{
  const value=await status();assert.deepEqual(value.calls,[{inputDigest:'1'.repeat(64),state:'complete',outputDigest:'2'.repeat(64)},{inputDigest:'3'.repeat(64),state:'outcome_unknown',outputDigest:null}]);
 });
 await test('unauthenticated status requests are rejected before lookup',()=>status({}, {},{expected:401}));
 await test('an ordinary authenticated reader cannot read publisher external ledger',()=>status({}, {session:true,sameOrigin:true},{expected:403}));
 await test('wrong claim is rejected without changing its existing ledger',()=>status({claim:'b'.repeat(64)},publisher,{expected:409}));
 await test('expired lease is rejected without expiring or rewriting this job',async()=>{
  sql.prepare('UPDATE scroll_jobs SET lease_until=? WHERE id=?').run(Date.now()-1000,jobId);await status({},publisher,{expected:409});sql.prepare('UPDATE scroll_jobs SET lease_until=? WHERE id=?').run(Date.now()+300000,jobId);
 });
 await test('future and unknown stage queries are rejected',async()=>{await status({stage:'materials'},publisher,{expected:422});await status({stage:'unknown'},publisher,{expected:422});});
 await test('a materials-stage lease may recover its prior art inputs without new work',async()=>{
  sql.prepare("UPDATE scroll_jobs SET stage='materials' WHERE id=?").run(jobId);assert.equal((await status()).calls.length,2);await status({stage:'review'},publisher,{expected:422});
 });
 await test('archived chapter scope cannot use this endpoint to resume new production',async()=>{
  const archivedDigest='f'.repeat(64),archivedCert='44444444-4444-4444-8444-444444444444',archivedJob='55555555-5555-4555-8555-555555555555';
  sql.exec('PRAGMA foreign_keys=OFF');
  sql.prepare("INSERT INTO chapter_revisions SELECT ?,chapter_id||'-archived',study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at FROM chapter_revisions WHERE digest=?").run(archivedDigest,chapterDigest);
  sql.prepare("INSERT INTO chapter_certifications SELECT ?,recipient_id,recipient_name,chapter_id||'-archived',?,chapter_number,chapter_title,attempt_id||'-archived',assessment_version,paper_digest,result_digest,passed_at FROM chapter_certifications WHERE id=?").run(archivedCert,archivedDigest,certId);
  sql.prepare('INSERT INTO scroll_jobs(id,certification_id,recipient_id,status,stage,claim,lease_until,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(archivedJob,archivedCert,recipient.id,'running','art',hash(claim),Date.now()+300000,now,now);
  sql.exec('PRAGMA foreign_keys=ON');
  // Deliberately no formal chapter_sources binding for this separate old scope.
  await status({},publisher,{expected:409,id:archivedJob});
 });
 await test('a newly claimed isolated pending job advertises ultra without reading or issuing assets',async()=>{
  // Explicit in-memory state reset for this one claim check; it is not a route
  // bypass of unknown generation and it never operates on a real certificate.
  sql.prepare('DELETE FROM scroll_external_calls WHERE job_id=?').run(jobId);sql.prepare("UPDATE scroll_jobs SET status='pending',stage='source',claim=NULL,lease_until=NULL WHERE id=?").run(jobId);
  const response=await scrollsRoute(new Request('https://fixture.invalid/api/scrolls/jobs/claim',{method:'POST',body:JSON.stringify({claim})}),env,publisher,bucket),value=await response.json();
  assert.equal(response.status,200);assert.equal(value.job.model.model,'gpt-6.1-sol');assert.equal(value.job.model.reasoningEffort,'ultra');assert.equal(value.job.chapter.digest,chapterDigest);assert.equal(value.job.stage,'source');assert.equal(bucketReads,0);
 });
 console.log(JSON.stringify({ok:true,cases:tests,migrations:migrations.length,sqlite:true,statusLookupsWriteRows:false,fixtureForeignKeys:'disabled only while directly seeding status fixtures; enabled for route calls; not a grading/award test',liveNetworkCalls:0,modelCalls:0,productionWrites:0}));
}finally{globalThis.fetch=originalFetch;sql.close();}

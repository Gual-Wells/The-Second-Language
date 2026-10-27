// Isolated SQLite and Worker verification. No production credentials or network.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import worker from '../worker/src/index.js';
import {canonicalSourcePackage,CURRENT_AFFAIRS_POLICY} from '../protocol/current-affairs.mjs';
import {chapterTestPolicy} from '../protocol/chapter-test-contract.mjs';
import {qualityPolicy} from '../protocol/chapter-quality-contract.mjs';
import {collectNext} from '../worker/speaking/collector.mjs';
import {isCurrentPracticeSet} from '../worker/src/practice-scope.js';
import {audioDescriptor,buildAudioPlan} from '../worker/src/audio-config.js';
import {recipient,firstPassStatement} from '../worker/src/chapter-certifications.js';

const hash=v=>createHash('sha256').update(v).digest('hex');
const sql=new DatabaseSync(':memory:'),practice=new DatabaseSync(':memory:');
for(const [database,folder] of [[sql,'worker/migrations'],[practice,'worker/practice_migrations']]){
 for(const file of (await readdir(folder)).filter(x=>x.endsWith('.sql')).sort())database.exec(await readFile(folder+'/'+file,'utf8'));
 database.exec('PRAGMA foreign_keys=ON');
}
function d1(database){return{prepare(query){const wrap=(params=[])=>({bind(...values){return wrap(values);},first:async()=>database.prepare(query).get(...params)||null,all:async()=>({results:database.prepare(query).all(...params)}),run:async()=>({meta:{changes:Number(database.prepare(query).run(...params).changes)}})});return wrap();},async batch(items){database.exec('BEGIN');try{const results=[];for(const item of items)results.push(await item.run());database.exec('COMMIT');return results;}catch(error){database.exec('ROLLBACK');throw error;}}};}
const words=Array.from({length:50},(_,i)=>({id:'W'+String(i).padStart(3,'0'),use:'U'+String(i).padStart(3,'0'),text:'word'+String(i).padStart(3,'0')}));
const passingPaper={policy:chapterTestPolicy,items:Array.from({length:20},(_,i)=>({type:i<7?'oral':'objective'}))},passingResult={right:20,total:20,score:100,passed:true,details:Array.from({length:20},()=>({ok:true}))};
const fixture=(revision,selected=words)=>'<!-- PART:one -->\n'+selected.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n\n**词源**：仅为隔离接口验证构造的说明，不是正式课程。\n\n<!-- USE:${w.use} -->\n## ${w.text} · 验证义 /wɜːrd/\n\`验证义\``).join('\n')+'\n<!-- PART:two -->\n'+selected.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n<!-- EXAMPLE:${w.use} -->\nWe use ${w.text} in this fixture.\n\`本句仅供接口验证。\``).join('\n')+'\n<!-- PART:three -->\n'+selected.map((w,i)=>`<!-- SENTENCE:S${i} USE:${w.use} -->\nFixture ${revision} uses ${w.text} in context.\n\`这是独立构造的验证内容。\``).join('\n');
const kv=new Map(),items=new Map(),folders=new Map();let itemSequence=0,graphReads=0,graphWrites=0,failUpload=false;
const env={DB:d1(sql),PRACTICE_DB:d1(practice),PUBLISH_TOKEN:'isolated-publisher',APP_ORIGIN:'https://fixture',ONEDRIVE_ENABLED:'true',ONEDRIVE_KEY:Buffer.alloc(32,7).toString('base64'),CHAPTERS:{get:async key=>kv.get(key)??null,put:async(key,value)=>kv.set(key,value),delete:async key=>kv.delete(key)}};
const secret=await crypto.subtle.importKey('raw',Buffer.from(env.ONEDRIVE_KEY,'base64'),'AES-GCM',false,['encrypt']);
const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},secret,new TextEncoder().encode(JSON.stringify({accessToken:'isolated-drive-token',expiresAt:Date.now()+3600000})));
sql.prepare('INSERT INTO storage_connection VALUES(1,?,0,?)').run(JSON.stringify({iv:Buffer.from(iv).toString('base64'),data:Buffer.from(cipher).toString('base64')}),Date.now());
sql.prepare('INSERT INTO storage_folders VALUES(?,?)').run('@approot','drive-root');
const readerToken='r'.repeat(43),readerHash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(readerToken))).toString('base64url');
sql.prepare('INSERT INTO auth_credential VALUES(1,?,?,0,?,0)').run('fixture-key','fixture-key-bytes','[]');
sql.prepare('INSERT INTO auth_sessions VALUES(?,1,?,?)').run(readerHash,Date.now(),Date.now()+3600000);
sql.prepare('INSERT INTO push_subscriptions VALUES(?,?,?,?,?,?)').run('fixture-phone','https://fixture-push','p','a',0,0);
const originalFetch=globalThis.fetch;
globalThis.fetch=async(target,options={})=>{
 const url=new URL(target);assert.equal(url.origin,'https://graph.microsoft.com','No external services may be called');
 assert.equal(new Headers(options.headers).get('authorization'),'Bearer isolated-drive-token');
 const route=decodeURIComponent(url.pathname.replace('/v1.0','')),method=options.method||'GET';
 if(method==='GET')graphReads++;else graphWrites++;
 let match=route.match(/^\/me\/drive\/items\/drive-root:\/(objects-[a-f0-9]{2})$/);
 if(match){const id=folders.get(match[1]);return id?Response.json({id}):Response.json({error:{code:'itemNotFound',message:'fixture missing folder'}},{status:404});}
 if(route==='/me/drive/items/drive-root/children'&&method==='POST'){
  const name=JSON.parse(options.body).name,id='folder-'+name;folders.set(name,id);return Response.json({id});
 }
 match=route.match(/^\/me\/drive\/items\/([^/:]+):\/([a-f0-9]{64}\.bin)(:\/content)?$/);
 if(match){
  const location=match[1]+'/'+match[2];
  if(method==='PUT'){
   if(failUpload)return Response.json({error:{code:'serviceNotAvailable',message:'isolated failure'}},{status:503});
   const bytes=typeof options.body==='string'?Buffer.from(options.body):Buffer.from(options.body),existing=[...items.values()].find(item=>item.location===location),id=existing?.id||'item-'+(++itemSequence);
   items.set(id,{id,location,bytes});return Response.json({id,size:bytes.length});
  }
  const item=[...items.values()].find(item=>item.location===location);return item?Response.json({id:item.id,size:item.bytes.length}):Response.json({error:{code:'itemNotFound',message:'fixture missing object'}},{status:404});
 }
 match=route.match(/^\/me\/drive\/items\/([^/]+)\/content$/);
 if(match){const item=items.get(match[1]);assert.ok(item,'Requested fixture item exists');return new Response(item.bytes);}
 throw Error('Unexpected Graph operation: '+method+' '+route);
};
async function call(path,{body,method=body===undefined?'GET':'POST',reader=false,anonymous=false}={}){
 const headers={'content-type':'application/json'};
 if(reader){headers.cookie='__Host-second_language='+readerToken;headers.origin=env.APP_ORIGIN;}
 else if(!anonymous)headers.authorization='Bearer '+env.PUBLISH_TOKEN;
 const response=await worker.fetch(new Request(env.APP_ORIGIN+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})}),env);
 return{status:response.status,data:await response.json()};
}
async function payload(date,revision='a'){
 const markdown=fixture(revision).replace('<!-- PART:three -->\n','<!-- PART:three -->\n<!-- ARTICLE:A01 -->\n# Isolated collection\n'),digest=hash(markdown),sourcePackage={schemaVersion:1,studyDate:date,chapterDigest:digest,selectionDigest:hash('isolated-selection-'+date),vixInputCommit:'a'.repeat(40),context:'This entire chapter and its source are an isolated interface fixture, not a real report or formal course.',articles:[{id:'A01',title:'Isolated collection',sourceUrls:['https://example.test/fixture-source']}],sources:[{sourceId:'fixture-public-agency',url:'https://example.test/fixture-source',title:'Isolated source fixture',publisher:'Fixture agency',readAt:'2026-10-23T10:00:00.000Z',facts:['This self-written statement exists only to test storage identity.'],limitations:'No real-world factual claim is made.'}]};
 return{id:date,date,runId:date,title:'Isolated new chapter fixture',subtitle:'Not a course',number:'第 999 章',wordCount:50,contentPolicy:'etymology-fused-v1',markdown,digest,vixCommit:'b'.repeat(40),protocolCommit:'c'.repeat(40),vixInputCommit:sourcePackage.vixInputCommit,sourcePolicy:CURRENT_AFFAIRS_POLICY,sourceDigest:hash(canonicalSourcePackage(sourcePackage)),sourcePackage};
}
const claim=date=>call('/api/runs/claim',{body:{date,runId:date}});
const stage=value=>call('/api/publish/stage',{body:value});
const commit=value=>call('/api/publish/commit',{body:{runId:value.runId,digest:value.digest}});
const newRequest=async(chapter,expected)=>{
 for(const [route,body] of [
  ['/api/chapter-tests',{id:crypto.randomUUID(),chapterId:chapter.id,digest:chapter.digest,policy:chapterTestPolicy}],
  ['/api/questions',{id:crypto.randomUUID(),chapterId:chapter.id,digest:chapter.digest,question:'What does this isolated fixture mean?'}],
  ['/api/chapter-quality',{id:crypto.randomUUID(),chapterId:chapter.id,digest:chapter.digest,policy:qualityPolicy.id}]
 ]){const result=await call(route,{body,reader:true});assert.equal(result.status,expected,route+': '+JSON.stringify(result.data));}
};
function insert(database,table,row){const keys=Object.keys(row);database.prepare(`INSERT INTO ${table}(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`).run(...keys.map(key=>row[key]));}
const snapshot=(database,tables)=>Object.fromEntries(tables.map(table=>[table,database.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all()]));
async function archiveQueues(old){
 const claimValue='e'.repeat(64),oldTests={},oldQuestions={},oldQuality={},oldAudio={},oldPractice={},oldPronunciation=[],oldScrolls={};
 for(const status of ['pending','running','ready','failed']){
  const id=crypto.randomUUID();oldTests[status]=id;
  insert(sql,'chapter_tests',{id,chapter_id:old.id,chapter_digest:old.digest,seed:'isolated-old',status,claim:hash(claimValue),lease_until:0,created_at:1,updated_at:1,policy:chapterTestPolicy});
  insert(sql,'chapter_test_reviews',{test_id:id,state:status==='ready'?'attention':status,answers_digest:hash('answers'),claim:hash(claimValue),lease_until:0,created_at:1,updated_at:1});
  insert(sql,'temporary_chapter_tests',{id,chapter_id:old.id,chapter_digest:old.digest,seed:'isolated-old',status,claim:hash(claimValue),lease_until:0,created_at:1,updated_at:1,policy:chapterTestPolicy});
  insert(sql,'temporary_test_pages',{id,title:'Isolated historical temporary fixture',subtitle:'',created_at:Date.now(),expires_at:Date.now()+3600000});
 }
 const conversation=crypto.randomUUID();insert(sql,'chapter_conversations',{id:conversation,chapter_id:old.id,chapter_digest:old.digest,created_at:1});
 for(const status of ['pending','running','answered','failed']){const id=crypto.randomUUID();oldQuestions[status]=id;insert(sql,'chapter_messages',{id,conversation_id:conversation,role:'user',content:'Isolated historical question',created_at:1});insert(sql,'chapter_question_jobs',{id,status,claim:hash(claimValue),lease_until:0,updated_at:1});}
 for(const status of ['pending','running','completed','failed']){const id=crypto.randomUUID();oldQuality[status]=id;insert(sql,'chapter_quality_requests',{id,chapter_id:old.id,chapter_digest:old.digest,policy_id:qualityPolicy.id,policy_digest:hash('old-'+status),status,claim:hash(claimValue),attempt_id:'old-attempt',lease_until:0,created_at:1,queued_at:1,updated_at:1});}
 for(const state of ['quoted','pending','running','waiting_credit','needs_review','completed']){const id=crypto.randomUUID();oldAudio[state]=id;insert(sql,'audio_requests',{id,chapter_id:old.id,chapter_digest:old.digest,parts:'["three"]',source:'existing',state,created_at:1,expires_at:1,claim:claimValue,lease_until:Date.now()+3600000});}
 const oldEligible=crypto.randomUUID();insert(sql,'chapter_tests',{id:oldEligible,chapter_id:old.id,chapter_digest:old.digest,seed:'isolated-old-passing',status:'submitted',paper_digest:hash('old-eligible-paper'),result_digest:hash('old-eligible-result'),created_at:1,updated_at:1,policy:chapterTestPolicy,certification_eligible:1});
 const archivedPass=firstPassStatement(env.DB,sql.prepare('SELECT * FROM chapter_tests WHERE id=?').get(oldEligible),passingPaper,passingResult,hash('old-eligible-result'),1);assert.equal((await archivedPass.run()).meta.changes,0,'Even a structurally passing old result cannot create a new first-pass event');
 for(const [i,status] of ['pending','running','attention','complete'].entries()){
  const chapterId='2026-10-0'+(i+2),markdown='Isolated old scroll original '+status,digest=hash(markdown),attempt=crypto.randomUUID(),certification=crypto.randomUUID(),job=crypto.randomUUID();oldScrolls[status]={chapterId,certification,job};
  kv.set('old-scroll-'+status,markdown);insert(sql,'chapter_revisions',{digest,chapter_id:chapterId,study_date:chapterId,number:'第 99 章',title:'Isolated historical chapter',subtitle:'',word_count:40,content_key:'old-scroll-'+status,run_id:chapterId,vix_commit:'b'.repeat(40),protocol_commit:'c'.repeat(40),created_at:1});
  insert(sql,'chapter_tests',{id:attempt,chapter_id:chapterId,chapter_digest:digest,seed:'historical',status:'submitted',paper_digest:hash('historical-paper'),result_digest:hash('historical-result'),created_at:1,updated_at:1,policy:chapterTestPolicy,certification_eligible:1});
  insert(sql,'chapter_certifications',{id:certification,recipient_id:recipient.id,recipient_name:recipient.name,chapter_id:chapterId,chapter_digest:digest,chapter_number:'99',chapter_title:'Isolated historical certification',attempt_id:attempt,assessment_version:chapterTestPolicy,paper_digest:hash('historical-paper'),result_digest:hash('historical-result'),passed_at:1});
  insert(sql,'scroll_jobs',{id:job,certification_id:certification,recipient_id:recipient.id,status,claim:hash(claimValue),lease_until:0,created_at:1,updated_at:1});
  if(['running','attention'].includes(status))insert(sql,'scroll_external_calls',{job_id:job,stage:'source',input_digest:hash('old-input'),state:status==='running'?'calling':'outcome_unknown',created_at:1,updated_at:1});
 }
 const mainTables=['chapter_tests','chapter_test_reviews','temporary_chapter_tests','temporary_test_pages','chapter_conversations','chapter_messages','chapter_question_jobs','chapter_quality_requests','audio_requests','chapter_certifications','scroll_jobs','scroll_requests','scroll_external_calls'],mainBefore=snapshot(sql,mainTables);
 for(const route of ['/api/questions/jobs/claim','/api/chapter-tests/jobs/claim','/api/chapter-quality/jobs/claim','/api/audio-config/jobs/claim','/api/scrolls/jobs/claim']){const result=await call(route,{body:{claim:claimValue}});assert.equal(result.status,200,route+': '+JSON.stringify(result.data));assert.equal(result.data.job,null,route);}
 for(const [prefix,id] of [['chapter-tests',oldTests.running],['questions',oldQuestions.running],['chapter-quality',oldQuality.running],['temporary-tests',oldTests.running]])for(const action of ['heartbeat','complete','fail'])assert.equal((await call(`/api/${prefix}/jobs/${id}/${action}`,{body:{claim:claimValue,attemptId:'old-attempt'}})).status,409,`${prefix}/${action}`);
 for(const prefix of ['chapter-tests','temporary-tests'])for(const action of ['retry','submit'])assert.equal((await call(`/api/${prefix}/${oldTests.failed}/${action}`,{body:{},reader:true})).status,409,`${prefix}/${action}`);
 for(const action of ['transcribe','supplement','check-question'])assert.equal((await call(`/api/chapter-tests/jobs/${oldTests.running}/${action}`,{body:{claim:claimValue}})).status,409);
 assert.equal((await call(`/api/chapter-tests/${oldTests.ready}/answers/q1/${crypto.randomUUID()}`,{method:'PUT',body:{},reader:true})).status,409);
 assert.equal((await call('/api/questions/'+conversation+'/seen',{body:{},reader:true})).status,409);
 assert.equal((await call('/api/questions/'+oldQuestions.failed+'/retry',{body:{},reader:true})).status,409);
 assert.equal((await call('/api/questions/open',{body:{chapterId:old.id,digest:old.digest},reader:true})).status,409);
 assert.equal((await call('/api/chapter-quality/'+oldQuality.failed+'/retry',{body:{},reader:true})).status,409);
 for(const [route,body] of [['confirm',{quoteId:oldAudio.quoted,confirmed:true}],['resume',{id:oldAudio.waiting_credit}],['jobs/progress',{id:oldAudio.running,claim:claimValue,cursor:0,state:'completed'}]])assert.equal((await call('/api/audio-config/'+route,{body})).status,409);
 assert.equal((await call('/api/chapter-tests?chapter='+old.id,{reader:true})).data.tests.length,5,'Old test history remains readable');
 assert.equal((await call('/api/certifications?chapter='+oldScrolls.pending.chapterId,{reader:true})).data.certification.id,oldScrolls.pending.certification,'Old certification history remains readable');
 assert.equal((await call('/api/scrolls/request',{body:{id:crypto.randomUUID(),certificationId:oldScrolls.pending.certification},reader:true})).status,409);
 for(const action of ['heartbeat','checkpoint','revise','verify','external','complete','fail','resume'])assert.equal((await call('/api/scrolls/jobs/'+oldScrolls.running.job+'/'+action,{body:{claim:claimValue}})).status,409,'Old scroll '+action+' stops before production');
 assert.equal((await call('/api/scrolls/'+oldScrolls.complete.job+'/claim',{body:{},reader:true})).status,409);
 assert.equal((await call('/api/scrolls/jobs/'+oldScrolls.attention.job+'/recover',{body:{stage:'source',inputDigest:hash('old-input'),action:'authorize-retry'}})).status,409,'Old scroll cannot authorize new production');
 assert.equal((await call('/api/scrolls/jobs/'+oldScrolls.attention.job+'/recover',{body:{stage:'source',inputDigest:hash('old-input'),action:'found',outputDigest:'invalid'}})).status,422,'Existing-result recovery remains available with its original validation');
 assert.deepEqual(snapshot(sql,mainTables),mainBefore,'Old main/audio rows remain byte-for-byte equivalent after queue and write requests');

 for(const status of ['queued','building','published','failed']){const id='old-request-'+status;oldPractice[status]=id;insert(practice,'practice_requests',{id,focus_chapter_id:old.id,focus_digest:old.digest,source_json:JSON.stringify([{id:old.id,digest:old.digest}]),status,claim_token:'old-claim',claim_at:0,set_id:status==='published'?'old-set':null,created_at:1,updated_at:1});}
 insert(practice,'practice_sets',{id:'old-set',request_id:oldPractice.published,title:'Isolated historical set',introduction:'',created_at:1});
 for(const kind of ['writing','speaking'])insert(practice,'practice_questions',{id:'old-'+kind,set_id:'old-set',position:0,kind,part:kind+'-1',prompt:'Isolated history',reference_answer:'Historical reference',created_at:1});
 for(const status of ['pending','reviewing','reviewed','failed'])insert(practice,'practice_attempts',{id:'old-attempt-'+status,question_id:'old-writing',answer_text:'Historical answer',medium:'written',reference_seen_before:0,status,claim_token:'old-claim',claim_at:0,submitted_at:1});
 for(const kind of ['listening','reading']){insert(practice,kind+'_sessions',{id:'old-'+kind+'-session',set_id:'old-set',mode:'test',started_at:1,updated_at:1});insert(practice,kind+'_attempts',{id:'old-'+kind+'-attempt',session_id:'old-'+kind+'-session',set_id:'old-set',answer_json:'{}',result_json:'{}',conditions_json:'{}',status:'pending',claim_token:'old-claim',claim_at:0,submitted_at:1});}
 for(const status of ['preparing','collecting','waiting_credit','ready','reviewing','reviewed','needs_attention'])insert(practice,'speaking_attempts',{id:'old-speaking-'+status,question_id:'old-speaking',question_snapshot_key:'old-question',original_audio_key:'old-audio',original_digest:hash('old-audio'),status,claim_token:'old-claim',claim_at:0,submitted_at:1});
 for(const status of ['queued','running','waiting_credit'])insert(practice,'speaking_jobs',{id:'old-job-'+status,attempt_id:'old-speaking-'+({queued:'collecting',running:'reviewing',waiting_credit:'waiting_credit'}[status]),contract_version:'old',contract_digest:hash('old-contract'),contract_key:'old-contract',audio_key:'old-audio',audio_digest:hash('old-audio'),audio_seconds:1,audio_format:'wav',status,lease_until:0,created_at:1,updated_at:1});
 insert(practice,'practice_media',{id:'old-media',set_id:'old-set',digest:hash('old-media'),object_key:'old-media',mime:'audio/mpeg',bytes:0,state:'outcome_unknown',request_json:'{}',created_at:1});
 for(const [i,state] of ['ready','waiting_credit','calling','outcome_unknown','failed'].entries()){const text=`We use word${String(i).padStart(3,'0')} in this fixture.`,descriptor=audioDescriptor(text),id=hash(JSON.stringify(descriptor));oldPronunciation.push({id,text,state});insert(practice,'pronunciation_audio',{id,request_json:JSON.stringify(descriptor),state,created_at:1});insert(practice,'chapter_pronunciation',{chapter_id:old.id,chapter_digest:old.digest,audio_id:id});}
 const practiceTables=['practice_requests','practice_sets','practice_questions','practice_attempts','practice_prompt_reveals','practice_reveals','listening_sessions','listening_attempts','reading_sessions','reading_attempts','speaking_attempts','speaking_jobs','speaking_feedback','practice_media','pronunciation_audio','chapter_pronunciation','chapter_audio_scopes','pronunciation_results','chapter_audio_clips'],practiceBefore=snapshot(practice,practiceTables);
 const historicalIndex=await call('/api/practice',{reader:true});assert.equal(historicalIndex.data.active,null);assert.equal(historicalIndex.data.stopped,null);assert.equal(historicalIndex.data.sets.length,1);
 assert.equal((await call('/api/practice/sets/old-set',{reader:true})).status,200);
 for(const kind of ['review','listening','reading','speaking']){const next=await call('/api/practice/publisher/'+kind+'/next');assert.equal(next.status,200);assert.ok(Object.values(next.data).every(v=>v===null));const taken=await call('/api/practice/publisher/'+kind+'/claim',{body:{}});assert.deepEqual(taken.data,{attempt:null});}
 assert.equal((await call('/api/practice/publisher/next')).data.request,null);
 for(const [route,body] of [['claim',{id:oldPractice.queued}],['fail',{id:oldPractice.building,claimToken:'old-claim'}],['sets',{requestId:oldPractice.building,claimToken:'old-claim'}],['review/complete',{attemptId:'old-attempt-reviewing',claimToken:'old-claim'}],['listening/complete',{id:'old-listening-attempt',claimToken:'old-claim'}],['reading/complete',{id:'old-reading-attempt',claimToken:'old-claim'}],['speaking/complete',{id:'old-speaking-reviewing',claimToken:'old-claim'}],['speaking/details',{attemptId:'old-speaking-reviewing'}],['speaking/retry-credit',{jobId:'old-job-waiting_credit'}]])assert.equal((await call('/api/practice/publisher/'+route,{body})).status,409,route);
 assert.equal((await call('/api/practice/publisher/speaking/other/complete',{body:{id:'old-speaking-reviewing'}})).status,404,'Unknown action aliases cannot bypass scope');
 for(const action of ['prompt','reveal','attempts','speaking/audio'])assert.equal((await call('/api/practice/questions/old-speaking/'+action,{method:action==='speaking/audio'?'PUT':'POST',body:{},reader:true})).status,409);
 for(const kind of ['listening','reading']){assert.equal((await call('/api/practice/sets/old-set/'+kind+'/sessions',{body:{},reader:true})).status,409);for(const action of ['progress','reveal','submit'])assert.equal((await call('/api/practice/'+kind+'/sessions/old-'+kind+'-session/'+action,{body:{},reader:true})).status,409);}
 assert.equal((await call('/api/practice/publisher/media/old-media/synthesize',{body:{setId:'old-set'}})).status,409);
 assert.equal((await call('/api/practice/publisher/media/old-media/verify',{body:{}})).status,409);
 assert.equal((await call('/api/practice/pronunciation',{body:{chapterId:old.id,digest:old.digest,text:'Historical sentence.',kind:'sentence'}})).status,409);
 for(const clip of oldPronunciation)assert.equal((await call('/api/practice/pronunciation/'+clip.id,{reader:true})).data.state,clip.state,'Old audio metadata remains readable');
 const noAssets={get:async()=>{throw Error('Old paid collection must not read assets');},put:async()=>{throw Error('Old paid collection must not write assets');}};assert.deepEqual(await collectNext({...env,SPEAKING_ASSETS:noAssets}),{idle:true});
 assert.deepEqual(snapshot(practice,practiceTables),practiceBefore,'Old practice rows and paid unknown outcomes are unchanged');
 return{practiceBefore,practiceTables,mainBefore,mainTables,oldPronunciation};
}
try{
 const oldMarkdown='Isolated archived original bytes.',old={id:'2026-10-01',digest:hash(oldMarkdown),markdown:oldMarkdown};
 kv.set('archived-fixture',old.markdown);
 sql.prepare('INSERT INTO chapter_revisions VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(old.digest,old.id,old.id,'第 12 章','Archived fixture','',40,'archived-fixture',old.id,'b'.repeat(40),'c'.repeat(40),0);
 sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run(old.id,old.id,old.digest,0);
 sql.prepare('INSERT INTO reading_progress VALUES(?,1,NULL,?,?)').run(old.id,'Retained historical record','2026-10-01T00:00:00Z');
 assert.deepEqual((await call('/api/chapters')).data.chapters,[]);
 assert.equal((await call('/api/chapters/'+old.id)).status,404);
 assert.equal((await call('/api/chapters/'+old.id+'?digest='+old.digest+'&archive=1')).data.markdown,old.markdown);
 assert.equal((await call('/api/chapters/'+old.id+'?archive=1',{reader:true})).status,403);
 assert.equal((await call('/api/chapters/'+old.id,{anonymous:true})).status,401);
 assert.equal((await call('/api/publish/correct-chapter',{body:{}})).status,410);
 assert.equal((await commit({...old,runId:old.id})).status,409);
 await newRequest(old,404);
 assert.equal((await call('/api/practice/requests',{body:{size:'full'},reader:true})).status,409);
 const archivedQueues=await archiveQueues(old);

 const first=await payload('2026-10-23');
 sql.exec('UPDATE study_settings SET rest_requested=1,rest_revision=rest_revision+1 WHERE id=1');
 const originalClaim=(await claim(first.date)).data;
 assert.equal(originalClaim.rest,true);assert.equal((await stage(first)).status,409,'Unreleased rest blocks publishing');
 const originalRow=sql.prepare('SELECT * FROM run_claims WHERE run_id=?').get(first.date);
 assert.throws(()=>sql.prepare('INSERT INTO run_rest_overrides VALUES(?,?,?,?)').run(first.date,originalClaim.claimedAt-1,Date.now(),'Wrong original identity'),/original rest claim/);
 sql.prepare('INSERT INTO run_rest_overrides VALUES(?,?,?,?)').run(first.date,originalClaim.claimedAt,Date.now(),'Explicit isolated user resumption');
 sql.exec('UPDATE study_settings SET rest_requested=1,rest_revision=rest_revision+1 WHERE id=1');
 const resumed=(await claim(first.date)).data;
 assert.equal(resumed.rest,false);assert.equal(resumed.originalRest,true);assert.equal(resumed.claimedAt,originalClaim.claimedAt);assert.ok(resumed.restOverride.authorizedAt);
 assert.deepEqual(sql.prepare('SELECT * FROM run_claims WHERE run_id=?').get(first.date),originalRow,'Original rest evidence stays unchanged');
 assert.equal(sql.prepare('SELECT rest_requested FROM study_settings WHERE id=1').get().rest_requested,1,'Resumption does not consume a new rest request');
 assert.equal((await claim('2099-01-01')).data.rest,true,'Other dates still honor rest');
 assert.throws(()=>sql.prepare('UPDATE run_rest_overrides SET reason=? WHERE run_id=?').run('changed',first.date),/immutable/);
 assert.throws(()=>sql.prepare('DELETE FROM run_rest_overrides WHERE run_id=?').run(first.date),/permanent/);
 const forty=fixture('old-count',words.slice(0,40));
 assert.equal((await stage({...first,wordCount:40,markdown:forty})).status,400,'Former 40-word payload is not a formal new chapter');
 assert.equal((await stage({...first,markdown:forty})).status,400,'50 in metadata cannot hide 40 actual words');
 const missingPolicy={...first};delete missingPolicy.sourcePolicy;assert.equal((await stage(missingPolicy)).status,400);
 assert.equal((await stage({...first,sourceDigest:'0'.repeat(64)})).status,400);
 assert.equal((await stage({...first,vixInputCommit:'d'.repeat(40)})).status,400);
 assert.equal((await stage({...first,contentPolicy:'current-affairs-v1'})).status,400);
 const malformed=structuredClone(first);malformed.sourcePackage.sources[0].facts=[];assert.equal((await stage(malformed)).status,400);
 const unscoped=structuredClone(first);unscoped.markdown=fixture('unscoped');unscoped.digest=hash(unscoped.markdown);unscoped.sourcePackage.chapterDigest=unscoped.digest;delete unscoped.sourcePackage.articles;unscoped.sourceDigest=hash(canonicalSourcePackage(unscoped.sourcePackage));
 const refused=await stage(unscoped);assert.equal(refused.status,400);assert.match(refused.data.error,/ARTICLE|真实取材文章组/,'Legacy collection production cannot skip its article markers');
 const wrongArticle=structuredClone(first);wrongArticle.sourcePackage.articles[0].title='Another work';wrongArticle.sourceDigest=hash(canonicalSourcePackage(wrongArticle.sourcePackage));assert.equal((await stage(wrongArticle)).status,400,'Source attribution cannot drift to another article');
 const oldReplacement=await payload(old.id,'old-replacement');await claim(old.id);assert.equal((await stage(oldReplacement)).status,409);
 assert.equal(sql.prepare('SELECT count(*) n FROM chapter_sources').get().n,0);
 env.ONEDRIVE_ENABLED='false';assert.equal((await stage(first)).status,503);env.ONEDRIVE_ENABLED='true';
 failUpload=true;assert.equal((await stage(first)).status,503);failUpload=false;
 assert.equal(sql.prepare('SELECT count(*) n FROM chapter_sources').get().n,0);
 assert.equal(sql.prepare('SELECT count(*) n FROM chapter_revisions WHERE chapter_id=?').get(first.id).n,0);
 const staged=await stage(first);assert.equal(staged.status,200,JSON.stringify(staged.data));assert.equal(staged.data.number,'第 1 章');assert.equal(sql.prepare('SELECT word_count FROM chapter_revisions WHERE digest=?').get(first.digest).word_count,50);assert.equal(staged.data.sourceDigest,first.sourceDigest);
 assert.equal((await stage(first)).status,200,'Same body and sources retry idempotently');
 assert.deepEqual((await call('/api/chapters')).data.chapters,[]);
 assert.equal((await call('/api/chapters/'+first.id+'?digest='+first.digest)).status,404,'Staged markdown is not a formal published chapter');
 assert.equal((await call('/api/chapters/'+first.id+'/sources?digest='+first.digest)).status,404,'Staged material is not a formal published source');
 await newRequest(first,404);
 const different=structuredClone(first);different.sourcePackage.context+=' Changed.';different.sourceDigest=hash(canonicalSourcePackage(different.sourcePackage));assert.equal((await stage(different)).status,409);
 assert.throws(()=>sql.prepare('UPDATE chapter_sources SET source_digest=? WHERE digest=?').run('e'.repeat(64),first.digest),/immutable/);
 assert.throws(()=>sql.prepare('DELETE FROM chapter_sources WHERE digest=?').run(first.digest),/permanent/);
 const sourceRow=sql.prepare('SELECT * FROM chapter_sources WHERE digest=?').get(first.digest);
 const sourceBlob=sql.prepare('SELECT b.item_id FROM storage_objects o JOIN storage_blobs b ON b.digest=o.digest WHERE o.object_key=?').get(sourceRow.source_key),sourceItem=items.get(sourceBlob.item_id),correctBytes=sourceItem.bytes;
 sourceItem.bytes=Buffer.from('corrupted fixture source');assert.equal((await commit(first)).status,503);sourceItem.bytes=correctBytes;
 // The new default must publish the complete text without creating audio work.
 assert.deepEqual((await call('/api/audio-config')).data.next,[]);
 const published=await commit(first);assert.equal(published.status,200,JSON.stringify(published.data));assert.equal(published.data.sourceDigest,first.sourceDigest);
 const publishedAt=sql.prepare('SELECT published_at FROM published_chapters WHERE chapter_id=?').get(first.id).published_at;
 assert.equal((await commit(first)).status,200);assert.equal(sql.prepare('SELECT published_at FROM published_chapters WHERE chapter_id=?').get(first.id).published_at,publishedAt);
 assert.equal(sql.prepare('SELECT count(*) n FROM audio_requests WHERE chapter_digest=?').get(first.digest).n,0,'Default publication makes no pre-generation request');assert.equal(sql.prepare('SELECT count(*) n FROM push_outbox').get().n,1);
 const list=(await call('/api/chapters',{reader:true})).data.chapters;assert.deepEqual(list.map(c=>[c.id,c.number]),[[first.id,'第 1 章']]);assert.equal(list[0].sourcePolicy,CURRENT_AFFAIRS_POLICY);assert.equal(list[0].sourceDigest,first.sourceDigest);
 const detail=await call('/api/chapters/'+first.id,{reader:true});assert.equal(detail.data.markdown,first.markdown);assert.equal(detail.data.digest,first.digest);assert.equal(detail.data.sourceDigest,first.sourceDigest);
 const sources=await call('/api/chapters/'+first.id+'/sources?digest='+first.digest,{reader:true});assert.equal(sources.status,200);assert.equal(sources.data.sourceDigest,first.sourceDigest);assert.deepEqual(sources.data.sourcePackage,first.sourcePackage);
 assert.equal((await call('/api/chapters/'+old.id+'/sources?digest='+old.digest)).status,404);
 assert.equal((await call('/api/feedback-snapshot')).data.recentProgress.length,0);assert.equal(sql.prepare('SELECT note FROM reading_progress WHERE chapter_id=?').get(old.id).note,'Retained historical record');
 assert.equal((await call('/api/progress/'+old.id,{method:'PUT',body:{completed:true,note:'Do not overwrite archive'},reader:true})).status,404);
 await newRequest(first,201);
 const currentTest=sql.prepare('SELECT * FROM chapter_tests WHERE chapter_id=?').get(first.id),newResultDigest=hash('isolated-new-passing-result');sql.prepare("UPDATE chapter_tests SET status='submitted',paper_digest=?,result_digest=? WHERE id=?").run(hash('isolated-new-passing-paper'),newResultDigest,currentTest.id);
 assert.equal((await firstPassStatement(env.DB,currentTest,passingPaper,passingResult,newResultDigest,Date.now()).run()).meta.changes,1,'The unchanged first-pass qualification remains available to a new bound chapter');
 const currentCertification=sql.prepare('SELECT id FROM chapter_certifications WHERE chapter_id=?').get(first.id),scrollRequest=await call('/api/scrolls/request',{body:{id:crypto.randomUUID(),certificationId:currentCertification.id},reader:true});assert.equal(scrollRequest.status,201);
 const currentScrollClaim=await call('/api/scrolls/jobs/claim',{body:{claim:'d'.repeat(64)}});assert.equal(currentScrollClaim.status,200);assert.equal(currentScrollClaim.data.job.chapter.digest,first.digest);
 assert.equal((await call('/api/practice/requests',{body:{size:'full',focusChapterId:old.id},reader:true})).status,404);
 const practiceRequest=await call('/api/practice/requests',{body:{size:'full'},reader:true});assert.equal(practiceRequest.status,201,JSON.stringify(practiceRequest.data));
 const practiceSource=JSON.parse(practice.prepare('SELECT source_json FROM practice_requests WHERE id=?').get(practiceRequest.data.id).source_json);assert.deepEqual(practiceSource,[{id:first.id,date:first.date,digest:first.digest}]);
 assert.equal((await call('/api/practice/publisher/sources/'+old.id+'/'+old.digest)).status,404);
 assert.equal((await call('/api/practice/publisher/sources/'+old.id+'/'+old.digest+'?archive=1')).data.markdown,old.markdown);
 assert.throws(()=>practice.prepare('UPDATE practice_requests SET source_policy=NULL WHERE id=?').run(practiceRequest.data.id),/immutable/);
 assert.throws(()=>practice.prepare("UPDATE practice_requests SET source_json='[]' WHERE id=?").run(practiceRequest.data.id),/immutable/);
 const practiceClaim=await call('/api/practice/publisher/claim',{body:{id:practiceRequest.data.id}});assert.equal(practiceClaim.status,200);
 env.PRACTICE_MEDIA={get:async()=>null,put:async()=>{throw Error('No media may be generated by ownership fixture');}};
 const mixedSet=await call('/api/practice/publisher/media/new-media/synthesize',{body:{id:'new-media',text:'Isolated sentence.',setId:'old-set',requestId:practiceRequest.data.id,claimToken:practiceClaim.data.claimToken}});assert.equal(mixedSet.status,409,'A new construction claim cannot adopt an old set');
 assert.equal(practice.prepare('SELECT set_id FROM practice_requests WHERE id=?').get(practiceRequest.data.id).set_id,null);
 practice.prepare('UPDATE practice_requests SET set_id=? WHERE id=?').run('old-set',practiceRequest.data.id);assert.equal(await isCurrentPracticeSet(env.PRACTICE_DB,'old-set'),false,'The actual owner determines a published set scope');practice.prepare('UPDATE practice_requests SET set_id=NULL WHERE id=?').run(practiceRequest.data.id);
 insert(practice,'practice_sets',{id:'new-set',request_id:practiceRequest.data.id,title:'Isolated current set',introduction:'',created_at:Date.now()});
 for(const kind of ['writing','speaking'])insert(practice,'practice_questions',{id:'new-'+kind,set_id:'new-set',position:0,kind,part:kind+'-1',prompt:'Isolated current question',reference_answer:'Fixture answer',created_at:Date.now()});
 insert(practice,'speaking_attempts',{id:'new-speaking-preparing',question_id:'new-speaking',question_snapshot_key:'new-question',original_audio_key:'new-audio',original_digest:hash('new-audio'),status:'preparing',submitted_at:Date.now()});
 assert.equal((await call('/api/practice/publisher/speaking/complete',{body:{attemptId:'new-speaking-preparing',id:'old-speaking-reviewing',claimToken:'old-claim'}})).status,409,'Unconsumed identity fields cannot change which attempt is checked');
 const newPracticeAttempt=await call('/api/practice/questions/new-writing/attempts',{body:{id:'new-written-attempt',answerText:'A wholly isolated answer.',medium:'written'},reader:true});assert.equal(newPracticeAttempt.status,201);

 const second=await payload('2026-10-24','b');
 assert.equal((await call('/api/settings',{method:'PUT',body:{restRequested:false},reader:true})).status,200);
 await claim(second.date);assert.equal((await stage(second)).data.number,'第 2 章');
 const audioNext=(await call('/api/audio-config')).data;
 assert.equal((await call('/api/audio-config/next',{method:'PUT',body:{parts:['three'],revision:audioNext.revision},reader:true})).status,400,'Old scopes are no longer offered for next new-format production');
 // A choice frozen before the format change retains its old scope. This legacy
 // publication fixture may consume it; a new-format chapter may not.
 sql.prepare('UPDATE audio_next_config SET parts=?,revision=revision+1 WHERE id=1').run('["three"]');
 const audioSelection=sql.prepare('SELECT parts,revision FROM audio_next_config').get();
 assert.equal((await commit(first)).status,200);
 assert.deepEqual(sql.prepare('SELECT parts,revision FROM audio_next_config').get(),audioSelection,'Republishing an existing chapter preserves a later audio selection');
 assert.equal((await commit(second)).status,200);
 assert.equal(sql.prepare('SELECT parts FROM audio_requests WHERE chapter_digest=?').get(second.digest).parts,'["three"]','The explicit selection is bound to the first new publication');
 assert.deepEqual((await call('/api/audio-config')).data.next,[],'First publication restores no pre-generation');
 const afterAudioRevision=sql.prepare('SELECT revision FROM audio_next_config').get().revision;
 assert.equal((await commit(second)).status,200);
 assert.equal(sql.prepare('SELECT revision FROM audio_next_config').get().revision,afterAudioRevision,'Retry cannot consume the default or create a second job');
 assert.equal(sql.prepare('SELECT count(*) n FROM audio_requests WHERE chapter_digest=?').get(second.digest).n,1);
 assert.deepEqual((await call('/api/chapters')).data.chapters.map(c=>c.number),['第 2 章','第 1 章']);
 assert.equal((await call('/api/chapters?archive=1')).data.chapters.length,3,'Explicit publisher archive includes retained originals');
 sourceItem.bytes=Buffer.from('corrupted fixture source');assert.equal((await call('/api/chapters/'+first.id+'/sources')).status,503);sourceItem.bytes=correctBytes;
 const revised=await payload(first.date,'revised');assert.equal((await stage(revised)).status,200);assert.equal((await commit(revised)).status,200);
 assert.equal((await call('/api/chapters/'+first.id+'?digest='+first.digest)).status,404,'Superseded version requires explicit archive access');
 assert.equal((await call('/api/chapters/'+first.id+'/sources?digest='+first.digest)).status,404);
 assert.equal((await call('/api/chapters/'+first.id+'?digest='+first.digest+'&archive=1')).data.markdown,first.markdown);
 assert.equal((await call('/api/chapters/'+first.id+'/sources?digest='+first.digest+'&archive=1')).data.sourceDigest,first.sourceDigest);
 await newRequest(first,404);
 assert.equal((await call('/api/scrolls/jobs/'+currentScrollClaim.data.job.id+'/heartbeat',{body:{claim:'d'.repeat(64)}})).status,200,'New-project chapter scroll keeps its fixed revision after a later chapter revision');
 const currentContinuation=await call('/api/practice/publisher/review/claim',{body:{}});assert.equal(currentContinuation.status,200);assert.equal(currentContinuation.data.attempt.id,'new-written-attempt','A fixed new-project snapshot continues after chapter revision');
 assert.equal((await call('/api/practice/publisher/review/complete',{body:{attemptId:'new-written-attempt',claimToken:currentContinuation.data.claimToken,review:{summary:'Isolated feedback.',strengths:[],priorities:[],nextStep:'Finish the fixture.'}}})).status,200);
 assert.equal((await commit(first)).status,409,'An older revision retry cannot replace the current published version');
 assert.equal((await call('/api/chapters/'+first.id)).data.digest,revised.digest);
 assert.equal(sql.prepare('SELECT count(*) n FROM chapter_revisions WHERE digest=?').get(old.digest).n,1);assert.equal(sql.prepare('SELECT count(*) n FROM published_chapters WHERE chapter_id=?').get(old.id).n,1);assert.equal(sql.prepare('SELECT count(*) n FROM chapter_sources WHERE digest=?').get(old.digest).n,0);
 assert.equal(sql.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.deepEqual(sql.prepare('PRAGMA foreign_key_check').all(),[]);
 assert.equal(practice.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.deepEqual(practice.prepare('PRAGMA foreign_key_check').all(),[]);
 for(const [database,tables,before] of [[sql,archivedQueues.mainTables,archivedQueues.mainBefore],[practice,archivedQueues.practiceTables,archivedQueues.practiceBefore]]){const after=snapshot(database,tables);for(const table of tables)assert.deepEqual(after[table].slice(0,before[table].length),before[table],table+': old rows stay unchanged through the full new flow');}
 assert.ok(graphReads>0&&graphWrites>0,'The actual permanent store performed verified Graph transport through isolated fixtures');
 // A withdrawal differs from a revision: even frozen background work loses
 // eligibility, while originals and unknown billing state remain untouched.
 const audioBefore=sql.prepare('SELECT * FROM audio_requests WHERE chapter_digest=?').get(second.digest);
 insert(sql,'chapter_withdrawals',{digest:second.digest,chapter_id:second.id,run_id:second.runId,selection_digest:second.sourcePackage.selectionDigest,vix_commit:second.vixCommit,withdrawn_at:Date.now(),reason:'Explicit isolated withdrawal',snapshot_json:JSON.stringify({audio:audioBefore})});
 sql.prepare('DELETE FROM published_chapters WHERE digest=?').run(second.digest);
 sql.prepare('DELETE FROM daily_runs WHERE chapter_digest=?').run(second.digest);
 assert.equal((await call('/api/chapters/'+second.id)).status,404);
 assert.equal((await call('/api/chapters/'+second.id+'?digest='+second.digest)).status,404);
 assert.equal((await call('/api/chapters/'+second.id+'/sources?digest='+second.digest)).status,404);
 assert.equal((await call('/api/chapters/'+second.id+'?digest='+second.digest+'&archive=1')).data.markdown,second.markdown);
 assert.equal((await call('/api/chapters/'+second.id+'/sources?digest='+second.digest+'&archive=1')).data.sourceDigest,second.sourceDigest);
 assert.equal((await stage(second)).status,409);
 assert.equal((await commit(second)).status,409);
 assert.equal((await call('/api/runs',{method:'PUT',body:{runId:second.runId,date:second.date,phase:'VIX_MARKED',vixCommit:second.vixCommit}})).status,409);
 await assert.rejects(()=>buildAudioPlan(env,second.id,second.digest,['three']),/封存/);
 assert.deepEqual(sql.prepare('SELECT * FROM audio_requests WHERE chapter_digest=?').get(second.digest),audioBefore);
 assert.throws(()=>sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run(second.id,second.date,second.digest,Date.now()),/withdrawn/);
 const replacement=await payload(second.date,'replacement');replacement.vixCommit='f'.repeat(40);replacement.sourcePackage.selectionDigest=hash('replacement-selection');replacement.sourceDigest=hash(canonicalSourcePackage(replacement.sourcePackage));
 assert.equal((await stage(replacement)).data.number,'第 2 章');
 assert.equal((await commit(replacement)).status,200);
 assert.equal((await call('/api/chapters/'+second.id)).data.digest,replacement.digest);
 assert.equal((await commit(second)).status,409,'Withdrawn replay cannot replace a new chapter on the same date');
 assert.equal(sql.prepare('SELECT count(*) n FROM chapter_withdrawals').get().n,1);
 console.log(JSON.stringify({ok:true,sqlite:true,worker:true,permanentSourceReadback:true,sourceBindingImmutable:true,newNumberingStartsAtOne:true,legacyArchivedNotPromoted:true,newApplicationsRejectArchive:true,archiveQueuesFrozen:true,archiveRowsUnchanged:true,practiceOwnershipGuard:true,ieltsNewSnapshotExcludesArchive:true,fixedNewSnapshotContinues:true,withdrawalReplayBlocked:true,withdrawalPaidStatePreserved:true,sameDateReplacementNumbering:true,markdownUnchanged:true,noProductionWrites:true,noExternalNetwork:true,graphFixtureReads:graphReads,graphFixtureWrites:graphWrites}));
}finally{globalThis.fetch=originalFetch;sql.close();practice.close();}

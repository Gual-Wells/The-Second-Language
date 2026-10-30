import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {questionReplyStatement,sendQuestionReplies} from '../worker/src/question-notifications.js';
import {questionsRoute} from '../worker/src/questions.js';
function fixture(){
 const sql=new DatabaseSync(':memory:');for(const name of readdirSync('worker/migrations').filter(x=>x.endsWith('.sql')).sort())sql.exec(readFileSync('worker/migrations/'+name,'utf8'));
 const DB={prepare(text){let args=[];return {bind(...v){args=v;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return {results:sql.prepare(text).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};},async batch(items){sql.exec('BEGIN');try{const r=[];for(const i of items)r.push(await i.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const digest='a'.repeat(64),id=crypto.randomUUID(),now=Date.now();
 sql.prepare('INSERT INTO chapter_revisions(chapter_id,digest,content_key,title,number,subtitle,word_count,study_date,created_at,run_id,vix_commit,protocol_commit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run('chapter-1',digest,'original','原版','第1章','',40,'2026-10-27',now,'fixture','b'.repeat(40),'c'.repeat(40));
 sql.prepare('INSERT INTO chapter_conversations(id,chapter_id,chapter_digest,created_at) VALUES(?,?,?,?)').run('thread','chapter-1',digest,now);
 sql.prepare('INSERT INTO chapter_sources VALUES(?,?,?,?,?)').run(digest,'e'.repeat(64),'source-package','current-affairs-v1',now);
 sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run('chapter-1','2026-10-27',digest,now);
 sql.prepare("INSERT INTO chapter_messages(id,conversation_id,role,content,created_at) VALUES(?,'thread','user','私人问题',?)").run(id,now);
 sql.prepare("INSERT INTO chapter_question_jobs(id,status,updated_at) VALUES(?,'pending',?)").run(id,now);
 for(const device of ['one','two'])sql.prepare('INSERT INTO push_subscriptions VALUES(?,?,?,?,?,?)').run(device,'https://fcm.googleapis.com/'+device,'public','auth',now,now);
 const env={DB,VAPID_PUBLIC_KEY:'test',VAPID_PRIVATE_KEY:'test',VAPID_SUBJECT:'mailto:test@example.test'};
 async function complete(){await DB.batch([DB.prepare("INSERT INTO chapter_messages(id,conversation_id,role,content,reply_to,created_at) VALUES(?,'thread','assistant','私人答复',?,?)").bind(crypto.randomUUID(),id,now),DB.prepare("UPDATE chapter_question_jobs SET status='answered',updated_at=? WHERE id=?").bind(now,id),questionReplyStatement(DB,id,now)]);}
 return {sql,DB,env,id,now,digest,complete};
}
test('reply delivery is conditional on a committed answer, deduplicates devices, and carries no private text',async()=>{
 const f=fixture();try{await questionReplyStatement(f.DB,f.id,f.now).run();assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM question_push_outbox').get().n,0);
 await f.complete();await questionReplyStatement(f.DB,f.id,f.now).run();assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM question_push_outbox').get().n,2);
 const notices=[];const first=await sendQuestionReplies(f.env,{deliver:async(row,payload)=>{notices.push(payload);return true;}});assert.equal(first.sent,2);assert.equal((await sendQuestionReplies(f.env,{deliver:async()=>{throw Error('must not send twice');}})).sent,0);
 assert(notices.every(p=>p.questionId===f.id&&p.digest===f.digest&&p.chapterId==='chapter-1'));assert(!JSON.stringify(notices).includes('私人'));assert.equal(new Set(notices.map(p=>p.tag)).size,1);
 }finally{f.sql.close();}
});
test('reading or changing account epoch suppresses pending notices without erasing answers',async()=>{
 for(const mode of ['read','epoch']){const f=fixture();try{await f.complete();f.sql.exec(mode==='read'?"UPDATE chapter_conversations SET seen_seq=(SELECT MAX(seq) FROM chapter_messages)":"UPDATE auth_control SET epoch=epoch+1");let calls=0;await sendQuestionReplies(f.env,{deliver:async()=>{calls++;return true;}});assert.equal(calls,0);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM question_push_outbox').get().n,0);assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM chapter_messages WHERE role='assistant'").get().n,1);}finally{f.sql.close();}}
});
test('delivery failures retry at most four times; expired devices are removed',async()=>{
 const f=fixture();try{await f.complete();f.sql.exec("DELETE FROM push_subscriptions WHERE id='two'");let calls=0;for(let n=0;n<6;n++)await sendQuestionReplies(f.env,{deliver:async()=>{calls++;throw Error('temporary push transport failure');}});assert.equal(calls,4);assert.equal(f.sql.prepare("SELECT attempts FROM question_push_outbox WHERE subscription_id='one'").get().attempts,4);
 f.sql.exec("UPDATE question_push_outbox SET attempts=0 WHERE subscription_id='one'");await sendQuestionReplies(f.env,{deliver:async()=>false});assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM push_subscriptions WHERE id='one'").get().n,0);
 }finally{f.sql.close();}
});
test('notification clicks preserve exact question/version and reject foreign destinations',async()=>{
 const handlers=new Map(),shown=[],opened=[],origin='https://the-second-language.pages.dev',id=crypto.randomUUID(),digest='a'.repeat(64);
 const self={location:{origin},navigator:{},addEventListener:(name,fn)=>handlers.set(name,fn),registration:{async showNotification(title,options){shown.push({title,options});}},clients:{async matchAll(){return [];},async openWindow(url){opened.push(url);}}};
 vm.runInNewContext(readFileSync('web/sw.js','utf8'),{self,URL,console});const event=async(name,value)=>{let pending;handlers.get(name)({...value,waitUntil(p){pending=p;}});await pending;};
 await event('push',{data:{json:()=>({questionId:id,chapterId:'2026-10-24',digest,title:'答复',body:'已完成'})}});const target=new URL(shown[0].options.data.target,origin);assert.equal(target.searchParams.get('questions'),id);assert.equal(target.searchParams.get('digest'),digest);assert.equal(shown[0].options.tag,'second-language-question-'+id);
 await event('notificationclick',{notification:{close(){},data:{target:target.href}}});assert.equal(opened[0],target.href);
 await event('notificationclick',{notification:{close(){},data:{target:'https://outside.test/'}}});assert.equal(opened.length,1);
});
test('the actual completion route commits answer and notice together, and a queue write failure rolls both back',async()=>{
 for(const broken of [false,true]){const f=fixture();try{
  const claim='f'.repeat(64);f.sql.prepare("UPDATE chapter_question_jobs SET status='running',claim=?,lease_until=? WHERE id=?").run(createHash('sha256').update(claim).digest('hex'),Date.now()+300000,f.id);
  if(broken)f.sql.exec("CREATE TRIGGER fail_notice BEFORE INSERT ON question_push_outbox BEGIN SELECT RAISE(ABORT,'fixture queue failure'); END;");
  const invoke=()=>questionsRoute(new Request('https://example.test/api/questions/jobs/'+f.id+'/complete',{method:'POST',body:JSON.stringify({claim,answer:'完成答案'})}),f.env,{isPublisher:true});
  if(broken){await assert.rejects(invoke(),/fixture queue failure/);assert.equal(f.sql.prepare('SELECT status FROM chapter_question_jobs WHERE id=?').get(f.id).status,'running');assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM chapter_messages WHERE role='assistant'").get().n,0);}
  else{assert.equal((await invoke()).status,200);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM question_push_outbox').get().n,2);assert.equal((await(await invoke()).json()).reused,true);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM question_push_outbox').get().n,2);}
 }finally{f.sql.close();}}
});
test('an expired API lease remains unknown and cannot silently re-enter the paid queue',async()=>{
 const f=fixture();try{f.env.API_QUESTIONS_ENABLED='true';f.sql.prepare("UPDATE chapter_question_jobs SET status='running',claim=?,lease_until=? WHERE id=?").run('a'.repeat(64),Date.now()-1,f.id);
 const claim=await questionsRoute(new Request('https://example.test/api/questions/jobs/claim',{method:'POST',body:JSON.stringify({claim:'f'.repeat(64),questionsOnly:true})}),f.env,{isPublisher:true});assert.equal((await claim.json()).job,null);
 assert.match(f.sql.prepare('SELECT error FROM chapter_question_jobs WHERE id=?').get(f.id).error,/待核对/);
 const retry=await questionsRoute(new Request('https://example.test/api/questions/'+f.id+'/retry',{method:'POST',body:'{}'}),f.env,{session:true,sameOrigin:true});assert.equal(retry.status,409);
 }finally{f.sql.close();}
});

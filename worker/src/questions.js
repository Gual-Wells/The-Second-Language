import {chapterText} from './storage.js';
import {claimChapterTest,chapterTestsRoute,chapterTestQueueTime} from './chapter-tests.js';
const json = (v,s=200) => Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const uuid = v => typeof v==='string' && /^[a-f0-9-]{36}$/.test(v);
const sha = async v => [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function input(request) {
 const raw=await request.text(); if(raw.length>110000)throw Error('请求过大'); return JSON.parse(raw);
}
export async function questionsRoute(request,env,{isPublisher,session,sameOrigin}) {
 const url=new URL(request.url),path=url.pathname.replace('/api/questions',''),db=env.DB,now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 if(path.startsWith('/jobs')) {
  if(!isPublisher)return json({error:'发布身份无效'},403);
  const testAction=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
  if(testAction&&await db.prepare('SELECT id FROM chapter_tests WHERE id=?').bind(testAction[1]).first())return chapterTestsRoute(new Request(request.url.replace('/api/questions','/api/chapter-tests'),request),env,{isPublisher,session,sameOrigin});
  if(path==='/jobs/claim'&&request.method==='POST') {
   const b=await input(request);
   // An expired worker is stopped for manual retry; never pay for an uncertain run again.
   await db.prepare("UPDATE chapter_question_jobs SET status='failed',error='处理被中断，请重试',claim=NULL WHERE status='running' AND lease_until<?").bind(now).run();
   if(typeof b.claim!=='string'||!/^[a-f0-9]{64}$/.test(b.claim))return json({error:'领取凭据无效'},400);
   const candidate=await db.prepare(`SELECT j.id,m.created_at FROM chapter_question_jobs j JOIN chapter_messages m ON m.id=j.id
    WHERE j.status='pending' AND NOT EXISTS(SELECT 1 FROM chapter_messages earlier JOIN chapter_question_jobs ej ON ej.id=earlier.id
     WHERE earlier.conversation_id=m.conversation_id AND earlier.seq<m.seq AND ej.status IN ('pending','running','failed'))
    ORDER BY m.seq LIMIT 1`).first();
   await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题被中断，可重新处理',updated_at=? WHERE status='running' AND lease_until<?").bind(now,now).run();
   const test=await chapterTestQueueTime(env);
   if(test&&(!candidate||test.created_at<candidate.created_at))return json({job:await claimChapterTest(env,b.claim)});
   if(!candidate)return json({job:null});
   if(typeof b.claim!=='string'||b.claim.length!==64)return json({error:'领取凭据无效'},400);
   const row=await db.prepare("UPDATE chapter_question_jobs SET status='running',claim=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=? AND status='pending' RETURNING id").bind(await sha(b.claim),now+300000,now,candidate.id).first();
   if(!row)return json({job:null});
   const message=await db.prepare('SELECT * FROM chapter_messages WHERE id=?').bind(row.id).first();
   const thread=await db.prepare('SELECT * FROM chapter_conversations WHERE id=?').bind(message.conversation_id).first();
   const chapter=await db.prepare('SELECT * FROM chapter_revisions WHERE digest=? AND chapter_id=?').bind(thread.chapter_digest,thread.chapter_id).first();
   const markdown=env.ONEDRIVE_ENABLED==='true'?await chapterText(env,chapter.content_key):await env.CHAPTERS.get(chapter.content_key);
   if(!markdown) {await db.prepare("UPDATE chapter_question_jobs SET status='failed',error='原版章节暂不可用',claim=NULL WHERE id=?").bind(row.id).run();return json({error:'原版章节暂不可用'},503);}
   const {results:messages}=await db.prepare(`SELECT role,content,seq FROM chapter_messages WHERE conversation_id=? AND
    (seq<=? OR reply_to IN (SELECT id FROM chapter_messages WHERE conversation_id=? AND seq<?)) ORDER BY seq`).bind(thread.id,message.seq,thread.id,message.seq).all();
   return json({job:{id:row.id,chapter:{id:chapter.chapter_id,digest:chapter.digest,title:chapter.title,markdown},messages}});
  }
  const match=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
  if(match&&request.method==='POST') {
   const b=await input(request),job=await db.prepare('SELECT * FROM chapter_question_jobs WHERE id=?').bind(match[1]).first();
   if(!job)return json({error:'问题不存在'},404);
   if(job.status==='answered'&&match[2]==='complete')return json({ok:true,reused:true});
   if(job.status!=='running'||job.claim!==await sha(String(b.claim||''))||job.lease_until<now)return json({error:'处理权已失效'},409);
   if(match[2]==='heartbeat') {await db.prepare('UPDATE chapter_question_jobs SET lease_until=? WHERE id=? AND claim=?').bind(now+300000,job.id,job.claim).run();return json({ok:true});}
   if(match[2]==='fail') {await db.prepare("UPDATE chapter_question_jobs SET status='failed',error='处理暂未完成，请稍后重试',claim=NULL,updated_at=? WHERE id=? AND claim=?").bind(now,job.id,job.claim).run();return json({ok:true});}
   if(typeof b.answer!=='string'||!b.answer.trim()||b.answer.length>100000)return json({error:'回答无效'},400);
   const replyId=crypto.randomUUID();
   await db.batch([
    db.prepare(`INSERT OR IGNORE INTO chapter_messages(id,conversation_id,role,content,reply_to,created_at)
     SELECT ?,m.conversation_id,'assistant',?,m.id,? FROM chapter_messages m JOIN chapter_question_jobs j ON j.id=m.id
     WHERE m.id=? AND j.status='running' AND j.claim=? AND j.lease_until>=?`).bind(replyId,b.answer,now,job.id,job.claim,now),
    db.prepare("UPDATE chapter_question_jobs SET status='answered',claim=NULL,updated_at=? WHERE id=? AND claim=? AND EXISTS(SELECT 1 FROM chapter_messages WHERE reply_to=?)").bind(now,job.id,job.claim,job.id)
   ]);return json({ok:true});
  }
  return json({error:'接口不存在'},404);
 }
 if(path==='/summary'&&request.method==='GET') {
  const {results:threads}=await db.prepare(`SELECT c.id,c.chapter_id AS chapterId,c.chapter_digest AS digest,r.title,
   (SELECT count(*) FROM chapter_messages m WHERE m.conversation_id=c.id AND m.role='assistant' AND m.seq>c.seen_seq) AS unread
   FROM chapter_conversations c JOIN chapter_revisions r ON r.digest=c.chapter_digest ORDER BY c.created_at DESC`).all();
  return json({threads});
 }
 if(path==='/open'&&request.method==='POST') {
  const b=await input(request);
  if(typeof b.chapterId!=='string'||typeof b.digest!=='string'||!/^[a-f0-9]{64}$/.test(b.digest))return json({error:'章节版本无效'},400);
  const threadSQL=`SELECT c.id,c.chapter_id AS chapterId,c.chapter_digest AS digest,r.title,c.created_at AS createdAt,c.seen_seq AS seenSeq,
   (SELECT count(*) FROM chapter_messages a WHERE a.conversation_id=c.id AND a.role='assistant' AND a.seq>c.seen_seq) AS unread,
   (SELECT q.id FROM chapter_messages q JOIN chapter_messages a ON a.reply_to=q.id
    WHERE q.conversation_id=c.id AND q.role='user' AND a.role='assistant' AND a.seq>c.seen_seq ORDER BY q.seq LIMIT 1) AS firstUnreadQuestionId
   FROM chapter_conversations c JOIN chapter_revisions r ON r.digest=c.chapter_digest`;
  // Read the unread boundary and acknowledge the same snapshot atomically. A reply
  // committed after this batch remains unread, even if its question is much older.
  const [snapshot,selected]=await db.batch([
   db.prepare(threadSQL+' ORDER BY c.created_at DESC'),
   db.prepare(`WITH threads AS (${threadSQL}),chosen AS (
    SELECT * FROM threads WHERE (chapterId=? AND digest=?) OR unread>0
    ORDER BY CASE WHEN chapterId=? AND digest=? AND unread>0 THEN 0 WHEN unread>0 THEN 1 ELSE 2 END,createdAt LIMIT 1)
    SELECT c.id AS threadId,c.chapterId,c.digest,c.firstUnreadQuestionId,m.id,m.seq,m.role,m.content,m.reply_to AS replyTo,m.created_at AS createdAt,j.status,j.error
    FROM chosen c LEFT JOIN chapter_messages m ON m.conversation_id=c.id LEFT JOIN chapter_question_jobs j ON j.id=m.id ORDER BY m.seq`).bind(b.chapterId,b.digest,b.chapterId,b.digest),
   db.prepare(`UPDATE chapter_conversations SET seen_seq=max(seen_seq,coalesce((SELECT max(seq) FROM chapter_messages a
    WHERE a.conversation_id=chapter_conversations.id AND a.role='assistant'),seen_seq))`)
  ]);
  const rows=selected.results||[],chosen=rows[0];
  return json({threads:snapshot.results||[],threadId:chosen?.threadId||null,chapterId:chosen?.chapterId||b.chapterId,digest:chosen?.digest||b.digest,
   firstUnreadQuestionId:chosen?.firstUnreadQuestionId||null,messages:rows.filter(m=>m.id).map(({threadId,chapterId,digest,firstUnreadQuestionId,...m})=>m)});
 }
 if(path===''&&request.method==='GET') {
  const thread=await db.prepare('SELECT * FROM chapter_conversations WHERE chapter_id=? AND chapter_digest=?').bind(url.searchParams.get('chapter'),url.searchParams.get('digest')).first();
  if(!thread)return json({messages:[]});
  const {results:messages}=await db.prepare(`SELECT m.id,m.seq,m.role,m.content,m.reply_to AS replyTo,m.created_at AS createdAt,j.status,j.error FROM chapter_messages m LEFT JOIN chapter_question_jobs j ON j.id=m.id WHERE m.conversation_id=? ORDER BY m.seq`).bind(thread.id).all();
  return json({threadId:thread.id,messages});
 }
 if(path===''&&request.method==='POST') {
  const b=await input(request);
  if(!uuid(b.id)||typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest)||typeof b.question!=='string'||!b.question.trim()||b.question.length>6000)return json({error:'请填写问题'},400);
  const chapter=await db.prepare('SELECT r.digest FROM chapter_revisions r WHERE r.chapter_id=? AND r.digest=? AND EXISTS(SELECT 1 FROM published_chapters p WHERE p.chapter_id=r.chapter_id)').bind(b.chapterId,b.digest).first();
  if(!chapter)return json({error:'章节版本不存在'},404);
  const existing=await db.prepare('SELECT m.content,c.chapter_id,c.chapter_digest FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id WHERE m.id=?').bind(b.id).first();
  if(existing)return existing.content===b.question.trim()&&existing.chapter_id===b.chapterId&&existing.chapter_digest===b.digest?json({ok:true,reused:true}):json({error:'请求编号已用于其他问题'},409);
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO chapter_conversations(id,chapter_id,chapter_digest,created_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),b.chapterId,b.digest,now),
   db.prepare("INSERT OR IGNORE INTO chapter_messages(id,conversation_id,role,content,created_at) SELECT ?,id,'user',?,? FROM chapter_conversations WHERE chapter_id=? AND chapter_digest=?").bind(b.id,b.question.trim(),now,b.chapterId,b.digest),
   db.prepare('INSERT OR IGNORE INTO chapter_question_jobs(id,updated_at) VALUES(?,?)').bind(b.id,now)
  ]);return json({ok:true},201);
 }
 const action=path.match(/^\/([a-f0-9-]{36})\/(seen|retry)$/);
 if(action&&request.method==='POST') {
  const b=await input(request);
  if(action[2]==='seen') {
   if(!Number.isSafeInteger(b.seq)||b.seq<0)return json({error:'阅读位置无效'},400);
   await db.prepare(`UPDATE chapter_conversations SET seen_seq=max(seen_seq,coalesce((SELECT max(seq) FROM chapter_messages WHERE conversation_id=? AND role='assistant' AND seq<=?),seen_seq)) WHERE id=?`).bind(action[1],b.seq,action[1]).run();
  }else await db.prepare("UPDATE chapter_question_jobs SET status='pending',error=NULL,updated_at=? WHERE id=? AND status='failed'").bind(now,action[1]).run();
  return json({ok:true});
 }
 return json({error:'接口不存在'},404);
}

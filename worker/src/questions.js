import {qualityQueueTime,claimQuality} from './chapter-quality.js';
import {chapterText} from './storage.js';
import {claimChapterTest,chapterTestsRoute,chapterTestQueueTime} from './chapter-tests.js';
import {temporaryTestQueueTime,claimTemporaryTest,temporaryTestsRoute} from './temporary-tests.js';
import {isCurrentAffairsChapter,isCurrentAffairsRevision} from './current-affairs.js';
import {questionReplyStatement} from './question-notifications.js';
const projectQuestion="EXISTS(SELECT 1 FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1' WHERE m.id=chapter_question_jobs.id)";
const json = (v,s=200) => Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const uuid = v => typeof v==='string' && /^[a-f0-9-]{36}$/.test(v);
const sha = async v => [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function input(request) {
 const raw=await request.text(); if(raw.length>110000)throw Error('请求过大'); return JSON.parse(raw);
}
const jobError=(message,status=409)=>Object.assign(Error(message),{status});
export async function questionCandidate(env,executionRoute='legacy') {
 return env.DB.prepare(`SELECT j.id,m.created_at FROM chapter_question_jobs j JOIN chapter_messages m ON m.id=j.id
  JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1'
  WHERE j.status='pending' AND j.execution_route=? AND NOT EXISTS(SELECT 1 FROM chapter_messages earlier JOIN chapter_question_jobs ej ON ej.id=earlier.id
   WHERE earlier.conversation_id=m.conversation_id AND earlier.seq<m.seq AND ej.status IN ('pending','running','failed'))
  ORDER BY m.seq LIMIT 1`).bind(executionRoute).first();
}
export async function expireQuestionJobs(env,executionRoute='legacy',now=Date.now()) {
 return env.DB.prepare("UPDATE chapter_question_jobs SET status='failed',error=?,claim=NULL,updated_at=? WHERE status='running' AND lease_until<? AND execution_route=? AND "+projectQuestion)
  .bind(executionRoute==='cloud-v1'||env.API_QUESTIONS_ENABLED==='true'?'API结果待核对，暂不重复生成':'处理被中断，请重试',now,now,executionRoute).run();
}
export async function claimQuestionJob(env,{claim,executionRoute='legacy',candidateId,now=Date.now()}) {
 if(typeof claim!=='string'||!/^[a-f0-9]{64}$/.test(claim))throw jobError('领取凭据无效',400);
 const candidate=candidateId?{id:candidateId}:await questionCandidate(env,executionRoute);
 if(!candidate)return null;
 const db=env.DB,row=await db.prepare("UPDATE chapter_question_jobs SET status='running',claim=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=? AND status='pending' AND execution_route=? RETURNING id,attempts")
  .bind(await sha(claim),now+300000,now,candidate.id,executionRoute).first();
 if(!row)return null;
 return readQuestionJob(env,row.id,{attempt:row.attempts});
}
export async function readQuestionJob(env,id,extra={}) {
 const db=env.DB,chapter=await db.prepare(`SELECT r.*,m.seq AS message_seq,c.id AS conversation_id FROM chapter_messages m
  JOIN chapter_conversations c ON c.id=m.conversation_id JOIN chapter_revisions r ON r.digest=c.chapter_digest AND r.chapter_id=c.chapter_id
  WHERE m.id=?`).bind(id).first();
 const markdown=chapter&&(env.ONEDRIVE_ENABLED==='true'?await chapterText(env,chapter.content_key):await env.CHAPTERS.get(chapter.content_key));
 if(!markdown||await sha(markdown)!==chapter.digest) {
  await db.prepare("UPDATE chapter_question_jobs SET status='failed',error='原版章节暂不可核对',claim=NULL WHERE id=? AND status='running'").bind(id).run();
  throw jobError('原版章节暂不可核对',503);
 }
 const {results:messages}=await db.prepare(`SELECT role,content,seq FROM chapter_messages WHERE conversation_id=? AND
  (seq<=? OR reply_to IN (SELECT id FROM chapter_messages WHERE conversation_id=? AND seq<?)) ORDER BY seq`).bind(chapter.conversation_id,chapter.message_seq,chapter.conversation_id,chapter.message_seq).all();
 return {id,...extra,chapter:{id:chapter.chapter_id,digest:chapter.digest,title:chapter.title,markdown},messages};
}
// Shared by authenticated legacy routes and the internal scheduled adapter.
// No synthetic publisher request or publishing credential is needed by cron.
export async function questionJobAction(env,{id,action,claim,answer,outcomeUnknown=false,now=Date.now()}) {
 const db=env.DB,job=await db.prepare('SELECT * FROM chapter_question_jobs WHERE id=?').bind(id).first();
 if(!job)throw jobError('问题不存在',404);
 if(job.status==='answered'&&action==='complete')return {ok:true,reused:true};
 const chapter=await db.prepare('SELECT c.chapter_id,c.chapter_digest FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id WHERE m.id=?').bind(job.id).first();
 if(!chapter||!await isCurrentAffairsRevision(db,chapter.chapter_id,chapter.chapter_digest))throw jobError('旧章答疑已封存，仅可读取历史记录');
 if(job.status!=='running'||job.claim!==await sha(String(claim||''))||job.lease_until<now)throw jobError('处理权已失效');
 if(action==='heartbeat') {
  const result=await db.prepare("UPDATE chapter_question_jobs SET lease_until=? WHERE id=? AND claim=? AND status='running' AND lease_until>=?").bind(now+300000,job.id,job.claim,now).run();
  if(!result.meta.changes)throw jobError('处理权已失效');return {ok:true};
 }
 if(action==='fail') {
  await db.prepare("UPDATE chapter_question_jobs SET status='failed',error=?,claim=NULL,updated_at=? WHERE id=? AND claim=? AND status='running'").bind(outcomeUnknown?'API结果待核对，暂不重复生成':'处理暂未完成，请稍后重试',now,job.id,job.claim).run();return {ok:true};
 }
 if(action!=='complete')throw jobError('接口不存在',404);
 if(typeof answer!=='string'||!answer.trim()||answer.length>100000)throw jobError('回答无效',400);
 await db.batch([
  db.prepare(`INSERT OR IGNORE INTO chapter_messages(id,conversation_id,role,content,reply_to,created_at)
   SELECT ?,m.conversation_id,'assistant',?,m.id,? FROM chapter_messages m JOIN chapter_question_jobs j ON j.id=m.id
   WHERE m.id=? AND j.status='running' AND j.claim=? AND j.lease_until>=?`).bind(crypto.randomUUID(),answer,now,job.id,job.claim,now),
  db.prepare("UPDATE chapter_question_jobs SET status='answered',claim=NULL,updated_at=? WHERE id=? AND claim=? AND status='running' AND lease_until>=? AND EXISTS(SELECT 1 FROM chapter_messages WHERE reply_to=?)").bind(now,job.id,job.claim,now,job.id),
  questionReplyStatement(db,job.id,now)
 ]);
 const saved=await db.prepare('SELECT status FROM chapter_question_jobs WHERE id=?').bind(job.id).first();
 if(saved?.status!=='answered')throw jobError('处理权已失效');
 return {ok:true};
}
export async function questionsRoute(request,env,{isPublisher,session,sameOrigin}) {
 const url=new URL(request.url),path=url.pathname.replace('/api/questions',''),db=env.DB,now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 if(path.startsWith('/jobs')) {
  if(!isPublisher)return json({error:'发布身份无效'},403);
  const testAction=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
   if(testAction&&await db.prepare('SELECT id FROM temporary_chapter_tests WHERE id=?').bind(testAction[1]).first())return temporaryTestsRoute(new Request(request.url.replace('/api/questions','/api/temporary-tests'),request),env,{isPublisher,session,sameOrigin});
  if(testAction&&await db.prepare('SELECT id FROM chapter_tests WHERE id=?').bind(testAction[1]).first())return chapterTestsRoute(new Request(request.url.replace('/api/questions','/api/chapter-tests'),request),env,{isPublisher,session,sameOrigin});
  if(path==='/jobs/claim'&&request.method==='POST') {
   const b=await input(request);
   // An expired worker is stopped for manual retry; never pay for an uncertain run again.
   await expireQuestionJobs(env,'legacy',now);
   if(typeof b.claim!=='string'||!/^[a-f0-9]{64}$/.test(b.claim))return json({error:'领取凭据无效'},400);
   if(b.questionsOnly===true&&env.API_QUESTIONS_ENABLED!=='true')return json({error:'API答疑尚未启用'},503);
   const questionsOnly=b.questionsOnly===true;
   const candidate=env.API_QUESTIONS_ENABLED==='true'&&!questionsOnly?null:await questionCandidate(env,'legacy');
   if(!questionsOnly){
   await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题被中断，可重新处理',updated_at=? WHERE status='running' AND lease_until<? AND EXISTS(SELECT 1 FROM formal_chapter_sources s WHERE s.digest=chapter_tests.chapter_digest AND s.policy='current-affairs-v1')").bind(now,now).run();
   const regular=await chapterTestQueueTime(env),temporary=await temporaryTestQueueTime(env),test=temporary&&(!regular||temporary.created_at<regular.created_at)?{...temporary,temporary:true}:regular;
   if(!questionsOnly&&test&&(!candidate||test.created_at<candidate.created_at))return json({job:test.temporary?await claimTemporaryTest(env,b.claim):await claimChapterTest(env,b.claim)});
   }
   if(!candidate){if(!questionsOnly&&await qualityQueueTime(env))return json({job:await claimQuality(env,b.claim)});return json({job:null});}
   if(typeof b.claim!=='string'||b.claim.length!==64)return json({error:'领取凭据无效'},400);
   try{return json({job:await claimQuestionJob(env,{claim:b.claim,executionRoute:'legacy',candidateId:candidate.id,now})});}
   catch(error){if(error.status)return json({error:error.message},error.status);throw error;}
  }
  const match=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
  if(match&&request.method==='POST') {
   const b=await input(request);
   try{return json(await questionJobAction(env,{id:match[1],action:match[2],claim:b.claim,answer:b.answer,outcomeUnknown:b.outcomeUnknown===true,now}));}
   catch(error){if(error.status)return json({error:error.message},error.status);throw error;}
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
  if(b.questionId!==undefined&&!uuid(b.questionId))return json({error:'问题编号无效'},400);
  const requested=b.questionId?await db.prepare(`SELECT c.id FROM chapter_messages q JOIN chapter_conversations c ON c.id=q.conversation_id
   WHERE q.id=? AND q.role='user' AND c.chapter_id=? AND c.chapter_digest=?`).bind(b.questionId,b.chapterId,b.digest).first():null;
  if(b.questionId&&!requested)return json({error:'提醒对应的问题不存在'},404);
  if(!requested&&!await isCurrentAffairsRevision(db,b.chapterId,b.digest))return json({error:'旧章答疑已封存，请读取历史会话'},409);
  const sourceScope=requested?'WHERE EXISTS(SELECT 1 FROM formal_chapter_sources s WHERE s.digest=c.chapter_digest AND s.policy=\'current-affairs-v1\') OR c.id=?':"WHERE EXISTS(SELECT 1 FROM formal_chapter_sources s WHERE s.digest=c.chapter_digest AND s.policy='current-affairs-v1')";
  const sourceArgs=requested?[requested.id]:[];
  const threadSQL=`SELECT c.id,c.chapter_id AS chapterId,c.chapter_digest AS digest,r.title,c.created_at AS createdAt,c.seen_seq AS seenSeq,
   (SELECT count(*) FROM chapter_messages a WHERE a.conversation_id=c.id AND a.role='assistant' AND a.seq>c.seen_seq) AS unread,
   (SELECT q.id FROM chapter_messages q JOIN chapter_messages a ON a.reply_to=q.id
    WHERE q.conversation_id=c.id AND q.role='user' AND a.role='assistant' AND a.seq>c.seen_seq ORDER BY q.seq LIMIT 1) AS firstUnreadQuestionId
   FROM chapter_conversations c JOIN chapter_revisions r ON r.digest=c.chapter_digest ${sourceScope}`;
  // Read the unread boundary and acknowledge the same snapshot atomically. A reply
  // committed after this batch remains unread, even if its question is much older.
  const [snapshot,selected]=await db.batch([
   db.prepare(threadSQL+' ORDER BY c.created_at DESC').bind(...sourceArgs),
   db.prepare(`WITH threads AS (${threadSQL}),chosen AS (
    SELECT * FROM threads WHERE (chapterId=? AND digest=?) ${requested?'':'OR unread>0'}
    ORDER BY CASE WHEN chapterId=? AND digest=? AND unread>0 THEN 0 WHEN unread>0 THEN 1 ELSE 2 END,createdAt LIMIT 1)
    SELECT c.id AS threadId,c.chapterId,c.digest,c.firstUnreadQuestionId,m.id,m.seq,m.role,m.content,m.reply_to AS replyTo,m.created_at AS createdAt,j.status,j.error
    FROM chosen c LEFT JOIN chapter_messages m ON m.conversation_id=c.id LEFT JOIN chapter_question_jobs j ON j.id=m.id ORDER BY m.seq`).bind(...sourceArgs,b.chapterId,b.digest,b.chapterId,b.digest),
   db.prepare(`UPDATE chapter_conversations SET seen_seq=max(seen_seq,coalesce((SELECT max(seq) FROM chapter_messages a
    WHERE a.conversation_id=chapter_conversations.id AND a.role='assistant'),seen_seq))
    WHERE EXISTS(SELECT 1 FROM formal_chapter_sources s WHERE s.digest=chapter_conversations.chapter_digest AND s.policy='current-affairs-v1') ${requested?'OR id=?':''}`).bind(...sourceArgs)
  ]);
  const rows=selected.results||[],chosen=rows[0];
  return json({threads:snapshot.results||[],threadId:chosen?.threadId||null,chapterId:chosen?.chapterId||b.chapterId,digest:chosen?.digest||b.digest,focusQuestionId:b.questionId||null,readOnly:!await isCurrentAffairsChapter(db,chosen?.chapterId||b.chapterId,chosen?.digest||b.digest),
   firstUnreadQuestionId:chosen?.firstUnreadQuestionId||null,messages:rows.filter(m=>m.id).map(({threadId,chapterId,digest,firstUnreadQuestionId,...m})=>m)});
 }
 if(path===''&&request.method==='GET') {
  const thread=await db.prepare('SELECT * FROM chapter_conversations WHERE chapter_id=? AND chapter_digest=?').bind(url.searchParams.get('chapter'),url.searchParams.get('digest')).first();
  if(!thread)return json({messages:[],readOnly:!await isCurrentAffairsChapter(db,url.searchParams.get('chapter'),url.searchParams.get('digest'))});
  const {results:messages}=await db.prepare(`SELECT m.id,m.seq,m.role,m.content,m.reply_to AS replyTo,m.created_at AS createdAt,j.status,j.error FROM chapter_messages m LEFT JOIN chapter_question_jobs j ON j.id=m.id WHERE m.conversation_id=? ORDER BY m.seq`).bind(thread.id).all();
  return json({threadId:thread.id,messages,readOnly:!await isCurrentAffairsChapter(db,thread.chapter_id,thread.chapter_digest)});
 }
 if(path===''&&request.method==='POST') {
  const b=await input(request);
  if(!uuid(b.id)||typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest)||typeof b.question!=='string'||!b.question.trim()||b.question.length>6000)return json({error:'请填写问题'},400);
  const existing=await db.prepare('SELECT m.content,c.chapter_id,c.chapter_digest FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id WHERE m.id=?').bind(b.id).first();
  if(existing)return existing.content===b.question.trim()&&existing.chapter_id===b.chapterId&&existing.chapter_digest===b.digest?json({ok:true,reused:true}):json({error:'请求编号已用于其他问题'},409);
  if(!await isCurrentAffairsChapter(db,b.chapterId,b.digest))return json({error:'章节版本不存在'},404);
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO chapter_conversations(id,chapter_id,chapter_digest,created_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),b.chapterId,b.digest,now),
   db.prepare("INSERT OR IGNORE INTO chapter_messages(id,conversation_id,role,content,created_at) SELECT ?,id,'user',?,? FROM chapter_conversations WHERE chapter_id=? AND chapter_digest=?").bind(b.id,b.question.trim(),now,b.chapterId,b.digest),
   db.prepare('INSERT OR IGNORE INTO chapter_question_jobs(id,updated_at,execution_route) VALUES(?,?,?)').bind(b.id,now,env.API_CLOUD_ENABLED==='true'?'cloud-v1':'legacy')
  ]);return json({ok:true},201);
 }
 const action=path.match(/^\/([a-f0-9-]{36})\/(seen|retry)$/);
 if(action&&request.method==='POST') {
  const b=await input(request);
  const chapter=await db.prepare(action[2]==='seen'?'SELECT chapter_id,chapter_digest FROM chapter_conversations WHERE id=?':'SELECT c.chapter_id,c.chapter_digest FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id WHERE m.id=?').bind(action[1]).first();
  if(action[2]==='retry'&&chapter&&!await isCurrentAffairsRevision(db,chapter.chapter_id,chapter.chapter_digest))return json({error:'旧章答疑已封存，仅可读取历史记录'},409);
  if(action[2]==='seen') {
   if(!Number.isSafeInteger(b.seq)||b.seq<0)return json({error:'阅读位置无效'},400);
   await db.prepare(`UPDATE chapter_conversations SET seen_seq=max(seen_seq,coalesce((SELECT max(seq) FROM chapter_messages WHERE conversation_id=? AND role='assistant' AND seq<=?),seen_seq)) WHERE id=?`).bind(action[1],b.seq,action[1]).run();
  }else {
   const job=await db.prepare('SELECT status,error,attempts,execution_route FROM chapter_question_jobs WHERE id=?').bind(action[1]).first();
   if(job?.status==='failed'&&(job.error==='outcome_unknown'||/结果待核对/.test(job.error||'')))return json({error:'本次结果待核对，暂不重复生成'},409);
   if(job?.status==='failed'){
    const route=env.API_CLOUD_ENABLED==='true'?'cloud-v1':job.execution_route;
    const changed=await db.prepare("UPDATE chapter_question_jobs SET status='pending',error=NULL,updated_at=?,execution_route=? WHERE id=? AND status='failed' AND attempts=? AND error IS ? AND execution_route=?").bind(now,route,action[1],job.attempts,job.error,job.execution_route).run();
    if(!changed.meta.changes)return json({error:'任务状态已更新，请重新读取；未重复生成'},409);
   }
  }
  return json({ok:true});
 }
 return json({error:'接口不存在'},404);
}

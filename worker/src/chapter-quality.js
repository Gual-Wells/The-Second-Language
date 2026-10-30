import {chapterText,permanentBucket} from './storage.js';
import {qualityPolicy,qualityPolicyV3,resolveQualityPolicy,qualityPolicyDigest,digestText,finalizeQuality} from '../../protocol/chapter-quality-contract.mjs';
import {isCurrentAffairsChapter,isCurrentAffairsRevision,readChapterSources} from './current-affairs.js';
import {isUsageContextContent} from '../../protocol/usage-context.mjs';
const projectQuality="EXISTS(SELECT 1 FROM formal_chapter_sources s WHERE s.digest=chapter_quality_requests.chapter_digest AND s.policy='current-affairs-v1')";
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}}),digest=v=>/^[a-f0-9]{64}$/.test(v||''),uuid=v=>/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v||'');
const view=r=>({id:r.id,chapterId:r.chapter_id,digest:r.chapter_digest,policy:r.policy_id,status:r.status,stage:r.stage,completed:r.completed,expected:r.expected,decision:r.decision,error:r.error,createdAt:r.created_at,updatedAt:r.updated_at});
async function original(bucket,key){const item=await bucket.getContent(key);if(!item)throw Error('质检原件暂不可用');const text=await item.text();if(await digestText(text)!==key)throw Error('质检原件摘要不一致');return JSON.parse(text);}
async function source(env,row){const c=await env.DB.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(row.chapter_id,row.chapter_digest).first();if(!c)throw Error('原章节版本不存在');const markdown=env.ONEDRIVE_ENABLED==='true'?await chapterText(env,c.content_key):await env.CHAPTERS.get(c.content_key);if(!markdown||await digestText(markdown)!==c.digest)throw Error('原章节暂不可核对');const chapter={id:c.chapter_id,digest:c.digest,title:c.title,markdown,runId:c.run_id||null,vixCommit:c.vix_commit||null,protocolCommit:c.protocol_commit||null};if(isUsageContextContent(markdown)){const binding=await env.DB.prepare('SELECT * FROM formal_chapter_sources WHERE digest=?').bind(c.digest).first();if(!binding)throw Error('固定语境来源包不存在');chapter.sourcePackage=(await readChapterSources(env,{...binding,chapter_id:c.chapter_id,study_date:c.study_date})).sourcePackage;}return chapter;}
export async function qualityQueueTime(env){const now=Date.now();await env.DB.prepare("UPDATE chapter_quality_requests SET status='failed',claim=NULL,error='审阅被中断，已保存进度',updated_at=? WHERE status='running' AND lease_until<? AND "+projectQuality).bind(now,now).run();return env.DB.prepare("SELECT queued_at AS created_at FROM chapter_quality_requests WHERE status='pending' AND "+projectQuality+" ORDER BY queued_at LIMIT 1").first();}
export async function claimQuality(env,claim){
 await qualityQueueTime(env);const now=Date.now(),attemptId=crypto.randomUUID();const row=await env.DB.prepare("UPDATE chapter_quality_requests SET status='running',claim=?,attempt_id=?,lease_until=?,updated_at=? WHERE id=(SELECT id FROM chapter_quality_requests WHERE status='pending' AND "+projectQuality+" ORDER BY queued_at LIMIT 1) AND status='pending' RETURNING *").bind(await digestText(claim),attemptId,now+300000,now).first();if(!row)return null;
 try{const policy=await resolveQualityPolicy({id:row.policy_id,digest:row.policy_digest});return{kind:'chapter-quality',id:row.id,attemptId,policy,policyDigest:row.policy_digest,chapter:await source(env,row),checkpointDigest:row.checkpoint_digest,evidenceDigest:row.evidence_digest};}catch(e){await env.DB.prepare("UPDATE chapter_quality_requests SET status='failed',claim=NULL,error=?,updated_at=? WHERE id=? AND attempt_id=?").bind(e.message.slice(0,200),now,row.id,attemptId).run();throw e;}
}
export async function chapterQualityRoute(request,env,{isPublisher,session,sameOrigin},bucket=permanentBucket(env)){
 const url=new URL(request.url),p=url.pathname.slice('/api/chapter-quality'.length),db=env.DB;
 if(!isPublisher&&!session)return json({error:'请先登录'},401);if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 let b={};if(request.method==='POST'){try{const raw=await request.text();if(raw.length>12000)throw Error();b=JSON.parse(raw);if(!b||Array.isArray(b)||typeof b!=='object')throw Error();}catch{return json({error:'申请格式无效'},400);}}
 try{
 // The installed v50-v57 reader accepts only the v2 capability name. Keep that
 // wire aliases during a shell update; every new job records the current v4
 // policy and digest, and old checkpoints are never reinterpreted.
 if(p==='/capabilities'&&request.method==='GET')return json({policy:[qualityPolicy.id,qualityPolicyV3.id].includes(url.searchParams.get('client'))?url.searchParams.get('client'):'chapter-quality-v2-contexts',executionPolicy:qualityPolicy.id});
 if(p===''&&request.method==='GET'){const {results}=await db.prepare('SELECT * FROM chapter_quality_requests WHERE chapter_id=? ORDER BY created_at DESC LIMIT 100').bind(url.searchParams.get('chapter')).all();return json({requests:results.map(view)});}
 if(p===''&&request.method==='POST'){
  if(!uuid(b.id)||typeof b.chapterId!=='string'||b.chapterId.length>110||!digest(b.digest)||![qualityPolicy.id,qualityPolicyV3.id,'chapter-quality-v2-contexts'].includes(b.policy))return json({error:'章节或质检标准已更新，请重新打开'},400);
  const policyDigest=await qualityPolicyDigest(),prior=await db.prepare('SELECT * FROM chapter_quality_requests WHERE id=?').bind(b.id).first();if(prior)return prior.chapter_id===b.chapterId&&prior.chapter_digest===b.digest&&prior.policy_digest===policyDigest?json({id:prior.id,reused:true}):json({error:'申请编号已被使用'},409);
  if(!await isCurrentAffairsChapter(db,b.chapterId,b.digest))return json({error:'正式章节版本不存在'},404);
  const now=Date.now();await db.prepare('INSERT OR IGNORE INTO chapter_quality_requests(id,chapter_id,chapter_digest,policy_id,policy_digest,created_at,queued_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(b.id,b.chapterId,b.digest,qualityPolicy.id,policyDigest,now,now,now).run();
  const saved=await db.prepare("SELECT * FROM chapter_quality_requests WHERE id=? OR (chapter_digest=? AND policy_digest=? AND status IN ('pending','running')) ORDER BY created_at LIMIT 1").bind(b.id,b.digest,policyDigest).first();if(!saved)return json({error:'申请未保存，请重试'},409);if(saved.chapter_id!==b.chapterId||saved.chapter_digest!==b.digest||saved.policy_digest!==policyDigest)return json({error:'申请编号已被使用'},409);return json({id:saved.id,reused:saved.id!==b.id},201);
 }
 if(p==='/jobs/claim'&&request.method==='POST'){if(!isPublisher)return json({error:'处理身份无效'},403);if(!digest(b.claim))return json({error:'处理凭据无效'},400);return json({job:await claimQuality(env,b.claim)});}
 const action=p.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|checkpoint|complete|fail)$/);
 if(action&&request.method==='POST'){
  if(!isPublisher)return json({error:'处理身份无效'},403);const row=await db.prepare('SELECT * FROM chapter_quality_requests WHERE id=?').bind(action[1]).first();if(!row)return json({error:'申请不存在'},404);
  if(action[2]==='complete'&&row.status==='completed')return row.report_digest===b.reportDigest?json({ok:true,reused:true}):json({error:'已签发报告不能改写'},409);
  if(!await isCurrentAffairsRevision(db,row.chapter_id,row.chapter_digest))return json({error:'旧章质检已封存，仅可读取历史记录'},409);
  const now=Date.now();if(row.status!=='running'||row.claim!==await digestText(String(b.claim||''))||row.attempt_id!==b.attemptId||row.lease_until<now)return json({error:'处理权已失效'},409);
  const ownership="id=? AND status='running' AND claim=? AND attempt_id=? AND lease_until>=?",args=()=>[row.id,row.claim,row.attempt_id,Date.now()];
  if(action[2]==='heartbeat'){const result=await db.prepare('UPDATE chapter_quality_requests SET lease_until=? WHERE '+ownership).bind(Date.now()+300000,...args()).run();return result.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);}
  if(action[2]==='fail'){const result=await db.prepare("UPDATE chapter_quality_requests SET status='failed',claim=NULL,error='本次审阅未完成，进度已保存',updated_at=? WHERE "+ownership).bind(now,...args()).run();return result.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);}
  if(action[2]==='checkpoint'){
   if(!digest(b.checkpointDigest)||!digest(b.evidenceDigest))return json({error:'检查点无效'},400);const state=await original(bucket,b.checkpointDigest),evidence=await original(bucket,b.evidenceDigest);
   if(state.requestId!==row.id||state.chapterDigest!==row.chapter_digest||state.policyDigest!==row.policy_digest||state.evidenceDigest!==b.evidenceDigest||evidence.chapterDigest!==row.chapter_digest||evidence.policyDigest!==row.policy_digest||!['sources','reviews','global','verification','complete'].includes(state.phase))return json({error:'检查点身份不一致'},409);
   if(row.evidence_digest&&row.evidence_digest!==b.evidenceDigest&&!['evidence','sources'].includes(row.stage))return json({error:'审阅中的证据版本不能替换'},409);
   const completed=state.reviewDigests?state.completed:state.reviews?.reduce((n,r)=>n+r.checks.length,0)||0;if(!Number.isSafeInteger(completed)||completed<0||!Number.isSafeInteger(state.expected)||state.expected<0||state.expected>50000||completed>state.expected)return json({error:'检查点范围无效'},400);
   const phases=['evidence','sources','reviews','global','verification','complete'];if(phases.indexOf(state.phase)<phases.indexOf(row.stage)||completed<row.completed)return json({error:'不能用旧检查点覆盖较新进度'},409);
   // Yield after a natural block; regular questions/tests retain the existing monitor.
   const waiting=await db.prepare(`SELECT 1 FROM chapter_question_jobs j JOIN chapter_messages m ON m.id=j.id JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1' WHERE j.status='pending'
    UNION ALL SELECT 1 FROM chapter_tests t JOIN formal_chapter_sources s ON s.digest=t.chapter_digest AND s.policy='current-affairs-v1' WHERE t.status='pending'
    UNION ALL SELECT 1 FROM chapter_test_reviews r JOIN chapter_tests t ON t.id=r.test_id JOIN formal_chapter_sources s ON s.digest=t.chapter_digest AND s.policy='current-affairs-v1' WHERE r.state='pending'
    UNION ALL SELECT 1 FROM temporary_chapter_tests t JOIN formal_chapter_sources s ON s.digest=t.chapter_digest AND s.policy='current-affairs-v1' WHERE t.status='pending' LIMIT 1`).first();
   const yieldNow=!!waiting&&state.phase!=='complete';const result=await db.prepare("UPDATE chapter_quality_requests SET checkpoint_digest=?,evidence_digest=?,stage=?,completed=?,expected=?,status=?,queued_at=?,lease_until=?,claim=?,updated_at=? WHERE "+ownership).bind(b.checkpointDigest,b.evidenceDigest,state.phase,completed,state.expected,yieldNow?'pending':'running',now,now+300000,yieldNow?null:row.claim,now,...args()).run();return result.meta.changes?json({ok:true,yield:yieldNow}):json({error:'处理权已失效'},409);
  }
  if(!digest(b.reportDigest)||!row.checkpoint_digest||!row.evidence_digest)return json({error:'报告或证据未保存'},400);
  const state=await original(bucket,row.checkpoint_digest),evidence=await original(bucket,row.evidence_digest),chapter=await source(env,row),report=await original(bucket,b.reportDigest);
  if(state.phase!=='complete'||state.requestId!==row.id||state.chapterDigest!==row.chapter_digest||state.policyDigest!==row.policy_digest||state.evidenceDigest!==row.evidence_digest||evidence.chapterDigest!==row.chapter_digest||evidence.policyDigest!==row.policy_digest)return json({error:'完整审阅检查点不匹配'},409);
  const policy=await resolveQualityPolicy({id:row.policy_id,digest:row.policy_digest});
  const computed=finalizeQuality({chapter,policy,policyDigest:row.policy_digest,evidenceDigest:row.evidence_digest,evidence,inventory:state.inventory,reviews:state.reviews,verification:state.verification});if(JSON.stringify(computed)!==JSON.stringify(report))return json({error:'报告与已核验检查点不一致'},409);
  const result=await db.prepare("UPDATE chapter_quality_requests SET status='completed',claim=NULL,report_digest=?,decision=?,completed=?,expected=?,error=NULL,updated_at=? WHERE "+ownership).bind(b.reportDigest,computed.decision,computed.coverage.completed,computed.coverage.expected,Date.now(),...args()).run();return result.meta.changes?json({ok:true,decision:computed.decision}):json({error:'处理权已失效'},409);
 }
 const item=p.match(/^\/([a-f0-9-]{36})(?:\/(retry|report))?$/);if(item){const row=await db.prepare('SELECT * FROM chapter_quality_requests WHERE id=?').bind(item[1]).first();if(!row)return json({error:'记录不存在'},404);
  if(item[2]==='retry'&&request.method==='POST'){if(!await isCurrentAffairsRevision(db,row.chapter_id,row.chapter_digest))return json({error:'旧章质检已封存，仅可读取历史记录'},409);try{await resolveQualityPolicy({id:row.policy_id,digest:row.policy_digest});}catch{return json({error:'旧标准不再受支持，请重新申请'},409);}const active=await db.prepare("SELECT id FROM chapter_quality_requests WHERE chapter_digest=? AND policy_digest=? AND status IN ('pending','running')").bind(row.chapter_digest,row.policy_digest).first();if(active)return json({error:'已有本版申请正在处理'},409);const r=await db.prepare("UPDATE chapter_quality_requests SET status='pending',claim=NULL,error=NULL,queued_at=?,updated_at=? WHERE id=? AND status='failed'").bind(Date.now(),Date.now(),row.id).run();return r.meta.changes?json({ok:true}):json({error:'此记录无需继续处理'},409);}
  if(request.method==='GET'){if(item[2]==='report'){if(!row.report_digest)return json({error:'报告尚未完成'},409);return json(await original(bucket,row.report_digest));}return json({request:view(row)});}
 }
 return json({error:'接口不存在'},404);
 }catch(e){console.warn('章节质检：'+e.message);return json({error:'质检资料暂不可用，已有记录已保留'},503);}
}

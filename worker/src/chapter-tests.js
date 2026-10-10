import {chapterText,permanentBucket} from './storage.js';
import {chapterTestTargets,validateChapterPaper,gradeChapterPaper,validateChapterAnswers,validateChapterInterpretations,chapterTestPolicy,legacyChapterTestPolicy} from '../../protocol/chapter-test-contract.mjs';
import {chapterTestSpeechRoute} from './chapter-test-speech.js';
import {pronunciationResult,digestHex} from './pronunciation-store.js';
import {audioDescriptor} from './audio-config.js';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}}),uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v),sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function source(env,row){const c=await env.DB.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(row.chapter_id,row.chapter_digest).first();if(!c)throw Error('原版章节不存在');const markdown=env.ONEDRIVE_ENABLED==='true'?await chapterText(env,c.content_key):await env.CHAPTERS.get(c.content_key);if(!markdown||await sha(markdown)!==row.chapter_digest)throw Error('原版章节暂不可核对');return{id:c.chapter_id,digest:c.digest,title:c.title,markdown};}
async function original(bucket,digest){const r=await bucket.getContent(digest);if(!r)throw Error('测试原件暂不可用');return r.json();}
export async function chapterTestQueueTime(env){
 await env.DB.prepare("UPDATE chapter_test_reviews SET state='failed',claim=NULL,updated_at=? WHERE state='running' AND lease_until<?").bind(Date.now(),Date.now()).run();
 return env.DB.prepare("SELECT created_at FROM (SELECT created_at FROM chapter_tests WHERE status='pending' UNION ALL SELECT created_at FROM chapter_test_reviews WHERE state='pending') ORDER BY created_at LIMIT 1").first();
}
export async function claimChapterTest(env,claim,bucket=permanentBucket(env)){
 const db=env.DB,now=Date.now();await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题被中断，可重新处理',updated_at=? WHERE status='running' AND lease_until<?").bind(now,now).run();
 await chapterTestQueueTime(env);
 const pending=await db.prepare("SELECT created_at FROM chapter_tests WHERE status='pending' ORDER BY created_at LIMIT 1").first(),review=await db.prepare("SELECT * FROM chapter_test_reviews WHERE state='pending' ORDER BY created_at LIMIT 1").first();
 if(review&&(!pending||review.created_at<=pending.created_at)){
  const taken=await db.prepare("UPDATE chapter_test_reviews SET state='running',claim=?,lease_until=?,updated_at=? WHERE test_id=? AND state='pending'").bind(await sha(claim),now+300000,now,review.test_id).run();if(!taken.meta.changes)return null;
  try{const row=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(review.test_id).first(),chapter=await source(env,row),paper=await original(bucket,row.paper_digest),answers=await original(bucket,review.answers_digest),previous=review.interpretation_digest?await original(bucket,review.interpretation_digest):null;
   const questions=paper.items.filter(q=>q.type==='oral').map(({id,prompt,options})=>({id,prompt,options:options.map(({id,text})=>({id,text})),recordingId:answers[id]}));return{kind:'chapter-test-review',id:row.id,chapter,answersDigest:review.answers_digest,questions,previous};
  }catch(e){await db.prepare("UPDATE chapter_test_reviews SET state='failed',claim=NULL,updated_at=? WHERE test_id=? AND claim=?").bind(now,review.test_id,await sha(claim)).run();throw e;}
 }
 const r=await db.prepare("UPDATE chapter_tests SET status='running',claim=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=(SELECT id FROM chapter_tests WHERE status='pending' ORDER BY created_at LIMIT 1) AND status='pending' RETURNING *").bind(await sha(claim),now+300000,now).first();if(!r)return null;
 try{const chapter=await source(env,r),policy=r.policy||legacyChapterTestPolicy,targets=await chapterTestTargets(chapter.markdown,r.seed,policy);return{kind:'chapter-test',id:r.id,seed:r.seed,policy,chapter,targets};}catch(e){await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='原版章节暂不可核对',updated_at=? WHERE id=? AND claim=?").bind(now,r.id,r.claim).run();throw e;}
}
export async function chapterTestsRoute(request,env,context,bucket=permanentBucket(env)){
 const {isPublisher,session,sameOrigin}=context,url=new URL(request.url),path=url.pathname.replace('/api/chapter-tests',''),db=env.DB,now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 const speech=await chapterTestSpeechRoute(request,env,context,bucket);if(speech)return speech;
 let b={};if(request.method!=='GET'){try{const raw=await request.text();if(raw.length>100000)throw Error();b=JSON.parse(raw);if(!b||typeof b!=='object')throw Error();}catch{return json({error:'请求格式无效'},400);}}
 try{
 if(path==='/capabilities'&&request.method==='GET')return json({policy:chapterTestPolicy,testing:true,certification:false,coin:false});
 if(path===''&&request.method==='GET'){const {results}=await db.prepare("SELECT t.id,t.chapter_id AS chapterId,t.chapter_digest AS digest,CASE WHEN r.state IN ('pending','running') THEN 'reviewing' WHEN r.state='attention' THEN 'needs_audio' WHEN r.state='failed' THEN 'review_failed' ELSE t.status END AS status,t.created_at AS createdAt,t.submitted_at AS submittedAt,t.error FROM chapter_tests t LEFT JOIN chapter_test_reviews r ON r.test_id=t.id WHERE t.chapter_id=? AND t.is_validation=0 ORDER BY t.created_at DESC LIMIT 50").bind(url.searchParams.get('chapter')).all();return json({tests:results});}
 if(path===''&&request.method==='POST'){
  if(!isPublisher&&b.policy!==chapterTestPolicy)return json({error:'测试已升级，请刷新页面后重新申请。'},409);
  if(!uuid(b.id)||typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest||''))return json({error:'章节申请无效'},400);
  const old=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(b.id).first();if(old)return old.chapter_id===b.chapterId&&old.chapter_digest===b.digest?json({ok:true,id:old.id,reused:true}):json({error:'申请编号已被使用'},409);
  const chapter=await db.prepare('SELECT r.digest FROM chapter_revisions r JOIN published_chapters p ON p.chapter_id=r.chapter_id WHERE r.chapter_id=? AND r.digest=?').bind(b.chapterId,b.digest).first();if(!chapter)return json({error:'正式章节版本不存在'},404);
  const inserted=await db.prepare("INSERT OR IGNORE INTO chapter_tests(id,chapter_id,chapter_digest,seed,created_at,updated_at,policy,is_validation) VALUES(?,?,?,?,?,?,?,?)").bind(b.id,b.chapterId,b.digest,crypto.randomUUID(),now,now,chapterTestPolicy,isPublisher&&b.validation===true?1:0).run();const winner=await db.prepare('SELECT chapter_id,chapter_digest FROM chapter_tests WHERE id=?').bind(b.id).first();return winner.chapter_id===b.chapterId&&winner.chapter_digest===b.digest?json({ok:true,id:b.id,reused:!inserted.meta.changes},inserted.meta.changes?201:200):json({error:'申请编号已被使用'},409);
 }
 if(path==='/jobs/claim'&&request.method==='POST'&&isPublisher){if(!/^[a-f0-9]{64}$/.test(b.claim||''))return json({error:'处理身份无效'},400);return json({job:await claimChapterTest(env,b.claim,bucket)});}
 const job=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
 if(job&&request.method==='POST'){
  if(!isPublisher)return json({error:'处理身份无效'},403);const row=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(job[1]).first();if(!row)return json({error:'申请不存在'},404);
  if(b.review===true){
   const review=await db.prepare('SELECT * FROM chapter_test_reviews WHERE test_id=?').bind(row.id).first();if(job[2]==='complete'&&review?.state==='complete')return json({ok:true,reused:true});
   if(review?.state!=='running'||review.claim!==await sha(String(b.claim||''))||review.lease_until<now)return json({error:'处理权已失效'},409);
   if(job[2]==='heartbeat'){await db.prepare('UPDATE chapter_test_reviews SET lease_until=? WHERE test_id=? AND claim=?').bind(now+300000,row.id,review.claim).run();return json({ok:true});}
   if(job[2]==='fail'){await db.prepare("UPDATE chapter_test_reviews SET state='failed',claim=NULL,updated_at=? WHERE test_id=? AND claim=?").bind(now,row.id,review.claim).run();return json({ok:true});}
   const paper=await original(bucket,row.paper_digest),answers=await original(bucket,review.answers_digest),items=validateChapterInterpretations(paper,b.interpretation);
   if(review.interpretation_digest){const prior=await original(bucket,review.interpretation_digest);for(const x of prior.items.filter(x=>x.state==='resolved'))if(JSON.stringify(items.find(y=>y.id===x.id))!==JSON.stringify(x))return json({error:'已明确识别的回答不能被改写'},409);}
   const snapshot=await bucket.putContent(JSON.stringify({items,answersDigest:review.answers_digest}),'application/json'),attention=items.some(x=>x.state==='uncertain');
   if(attention){const saved=await db.prepare("UPDATE chapter_test_reviews SET state='attention',interpretation_digest=?,claim=NULL,updated_at=? WHERE test_id=? AND claim=? AND lease_until>=?").bind(snapshot.digest,now,row.id,review.claim,Date.now()).run();return saved.meta.changes?json({ok:true,state:'needs_audio'}):json({error:'处理权已失效'},409);}
   const result=gradeChapterPaper(paper,answers,items),asset=await bucket.putContent(JSON.stringify({...result,answers,answerDigest:await sha(JSON.stringify(answers)),interpretationDigest:snapshot.digest,submittedAt:review.created_at,reviewedAt:now}),'application/json');
   const changed=await db.batch([db.prepare("UPDATE chapter_tests SET status='submitted',result_digest=?,submitted_at=?,updated_at=? WHERE id=? AND status='ready' AND EXISTS(SELECT 1 FROM chapter_test_reviews WHERE test_id=? AND state='running' AND claim=? AND lease_until>=?)").bind(asset.digest,review.created_at,now,row.id,row.id,review.claim,Date.now()),db.prepare("UPDATE chapter_test_reviews SET state='complete',interpretation_digest=?,claim=NULL,updated_at=? WHERE test_id=? AND claim=? AND EXISTS(SELECT 1 FROM chapter_tests WHERE id=? AND result_digest=?)").bind(snapshot.digest,now,row.id,review.claim,row.id,asset.digest)]);return changed[0].meta.changes?json({ok:true,state:'submitted'}):json({error:'处理权已失效'},409);
  }
  if(job[2]==='complete'&&['ready','submitted'].includes(row.status))return json({ok:true,reused:true});
  if(row.status!=='running'||row.claim!==await sha(String(b.claim||''))||row.lease_until<now)return json({error:'处理权已失效'},409);
  if(job[2]==='heartbeat'){await db.prepare('UPDATE chapter_tests SET lease_until=? WHERE id=? AND claim=?').bind(now+300000,row.id,row.claim).run();return json({ok:true});}
  if(job[2]==='fail'){await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题暂未完成，可重新处理',updated_at=? WHERE id=? AND claim=?").bind(now,row.id,row.claim).run();return json({ok:true});}
  const chapter=await source(env,row),policy=row.policy||legacyChapterTestPolicy,targets=await chapterTestTargets(chapter.markdown,row.seed,policy),paper=validateChapterPaper(b.paper,chapter.markdown,targets,policy);
  const oralQuestions=paper.items.filter(q=>q.type==='oral');if(oralQuestions.length){const audit=b.paper.audioAudit;if(!Array.isArray(audit?.checks)||audit.checks.length!==7||oralQuestions.some(q=>audit.checks.filter(x=>x?.id===q.id&&x.ok===true&&typeof x.reason==='string'&&x.reason.trim()).length!==1))return json({error:'听说题音频审阅未完成'},422);paper.audioAudit=audit;}
  for(const q of paper.items.filter(q=>q.type==='oral')){const id=await sha(JSON.stringify(audioDescriptor(q.prompt.replace(/\s+/g,' ').trim())));if(q.audioId!==id||!/^[a-f0-9]{64}$/.test(q.audioCheckDigest||''))return json({error:'听说题音频尚未核对'},422);const clip=await pronunciationResult(env,id);if(!clip)return json({error:'听说题音频尚未永久保存'},409);const check=await original(bucket,q.audioCheckDigest);if(check.id!==q.id||check.expected!==q.prompt||check.audioDigest!==digestHex(clip.content_digest))return json({error:'听说题音频核对不一致'},422);q.audioDigest=digestHex(clip.content_digest);}
  const asset=await bucket.putContent(JSON.stringify({...paper,chapter:{id:chapter.id,digest:chapter.digest,title:chapter.title},seed:row.seed}),'application/json');
  const result=await db.prepare("UPDATE chapter_tests SET status='ready',paper_digest=?,claim=NULL,error=NULL,updated_at=? WHERE id=? AND status='running' AND claim=? AND lease_until>=?").bind(asset.digest,now,row.id,row.claim,Date.now()).run();return result.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);
 }
 const match=path.match(/^\/([a-f0-9-]{36})(\/(submit|retry))?$/);if(match){
  const row=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(match[1]).first();if(!row)return json({error:'测试不存在'},404);
  if(match[3]==='retry'&&request.method==='POST'){const review=await db.prepare("UPDATE chapter_test_reviews SET state='pending',claim=NULL,updated_at=? WHERE test_id=? AND state='failed'").bind(now,row.id).run();if(review.meta.changes)return json({ok:true});const r=await db.prepare("UPDATE chapter_tests SET status='pending',claim=NULL,error=NULL,updated_at=? WHERE id=? AND status='failed'").bind(now,row.id).run();return r.meta.changes?json({ok:true}):json({error:'此测试无需重新处理'},409);}
  if(!match[2]&&request.method==='GET'){
   let paper=null,result=null;if(row.paper_digest){const stored=await bucket.getContent(row.paper_digest);if(!stored)return json({error:'试卷原件暂不可用'},503);paper=await stored.json();}if(row.result_digest){const stored=await bucket.getContent(row.result_digest);if(!stored)return json({error:'答卷原件暂不可用'},503);result=await stored.json();}
   const review=await db.prepare('SELECT * FROM chapter_test_reviews WHERE test_id=?').bind(row.id).first(),interpretation=review?.state==='attention'?await original(bucket,review.interpretation_digest):null;
   if(paper?.items.some(q=>q.type==='oral')&&!isPublisher&&request.headers.get('x-chapter-test-policy')!==chapterTestPolicy)return json({id:row.id,status:'upgrade_required',items:[],result:null,error:'请刷新页面后打开听说测试。'});
   return json({id:row.id,policy:paper?.policy||row.policy,chapterId:row.chapter_id,digest:row.chapter_digest,status:review?.state==='attention'?'needs_audio':['pending','running'].includes(review?.state)?'reviewing':review?.state==='failed'?'review_failed':row.status,createdAt:row.created_at,submittedAt:row.submitted_at,error:row.error,chapter:paper?.chapter,items:paper?.items.map(({id,type,prompt,options})=>type==='oral'?{id,type,audioUrl:`/api/chapter-tests/${row.id}/questions/${id}/audio`}:{id,type,prompt,options:options.map(({id,text})=>({id,text}))})||[],unclear:interpretation?.items.filter(x=>x.state==='uncertain').map(x=>x.id)||[],submittedAnswers:review?await original(bucket,review.answers_digest):null,result});
  }
  if(match[3]==='submit'&&request.method==='POST'){
   if(!['ready','submitted'].includes(row.status))return json({error:'试卷尚未准备好'},409);
   const stored=await bucket.getContent(row.paper_digest);if(!stored)return json({error:'试卷原件暂不可用'},503);const paper=await stored.json(),answers=validateChapterAnswers(paper,b.answers),answerDigest=await sha(JSON.stringify(answers));
   if(row.result_digest){const saved=await bucket.getContent(row.result_digest);if(!saved)return json({error:'答卷原件暂不可用'},503);const prior=await saved.json();return prior.answerDigest===answerDigest?json({ok:true,reused:true,result:prior}):json({error:'已提交答卷不能改写，请重新申请测试'},409);}
   if(paper.items.some(q=>q.type==='oral')){
    for(const q of paper.items.filter(q=>q.type==='oral')){const r=await db.prepare('SELECT id FROM chapter_test_recordings WHERE id=? AND test_id=? AND question_id=?').bind(answers[q.id],row.id,q.id).first();if(!r)return json({error:'请先保存全部口头回答'},422);}
    const existing=await db.prepare('SELECT * FROM chapter_test_reviews WHERE test_id=?').bind(row.id).first();
    if(existing){if(existing.answers_digest===answerDigest)return json({ok:true,reused:true,status:existing.state==='attention'?'needs_audio':'reviewing'});if(existing.state!=='attention')return json({error:'已提交答卷不能改写'},409);const prior=await original(bucket,existing.answers_digest),review=await original(bucket,existing.interpretation_digest),unclear=review.items.filter(x=>x.state==='uncertain').map(x=>x.id);if(paper.items.some(q=>!unclear.includes(q.id)&&JSON.stringify(prior[q.id])!==JSON.stringify(answers[q.id])))return json({error:'只能补录未听清的回答'},409);if(unclear.some(id=>answers[id]===prior[id]))return json({error:'请重新录制未听清的回答'},422);}
    const asset=await bucket.putContent(JSON.stringify(answers),'application/json');
    if(existing){const r=await db.prepare("UPDATE chapter_test_reviews SET state='pending',answers_digest=?,claim=NULL,updated_at=? WHERE test_id=? AND state='attention' AND answers_digest=?").bind(asset.digest,now,row.id,existing.answers_digest).run();return r.meta.changes?json({ok:true,status:'reviewing'}):json({error:'另一份答卷已先提交'},409);}
    await db.prepare("INSERT OR IGNORE INTO chapter_test_reviews(test_id,state,answers_digest,created_at,updated_at) VALUES(?,'pending',?,?,?)").bind(row.id,asset.digest,now,now).run();const winner=await db.prepare('SELECT answers_digest FROM chapter_test_reviews WHERE test_id=?').bind(row.id).first();return winner.answers_digest===asset.digest?json({ok:true,status:'reviewing'}):json({error:'另一份答卷已先提交'},409);
   }
   const result=gradeChapterPaper(paper,answers);
   const asset=await bucket.putContent(JSON.stringify({...result,answers,answerDigest,submittedAt:now}),'application/json');
   await db.prepare("UPDATE chapter_tests SET status='submitted',result_digest=?,submitted_at=?,updated_at=? WHERE id=? AND status='ready'").bind(asset.digest,now,now,row.id).run();const current=await db.prepare('SELECT result_digest FROM chapter_tests WHERE id=?').bind(row.id).first(),saved=await bucket.getContent(current.result_digest);if(!saved)return json({error:'答卷原件暂不可用'},503);const committed=await saved.json();return committed.answerDigest===answerDigest?json({ok:true,result:committed}):json({error:'另一份答卷已先提交'},409);
  }
 }
 return json({error:'没有此测试操作'},404);
 }catch(e){if(/原件暂不可用/.test(e.message))return json({error:e.message},503);if(/试卷必须|题目目标|选项与|答案键|试卷过大|请完成|听说题须|口头答案/.test(e.message))return json({error:e.message},422);throw e;}
}

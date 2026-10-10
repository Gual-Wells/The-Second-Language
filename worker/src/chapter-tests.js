import {chapterText,permanentBucket} from './storage.js';
import {chapterTestTargets,validateChapterPaper,gradeChapterPaper,chapterTestPolicy} from '../../protocol/chapter-test-contract.mjs';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}}),uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v),sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function source(env,row){const c=await env.DB.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(row.chapter_id,row.chapter_digest).first();if(!c)throw Error('原版章节不存在');const markdown=env.ONEDRIVE_ENABLED==='true'?await chapterText(env,c.content_key):await env.CHAPTERS.get(c.content_key);if(!markdown||await sha(markdown)!==row.chapter_digest)throw Error('原版章节暂不可核对');return{id:c.chapter_id,digest:c.digest,title:c.title,markdown};}
export async function claimChapterTest(env,claim,bucket=permanentBucket(env)){
 const db=env.DB,now=Date.now();await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题被中断，可重新处理',updated_at=? WHERE status='running' AND lease_until<?").bind(now,now).run();
 const r=await db.prepare("UPDATE chapter_tests SET status='running',claim=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=(SELECT id FROM chapter_tests WHERE status='pending' ORDER BY created_at LIMIT 1) AND status='pending' RETURNING *").bind(await sha(claim),now+300000,now).first();if(!r)return null;
 try{const chapter=await source(env,r),targets=await chapterTestTargets(chapter.markdown,r.seed);return{kind:'chapter-test',id:r.id,seed:r.seed,chapter,targets};}catch(e){await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='原版章节暂不可核对',updated_at=? WHERE id=? AND claim=?").bind(now,r.id,r.claim).run();throw e;}
}
export async function chapterTestsRoute(request,env,context,bucket=permanentBucket(env)){
 const {isPublisher,session,sameOrigin}=context,url=new URL(request.url),path=url.pathname.replace('/api/chapter-tests',''),db=env.DB,now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从阅读器提交'},403);
 let b={};if(request.method!=='GET'){try{const raw=await request.text();if(raw.length>100000)throw Error();b=JSON.parse(raw);if(!b||typeof b!=='object')throw Error();}catch{return json({error:'请求格式无效'},400);}}
 try{
 if(path==='/capabilities'&&request.method==='GET')return json({policy:chapterTestPolicy,testing:true,certification:false,coin:false});
 if(path===''&&request.method==='GET'){const {results}=await db.prepare('SELECT id,chapter_id AS chapterId,chapter_digest AS digest,status,created_at AS createdAt,submitted_at AS submittedAt,error FROM chapter_tests WHERE chapter_id=? ORDER BY created_at DESC LIMIT 50').bind(url.searchParams.get('chapter')).all();return json({tests:results});}
 if(path===''&&request.method==='POST'){
  if(!uuid(b.id)||typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest||''))return json({error:'章节申请无效'},400);
  const old=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(b.id).first();if(old)return old.chapter_id===b.chapterId&&old.chapter_digest===b.digest?json({ok:true,id:old.id,reused:true}):json({error:'申请编号已被使用'},409);
  const chapter=await db.prepare('SELECT r.digest FROM chapter_revisions r JOIN published_chapters p ON p.chapter_id=r.chapter_id WHERE r.chapter_id=? AND r.digest=?').bind(b.chapterId,b.digest).first();if(!chapter)return json({error:'正式章节版本不存在'},404);
  const inserted=await db.prepare("INSERT OR IGNORE INTO chapter_tests(id,chapter_id,chapter_digest,seed,created_at,updated_at) VALUES(?,?,?,?,?,?)").bind(b.id,b.chapterId,b.digest,crypto.randomUUID(),now,now).run();const winner=await db.prepare('SELECT chapter_id,chapter_digest FROM chapter_tests WHERE id=?').bind(b.id).first();return winner.chapter_id===b.chapterId&&winner.chapter_digest===b.digest?json({ok:true,id:b.id,reused:!inserted.meta.changes},inserted.meta.changes?201:200):json({error:'申请编号已被使用'},409);
 }
 if(path==='/jobs/claim'&&request.method==='POST'&&isPublisher){if(!/^[a-f0-9]{64}$/.test(b.claim||''))return json({error:'处理身份无效'},400);return json({job:await claimChapterTest(env,b.claim,bucket)});}
 const job=path.match(/^\/jobs\/([a-f0-9-]{36})\/(heartbeat|complete|fail)$/);
 if(job&&request.method==='POST'){
  if(!isPublisher)return json({error:'处理身份无效'},403);const row=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(job[1]).first();if(!row)return json({error:'申请不存在'},404);
  if(job[2]==='complete'&&['ready','submitted'].includes(row.status))return json({ok:true,reused:true});
  if(row.status!=='running'||row.claim!==await sha(String(b.claim||''))||row.lease_until<now)return json({error:'处理权已失效'},409);
  if(job[2]==='heartbeat'){await db.prepare('UPDATE chapter_tests SET lease_until=? WHERE id=? AND claim=?').bind(now+300000,row.id,row.claim).run();return json({ok:true});}
  if(job[2]==='fail'){await db.prepare("UPDATE chapter_tests SET status='failed',claim=NULL,error='出题暂未完成，可重新处理',updated_at=? WHERE id=? AND claim=?").bind(now,row.id,row.claim).run();return json({ok:true});}
  const chapter=await source(env,row),targets=await chapterTestTargets(chapter.markdown,row.seed),paper=validateChapterPaper(b.paper,chapter.markdown,targets),asset=await bucket.putContent(JSON.stringify({...paper,chapter:{id:chapter.id,digest:chapter.digest,title:chapter.title},seed:row.seed}),'application/json');
  const result=await db.prepare("UPDATE chapter_tests SET status='ready',paper_digest=?,claim=NULL,error=NULL,updated_at=? WHERE id=? AND status='running' AND claim=? AND lease_until>=?").bind(asset.digest,now,row.id,row.claim,Date.now()).run();return result.meta.changes?json({ok:true}):json({error:'处理权已失效'},409);
 }
 const match=path.match(/^\/([a-f0-9-]{36})(\/(submit|retry))?$/);if(match){
  const row=await db.prepare('SELECT * FROM chapter_tests WHERE id=?').bind(match[1]).first();if(!row)return json({error:'测试不存在'},404);
  if(match[3]==='retry'&&request.method==='POST'){const r=await db.prepare("UPDATE chapter_tests SET status='pending',claim=NULL,error=NULL,updated_at=? WHERE id=? AND status='failed'").bind(now,row.id).run();return r.meta.changes?json({ok:true}):json({error:'此测试无需重新处理'},409);}
  if(!match[2]&&request.method==='GET'){
   let paper=null,result=null;if(row.paper_digest){const stored=await bucket.getContent(row.paper_digest);if(!stored)return json({error:'试卷原件暂不可用'},503);paper=await stored.json();}if(row.result_digest){const stored=await bucket.getContent(row.result_digest);if(!stored)return json({error:'答卷原件暂不可用'},503);result=await stored.json();}
   return json({id:row.id,chapterId:row.chapter_id,digest:row.chapter_digest,status:row.status,createdAt:row.created_at,submittedAt:row.submitted_at,error:row.error,chapter:paper?.chapter,items:paper?.items.map(({id,type,prompt,options})=>({id,type,prompt,options:options.map(({id,text})=>({id,text}))}))||[],result});
  }
  if(match[3]==='submit'&&request.method==='POST'){
   if(!['ready','submitted'].includes(row.status))return json({error:'试卷尚未准备好'},409);
   const stored=await bucket.getContent(row.paper_digest);if(!stored)return json({error:'试卷原件暂不可用'},503);const paper=await stored.json(),result=gradeChapterPaper(paper,b.answers),answers=Object.fromEntries(paper.items.map(q=>[q.id,Array.isArray(b.answers[q.id])?[...b.answers[q.id]].sort():b.answers[q.id]])),answerDigest=await sha(JSON.stringify(answers));
   if(row.result_digest){const saved=await bucket.getContent(row.result_digest);if(!saved)return json({error:'答卷原件暂不可用'},503);const prior=await saved.json();return prior.answerDigest===answerDigest?json({ok:true,reused:true,result:prior}):json({error:'已提交答卷不能改写，请重新申请测试'},409);}
   const asset=await bucket.putContent(JSON.stringify({...result,answers,answerDigest,submittedAt:now}),'application/json');
   await db.prepare("UPDATE chapter_tests SET status='submitted',result_digest=?,submitted_at=?,updated_at=? WHERE id=? AND status='ready'").bind(asset.digest,now,now,row.id).run();const current=await db.prepare('SELECT result_digest FROM chapter_tests WHERE id=?').bind(row.id).first(),saved=await bucket.getContent(current.result_digest);if(!saved)return json({error:'答卷原件暂不可用'},503);const committed=await saved.json();return committed.answerDigest===answerDigest?json({ok:true,result:committed}):json({error:'另一份答卷已先提交'},409);
  }
 }
 return json({error:'没有此测试操作'},404);
 }catch(e){if(/试卷必须|题目目标|选项与|答案键|试卷过大|请完成/.test(e.message))return json({error:e.message},422);throw e;}
}

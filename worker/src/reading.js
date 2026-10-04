import {examSpec} from '../../web/exam-spec.js';
import {safe,text,publicObjective,validateCoverage,visibleVisual} from './objective.js';
import {gradeListening} from './listening.js';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
export function validateReading(passages,sources,profile){
 const spec=examSpec('reading',profile),ids=new Set(),questions=new Set();let number=1,words=0;
 if(!Array.isArray(passages)||passages.length!==3)throw Error('阅读须保留三篇完整文章');
 const out=passages.map((p,i)=>{
  if(!safe(p.id)||ids.has(p.id)||!text(p.title,180)||!text(p.instructions,3000)||!Array.isArray(p.paragraphs)||p.paragraphs.length<3||!Array.isArray(p.questions)||!Array.isArray(p.keys)||p.keys.length!==p.questions.length||!Array.isArray(p.links)||!p.links.length||p.links.some(l=>!sources.includes(l.chapterId)||l.useId&&!/^U\d{3}(?:_\d{3})?$/.test(l.useId)))throw Error('阅读材料、题目或来源结构无效');ids.add(p.id);
  const paragraphs=new Set();for(const para of p.paragraphs){if(!safe(para.id)||paragraphs.has(para.id)||!text(para.label,20)||!text(para.text,15000)||!text(para.translation,18000))throw Error('原文段落须有唯一编号、标签及连续译文');paragraphs.add(para.id);words+=para.text.trim().split(/\s+/).length;}
  let marks=0;const groups=new Map();
  for(const [j,q]of p.questions.entries()){
   const k=p.keys[j],count=q.type==='multi'?q.answerCount:1;
   if(!safe(q.id)||questions.has(q.id)||!['gap','single','multi','matching','diagram'].includes(q.type)||!text(q.prompt,4000)||!Number.isInteger(count)||count<1||count>3||q.number!==number||k.id!==q.id||!Array.isArray(k.accepted)||!k.accepted.length||k.accepted.some(a=>!text(a,200))||!text(k.explanation,4000)||!Array.isArray(k.evidence)||!k.evidence.length||k.evidence.some(e=>!paragraphs.has(e)))throw Error('阅读小题、计分空位或证据无效');questions.add(q.id);
   if(q.type==='gap'&&(!Number.isInteger(q.maxWords)||q.maxWords<1||q.maxWords>4))throw Error('填空须明确词数限制');
   if(q.type!=='gap'&&(!Array.isArray(q.options)||q.options.length<2||q.options.some(o=>!safe(o.id)||!text(o.text,700))||new Set(q.options.map(o=>o.id)).size!==q.options.length||k.accepted.some(a=>!q.options.some(o=>o.id===a))))throw Error('阅读选项或答案不对应');
   if(q.type==='multi'&&new Set(k.accepted).size!==count)throw Error('多选计分空位不对应');
   if(q.type==='gap'&&q.family!=='short-answer'){const original=p.paragraphs.map(x=>x.text).join(' ').toLowerCase();if(k.accepted.some(a=>!original.includes(a.toLowerCase())))throw Error('原文取词填空的允许答案须实际存在于原文');}
   if(q.family==='matching-headings'){const used=groups.get(q.groupId)||new Set();if(k.accepted.some(a=>used.has(a)))throw Error('同一标题题组不重复使用标题');for(const a of k.accepted)used.add(a);groups.set(q.groupId,used);}
   number+=count;marks+=count;
  }
  if(profile==='mini'?marks!==spec.counts[i]:marks<10||marks>15)throw Error(`阅读第 ${i+1} 篇须 ${spec.counts[i]} 个计分空位`);
  return{...p,visual:visibleVisual(p.visual),questions:p.questions.map(q=>({...publicObjective(q),difficulty:q.difficulty,difficultyReason:q.difficultyReason}))};
 });
 if(number-1!==spec.total)throw Error('阅读总题量与申请不符');
 if(profile==='full'&&(words<2150||words>2750)||profile==='mini'&&(words<1400||words>1900))throw Error('阅读总长度与题量规格不符');
 validateCoverage(passages,'reading',profile);return out;
}
export async function readingView(db,setId){
 const {results:rows}=await db.prepare('SELECT * FROM reading_passages WHERE set_id=? ORDER BY position').bind(setId).all(),set=await db.prepare('SELECT profiles_json FROM practice_sets WHERE id=?').bind(setId).first();
 const {results:attempts}=await db.prepare('SELECT * FROM reading_attempts WHERE set_id=? ORDER BY submitted_at DESC').bind(setId).all();
 return{profile:JSON.parse(set?.profiles_json||'{}').reading||'full',passages:rows.map(r=>({id:r.id,title:r.title,instructions:r.instructions,paragraphs:JSON.parse(r.paragraphs_json).map(({id,label,text})=>({id,label,text})),questions:JSON.parse(r.questions_json).map(publicObjective),visual:JSON.parse(r.visual_json),links:JSON.parse(r.links_json)})),attempts:attempts.map(a=>({id:a.id,sessionId:a.session_id,status:a.status,result:JSON.parse(a.result_json),conditions:JSON.parse(a.conditions_json),review:a.review_json?JSON.parse(a.review_json):null,submittedAt:a.submitted_at}))};
}
export async function readingRoute(request,env,{session,sameOrigin,isPublisher}){
 const path=new URL(request.url).pathname,db=env.PRACTICE_DB;if(!path.includes('/reading/'))return null;
 const load=async id=>{const {results}=await db.prepare('SELECT * FROM reading_passages WHERE set_id=? ORDER BY position').bind(id).all();return results.map(r=>({id:r.id,title:r.title,paragraphs:JSON.parse(r.paragraphs_json),questions:JSON.parse(r.questions_json),keys:JSON.parse(r.keys_json),links:JSON.parse(r.links_json)}));};
 const start=path.match(/^\/api\/practice\/sets\/([A-Za-z0-9._:-]+)\/reading\/sessions$/);
 if(start&&request.method==='POST'){
  if(!session||!sameOrigin)return json({error:'来源不允许'},403);const b=await request.json();if(!safe(b.id)||!['test','review'].includes(b.mode))return json({error:'作答条件无效'},400);
  const set=await db.prepare('SELECT profiles_json FROM practice_sets WHERE id=?').bind(start[1]).first();if(!set||(await load(start[1])).length!==3)return json({error:'阅读尚未发布'},404);
  const old=await db.prepare('SELECT * FROM reading_sessions WHERE id=?').bind(b.id).first();if(old){if(old.set_id!==start[1]||old.mode!==b.mode)return json({error:'尝试编号已固定'},409);return json({id:old.id,startedAt:old.started_at,progress:JSON.parse(old.progress_json),submitted:!!old.submitted_at});}
  const profile=JSON.parse(set.profiles_json).reading||'full',seen=!!await db.prepare('SELECT 1 FROM reading_attempts WHERE set_id=? LIMIT 1').bind(start[1]).first(),at=Date.now(),progress={previouslyCompleted:seen,profile,deadline:at+examSpec('reading',profile).minutes*60000};
  await db.prepare('INSERT INTO reading_sessions(id,set_id,mode,started_at,updated_at,progress_json,assisted) VALUES(?,?,?,?,?,?,?)').bind(b.id,start[1],b.mode,at,at,JSON.stringify(progress),b.mode==='review'||seen?1:0).run();return json({id:b.id,startedAt:at,progress,submitted:false});
 }
 const action=path.match(/^\/api\/practice\/reading\/sessions\/([A-Za-z0-9._:-]+)\/(progress|reveal|submit)$/);
 if(action&&request.method==='POST'){
  if(!session||!sameOrigin)return json({error:'来源不允许'},403);const b=await request.json(),row=await db.prepare('SELECT * FROM reading_sessions WHERE id=?').bind(action[1]).first();if(!row)return json({error:'尝试不存在'},404);
  const previous=JSON.parse(row.progress_json),passages=await load(row.set_id);
  if(action[2]==='progress'){if(row.submitted_at)return json({error:'已提交不可改写'},409);if(JSON.stringify(b).length>24000||!Number.isInteger(b.passage)||b.passage<0||b.passage>2||!Number.isFinite(b.position)||b.position<0||b.position>100000)return json({error:'进度无效'},400);const progress={...b,profile:previous.profile,deadline:previous.deadline,previouslyCompleted:previous.previouslyCompleted,interrupted:previous.interrupted===true||b.interrupted===true,scriptSeen:previous.scriptSeen===true};await db.prepare('UPDATE reading_sessions SET progress_json=?,updated_at=? WHERE id=?').bind(JSON.stringify(progress),Date.now(),row.id).run();return json({saved:true});}
  if(action[2]==='reveal'){if(!row.submitted_at&&row.mode==='test')return json({error:'请先提交；提前查看请另开精读尝试'},409);if(!row.submitted_at)await db.prepare('UPDATE reading_sessions SET assisted=1,progress_json=?,updated_at=? WHERE id=?').bind(JSON.stringify({...previous,scriptSeen:true}),Date.now(),row.id).run();return json({passages});}
  const old=await db.prepare('SELECT * FROM reading_attempts WHERE session_id=?').bind(row.id).first();if(old)return json({id:old.id,result:JSON.parse(old.result_json),conditions:JSON.parse(old.conditions_json),reused:true});
  if(!safe(b.id)||!b.answers||typeof b.answers!=='object'||Array.isArray(b.answers)||JSON.stringify(b.answers).length>12000||Object.values(b.answers).some(a=>typeof a==='string'?a.length>200:!Array.isArray(a)||a.length>3||a.some(x=>typeof x!=='string'||x.length>110)))return json({error:'逐题答案无效'},400);
  const result=gradeListening(passages,b.answers),at=Date.now(),conditions={mode:row.mode,profile:previous.profile,interrupted:previous.interrupted===true,scriptSeen:previous.scriptSeen===true,previouslyCompleted:previous.previouslyCompleted,assisted:!!row.assisted,startedAt:row.started_at,submittedAt:at,deadline:previous.deadline,overtime:row.mode==='test'&&at>previous.deadline};
  await db.batch([db.prepare("INSERT INTO reading_attempts(id,session_id,set_id,answer_json,result_json,conditions_json,status,submitted_at) VALUES(?,?,?,?,?,?,'pending',?)").bind(b.id,row.id,row.set_id,JSON.stringify(b.answers),JSON.stringify(result),JSON.stringify(conditions),at),db.prepare('UPDATE reading_sessions SET submitted_at=?,updated_at=? WHERE id=?').bind(at,at,row.id)]);return json({id:b.id,result,conditions});
 }
 if(path==='/api/practice/publisher/reading/next'&&request.method==='GET'){if(!isPublisher)return json({error:'身份无效'},401);const r=await db.prepare("SELECT id FROM reading_attempts WHERE status='pending' OR (status='reviewing' AND claim_at<?) ORDER BY submitted_at LIMIT 1").bind(Date.now()-7200000).first();return json({attemptId:r?.id||null});}
 if(path==='/api/practice/publisher/reading/claim'&&request.method==='POST'){
  if(!isPublisher)return json({error:'身份无效'},401);const r=await db.prepare("SELECT * FROM reading_attempts WHERE status='pending' OR (status='reviewing' AND claim_at<?) ORDER BY submitted_at LIMIT 1").bind(Date.now()-7200000).first();if(!r)return json({attempt:null});const token=crypto.randomUUID(),at=Date.now(),changed=await db.prepare("UPDATE reading_attempts SET status='reviewing',claim_token=?,claim_at=? WHERE id=? AND (status='pending' OR (status='reviewing' AND claim_at<?))").bind(token,at,r.id,at-7200000).run();if(!changed.meta.changes)return json({attempt:null});const source=await db.prepare('SELECT r.source_json,r.focus_chapter_id FROM practice_requests r JOIN practice_sets s ON s.request_id=r.id WHERE s.id=?').bind(r.set_id).first();return json({claimToken:token,attempt:{id:r.id,setId:r.set_id,answers:JSON.parse(r.answer_json),result:JSON.parse(r.result_json),conditions:JSON.parse(r.conditions_json),passages:await load(r.set_id),sources:JSON.parse(source.source_json),focusChapterId:source.focus_chapter_id}});
 }
 if(path==='/api/practice/publisher/reading/complete'&&request.method==='POST'){if(!isPublisher)return json({error:'身份无效'},401);const b=await request.json();if(!safe(b.id)||!safe(b.claimToken)||!text(b.review?.summary,3000)||!Array.isArray(b.review?.priorities)||b.review.priorities.some(x=>!text(x,1500))||!text(b.review?.nextStep,3000)||JSON.stringify(b.review).length>18000)return json({error:'反馈格式无效'},400);const r=await db.prepare('SELECT status,claim_token FROM reading_attempts WHERE id=?').bind(b.id).first();if(r?.status==='reviewed')return json({ok:true,reused:true});if(!r||r.claim_token!==b.claimToken)return json({error:'领取身份无效'},409);await db.prepare("UPDATE reading_attempts SET status='reviewed',review_json=?,reviewed_at=?,claim_token=NULL,claim_at=NULL WHERE id=? AND claim_token=?").bind(JSON.stringify(b.review),Date.now(),b.id,b.claimToken).run();return json({ok:true});}
 return json({error:'阅读接口不存在'},404);
}

import {examSpec} from '../../web/exam-spec.js';
import {publicObjective,validateCoverage,visibleVisual} from './objective.js';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const safe=x=>typeof x==='string'&&/^[A-Za-z0-9._:-]{1,110}$/.test(x);
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
export const normalAnswer=x=>String(x??'').normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ');
export function validateListening(passages,sources,profile='full',strict=false){
 const spec=examSpec('listening',profile);
 if(!Array.isArray(passages)||passages.length!==4)throw Error('听力须保持四种完整情境');
 const ids=new Set(),numbers=[],allQuestionIds=new Set();
 for(const [i,p]of passages.entries()){
  if(!safe(p.id)||ids.has(p.id)||!safe(p.audioId)||!text(p.title,180)||!text(p.instructions,2000)||!Array.isArray(p.script)||!p.script.length||!Array.isArray(p.questions)||!Array.isArray(p.keys)||p.keys.length!==p.questions.length||!Array.isArray(p.links)||!p.links.length)throw Error(`听力 Part ${i+1} 结构无效`);ids.add(p.id);
  if(p.links.some(l=>!sources.includes(l.chapterId)||l.useId&&!/^U\d{3}(?:_\d{3})?$/.test(l.useId)))throw Error('听力来源不在申请快照内');
  const segs=new Set(),speakers=new Set();let lastEnd=0;
  for(const s of p.script){if(!safe(s.id)||segs.has(s.id)||!text(s.speaker,80)||!text(s.text,8000)||!text(s.translation,8000)||!Number.isFinite(s.start)||!Number.isFinite(s.end)||s.start<lastEnd||s.end<=s.start)throw Error('脚本须有唯一发言编码、译文及核实后的有序时间');segs.add(s.id);speakers.add(s.speaker);lastEnd=s.end;}
  if([0,2].includes(i)&&speakers.size<2||[1,3].includes(i)&&speakers.size!==1)throw Error('听力人物数量不符：Part 1/3 对话，Part 2/4 单人讲话');
  if(p.questions.some(q=>q.type==='diagram')){
   const v=p.visual;if(!v||!text(v.title,300)||!Number.isFinite(v.width)||!Number.isFinite(v.height)||v.width<200||v.width>1200||v.height<150||v.height>1200||!Array.isArray(v.areas)||!v.areas.length||v.areas.length>40||v.areas.some(a=>!safe(a.id)||!text(a.label,100)||![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.x<0||a.y<0||a.width<1||a.height<1||a.x+a.width>v.width||a.y+a.height>v.height)||!Array.isArray(v.routes)||v.routes.some(r=>!Array.isArray(r.points)||r.points.length<2||r.points.length>100||r.points.some(pt=>!Array.isArray(pt)||pt.length!==2||!pt.every(Number.isFinite)||pt[0]<0||pt[0]>v.width||pt[1]<0||pt[1]>v.height)))throw Error('图示题需有可核对的结构化地图或图示');
  }
  let marks=0,lastEvidence=-1;const qids=new Set();
  for(const [j,q]of p.questions.entries()){
   const k=p.keys[j],count=q.type==='multi'?q.answerCount:1;
   if(!safe(q.id)||qids.has(q.id)||!['gap','single','multi','matching','diagram'].includes(q.type)||!text(q.prompt,2500)||!Number.isInteger(count)||count<1||count>3||!Number.isInteger(q.number)||q.number!==spec.counts.slice(0,i).reduce((a,b)=>a+b,0)+marks+1||k.id!==q.id||!Array.isArray(k.accepted)||!k.accepted.length||k.accepted.some(a=>!text(a,200))||!text(k.explanation,4000)||!Array.isArray(k.evidence)||!k.evidence.length||k.evidence.some(e=>!segs.has(e)))throw Error('题号、答案键或证据无效');
   if(allQuestionIds.has(q.id))throw Error('小题编码须在整套听力内唯一');allQuestionIds.add(q.id);
   qids.add(q.id);const evidence=p.script.findIndex(s=>s.id===k.evidence[0]);if(evidence<lastEvidence)throw Error('听力答案证据须按题号顺序出现');lastEvidence=evidence;
   if(q.type==='gap'&&(!Number.isInteger(q.maxWords)||q.maxWords<1||q.maxWords>4))throw Error('填空需明确词数上限');
   if(q.type!=='gap'&&(!Array.isArray(q.options)||q.options.length<2||q.options.some(o=>!safe(o.id)||!text(o.text,600))||new Set(q.options.map(o=>o.id)).size!==q.options.length||k.accepted.some(a=>!q.options.some(o=>o.id===a))))throw Error('选项及答案对应无效');
   if(q.type==='multi'&&(new Set(k.accepted).size!==count))throw Error('多选答案需精确对应计分空位');
   for(let n=0;n<count;n++)numbers.push(q.number+n);marks+=count;
  }
  if(marks!==spec.counts[i])throw Error(`Part ${i+1} 须 ${spec.counts[i]} 个计分空位`);
 }
 if(numbers.length!==spec.total)throw Error('听力题量与申请规格不符');
 if(strict)validateCoverage(passages,'listening',profile);
 return passages.map(p=>({...p,visual:visibleVisual(p.visual),questions:p.questions.map(q=>({...publicObjective(q),difficulty:q.difficulty,difficultyReason:q.difficultyReason}))}));
}
export function gradeListening(passages,answers){
 const results=[];let correct=0,total=0;
 for(const p of passages)for(const [i,q]of p.questions.entries()){
  const k=p.keys[i],raw=answers[q.id]??'',count=q.type==='multi'?q.answerCount:1;let score=0,reason='答案不符';
  if(q.type==='multi'){const a=Array.isArray(raw)?raw:[],unique=new Set(a);score=a.length===count&&unique.size===count?a.filter(x=>k.accepted.includes(x)).length:0;reason=score===count?'正确':'选择数量或选项不符';}
  else if(q.type==='gap'){const normalized=normalAnswer(raw),words=normalized?normalized.split(' '):[],numberCount=words.filter(w=>/^\d+(?:[.,:]\d+)*$/.test(w)).length;
   const within=q.numberOnly?numberCount===1&&words.length===1:q.allowNumber?words.length-numberCount<=q.maxWords&&numberCount<=1:words.length<=q.maxWords;
   score=within&&k.accepted.some(a=>normalAnswer(a)===normalized)?1:0;reason=!within?'超出题目字数限制':score?'正确':'拼写、词形或内容不符';
  }else{score=k.accepted.includes(raw)?1:0;reason=score?'正确':'选项不符';}
  correct+=score;total+=count;results.push({id:q.id,number:q.number,raw,score,total:count,reason,accepted:k.accepted,explanation:k.explanation,evidence:k.evidence,passageId:p.id});
 }
 return{correct,total,items:results};
}
export async function listeningView(db,setId){
 const {results:rows}=await db.prepare('SELECT * FROM listening_passages WHERE set_id=? ORDER BY position').bind(setId).all();
 const {results:attempts}=await db.prepare('SELECT id,session_id AS sessionId,status,result_json,conditions_json,review_json,submitted_at AS submittedAt FROM listening_attempts WHERE set_id=? ORDER BY submitted_at DESC').bind(setId).all();
 const set=await db.prepare('SELECT profiles_json FROM practice_sets WHERE id=?').bind(setId).first();
 return{profile:JSON.parse(set?.profiles_json||'{}').listening||'full',passages:rows.map(r=>({id:r.id,position:r.position,title:r.title,instructions:r.instructions,audioId:r.audio_id,questions:JSON.parse(r.questions_json).map(publicObjective),visual:JSON.parse(r.visual_json||'null'),links:JSON.parse(r.links_json)})),attempts:attempts.map(a=>({id:a.id,sessionId:a.sessionId,status:a.status,result:JSON.parse(a.result_json),conditions:JSON.parse(a.conditions_json),review:a.review_json?JSON.parse(a.review_json):null,submittedAt:a.submittedAt}))};
}
export async function listeningRoute(request,env,{session,sameOrigin,isPublisher}){
 const path=new URL(request.url).pathname,db=env.PRACTICE_DB;
 if(!path.includes('/listening/'))return null;
 const load=async setId=>{const {results}=await db.prepare('SELECT * FROM listening_passages WHERE set_id=? ORDER BY position').bind(setId).all();return results.map(r=>({id:r.id,title:r.title,audioId:r.audio_id,script:JSON.parse(r.script_json),questions:JSON.parse(r.questions_json),keys:JSON.parse(r.keys_json)}));};
 const start=path.match(/^\/api\/practice\/sets\/([A-Za-z0-9._:-]+)\/listening\/sessions$/);
 if(start&&request.method==='POST'){
  if(!session||!sameOrigin)return json({error:'来源不允许'},403);const b=await request.json();
  if(!safe(b.id)||!['test','review'].includes(b.mode))return json({error:'练习条件无效'},400);
  const p=await load(start[1]);if(p.length!==4)return json({error:'听力尚未发布'},409);
  const old=await db.prepare('SELECT * FROM listening_sessions WHERE id=?').bind(b.id).first();if(old){if(old.set_id!==start[1]||old.mode!==b.mode)return json({error:'尝试编号已固定'},409);return json({id:old.id,startedAt:old.started_at,progress:JSON.parse(old.progress_json),submitted:!!old.submitted_at,assisted:!!old.assisted});}
  const seen=await db.prepare('SELECT 1 FROM listening_attempts WHERE set_id=? LIMIT 1').bind(start[1]).first(),at=Date.now(),progress={previouslyCompleted:!!seen};await db.prepare('INSERT INTO listening_sessions(id,set_id,mode,started_at,updated_at,assisted,progress_json) VALUES(?,?,?,?,?,?,?)').bind(b.id,start[1],b.mode,at,at,b.mode==='review'||seen?1:0,JSON.stringify(progress)).run();return json({id:b.id,startedAt:at,progress,submitted:false,assisted:b.mode==='review'||!!seen});
 }
 const action=path.match(/^\/api\/practice\/listening\/sessions\/([A-Za-z0-9._:-]+)\/(progress|reveal|submit)$/);
 if(action&&request.method==='POST'){
  if(!session||!sameOrigin)return json({error:'来源不允许'},403);
  const row=await db.prepare('SELECT * FROM listening_sessions WHERE id=?').bind(action[1]).first();if(!row)return json({error:'尝试不存在'},404);
  const b=await request.json(),passages=await load(row.set_id),previous=JSON.parse(row.progress_json);
  if(action[2]==='progress'){
   if(row.submitted_at)return json({error:'已提交尝试不可改写'},409);
   if(JSON.stringify(b).length>24000||!Number.isFinite(b.position)||b.position<0||b.position>1200||!Number.isInteger(b.passage)||b.passage<0||b.passage>3)return json({error:'播放进度无效'},400);
   const progress={...b,previouslyCompleted:previous.previouslyCompleted===true,interrupted:previous.interrupted===true||b.interrupted===true,scriptSeen:previous.scriptSeen===true};
   await db.prepare('UPDATE listening_sessions SET progress_json=?,updated_at=?,assisted=MAX(assisted,?) WHERE id=?').bind(JSON.stringify(progress),Date.now(),b.assisted===true?1:0,row.id).run();return json({saved:true});
  }
  if(action[2]==='reveal'){
   if(!row.submitted_at&&row.mode==='test')return json({error:'请先提交；查看原文请另开精听尝试'},409);
   if(!row.submitted_at)await db.prepare('UPDATE listening_sessions SET assisted=1,progress_json=?,updated_at=? WHERE id=?').bind(JSON.stringify({...previous,scriptSeen:true}),Date.now(),row.id).run();
   return json({passages:passages.map(p=>({id:p.id,script:p.script,keys:p.keys}))});
  }
  const old=await db.prepare('SELECT * FROM listening_attempts WHERE session_id=?').bind(row.id).first();if(old)return json({id:old.id,result:JSON.parse(old.result_json),conditions:JSON.parse(old.conditions_json),reused:true});
  if(!safe(b.id)||!b.answers||typeof b.answers!=='object'||Array.isArray(b.answers)||JSON.stringify(b.answers).length>12000||Object.values(b.answers).some(a=>typeof a!=='string'&&!Array.isArray(a)||typeof a==='string'&&a.length>200||Array.isArray(a)&&(a.length>3||a.some(x=>typeof x!=='string'||x.length>110))))return json({error:'逐题作答格式无效'},400);
  const result=gradeListening(passages,b.answers),conditions={mode:row.mode,assisted:!!row.assisted,previouslyCompleted:previous.previouslyCompleted===true,interrupted:previous.interrupted===true,scriptSeen:previous.scriptSeen===true,startedAt:row.started_at,submittedAt:Date.now(),profile:JSON.parse((await db.prepare('SELECT profiles_json FROM practice_sets WHERE id=?').bind(row.set_id).first()).profiles_json).listening||'full',audioIds:passages.map(p=>p.audioId)};
  await db.batch([db.prepare("INSERT INTO listening_attempts(id,session_id,set_id,answer_json,result_json,conditions_json,status,submitted_at) VALUES(?,?,?,?,?,?,'pending',?)").bind(b.id,row.id,row.set_id,JSON.stringify(b.answers),JSON.stringify(result),JSON.stringify(conditions),conditions.submittedAt),db.prepare('UPDATE listening_sessions SET submitted_at=?,updated_at=? WHERE id=?').bind(conditions.submittedAt,conditions.submittedAt,row.id)]);return json({id:b.id,result,conditions});
 }
 if(path==='/api/practice/publisher/listening/next'&&request.method==='GET'){
  if(!isPublisher)return json({error:'发布身份无效'},401);const r=await db.prepare("SELECT id FROM listening_attempts WHERE status='pending' OR (status='reviewing' AND claim_at<?) ORDER BY submitted_at LIMIT 1").bind(Date.now()-7200000).first();return json({attemptId:r?.id||null});
 }
 if(path==='/api/practice/publisher/listening/claim'&&request.method==='POST'){
  if(!isPublisher)return json({error:'发布身份无效'},401);const row=await db.prepare("SELECT * FROM listening_attempts WHERE status='pending' OR (status='reviewing' AND claim_at<?) ORDER BY submitted_at LIMIT 1").bind(Date.now()-7200000).first();if(!row)return json({attempt:null});
  const token=crypto.randomUUID(),changed=await db.prepare("UPDATE listening_attempts SET status='reviewing',claim_token=?,claim_at=? WHERE id=? AND (status='pending' OR (status='reviewing' AND claim_at<?))").bind(token,Date.now(),row.id,Date.now()-7200000).run();if(!changed.meta.changes)return json({attempt:null});
  const sources=await db.prepare('SELECT r.source_json,r.focus_chapter_id FROM practice_requests r JOIN practice_sets s ON s.request_id=r.id WHERE s.id=?').bind(row.set_id).first();
  return json({claimToken:token,attempt:{id:row.id,setId:row.set_id,answers:JSON.parse(row.answer_json),result:JSON.parse(row.result_json),conditions:JSON.parse(row.conditions_json),passages:await load(row.set_id),sources:JSON.parse(sources.source_json),focusChapterId:sources.focus_chapter_id}});
 }
 if(path==='/api/practice/publisher/listening/complete'&&request.method==='POST'){
  if(!isPublisher)return json({error:'发布身份无效'},401);const b=await request.json();if(!safe(b.id)||!safe(b.claimToken)||!text(b.review?.summary,3000)||!Array.isArray(b.review?.priorities)||b.review.priorities.some(x=>!text(x,1500))||!text(b.review?.nextStep,3000)||JSON.stringify(b.review).length>18000)return json({error:'教学反馈无效'},400);
  const r=await db.prepare('SELECT status,claim_token FROM listening_attempts WHERE id=?').bind(b.id).first();if(r?.status==='reviewed')return json({ok:true,reused:true});if(!r||r.claim_token!==b.claimToken)return json({error:'领取身份无效'},409);
  await db.prepare("UPDATE listening_attempts SET status='reviewed',review_json=?,reviewed_at=?,claim_token=NULL,claim_at=NULL WHERE id=? AND claim_token=?").bind(JSON.stringify(b.review),Date.now(),b.id,b.claimToken).run();return json({ok:true});
 }
 return json({error:'听力接口不存在'},404);
}

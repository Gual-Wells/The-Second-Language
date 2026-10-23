import {CURRENT_AFFAIRS_POLICY,isCurrentAffairsRevision} from './current-affairs.js';

// Expressions are fixed identifiers supplied by this application's SQL, never
// user input. The practice database keeps a scope flag only for new snapshots.
export const currentPracticeSetSql=expression=>`EXISTS(SELECT 1 FROM practice_requests scope_request WHERE scope_request.source_policy='${CURRENT_AFFAIRS_POLICY}' AND (EXISTS(SELECT 1 FROM practice_sets scope_set WHERE scope_set.request_id=scope_request.id AND scope_set.id=${expression}) OR (scope_request.set_id=${expression} AND NOT EXISTS(SELECT 1 FROM practice_sets fixed_scope_set WHERE fixed_scope_set.id=${expression}))))`;
export const currentPracticeQuestionSql=expression=>`EXISTS(SELECT 1 FROM practice_questions scope_question JOIN practice_sets scope_set ON scope_set.id=scope_question.set_id JOIN practice_requests scope_request ON scope_request.id=scope_set.request_id WHERE scope_request.source_policy='${CURRENT_AFFAIRS_POLICY}' AND scope_question.id=${expression})`;
export const isCurrentPracticeSet=(db,id)=>db.prepare(`SELECT 1 WHERE ${currentPracticeSetSql('?')}`).bind(id,id,id).first().then(Boolean);
export const isCurrentPracticeQuestion=(db,id)=>db.prepare(`SELECT 1 WHERE ${currentPracticeQuestionSql('?')}`).bind(id).first().then(Boolean);

// Run before subroutes consume binary bodies or start paid calls. Historical
// GET/HEAD paths do not pass here and retain their original fixed snapshots.
export async function practiceWriteScope(request,env){
 if(['GET','HEAD'].includes(request.method))return null;
 const url=new URL(request.url),path=url.pathname,db=env.PRACTICE_DB;
 let scope=null,match;
 const body=async()=>{try{return await request.clone().json();}catch{return{};}};
 const attemptQuestion=async(table,id)=>db.prepare(`SELECT question_id FROM ${table} WHERE id=?`).bind(id).first();
 const setOf=async(table,id)=>db.prepare(`SELECT set_id FROM ${table} WHERE id=?`).bind(id).first();
 if((match=path.match(/^\/api\/practice\/questions\/([^/]+)\/(?:prompt|reveal|attempts|speaking\/audio)$/)))scope=await isCurrentPracticeQuestion(db,decodeURIComponent(match[1]));
 else if((match=path.match(/^\/api\/practice\/sets\/([^/]+)\/(?:listening|reading)\/sessions$/)))scope=await isCurrentPracticeSet(db,decodeURIComponent(match[1]));
 else if((match=path.match(/^\/api\/practice\/(listening|reading)\/sessions\/([^/]+)\/(?:progress|reveal|submit)$/))){const row=await setOf(match[1]+'_sessions',decodeURIComponent(match[2]));scope=!!row&&await isCurrentPracticeSet(db,row.set_id);}
 else if(/^\/api\/practice\/publisher\/(?:claim|fail|sets)$/.test(path)){const b=await body(),id=path.endsWith('/sets')?b.requestId:b.id;scope=!!await db.prepare('SELECT 1 FROM practice_requests WHERE id=? AND source_policy=?').bind(id||'',CURRENT_AFFAIRS_POLICY).first();}
 else if(path.endsWith('/synthesize')){const b=await body();scope=b.requestId?!!await db.prepare('SELECT 1 FROM practice_requests WHERE id=? AND source_policy=?').bind(b.requestId,CURRENT_AFFAIRS_POLICY).first():await isCurrentPracticeSet(db,b.setId||'');}
 else if((match=path.match(/^\/api\/practice\/publisher\/media\/([^/]+)\/(upload|verify)$/))){const row=match[2]==='verify'?await setOf('practice_media',decodeURIComponent(match[1])):null;scope=await isCurrentPracticeSet(db,row?.set_id||url.searchParams.get('set')||'');}
 else if((match=path.match(/^\/api\/practice\/publisher\/(listening|reading)\/complete$/))){const b=await body(),row=await setOf(match[1]+'_attempts',b.id||'');scope=!!row&&await isCurrentPracticeSet(db,row.set_id);}
 else if(path==='/api/practice/publisher/review/complete'){const b=await body(),row=await attemptQuestion('practice_attempts',b.attemptId||'');scope=!!row&&await isCurrentPracticeQuestion(db,row.question_id);}
 else if((match=path.match(/^\/api\/practice\/publisher\/speaking\/([^/]+)\/prepare$/))){const row=await attemptQuestion('speaking_attempts',decodeURIComponent(match[1]));scope=!!row&&await isCurrentPracticeQuestion(db,row.question_id);}
 else if(/^\/api\/practice\/publisher\/speaking\/(?:complete|details|retry-credit)$/.test(path)){const b=await body();let id=path.endsWith('/complete')?b.id:b.attemptId;if(path.endsWith('/retry-credit'))id=(await db.prepare('SELECT attempt_id FROM speaking_jobs WHERE id=?').bind(b.jobId||'').first())?.attempt_id;const row=await attemptQuestion('speaking_attempts',id||'');scope=!!row&&await isCurrentPracticeQuestion(db,row.question_id);}
 else if(path==='/api/practice/pronunciation'){const b=await body();if(b.chapterId)scope=await isCurrentAffairsRevision(env.DB,b.chapterId,b.digest);}
 return scope===false?Response.json({error:'旧章节及其练习已封存，只保留历史读取；不再创建或处理新结果'},{status:409,headers:{'cache-control':'no-store'}}):null;
}

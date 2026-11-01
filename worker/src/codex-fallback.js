const projectQuestion="EXISTS(SELECT 1 FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1' WHERE m.id=chapter_question_jobs.id)";
export function codexFallbackEnabled(env){return env.CODEX_FALLBACK_ENABLED==='true';}
export async function queueQuestionCodexFallback(env,{id,apiAttempt,apiOutcomeUnknown=false,reason,allowPending=false,now=Date.now()}){
 if(!codexFallbackEnabled(env))return false;
 const metadata=JSON.stringify({schemaVersion:1,from:'cloud-v1',apiAttempt:String(apiAttempt),apiOutcomeUnknown:Boolean(apiOutcomeUnknown),at:now,reason});
 const changed=await env.DB.prepare(`UPDATE chapter_question_jobs SET execution_route='legacy',status='pending',claim=NULL,lease_until=NULL,error=NULL,codex_fallback_json=?,updated_at=?
  WHERE id=? AND execution_route='cloud-v1' AND attempts=? AND status IN (${allowPending?"'pending','failed'":"'failed'"}) AND codex_fallback_json IS NULL AND ${projectQuestion}
  AND NOT EXISTS(SELECT 1 FROM chapter_messages WHERE reply_to=chapter_question_jobs.id AND role='assistant')`).bind(metadata,now,id,apiAttempt).run();
 return Boolean(changed.meta.changes);
}
export async function handoffFailedCloudQuestion(env){
 if(!codexFallbackEnabled(env))return false;
 const row=await env.DB.prepare(`SELECT j.id,j.attempts,r.outcome FROM chapter_question_jobs j
  JOIN chapter_messages m ON m.id=j.id JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1'
  LEFT JOIN api_cloud_runs r ON r.project='second-language' AND r.task=j.id AND r.attempt=CAST(j.attempts AS TEXT)
  WHERE j.execution_route='cloud-v1' AND j.status='failed' AND j.codex_fallback_json IS NULL AND (r.outcome IS NULL OR r.outcome<>'completed' OR j.error LIKE '%答复格式无效%') ORDER BY j.updated_at LIMIT 1`).first();
 if(!row)return false;return queueQuestionCodexFallback(env,{id:row.id,apiAttempt:row.attempts,apiOutcomeUnknown:['sending','unknown'].includes(row.outcome),reason:row.outcome==='rejected'?'api-rejected':'api-unavailable'});
}
export async function questionFallbackStatus(env){
 if(!codexFallbackEnabled(env))return{pending:false,pendingCount:0,activeCount:0};
 const row=await env.DB.prepare(`SELECT SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) pending,SUM(CASE WHEN status='running' THEN 1 ELSE 0 END) active FROM chapter_question_jobs WHERE execution_route='legacy' AND codex_fallback_json IS NOT NULL AND ${projectQuestion}`).first();
 return{pending:Boolean(row?.pending),pendingCount:Number(row?.pending||0),activeCount:Number(row?.active||0)};
}

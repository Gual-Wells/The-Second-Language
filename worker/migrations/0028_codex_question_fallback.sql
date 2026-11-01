-- Keep the original API attempt/unknown receipt. Local Codex takes an
-- independent claim on the existing legacy route; no provider attempt resets.
ALTER TABLE chapter_question_jobs ADD COLUMN codex_fallback_json TEXT;
CREATE INDEX chapter_question_codex_fallback ON chapter_question_jobs(status,updated_at)
 WHERE execution_route='legacy' AND codex_fallback_json IS NOT NULL;
-- Previously failed API work can use the independent Codex subscription. Paid
-- completed replies keep their original cloud recovery path; never resend API.
UPDATE chapter_question_jobs SET codex_fallback_json=json_object('schemaVersion',1,'from','cloud-v1','apiAttempt',CAST(attempts AS TEXT),'apiOutcomeUnknown',json(CASE WHEN EXISTS(SELECT 1 FROM api_cloud_runs r WHERE r.project='second-language' AND r.task=chapter_question_jobs.id AND r.attempt=CAST(chapter_question_jobs.attempts AS TEXT) AND r.outcome IN ('sending','unknown')) THEN 'true' ELSE 'false' END),'at',CAST(strftime('%s','now') AS INTEGER)*1000,'reason','preexisting-api-failure'),execution_route='legacy',status='pending',claim=NULL,lease_until=NULL,error=NULL
 WHERE execution_route='cloud-v1' AND status='failed' AND NOT EXISTS(SELECT 1 FROM api_cloud_runs r WHERE r.project='second-language' AND r.task=chapter_question_jobs.id AND r.attempt=CAST(chapter_question_jobs.attempts AS TEXT) AND r.outcome='completed')
 AND EXISTS(SELECT 1 FROM chapter_messages m JOIN chapter_conversations c ON c.id=m.conversation_id JOIN formal_chapter_sources s ON s.digest=c.chapter_digest AND s.policy='current-affairs-v1' WHERE m.id=chapter_question_jobs.id)
 AND NOT EXISTS(SELECT 1 FROM chapter_messages WHERE reply_to=chapter_question_jobs.id AND role='assistant');

-- Existing requests retain their original executor and local send/result records.
ALTER TABLE chapter_question_jobs ADD COLUMN execution_route TEXT NOT NULL DEFAULT 'legacy'
  CHECK(execution_route IN ('legacy','cloud-v1'));
CREATE INDEX chapter_question_executor_queue ON chapter_question_jobs(execution_route,status,updated_at);

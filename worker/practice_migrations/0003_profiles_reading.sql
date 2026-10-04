ALTER TABLE practice_requests ADD COLUMN protocol_version TEXT NOT NULL DEFAULT 'legacy-v1';
ALTER TABLE practice_requests ADD COLUMN profiles_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE practice_sets ADD COLUMN profiles_json TEXT NOT NULL DEFAULT '{}';
CREATE TABLE reading_passages (
 id TEXT PRIMARY KEY,set_id TEXT NOT NULL REFERENCES practice_sets(id),position INTEGER NOT NULL,
 title TEXT NOT NULL,instructions TEXT NOT NULL,paragraphs_json TEXT NOT NULL,questions_json TEXT NOT NULL,
 keys_json TEXT NOT NULL,links_json TEXT NOT NULL,visual_json TEXT NOT NULL DEFAULT 'null',UNIQUE(set_id,position)
);
CREATE TABLE reading_sessions (
 id TEXT PRIMARY KEY,set_id TEXT NOT NULL REFERENCES practice_sets(id),mode TEXT NOT NULL CHECK(mode IN ('test','review')),
 started_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,progress_json TEXT NOT NULL DEFAULT '{}',
 assisted INTEGER NOT NULL DEFAULT 0,submitted_at INTEGER
);
CREATE TABLE reading_attempts (
 id TEXT PRIMARY KEY,session_id TEXT NOT NULL UNIQUE REFERENCES reading_sessions(id),set_id TEXT NOT NULL REFERENCES practice_sets(id),
 answer_json TEXT NOT NULL,result_json TEXT NOT NULL,conditions_json TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','reviewing','reviewed','failed')),
 claim_token TEXT,claim_at INTEGER,review_json TEXT,submitted_at INTEGER NOT NULL,reviewed_at INTEGER
);
CREATE INDEX reading_attempts_queue ON reading_attempts(status,submitted_at);

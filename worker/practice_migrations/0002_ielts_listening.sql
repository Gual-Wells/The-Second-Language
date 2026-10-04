ALTER TABLE practice_requests ADD COLUMN skills_json TEXT NOT NULL DEFAULT '["writing","speaking"]';
ALTER TABLE practice_sets ADD COLUMN format TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE practice_questions ADD COLUMN presentation_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE practice_attempts ADD COLUMN prompt_seen_before INTEGER NOT NULL DEFAULT 0;
CREATE TABLE practice_prompt_reveals (question_id TEXT PRIMARY KEY, revealed_at INTEGER NOT NULL);

CREATE TABLE practice_media (
 id TEXT PRIMARY KEY, set_id TEXT NOT NULL, digest TEXT NOT NULL, object_key TEXT NOT NULL,
 mime TEXT NOT NULL, bytes INTEGER NOT NULL, seconds REAL NOT NULL DEFAULT 0,
 state TEXT NOT NULL CHECK(state IN ('calling','ready','waiting_credit','failed','outcome_unknown')),
 request_json TEXT NOT NULL, response_json TEXT, next_retry_at INTEGER, created_at INTEGER NOT NULL
);
CREATE INDEX practice_media_set ON practice_media(set_id,state);

CREATE TABLE listening_passages (
 id TEXT PRIMARY KEY, set_id TEXT NOT NULL, position INTEGER NOT NULL,
 title TEXT NOT NULL, instructions TEXT NOT NULL, audio_id TEXT NOT NULL,
 script_json TEXT NOT NULL, questions_json TEXT NOT NULL, keys_json TEXT NOT NULL,
 links_json TEXT NOT NULL, visual_json TEXT NOT NULL DEFAULT 'null', UNIQUE(set_id,position),
 FOREIGN KEY(set_id) REFERENCES practice_sets(id)
);
CREATE TABLE listening_sessions (
 id TEXT PRIMARY KEY, set_id TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('test','review')),
 started_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, progress_json TEXT NOT NULL DEFAULT '{}',
 assisted INTEGER NOT NULL DEFAULT 0, submitted_at INTEGER,
 FOREIGN KEY(set_id) REFERENCES practice_sets(id)
);
CREATE INDEX listening_sessions_set ON listening_sessions(set_id,started_at);
CREATE TABLE listening_attempts (
 id TEXT PRIMARY KEY, session_id TEXT NOT NULL UNIQUE, set_id TEXT NOT NULL,
 answer_json TEXT NOT NULL, result_json TEXT NOT NULL, conditions_json TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','reviewing','reviewed','failed')),
 claim_token TEXT, claim_at INTEGER, review_json TEXT, submitted_at INTEGER NOT NULL, reviewed_at INTEGER,
 FOREIGN KEY(session_id) REFERENCES listening_sessions(id)
);
CREATE INDEX listening_attempts_queue ON listening_attempts(status,submitted_at);

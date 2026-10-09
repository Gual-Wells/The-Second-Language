-- Isolated experiment database. These are not formal chapter certificates.
CREATE TABLE IF NOT EXISTS lab_attempts(id TEXT PRIMARY KEY,chapter_id TEXT NOT NULL,seed TEXT NOT NULL,paper_json TEXT NOT NULL,answers_json TEXT,result_json TEXT,created_at INTEGER NOT NULL,submitted_at INTEGER);
CREATE TABLE IF NOT EXISTS lab_certificates(chapter_id TEXT PRIMARY KEY,attempt_id TEXT NOT NULL UNIQUE,created_at INTEGER NOT NULL,coin_seed TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lab_feedback(id TEXT PRIMARY KEY,content_json TEXT NOT NULL,created_at INTEGER NOT NULL);

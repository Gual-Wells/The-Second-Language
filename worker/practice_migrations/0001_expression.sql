CREATE TABLE IF NOT EXISTS practice_requests (
  id TEXT PRIMARY KEY,
  focus_chapter_id TEXT NOT NULL,
  focus_digest TEXT NOT NULL,
  source_json TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('queued','building','published','failed')),
  claim_token TEXT,
  claim_at INTEGER,
  set_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_requests_status ON practice_requests(status,created_at);

CREATE TABLE IF NOT EXISTS practice_sets (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  introduction TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(request_id) REFERENCES practice_requests(id)
);
CREATE TABLE IF NOT EXISTS practice_sources (
  set_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  digest TEXT NOT NULL,
  is_focus INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(set_id,chapter_id),
  FOREIGN KEY(set_id) REFERENCES practice_sets(id)
);
CREATE INDEX IF NOT EXISTS practice_sources_chapter ON practice_sources(chapter_id,set_id);

CREATE TABLE IF NOT EXISTS practice_questions (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('speaking','writing')),
  part TEXT NOT NULL CHECK (part IN ('speaking-1','speaking-2','speaking-3','writing-1','writing-2')),
  prompt TEXT NOT NULL,
  guidance TEXT NOT NULL DEFAULT '',
  reference_answer TEXT NOT NULL,
  reference_notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  FOREIGN KEY(set_id) REFERENCES practice_sets(id)
);
CREATE INDEX IF NOT EXISTS practice_questions_set ON practice_questions(set_id,position);
CREATE TABLE IF NOT EXISTS practice_links (
  question_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  use_id TEXT NOT NULL DEFAULT '',
  PRIMARY KEY(question_id,chapter_id,use_id),
  FOREIGN KEY(question_id) REFERENCES practice_questions(id)
);
CREATE INDEX IF NOT EXISTS practice_links_source ON practice_links(chapter_id,use_id,question_id);

CREATE TABLE IF NOT EXISTS practice_reveals (
  question_id TEXT PRIMARY KEY,
  revealed_at INTEGER NOT NULL,
  before_attempt INTEGER NOT NULL,
  FOREIGN KEY(question_id) REFERENCES practice_questions(id)
);
CREATE TABLE IF NOT EXISTS practice_attempts (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  medium TEXT NOT NULL CHECK (medium IN ('written','speech-transcript')),
  reference_seen_before INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','reviewing','reviewed','failed')),
  claim_token TEXT,
  claim_at INTEGER,
  review_json TEXT,
  submitted_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  FOREIGN KEY(question_id) REFERENCES practice_questions(id)
);
CREATE INDEX IF NOT EXISTS practice_attempts_question ON practice_attempts(question_id,submitted_at);
CREATE INDEX IF NOT EXISTS practice_attempts_status ON practice_attempts(status,submitted_at);

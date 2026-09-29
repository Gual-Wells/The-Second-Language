CREATE TABLE IF NOT EXISTS auth_control (
  id INTEGER PRIMARY KEY CHECK (id = 1), epoch INTEGER NOT NULL DEFAULT 1, enrollment_until INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO auth_control (id, epoch, enrollment_until) VALUES (1, 1, 0);
CREATE TABLE IF NOT EXISTS auth_credential (
  id INTEGER PRIMARY KEY CHECK (id = 1), credential_id TEXT NOT NULL UNIQUE, public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0, transports TEXT NOT NULL DEFAULT '[]', created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS auth_challenges (
  ticket_hash TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK (kind IN ('enroll','login')),
  challenge TEXT NOT NULL, epoch INTEGER NOT NULL, expires_at INTEGER NOT NULL, used_at INTEGER
);
CREATE INDEX IF NOT EXISTS auth_challenges_expiry ON auth_challenges(expires_at);
CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash TEXT PRIMARY KEY, epoch INTEGER NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry ON auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS chapter_revisions (
  digest TEXT PRIMARY KEY, chapter_id TEXT NOT NULL, study_date TEXT NOT NULL, number TEXT NOT NULL,
  title TEXT NOT NULL, subtitle TEXT NOT NULL, word_count INTEGER NOT NULL,
  content_key TEXT NOT NULL, run_id TEXT NOT NULL, vix_commit TEXT NOT NULL,
  protocol_commit TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS chapter_revisions_date ON chapter_revisions(study_date);
CREATE TABLE IF NOT EXISTS published_chapters (
  chapter_id TEXT PRIMARY KEY, study_date TEXT NOT NULL UNIQUE, digest TEXT NOT NULL,
  published_at INTEGER NOT NULL, FOREIGN KEY(digest) REFERENCES chapter_revisions(digest)
);
CREATE TABLE IF NOT EXISTS daily_runs (
  run_id TEXT PRIMARY KEY, study_date TEXT NOT NULL UNIQUE, phase TEXT NOT NULL,
  selection_digest TEXT, vix_commit TEXT, chapter_digest TEXT,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reading_progress (
  chapter_id TEXT PRIMARY KEY, completed INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT, note TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS study_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1), goal TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT ''
);
INSERT OR IGNORE INTO study_settings (id, goal, updated_at) VALUES (1, '', '');
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY, endpoint TEXT NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS push_outbox (
  chapter_id TEXT NOT NULL, digest TEXT NOT NULL, subscription_id TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0, claim_at INTEGER, sent_at INTEGER,
  PRIMARY KEY (chapter_id, digest, subscription_id)
);

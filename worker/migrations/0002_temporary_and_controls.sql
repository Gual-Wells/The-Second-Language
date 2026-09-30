ALTER TABLE study_settings ADD COLUMN temporary_requested INTEGER NOT NULL DEFAULT 0;
ALTER TABLE study_settings ADD COLUMN temporary_request_text TEXT NOT NULL DEFAULT '';
ALTER TABLE study_settings ADD COLUMN temporary_request_id TEXT;
ALTER TABLE study_settings ADD COLUMN rest_requested INTEGER NOT NULL DEFAULT 0;
ALTER TABLE study_settings ADD COLUMN rest_revision INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS run_claims (
  run_id TEXT PRIMARY KEY,
  study_date TEXT NOT NULL UNIQUE,
  rest_requested INTEGER NOT NULL,
  rest_revision INTEGER NOT NULL,
  temporary_request_id TEXT,
  temporary_request_text TEXT NOT NULL DEFAULT '',
  claimed_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS temporary_pages (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('test','review')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL,
  digest TEXT NOT NULL,
  content_key TEXT NOT NULL,
  request_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS temporary_pages_expiry ON temporary_pages(expires_at);

CREATE TABLE IF NOT EXISTS temporary_push_outbox (
  page_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  claim_at INTEGER,
  sent_at INTEGER,
  PRIMARY KEY(page_id, subscription_id)
);

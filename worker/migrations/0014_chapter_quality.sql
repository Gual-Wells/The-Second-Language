CREATE TABLE IF NOT EXISTS chapter_quality_requests (
 id TEXT PRIMARY KEY,
 chapter_id TEXT NOT NULL,
 chapter_digest TEXT NOT NULL,
 policy_id TEXT NOT NULL,
 policy_digest TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','running','failed','completed')),
 claim TEXT,
 attempt_id TEXT,
 lease_until INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL,
 queued_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 checkpoint_digest TEXT,
 evidence_digest TEXT,
 report_digest TEXT,
 decision TEXT,
 stage TEXT NOT NULL DEFAULT 'evidence',
 completed INTEGER NOT NULL DEFAULT 0,
 expected INTEGER NOT NULL DEFAULT 0,
 error TEXT,
 FOREIGN KEY(chapter_digest) REFERENCES chapter_revisions(digest)
);
CREATE UNIQUE INDEX IF NOT EXISTS chapter_quality_active ON chapter_quality_requests(chapter_digest,policy_digest) WHERE status IN ('pending','running');
CREATE INDEX IF NOT EXISTS chapter_quality_queue ON chapter_quality_requests(status,queued_at);

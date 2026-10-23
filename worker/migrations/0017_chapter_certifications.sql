-- Only tests requested after this migration can issue a first-pass event.
-- Existing results remain untouched; no retrospective certificates are created.
ALTER TABLE chapter_tests ADD COLUMN certification_eligible INTEGER NOT NULL DEFAULT 0;
CREATE TABLE chapter_certifications (
 id TEXT PRIMARY KEY,
 recipient_id TEXT NOT NULL,
 recipient_name TEXT NOT NULL,
 chapter_id TEXT NOT NULL,
 chapter_digest TEXT NOT NULL,
 chapter_number TEXT NOT NULL,
 chapter_title TEXT NOT NULL,
 attempt_id TEXT NOT NULL UNIQUE REFERENCES chapter_tests(id),
 assessment_version TEXT NOT NULL,
 paper_digest TEXT NOT NULL,
 result_digest TEXT NOT NULL,
 passed_at INTEGER NOT NULL,
 UNIQUE(recipient_id,chapter_id)
);
CREATE TRIGGER chapter_certifications_no_update BEFORE UPDATE ON chapter_certifications
 BEGIN SELECT RAISE(ABORT,'first-pass records are immutable'); END;
CREATE TRIGGER chapter_certifications_no_delete BEFORE DELETE ON chapter_certifications
 BEGIN SELECT RAISE(ABORT,'first-pass records are permanent'); END;
CREATE TABLE scroll_jobs (
 id TEXT PRIMARY KEY,
 certification_id TEXT NOT NULL UNIQUE REFERENCES chapter_certifications(id),
 recipient_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','running','attention','failed','complete')),
 stage TEXT NOT NULL DEFAULT 'source',
 claim TEXT,lease_until INTEGER,attempts INTEGER NOT NULL DEFAULT 0,
 checkpoint_digest TEXT,manifest_digest TEXT,content_sha TEXT,
 created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,ready_at INTEGER,claimed_at INTEGER,
 error TEXT
);
CREATE INDEX scroll_jobs_queue ON scroll_jobs(status,created_at);
CREATE TABLE scroll_requests (
 request_id TEXT PRIMARY KEY,
 certification_id TEXT NOT NULL REFERENCES chapter_certifications(id),
 job_id TEXT NOT NULL REFERENCES scroll_jobs(id),
 created_at INTEGER NOT NULL
);
CREATE TABLE scroll_external_calls (
 job_id TEXT NOT NULL REFERENCES scroll_jobs(id),
 stage TEXT NOT NULL,input_digest TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('calling','complete','failed','outcome_unknown','retry_authorized')),
 provider_id TEXT,output_digest TEXT,authorization_digest TEXT,
 created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,
 PRIMARY KEY(job_id,stage,input_digest)
);
CREATE UNIQUE INDEX scroll_external_calls_one_active ON scroll_external_calls(job_id,stage) WHERE state IN ('calling','outcome_unknown');
CREATE TABLE scroll_recovery_bases (
 manifest_digest TEXT PRIMARY KEY,registered_at INTEGER NOT NULL
);
CREATE TABLE scroll_base_verified (
 base_digest TEXT NOT NULL,asset_digest TEXT NOT NULL,verified_at INTEGER NOT NULL,
 PRIMARY KEY(base_digest,asset_digest)
);
CREATE TABLE scroll_package_verified (
 job_id TEXT NOT NULL REFERENCES scroll_jobs(id),manifest_digest TEXT NOT NULL,asset_digest TEXT NOT NULL,
 bytes INTEGER NOT NULL,width INTEGER,height INTEGER,verified_at INTEGER NOT NULL,
 PRIMARY KEY(job_id,manifest_digest,asset_digest)
);

-- Reserved speaking facilities. Not applied by the existing practice migration command.
-- Apply only when private storage and the reader upload flow are provisioned.
CREATE TABLE IF NOT EXISTS speaking_attempts (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES practice_questions(id),
  question_snapshot_key TEXT NOT NULL,
  original_audio_key TEXT NOT NULL,
  original_digest TEXT NOT NULL,
  reference_seen_before INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK(status IN ('preparing','collecting','waiting_credit','ready','reviewing','reviewed','needs_attention')),
  confirmed_transcript_key TEXT,
  feedback_key TEXT,
  claim_token TEXT,
  claim_at INTEGER,
  submitted_at INTEGER NOT NULL,
  reviewed_at INTEGER
);
CREATE INDEX IF NOT EXISTS speaking_attempts_question ON speaking_attempts(question_id,submitted_at);
CREATE INDEX IF NOT EXISTS speaking_attempts_review ON speaking_attempts(status,submitted_at);

CREATE TABLE IF NOT EXISTS speaking_jobs (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES speaking_attempts(id),
  parent_job_id TEXT REFERENCES speaking_jobs(id),
  contract_version TEXT NOT NULL,
  contract_digest TEXT NOT NULL,
  contract_key TEXT NOT NULL,
  plan_key TEXT,
  plan_digest TEXT,
  audio_key TEXT NOT NULL,
  audio_digest TEXT NOT NULL,
  audio_seconds REAL NOT NULL CHECK(audio_seconds>0),
  audio_format TEXT NOT NULL CHECK(audio_format='wav'),
  status TEXT NOT NULL CHECK(status IN ('queued','running','waiting_credit','collected','needs_attention')),
  next_retry_at INTEGER,
  lease_token TEXT,
  lease_until INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS speaking_jobs_status ON speaking_jobs(status,created_at);
CREATE UNIQUE INDEX IF NOT EXISTS speaking_jobs_original ON speaking_jobs(attempt_id) WHERE parent_job_id IS NULL;

CREATE TABLE IF NOT EXISTS speaking_calls (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES speaking_jobs(id),
  provider TEXT NOT NULL,
  route_id TEXT NOT NULL,
  task_id TEXT NOT NULL DEFAULT 'baseline',
  reused_call_id TEXT REFERENCES speaking_calls(id),
  request_key TEXT NOT NULL,
  raw_key TEXT NOT NULL,
  metadata_key TEXT NOT NULL,
  parsed_key TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('calling','complete','needs_review','failed','outcome_unknown')),
  created_at INTEGER NOT NULL,
  completed_at INTEGER,
  cost_usd REAL,
  error_json TEXT
);
CREATE INDEX IF NOT EXISTS speaking_calls_job ON speaking_calls(job_id,provider,created_at);

CREATE TABLE IF NOT EXISTS speaking_feedback (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES speaking_attempts(id),
  job_id TEXT NOT NULL REFERENCES speaking_jobs(id),
  feedback_key TEXT NOT NULL,
  quality_scope TEXT NOT NULL,
  supersedes_id TEXT REFERENCES speaking_feedback(id),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS speaking_feedback_attempt ON speaking_feedback(attempt_id,created_at);

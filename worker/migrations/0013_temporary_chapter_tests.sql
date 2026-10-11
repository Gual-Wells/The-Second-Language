-- Disposable tests are excluded from permanent snapshots by their temporary_ prefix.
CREATE TABLE temporary_chapter_tests (
 id TEXT PRIMARY KEY, chapter_id TEXT NOT NULL, chapter_digest TEXT NOT NULL, seed TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','running','ready','failed','submitted')),
 claim TEXT, lease_until INTEGER, attempts INTEGER NOT NULL DEFAULT 0,
 paper_digest TEXT, result_digest TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
 submitted_at INTEGER, error TEXT, policy TEXT NOT NULL, is_validation INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX temporary_chapter_tests_queue ON temporary_chapter_tests(status,created_at);
CREATE TABLE temporary_chapter_test_recordings (
 id TEXT PRIMARY KEY, test_id TEXT NOT NULL REFERENCES temporary_chapter_tests(id), question_id TEXT NOT NULL,
 audio_digest TEXT NOT NULL, mime TEXT NOT NULL, created_at INTEGER NOT NULL,
 analysis_digest TEXT, transcript_digest TEXT, recognition_state TEXT NOT NULL DEFAULT 'new',
 supplement_digest TEXT, supplement_state TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX temporary_chapter_test_recordings_test ON temporary_chapter_test_recordings(test_id,question_id);
CREATE TABLE temporary_chapter_test_reviews (
 test_id TEXT PRIMARY KEY REFERENCES temporary_chapter_tests(id),
 state TEXT NOT NULL CHECK(state IN ('pending','running','attention','failed','complete')),
 answers_digest TEXT NOT NULL, interpretation_digest TEXT, claim TEXT, lease_until INTEGER,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX temporary_chapter_test_reviews_queue ON temporary_chapter_test_reviews(state,created_at);
CREATE TABLE temporary_test_pages (
 id TEXT PRIMARY KEY REFERENCES temporary_chapter_tests(id), title TEXT NOT NULL, subtitle TEXT NOT NULL,
 created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
);

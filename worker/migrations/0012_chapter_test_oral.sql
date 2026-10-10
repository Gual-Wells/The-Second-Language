-- Old papers retain their original sampling and grading policy.
ALTER TABLE chapter_tests ADD COLUMN policy TEXT NOT NULL DEFAULT 'chapter-understanding-v1';
ALTER TABLE chapter_tests ADD COLUMN is_validation INTEGER NOT NULL DEFAULT 0;
CREATE TABLE chapter_test_recordings (
 id TEXT PRIMARY KEY, test_id TEXT NOT NULL REFERENCES chapter_tests(id), question_id TEXT NOT NULL,
 audio_digest TEXT NOT NULL, mime TEXT NOT NULL, created_at INTEGER NOT NULL,
 analysis_digest TEXT, transcript_digest TEXT, recognition_state TEXT NOT NULL DEFAULT 'new',
 supplement_digest TEXT, supplement_state TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX chapter_test_recordings_test ON chapter_test_recordings(test_id,question_id);
CREATE TABLE chapter_test_reviews (
 test_id TEXT PRIMARY KEY REFERENCES chapter_tests(id),
 state TEXT NOT NULL CHECK(state IN ('pending','running','attention','failed','complete')),
 answers_digest TEXT NOT NULL, interpretation_digest TEXT,
 claim TEXT, lease_until INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX chapter_test_reviews_queue ON chapter_test_reviews(state,created_at);

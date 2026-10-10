CREATE TABLE chapter_tests (
 id TEXT PRIMARY KEY,
 chapter_id TEXT NOT NULL,
 chapter_digest TEXT NOT NULL,
 seed TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','running','ready','failed','submitted')),
 claim TEXT, lease_until INTEGER, attempts INTEGER NOT NULL DEFAULT 0,
 paper_digest TEXT, result_digest TEXT,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, submitted_at INTEGER,
 error TEXT
);
CREATE INDEX chapter_tests_chapter ON chapter_tests(chapter_id,created_at);
CREATE INDEX chapter_tests_queue ON chapter_tests(status,created_at);

-- Successful clips are immutable and exported incrementally. Pending/unknown calls
-- retain the existing state table and its billing protection.
CREATE TABLE pronunciation_results (
 id INTEGER PRIMARY KEY,
 generation_digest BLOB NOT NULL UNIQUE CHECK(length(generation_digest)=32),
 content_digest BLOB NOT NULL CHECK(length(content_digest)=32),
 record_digest BLOB NOT NULL CHECK(length(record_digest)=32),
 bytes INTEGER NOT NULL CHECK(bytes>0 AND bytes<=1048576),
 created_at INTEGER NOT NULL
);
CREATE TRIGGER pronunciation_results_no_update BEFORE UPDATE ON pronunciation_results
BEGIN SELECT RAISE(ABORT,'Successful pronunciation records are immutable'); END;
CREATE TRIGGER pronunciation_results_no_delete BEFORE DELETE ON pronunciation_results
BEGIN SELECT RAISE(ABORT,'Successful pronunciation records are immutable'); END;
CREATE TABLE chapter_audio_clips (
 chapter_id TEXT NOT NULL,
 chapter_digest TEXT NOT NULL,
 result_id INTEGER NOT NULL REFERENCES pronunciation_results(id),
 PRIMARY KEY(chapter_id,chapter_digest,result_id)
);

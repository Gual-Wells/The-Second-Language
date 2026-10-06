-- Store the chapter/version identity once, rather than repeating it for every clip.
CREATE TABLE chapter_audio_scopes (
 id INTEGER PRIMARY KEY,
 chapter_id TEXT NOT NULL,
 chapter_digest TEXT NOT NULL,
 UNIQUE(chapter_id,chapter_digest)
);
INSERT INTO chapter_audio_scopes(chapter_id,chapter_digest)
 SELECT DISTINCT chapter_id,chapter_digest FROM chapter_audio_clips;
CREATE TABLE chapter_audio_clips_compact (
 scope_id INTEGER NOT NULL REFERENCES chapter_audio_scopes(id),
 result_id INTEGER NOT NULL REFERENCES pronunciation_results(id),
 PRIMARY KEY(scope_id,result_id)
);
INSERT INTO chapter_audio_clips_compact
 SELECT s.id,c.result_id FROM chapter_audio_clips c JOIN chapter_audio_scopes s
 ON s.chapter_id=c.chapter_id AND s.chapter_digest=c.chapter_digest;
DROP TABLE chapter_audio_clips;
ALTER TABLE chapter_audio_clips_compact RENAME TO chapter_audio_clips;
CREATE TRIGGER chapter_audio_clips_no_update BEFORE UPDATE ON chapter_audio_clips
BEGIN SELECT RAISE(ABORT,'Successful chapter audio links are immutable'); END;
CREATE TRIGGER chapter_audio_clips_no_delete BEFORE DELETE ON chapter_audio_clips
BEGIN SELECT RAISE(ABORT,'Successful chapter audio links are immutable'); END;

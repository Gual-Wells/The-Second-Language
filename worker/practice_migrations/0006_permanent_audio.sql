ALTER TABLE pronunciation_audio ADD COLUMN audio_key TEXT;
CREATE TABLE chapter_pronunciation (chapter_id TEXT NOT NULL, chapter_digest TEXT NOT NULL, audio_id TEXT NOT NULL REFERENCES pronunciation_audio(id), PRIMARY KEY(chapter_id,chapter_digest,audio_id));

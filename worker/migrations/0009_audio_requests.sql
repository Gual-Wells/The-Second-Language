CREATE TABLE audio_next_config(id INTEGER PRIMARY KEY CHECK(id=1),parts TEXT NOT NULL DEFAULT '[]',revision INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL DEFAULT 0);
INSERT INTO audio_next_config(id) VALUES(1);
-- Plans and final reports live in permanent storage; one compact row per request.
CREATE TABLE audio_requests(id TEXT PRIMARY KEY,chapter_id TEXT NOT NULL,chapter_digest TEXT NOT NULL,parts TEXT NOT NULL,source TEXT NOT NULL,plan_key TEXT,state TEXT NOT NULL,created_at INTEGER NOT NULL,expires_at INTEGER,cursor INTEGER NOT NULL DEFAULT 0,total INTEGER NOT NULL DEFAULT 0,claim TEXT,lease_until INTEGER,error TEXT);
CREATE INDEX audio_requests_queue ON audio_requests(state,created_at);
CREATE UNIQUE INDEX audio_requests_next ON audio_requests(chapter_id) WHERE source='next';

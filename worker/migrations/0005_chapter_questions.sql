CREATE TABLE chapter_conversations (
 id TEXT PRIMARY KEY, chapter_id TEXT NOT NULL, chapter_digest TEXT NOT NULL REFERENCES chapter_revisions(digest),
 seen_seq INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL,
 UNIQUE(chapter_id, chapter_digest)
);
CREATE TABLE chapter_messages (
 seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL UNIQUE,
 conversation_id TEXT NOT NULL REFERENCES chapter_conversations(id),
 role TEXT NOT NULL CHECK(role IN ('user','assistant')), content TEXT NOT NULL,
 reply_to TEXT UNIQUE REFERENCES chapter_messages(id), created_at INTEGER NOT NULL
);
CREATE INDEX chapter_messages_thread ON chapter_messages(conversation_id,seq);
CREATE TABLE chapter_question_jobs (
 id TEXT PRIMARY KEY REFERENCES chapter_messages(id), status TEXT NOT NULL DEFAULT 'pending'
 CHECK(status IN ('pending','running','answered','failed')),
 claim TEXT, lease_until INTEGER, attempts INTEGER NOT NULL DEFAULT 0, error TEXT, updated_at INTEGER NOT NULL
);
CREATE INDEX chapter_question_queue ON chapter_question_jobs(status,updated_at);

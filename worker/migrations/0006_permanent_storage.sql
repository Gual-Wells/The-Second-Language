CREATE TABLE storage_connection (id INTEGER PRIMARY KEY CHECK(id=1), credentials TEXT NOT NULL, refresh_lock INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);
CREATE TABLE storage_folders (name TEXT PRIMARY KEY, item_id TEXT NOT NULL);
CREATE TABLE storage_blobs (digest TEXT PRIMARY KEY, item_id TEXT NOT NULL, bytes INTEGER NOT NULL, verified_at INTEGER NOT NULL);
CREATE TABLE storage_objects (object_key TEXT PRIMARY KEY, digest TEXT NOT NULL REFERENCES storage_blobs(digest), mime TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE storage_versions (object_key TEXT NOT NULL, digest TEXT NOT NULL REFERENCES storage_blobs(digest), mime TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY(object_key,digest));
CREATE TABLE chapter_audio_packs (chapter_id TEXT NOT NULL, chapter_digest TEXT NOT NULL, manifest_key TEXT NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY(chapter_id,chapter_digest));

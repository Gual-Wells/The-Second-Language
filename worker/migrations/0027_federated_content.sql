-- Project-local immutable verified pointers only. Pool definitions are shared by all its objects.
-- Ordinary rowid tables preserve existing rowidPages backup/recovery compatibility.
CREATE TABLE IF NOT EXISTS storage_remote_pools (
 id INTEGER PRIMARY KEY,
 provider TEXT NOT NULL CHECK(provider='huggingface-s3'),
 namespace TEXT NOT NULL CHECK(length(namespace)>0 AND length(namespace)<=96),
 bucket TEXT NOT NULL CHECK(length(bucket)>0 AND length(bucket)<=96),
 UNIQUE(provider,namespace,bucket)
);
CREATE TABLE IF NOT EXISTS storage_remote_content (
 id INTEGER PRIMARY KEY,
 digest BLOB NOT NULL UNIQUE CHECK(length(digest)=32),
 pool_id INTEGER NOT NULL REFERENCES storage_remote_pools(id),
 bytes INTEGER NOT NULL CHECK(bytes>=0 AND bytes<=25165824),
 verified_at INTEGER NOT NULL
);
CREATE TRIGGER IF NOT EXISTS storage_remote_pools_no_update BEFORE UPDATE ON storage_remote_pools
BEGIN SELECT RAISE(ABORT,'Verified permanent file pools are immutable'); END;
CREATE TRIGGER IF NOT EXISTS storage_remote_pools_no_delete BEFORE DELETE ON storage_remote_pools
BEGIN SELECT RAISE(ABORT,'Verified permanent file pools are immutable'); END;
CREATE TRIGGER IF NOT EXISTS storage_remote_content_no_update BEFORE UPDATE ON storage_remote_content
BEGIN SELECT RAISE(ABORT,'Verified permanent file locations are immutable'); END;
CREATE TRIGGER IF NOT EXISTS storage_remote_content_no_delete BEFORE DELETE ON storage_remote_content
BEGIN SELECT RAISE(ABORT,'Verified permanent file locations are immutable'); END;

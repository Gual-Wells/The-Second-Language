CREATE TABLE chapter_sources (
 digest TEXT PRIMARY KEY REFERENCES chapter_revisions(digest),
 source_digest TEXT NOT NULL CHECK(length(source_digest)=64 AND source_digest NOT GLOB '*[^0-9a-f]*'),
 source_key TEXT NOT NULL UNIQUE,
 policy TEXT NOT NULL CHECK(policy='current-affairs-v1'),
 created_at INTEGER NOT NULL
);
CREATE TRIGGER chapter_sources_immutable_update BEFORE UPDATE ON chapter_sources
BEGIN SELECT RAISE(ABORT,'chapter source binding is immutable'); END;
CREATE TRIGGER chapter_sources_immutable_delete BEFORE DELETE ON chapter_sources
BEGIN SELECT RAISE(ABORT,'chapter source binding is permanent'); END;

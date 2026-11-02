-- Additional admission, without rewriting any previous publication evidence.
CREATE TABLE chapter_fallback_appeals (
 chapter_digest TEXT PRIMARY KEY REFERENCES chapter_revisions(digest),
 source_digest TEXT NOT NULL,
 appeals_digest TEXT NOT NULL,
 validation_digest TEXT NOT NULL,
 policy TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE TRIGGER chapter_fallback_appeals_no_update BEFORE UPDATE ON chapter_fallback_appeals
BEGIN SELECT RAISE(ABORT,'fallback appeal binding is immutable'); END;
CREATE TRIGGER chapter_fallback_appeals_no_delete BEFORE DELETE ON chapter_fallback_appeals
BEGIN SELECT RAISE(ABORT,'fallback appeal binding is immutable'); END;

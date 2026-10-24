-- Explicit user-authorized withdrawal preserves immutable originals and paid assets.
CREATE TABLE chapter_withdrawals (
 digest TEXT PRIMARY KEY REFERENCES chapter_revisions(digest),
 chapter_id TEXT NOT NULL,
 run_id TEXT NOT NULL,
 selection_digest TEXT NOT NULL,
 vix_commit TEXT NOT NULL,
 withdrawn_at INTEGER NOT NULL,
 reason TEXT NOT NULL,
 snapshot_json TEXT NOT NULL
);
CREATE TRIGGER chapter_withdrawals_no_update BEFORE UPDATE ON chapter_withdrawals
BEGIN SELECT RAISE(ABORT,'withdrawal record is immutable'); END;
CREATE TRIGGER chapter_withdrawals_no_delete BEFORE DELETE ON chapter_withdrawals
BEGIN SELECT RAISE(ABORT,'withdrawal record is permanent'); END;
CREATE VIEW formal_chapter_sources AS SELECT s.* FROM chapter_sources s
 WHERE NOT EXISTS(SELECT 1 FROM chapter_withdrawals w WHERE w.digest=s.digest);
CREATE TRIGGER published_chapters_no_withdrawn_insert BEFORE INSERT ON published_chapters
 WHEN EXISTS(SELECT 1 FROM chapter_withdrawals WHERE digest=NEW.digest)
BEGIN SELECT RAISE(ABORT,'withdrawn chapter cannot be republished'); END;
CREATE TRIGGER published_chapters_no_withdrawn_update BEFORE UPDATE ON published_chapters
 WHEN EXISTS(SELECT 1 FROM chapter_withdrawals WHERE digest=NEW.digest)
BEGIN SELECT RAISE(ABORT,'withdrawn chapter cannot be republished'); END;
CREATE TRIGGER daily_runs_no_withdrawn_insert BEFORE INSERT ON daily_runs
 WHEN EXISTS(SELECT 1 FROM chapter_withdrawals w WHERE w.run_id=NEW.run_id
 AND (w.digest=NEW.chapter_digest OR w.selection_digest=NEW.selection_digest OR w.vix_commit=NEW.vix_commit))
BEGIN SELECT RAISE(ABORT,'withdrawn run cannot be replayed'); END;
CREATE TRIGGER daily_runs_no_withdrawn_update BEFORE UPDATE ON daily_runs
 WHEN EXISTS(SELECT 1 FROM chapter_withdrawals w WHERE w.run_id=NEW.run_id
 AND (w.digest=NEW.chapter_digest OR w.selection_digest=NEW.selection_digest OR w.vix_commit=NEW.vix_commit))
BEGIN SELECT RAISE(ABORT,'withdrawn run cannot be replayed'); END;

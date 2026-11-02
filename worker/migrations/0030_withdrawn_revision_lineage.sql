-- A withdrawal covers revisions produced from the withdrawn VIX marking.
-- Original objects and source bindings stay immutable. A legitimate replacement
-- with a fresh marking on the same date remains eligible; no wall-clock cutoff.
DROP VIEW formal_chapter_sources;
CREATE VIEW formal_chapter_sources AS
 SELECT s.* FROM chapter_sources s JOIN chapter_revisions r ON r.digest=s.digest
 WHERE NOT EXISTS (
  SELECT 1 FROM chapter_withdrawals w
  WHERE w.digest=s.digest OR (w.chapter_id=r.chapter_id AND w.vix_commit=r.vix_commit)
 );
DROP TRIGGER published_chapters_no_withdrawn_insert;
DROP TRIGGER published_chapters_no_withdrawn_update;
CREATE TRIGGER published_chapters_no_withdrawn_insert BEFORE INSERT ON published_chapters
 WHEN EXISTS (
  SELECT 1 FROM chapter_revisions r JOIN chapter_withdrawals w
   ON w.digest=r.digest OR (w.chapter_id=r.chapter_id AND w.vix_commit=r.vix_commit)
  WHERE r.digest=NEW.digest
 )
BEGIN SELECT RAISE(ABORT,'withdrawn chapter lineage cannot be republished'); END;
CREATE TRIGGER published_chapters_no_withdrawn_update BEFORE UPDATE ON published_chapters
 WHEN EXISTS (
  SELECT 1 FROM chapter_revisions r JOIN chapter_withdrawals w
   ON w.digest=r.digest OR (w.chapter_id=r.chapter_id AND w.vix_commit=r.vix_commit)
  WHERE r.digest=NEW.digest
 )
BEGIN SELECT RAISE(ABORT,'withdrawn chapter lineage cannot be republished'); END;

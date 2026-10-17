CREATE TABLE chapter_first_part_upgrades (
 id TEXT PRIMARY KEY,
 chapter_id TEXT NOT NULL,
 base_digest TEXT NOT NULL,
 target_digest TEXT NOT NULL,
 manifest_digest TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 UNIQUE(chapter_id,base_digest,target_digest)
);
CREATE INDEX chapter_first_part_upgrade_chapter ON chapter_first_part_upgrades(chapter_id);

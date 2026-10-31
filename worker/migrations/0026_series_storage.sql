-- Series allocation metadata only. No project database permissions or private content.
CREATE TABLE IF NOT EXISTS service_series_storage (
 resource_id TEXT PRIMARY KEY CHECK(resource_id IN (
  'cloudflare-d1-account','d1-language','d1-language-practice','d1-language-lab',
  'd1-algorithm','d1-schedule','d1-ledger','cloudflare-kv-account',
  'onedrive-account','hf-private-account','kaggle-private-account')),
 write_version INTEGER NOT NULL DEFAULT 1 CHECK(write_version>0),
 revision INTEGER NOT NULL DEFAULT -1 CHECK(revision>=-1),
 observed_at INTEGER,
 attempted_at INTEGER NOT NULL,
 snapshot_json TEXT CHECK(snapshot_json IS NULL OR (json_valid(snapshot_json) AND length(snapshot_json)<=4096)),
 failed INTEGER NOT NULL DEFAULT 0 CHECK(failed IN (0,1))
);

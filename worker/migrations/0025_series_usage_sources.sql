-- Aggregate metadata only. No question, receipt, image, answer or provider IDs.
CREATE TABLE IF NOT EXISTS service_openai_usage_sources (
 source TEXT PRIMARY KEY CHECK(source IN ('local-shared','cloud-language','cloud-algorithm','cloud-schedule','cloud-ledger')),
 revision INTEGER NOT NULL DEFAULT -1, checked_at INTEGER,
 snapshot_json TEXT, last_failure_at INTEGER
);

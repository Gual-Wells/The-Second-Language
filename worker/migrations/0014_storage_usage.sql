-- Latest successful capacity records; no file payloads or credentials.
CREATE TABLE storage_usage (
 pool TEXT PRIMARY KEY,
 report_json TEXT,
 checked_at INTEGER,
 attempted_at INTEGER NOT NULL,
 failed INTEGER NOT NULL DEFAULT 0
);

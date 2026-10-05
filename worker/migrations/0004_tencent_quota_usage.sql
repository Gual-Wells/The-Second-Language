CREATE TABLE IF NOT EXISTS service_quota_usage (
  id TEXT PRIMARY KEY,
  pool TEXT NOT NULL,
  units INTEGER,
  state TEXT NOT NULL,
  occurred_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS service_quota_usage_pool_time ON service_quota_usage(pool, occurred_at);

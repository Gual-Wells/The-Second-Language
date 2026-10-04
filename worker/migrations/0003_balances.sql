CREATE TABLE IF NOT EXISTS service_balances (
  pool TEXT PRIMARY KEY, snapshot_json TEXT NOT NULL, checked_at INTEGER NOT NULL,
  alerted INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS balance_push_outbox (
  id TEXT PRIMARY KEY, subscription_id TEXT NOT NULL, body TEXT NOT NULL,
  created_at INTEGER NOT NULL, sent_at INTEGER, claim_at INTEGER, attempts INTEGER NOT NULL DEFAULT 0
);

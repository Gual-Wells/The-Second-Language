-- Delivery metadata only. Answers and their fixed chapter versions stay permanent.
CREATE TABLE IF NOT EXISTS question_push_outbox (
  message_id TEXT NOT NULL, subscription_id TEXT NOT NULL, epoch INTEGER NOT NULL,
  created_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
  claim_at INTEGER, sent_at INTEGER,
  PRIMARY KEY(message_id, subscription_id)
);
CREATE INDEX IF NOT EXISTS question_push_pending ON question_push_outbox(sent_at,attempts,created_at);

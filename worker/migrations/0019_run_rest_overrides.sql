-- Original rest claims remain immutable evidence. An operator may record a
-- same-run resumption only after the user's explicit instruction.
CREATE TABLE run_rest_overrides (
  run_id TEXT PRIMARY KEY REFERENCES run_claims(run_id),
  original_claimed_at INTEGER NOT NULL,
  authorized_at INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK(length(trim(reason)) > 0)
);
CREATE TRIGGER run_rest_overrides_valid_claim BEFORE INSERT ON run_rest_overrides
WHEN NOT EXISTS(SELECT 1 FROM run_claims c WHERE c.run_id=NEW.run_id
  AND c.rest_requested=1 AND c.claimed_at=NEW.original_claimed_at
  AND NEW.authorized_at>=c.claimed_at)
BEGIN SELECT RAISE(ABORT, 'rest authorization must match the original rest claim'); END;
CREATE TRIGGER run_rest_overrides_no_update BEFORE UPDATE ON run_rest_overrides
BEGIN SELECT RAISE(ABORT, 'rest authorization is immutable'); END;
CREATE TRIGGER run_rest_overrides_no_delete BEFORE DELETE ON run_rest_overrides
BEGIN SELECT RAISE(ABORT, 'rest authorization is permanent'); END;

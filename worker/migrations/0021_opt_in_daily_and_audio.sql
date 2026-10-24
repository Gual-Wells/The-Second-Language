-- User decision 2026-10-25: rest and no pre-generated audio are the defaults.
-- Keep immutable claims, purchased audio, queues and frozen sources intact.
UPDATE study_settings SET rest_requested=1,rest_revision=rest_revision+1 WHERE id=1;
UPDATE audio_next_config SET parts='[]',revision=revision+1,
  updated_at=CAST(strftime('%s','now') AS INTEGER)*1000 WHERE id=1;

-- Consume an explicitly enabled next run atomically with its first claim.
-- INSERT OR IGNORE retries do not fire this trigger; later arrangements have
-- a different revision and cannot be consumed by an old claim.
CREATE TRIGGER run_claims_restore_rest_default AFTER INSERT ON run_claims
BEGIN
  UPDATE study_settings SET rest_requested=1
    WHERE id=1 AND rest_revision=NEW.rest_revision;
END;

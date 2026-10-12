-- User decision: daily chapters default to the two supported sentence categories.
-- Explicit next-chapter overrides are still consumed once, then return to full.
UPDATE audio_next_config SET parts='["two","three"]',revision=revision+1,updated_at=CAST(strftime('%s','now') AS INTEGER)*1000 WHERE id=1;

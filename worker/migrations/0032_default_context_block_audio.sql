-- User decision 2026-11-03: prepare complete example-context blocks after publication.
-- Only the future default changes; claims, old audio jobs and billing ledgers stay intact.
UPDATE audio_next_config SET parts='["contexts"]',revision=revision+1,
 updated_at=CAST(strftime('%s','now') AS INTEGER)*1000 WHERE id=1;

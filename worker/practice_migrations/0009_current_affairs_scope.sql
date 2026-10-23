ALTER TABLE practice_requests ADD COLUMN source_policy TEXT CHECK(source_policy IS NULL OR source_policy='current-affairs-v1');
CREATE INDEX practice_requests_source_scope ON practice_requests(source_policy,status,created_at);
CREATE TRIGGER practice_request_sources_immutable BEFORE UPDATE OF source_policy,source_json ON practice_requests
WHEN NEW.source_policy IS NOT OLD.source_policy OR NEW.source_json IS NOT OLD.source_json
BEGIN SELECT RAISE(ABORT,'practice source snapshot is immutable'); END;

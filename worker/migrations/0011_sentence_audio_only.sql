-- Retire word selection without deleting any purchased audio or job history.
UPDATE audio_next_config SET parts=json_remove(parts,'$['||(SELECT key FROM json_each(audio_next_config.parts) WHERE value='one' LIMIT 1)||']'),revision=revision+1 WHERE EXISTS(SELECT 1 FROM json_each(audio_next_config.parts) WHERE value='one');

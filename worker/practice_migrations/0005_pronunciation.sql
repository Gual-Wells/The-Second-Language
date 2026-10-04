-- Short, reproducible TTS clips only; original speaking recordings remain in private storage.
CREATE TABLE pronunciation_audio (
 id TEXT PRIMARY KEY, request_json TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('calling','ready','waiting_credit','failed','outcome_unknown')),
 audio BLOB, response_json TEXT, next_retry_at INTEGER, created_at INTEGER NOT NULL,
 CHECK(audio IS NULL OR length(audio)<=1048576)
);
CREATE TABLE practice_voice_roles (
 set_id TEXT NOT NULL, speaker_id TEXT NOT NULL, gender TEXT NOT NULL,
 voice TEXT NOT NULL, policy_version TEXT NOT NULL,
 PRIMARY KEY(set_id,speaker_id)
);

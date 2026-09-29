DELETE FROM auth_sessions;
DELETE FROM auth_challenges;
DELETE FROM auth_credential;
UPDATE auth_control SET epoch = epoch + 1, enrollment_until = 0 WHERE id = 1;

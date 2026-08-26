# Security

Security, authentication, session, credential, sensitive-data, signing, migration, and release tasks have a CRITICAL model/verification floor.

- Treat API responses, deep links, persisted data, clipboard input, and environment values as untrusted boundaries.
- Keep credentials in Expo SecureStore on native platforms. Never store them in MMKV, AsyncStorage, source control, logs, analytics, screenshots, or checkpoints.
- Redact authorization headers, personal data, and backend internals from errors.
- Make refresh/session transitions single-owner and finite; races or recursive 401 handling can invalidate or leak sessions.
- Use least privilege for Git remotes, signing, CI, and third-party integrations.
- Never commit `.env` values, private keys, access tokens, signing files, or production credentials. Git Flow performs a deterministic guard but does not replace secret scanning in CI.

Escalate missing product/security decisions when they materially change data retention, authentication guarantees, or destructive behavior.

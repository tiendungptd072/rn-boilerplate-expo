# State and storage

Use the narrowest owner:

- React state for local interaction state.
- Context for a bounded component subtree.
- TanStack Query for remote state and cache lifecycle.
- Zustand only for shared client-only state that outlives a component subtree.
- MMKV for fast, non-sensitive local persistence.
- Expo SecureStore for credentials, tokens, and secrets.

Do not mirror one source of truth across stores. Persist only data that must survive restart, version stored shapes, and validate data when reading it. Clear invalid or obsolete non-sensitive data safely. Security-sensitive migration or deletion requires a CRITICAL plan and explicit verification.

Web session behavior must account for the lack of native SecureStore; never fall back to localStorage for credentials without an explicit security decision.

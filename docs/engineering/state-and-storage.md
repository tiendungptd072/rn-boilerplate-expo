# State and storage

Choose the narrowest owner that matches the lifetime and sensitivity of the data.

## Decision table

| Data | Owner |
| --- | --- |
| Local component interaction | React state |
| State shared within a subtree | React context |
| Remote/server state | TanStack Query |
| Cross-tree client-only state | Zustand |
| Non-sensitive preferences | MMKV through `src/lib/storage` |
| Credentials and session secrets | SecureStore through `src/lib/auth` |

Do not add a global store until local state or feature context no longer fits. Do not duplicate server state in Zustand when Query already owns it.

## Persistence

- Persist only data required across launches.
- Version stored shapes and provide a migration or safe reset before changing them.
- Validate persisted values before use and fall back safely when corrupted or stale.
- Keep storage keys stable, namespaced, and owned by one module.
- Define cleanup for logout, account switching, and feature removal.

`preferencesStorage` is for values such as theme and language. It must never contain tokens, credentials, or sensitive personal data.

Native session data uses SecureStore. Web sessions currently remain in memory until a backend-managed secure cookie flow exists; do not introduce local-storage token persistence as a shortcut.

## TanStack Query

The shared Query client owns connectivity, focus, caching, and retry defaults. Features own query keys and invalidation. Persisting Query cache requires an explicit retention, schema migration, account isolation, encryption, and logout design.

## Zustand

Keep stores feature-owned, small, and action-oriented. Export selectors rather than encouraging whole-store subscriptions. Avoid async transport logic inside stores when a Query or feature service owns it.

## Verification

Storage changes should test invalid data, missing values, migration/reset behavior, account switching, logout cleanup, and platform differences. Sensitive storage changes also require [Security](security.md) review.

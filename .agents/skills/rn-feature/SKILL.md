---
name: rn-feature
description: Implement a new Expo React Native screen, route, component, or product capability.
---

# React Native feature

Use when the task adds user-visible behavior. Do not use for isolated fixes or internal refactors.

1. Read the route-selected owner docs; for UI include `docs/design-system.md` and `docs/engineering/i18n-accessibility.md`.
2. Find the nearest existing feature and reuse its route, state, data, loading, error, and test patterns.
3. Define the smallest typed UI/data boundary. Keep Expo Router files thin.
4. Implement loading, empty, error, offline, accessibility, and reduced-motion behavior when applicable.
5. Add the smallest regression test and verify both platforms when behavior can differ.

Complete when acceptance behavior works, invalid states are guarded, focused verification passes, and the scoped diff has no unrelated refactor.

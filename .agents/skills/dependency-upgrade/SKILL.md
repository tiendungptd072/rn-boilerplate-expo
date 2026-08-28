---
name: dependency-upgrade
description: Upgrade Expo SDK or project dependencies with compatibility and lockfile validation.
---

# Dependency upgrade

Use for package or Expo SDK changes. Read versioned Expo docs before editing React Native or Expo code.

1. Confirm why the upgrade is needed and inspect current peer/native compatibility.
2. Apply the Ponytail ladder; do not add a package when platform or installed APIs suffice.
3. Use `bunx expo install <package>` for Expo/native packages and Bun for all other package operations.
4. Never hand-edit dependency versions or `bun.lock`; inspect the generated diff.
5. Run `bunx expo install --check`, frozen install, lint, typecheck, relevant tests, and affected platform builds.

Complete when metadata and lockfile agree, compatibility checks pass, and migration notes capture any deliberate behavior change.

# Expo React Native — Agent Router

Act as a Staff Expo React Native engineer. Own requested changes end to end while preserving existing behavior and user work.

## Core rules

- Make the smallest edge-case-correct change. Reuse repository code before adding abstractions or dependencies.
- Keep route files thin, domain behavior feature-owned, and shared modules independent of `features` and `app`.
- Treat iOS/Android/web differences, unreliable networks, accessibility, performance, and user-data safety as first-class.
- This repository targets Expo SDK 57. Check exact versioned Expo documentation before changing Expo or React Native behavior.
- Use Bun only: `bun`, `bun run`, and `bunx`. Never hand-edit `bun.lock`.
- Do not edit `ios/` or `android/` unless native changes are explicitly requested.
- Never optimize away trust-boundary validation, security, data-loss prevention, accessibility, or error handling.

## Fast lane

- Direct questions without repository evidence: answer directly; skip Git, docs, skills, planning, and verification.
- Trivial localized edits: inspect the target, preserve unrelated work, make the change, and run one focused check plus `git diff --check`.
- Fast lane never applies to auth, security, sensitive data, migration, signing, release, or unclear destructive impact.

## Repository workflow

For non-trivial changes:

1. Record `git status --short --branch` and preserve pre-existing changes.
2. Select one primary owner document from the [wiki index](docs/README.md).
3. Inspect the entry point, direct callers, and nearest relevant tests.
4. Plan only for broad, unclear, DEEP, or CRITICAL work.
5. Implement the smallest correct change; fix root causes rather than masking symptoms.
6. Review the scoped diff, verify by risk, and report checks and limitations.

## Verification

- FAST: focused check and `git diff --check`.
- BALANCED: lint, typecheck, relevant tests, and diff check.
- DEEP: BALANCED plus broader affected tests.
- CRITICAL: maximum appropriate checks and explicit security/release risk review.
- Dependency changes also require `bunx expo install --check` and `bun install --frozen-lockfile`.

## Git safety

- Commit or push only when authorized. Never push directly to `main`, `master`, `develop`, `production`, or `prod`.
- Stage explicit task-owned paths; never discard, stash, or commit unrelated changes.
- Never automatically force-push, hard-reset, clean untracked files, rewrite shared history, merge protected branches, or release production.

## Owner documentation

- Workflow: [AI workflow](docs/engineering/ai-workflow.md), [model gate](docs/engineering/model-gate.md), [context](docs/engineering/context-strategy.md), [skills](docs/engineering/skills.md), [testing](docs/engineering/testing.md).
- App: [architecture](docs/architecture.md), [coding](docs/engineering/coding-standards.md), [screens](docs/guides/add-a-screen.md).
- Data: [API/errors](docs/engineering/api-and-errors.md), [state/storage](docs/engineering/state-and-storage.md), [security](docs/engineering/security.md).
- UI: [design system](docs/design-system.md), [i18n/accessibility](docs/engineering/i18n-accessibility.md), [performance](docs/cold-start-performance.md).
- Delivery: [Git flow](docs/engineering/git-flow.md). Optional compression: [Caveman](docs/engineering/caveman.md).

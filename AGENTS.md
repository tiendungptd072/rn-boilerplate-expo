# Expo React Native — Agent Router

This is the canonical instruction entry point for Codex and Claude Code. Detailed standards live in the linked owner documents; do not duplicate them here.

## Core invariants

- Act as a Staff Expo React Native engineer and own the requested outcome end to end.
- Preserve existing behavior and conventions. Make the smallest edge-case-correct change and avoid speculative abstractions or dependencies.
- Treat iOS/Android differences, unreliable networks, accessibility, performance, and user-data safety as first-class constraints.
- Use TypeScript to make invalid states difficult to represent. Keep route files thin and domain behavior in its owning feature.
- This repository targets Expo SDK 57. Before changing Expo or React Native code, consult the exact [versioned Expo documentation](https://docs.expo.dev/versions/v57.0.0/).
- Use Bun only: `bun`, `bun run`, and `bunx`. Never use npm, npx, Yarn, or pnpm. Do not hand-edit `bun.lock`.
- Do not edit `ios/` or `android/` unless the task explicitly requires native changes.

## Workflow

```text
classify -> model/context/skill gates -> plan when required -> investigate
-> build -> review -> verify -> checkpoint if long -> Git gate -> handoff
```

1. Record `git status --short --branch` and preserve all pre-existing user changes.
2. Run `bun run ai:route -- "<task>"`; use its safety floor even when the score is lower.
3. Load only the selected owner docs and skills, then search for the entry point and direct callers.
4. Plan only when the Plan Gate requires it. Continue through implementation unless truly blocked.
5. Implement the smallest correct change. For bugs, fix the root cause and inspect all callers of changed shared behavior.
6. Review the scoped diff and verify at the routed tier.
7. For long work, keep only durable compressed state in `bun run ai:checkpoint`.
8. Finish with explicit-path Git automation when authorized: `bun run git:auto -- --message "..." --paths <files>`.

## Plan Gate

A plan is required for DEEP or CRITICAL work, architecture changes, multi-module features, broad refactors, migrations, release/signing work, auth/security changes, or unclear blast radius. FAST work needs no ceremony. BALANCED work may use a short plan when it reduces risk.

Use an existing feature-plan template when present. A plan does not replace investigation, implementation, or verification.

## Context Gate

Follow this order:

```text
AGENTS.md -> task route -> owner doc -> entry point -> direct dependencies
```

Search before read; symbol before file; range before full file; diff before repository; summary before raw log; owner doc before neighboring docs. Expand only when the current hypothesis remains unresolved.

Do not default to the whole docs tree, all of `src`, lockfiles, generated/native files, or every test. Use `ai:search`, `ai:read`, `ai:diff`, and `ai:log` for bounded output. See [context strategy](docs/engineering/context-strategy.md).

## Ponytail / YAGNI

Stop at the first rung that holds: remove the need; reuse repository code; use TypeScript/React Native/Expo; use an installed dependency; write the minimum new code. The shortest change in the wrong layer is still wrong.

Never optimize away trust-boundary validation, data-loss prevention, security, accessibility, error handling, or device-specific calibration. Mark an accepted temporary ceiling with `ponytail:` and state both the limit and upgrade path.

## Verification Gate

- FAST: focused/basic checks and `git diff --check`.
- BALANCED: lint, typecheck, relevant tests, and `git diff --check`.
- DEEP: broader relevant tests plus BALANCED checks.
- CRITICAL: maximum appropriate verification and explicit review of security/release risk.
- Dependency changes also require `bunx expo install --check` and `bun install --frozen-lockfile`.

Every non-trivial logic change needs the smallest runnable regression check. Report commands run and limitations. See [testing](docs/engineering/testing.md).

## Git safety

- Protected branches: `main`, `master`, `develop`, `production`, `prod`. Never push directly to them; create a Conventional Git Flow topic branch.
- Stage only agent-owned paths. Never use `git add .` when pre-existing changes exist. `--all` is allowed only when ownership of the entire tree is certain.
- Commit only after verification succeeds. Use Conventional Commits and push the topic branch; do not merge it.
- Never automatically force-push, hard-reset, clean untracked files, rewrite shared history, delete remote branches, merge protected branches, or release production.
- If automation fails, preserve working-tree changes, safely unstage only automation-owned paths, do not push, and restore the prior branch when practical.

See [Git Flow](docs/engineering/git-flow.md). Completion procedure lives in `.agents/skills/git-finish/SKILL.md`.

## Owner documentation

- [Architecture](docs/architecture.md), [design system](docs/design-system.md), [performance](docs/cold-start-performance.md)
- [Coding/comments](docs/engineering/coding-standards.md), [testing](docs/engineering/testing.md), [API/errors](docs/engineering/api-and-errors.md)
- [State/storage](docs/engineering/state-and-storage.md), [security](docs/engineering/security.md), [i18n/accessibility](docs/engineering/i18n-accessibility.md)
- [AI workflow](docs/engineering/ai-workflow.md), [model gate](docs/engineering/model-gate.md), [skills](docs/engineering/skills.md), [Caveman](docs/engineering/caveman.md)

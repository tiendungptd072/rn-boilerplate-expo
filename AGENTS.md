# Expo React Native — Senior Engineering Rules

## Role

Act as a **Staff Expo React Native Engineer** responsible for a production-quality mobile application.

- Own the outcome end to end: clarify the real user need, trace the affected flow, implement the smallest safe change, and verify it before handoff.
- Make pragmatic, evidence-based technical decisions. Preserve existing project conventions unless a change is clearly justified.
- Treat mobile constraints as first-class: iOS/Android differences, unreliable networks, loading/error/empty states, performance on real devices, accessibility, and safe handling of user data.
- Use TypeScript to make invalid states difficult to represent. Prefer clear domain names, small focused components/hooks, and explicit boundaries over clever patterns.
- Communicate like a senior teammate: state assumptions, risks, validation performed, and any intentional trade-off concisely. Escalate only when a missing product or security decision materially changes the implementation.

## Expo compatibility

- This project targets Expo SDK 57. Before writing or changing Expo/React Native code, read the exact versioned documentation at https://docs.expo.dev/versions/v57.0.0/.
- Prefer Expo-supported APIs and configuration over custom native code. Do not add or edit `ios/` or `android/` native projects unless the task explicitly requires it.
- Keep Expo, React Native, and Expo package versions compatible. Use `bunx expo install <package>` for Expo packages so Expo selects a compatible version.

## Documentation map

This file is the single source of truth. It stays thin: detail lives in `docs/`, and the reasoning behind irreversible decisions lives in `docs/adr/`. Read the linked page before touching the area it owns.

| Read this | Before you |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Add a file, move code between layers, or wire a route |
| [docs/design-system.md](docs/design-system.md) | Build UI, add a color/typography/motion token, or style a screen |
| [docs/cold-start-performance.md](docs/cold-start-performance.md) | Touch root layout, providers, splash, or startup storage reads |
| [docs/distribution.md](docs/distribution.md) | Cut a release, bump a version, or write a migration guide |
| [docs/adr/](docs/adr/) | Change an architectural boundary — check whether a decision already binds you |
| [docs/_TEMPLATE_FEATURE_PLAN.md](docs/_TEMPLATE_FEATURE_PLAN.md) | Start work that trips the plan gate below |

[docs/README.md](docs/README.md) is the full index. A new page that is not listed there does not exist.

## Hard invariants

Violating one of these is a defect, not a style preference. They are derived from the docs above; when a rule changes, change it in its owning doc and here in the same commit.

**Boundaries**

1. Files in `src/app` define URLs and layouts only. A route renders or re-exports a screen from `src/features`.
2. Shared modules (`components`, `design-system`, `hooks`, `lib`, `providers`) must not import from `features` or `app`.
3. A feature must not reach into another feature's internals. Promote shared code only after a second real use appears.
4. API calls, Zod schemas, Zustand stores, and form logic stay inside the feature that owns them.

**Design system**

5. Product UI consumes the public `@/design-system` API. Raw hex, RGB, and named colors are not allowed in product components, and primitive palette values stay inside the token layers.
6. Adding a semantic color token requires its dark-mode value in the same change.
7. Typography, spacing, radius, and elevation come from tokens. Screens do not invent text styles, and spacing tokens are not radii.
8. New animation honors the shared reduced-motion policy.

**State, data, and safety**

9. Server state uses TanStack Query. Shared client state uses Zustand. Reach for React state or context first.
10. Secrets and credentials live in Expo SecureStore only. MMKV holds non-sensitive data.
11. Validate untrusted API and persisted data at the boundary with Zod.
12. Features branch on `ApiError` (`kind`, `status`, `retryable`, `fields`), never on `AxiosError` or a raw transport error.
13. Public configuration is read through `src/config/env.ts`. `EXPO_PUBLIC_*` is bundled into the app and must never hold a secret; `APP_VARIANT` and `EXPO_PUBLIC_APP_ENV` must match.
14. User-facing text comes from `useLocalization().t`. A new key is added to both `en` and `vi` in the same change.

**Toolchain**

15. Bun only — `bun`, `bunx`, and `bun.lock` as the sole lockfile. Install Expo packages with `bunx expo install`.
16. Do not add or edit `ios/` or `android/` native projects. Prefer Expo config and Expo-supported APIs.
17. A change to the template surface updates `template.version.json`, `package.json`, and `CHANGELOG.md`, plus a migration guide under `docs/migrations/` for any breaking change.

## Plan gate

Stop before coding and produce a plan from [docs/\_TEMPLATE\_FEATURE\_PLAN.md](docs/_TEMPLATE_FEATURE_PLAN.md) when the work: adds a feature or route, adds a runtime dependency, crosses a boundary in §Hard invariants, changes auth/API/storage contracts, or ships a release or migration. Wait for human approval on that plan before writing code.

Everything smaller follows the Ponytail ladder directly — no plan, no ceremony.

## Ponytail: lazy senior developer mode

Lazy means efficient, not careless: the best code is code never written. Understand the task and trace the real flow before selecting the smallest solution. Stop at the first rung that holds:

1. Does this need to exist? Apply YAGNI.
2. Does the repository already provide it? Reuse its helper, component, utility, or established pattern.
3. Does JavaScript/TypeScript or the React Native/Expo standard API provide it?
4. Does the native platform or Expo provide it?
5. Does an installed dependency provide it?
6. Can the correct solution be one line?
7. Only then, write the minimum code that works.

- For a bug, find and fix the root cause. Search all callers of a changed shared function and prefer one correct shared fix over repeated caller-side guards.
- Avoid unrequested abstractions, boilerplate, new dependencies, and unrelated refactors. Prefer deletion, boring code, and the fewest files possible.
- The smallest change in the wrong place is still a bug. Choose the smallest edge-case-correct solution, not merely the shortest-looking one.
- If a deliberate shortcut has a known limit, record it with a `ponytail:` comment that states the limit and the upgrade path.
- Never optimize away validation at trust boundaries, data-loss prevention, security, accessibility, error handling, device-specific calibration, or explicitly requested behavior.
- Every non-trivial logic change must include the smallest runnable verification that would fail if it regressed: an existing focused test, a new small test, or a documented manual verification when automation is impractical. Trivial one-line changes do not need a test.

## Package management: Bun only

- Use Bun for all package and script commands: `bun install`, `bun add`, `bun remove`, `bun run <script>`, and `bunx <command>`.
- Do not run `npm`, `npx`, `yarn`, or `pnpm` in this repository.
- Maintain `bun.lock` as the sole package-manager lockfile. When package management is intentionally migrated, generate `bun.lock` with Bun and remove `package-lock.json` in the same focused change; do not keep competing lockfiles.
- Before adding a dependency, first check the Ponytail ladder. Justify any new runtime dependency in the change summary and keep it compatible with Expo SDK 57.
- Do not hand-edit dependency versions or lockfiles. Use Bun commands, then inspect the resulting diff.

## Code comments and documentation

Write comments as senior-maintained documentation: concise, factual, and useful to the next engineer.

- Comment the **why**, invariant, trade-off, platform constraint, or non-obvious failure mode—not a line's obvious mechanics.
- Add TSDoc/JSDoc to exported functions, hooks, types, and components only when their contract is not clear from a precise name and TypeScript signature. Document inputs, outputs, side effects, errors, and lifecycle constraints when relevant.
- Keep comments adjacent to the decision they explain. Update or delete comments whenever the code changes; stale comments are defects.
- Do not add narration, restate the code, leave TODOs without an owner or issue reference, or use comments to excuse unclear design. Improve names and structure first.
- Use `NOTE:` only for durable context, `WARNING:` for behavior that could cause data loss, security, or production failures, and `ponytail:` for accepted temporary ceilings with a concrete upgrade path.
- Never document secrets, credentials, personal data, or internal values that do not belong in source control.

## Verification loop

Verification is a loop, not a final step: run it, read the failure, fix the cause, run it again. Never report work as done without a green run, and never report a step as passing that you did not run.

```bash
bun run lint
bun run typecheck
bun run test
bunx expo install --check   # only when dependencies changed
```

These are the same gates as `.github/workflows/quality.yml`, so a green local loop is a green CI run. Scale down only for a docs-only change; say which steps you skipped and why.

If a failure shows that this file, a page in `docs/`, or an approved plan was wrong, fix the document in the same change. Stale guidance is a defect that reproduces itself.

## Before handoff

- Report the exact commands you ran, their result, and any step you could not run.
- Review the final diff for scope, Expo SDK 57 compatibility, accessibility, and accidental package or lockfile changes.
- Name any invariant you deliberately bent and why, or state that none were.

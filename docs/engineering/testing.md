# Testing and verification

Verification depth follows the route tier. Always choose the smallest runnable check that would fail for the changed behavior.

| Tier | Required depth |
| --- | --- |
| FAST | Focused/basic check and `git diff --check` |
| BALANCED | Lint, typecheck, relevant tests, diff check |
| DEEP | BALANCED plus broader affected-suite/integration coverage |
| CRITICAL | Maximum appropriate checks plus explicit security/release review |

Use `bun run lint`, `bun run typecheck`, and the closest project-native test. Tooling uses `bun run test:ai`. Dependency changes also run `bunx expo install --check` and `bun install --frozen-lockfile`.

Tests must be deterministic, credential-free, and assert observable contracts. Prefer a focused regression test over broad snapshots. Git tooling tests use temporary repositories and must never access production remotes. Document manual device/build verification only when automation is impractical, including platform, build type, steps, and limits.

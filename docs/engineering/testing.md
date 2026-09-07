# Testing and verification

Verification must match the changed behavior and risk. Prefer the smallest check that would fail for the regression.

## Available commands

```bash
bun run lint
bun run typecheck
bun test
```

Run a focused Bun test by passing its path, for example:

```bash
bun test tests/api-client.test.js
```

## Verification tiers

- FAST: focused syntax, format, or manual check plus `git diff --check`.
- BALANCED: lint, typecheck, nearest relevant tests, and `git diff --check`.
- DEEP: BALANCED plus broader tests across affected boundaries and platforms.
- CRITICAL: DEEP plus explicit auth, security, migration, release, or data-loss review.

Dependency changes additionally require:

```bash
bunx expo install --check
bun install --frozen-lockfile
```

Routing or web-rendering changes should also verify a production web export when relevant:

```bash
bunx expo export --platform web
```

## Test ownership

- Put deterministic infrastructure and utility tests under `tests/` while the suite remains small.
- Keep feature behavior tests near the feature when colocating improves ownership.
- Test public behavior and trust boundaries instead of implementation details.
- Mock network and platform dependencies at their boundary; do not hide invalid production behavior with broad mocks.

## Mobile checks

Automation does not replace device-specific verification. Check impacted iOS, Android, and web behavior, including loading, error, empty, offline, keyboard, safe-area, accessibility, reduced-motion, and dark-mode states when relevant.

## Handoff

Report exact commands run, their result, untested platforms or states, and why any expected check was skipped. Do not claim a check passed when it was unavailable.

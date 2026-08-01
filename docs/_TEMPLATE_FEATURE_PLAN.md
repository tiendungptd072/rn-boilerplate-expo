# Feature plan — <name>

Copy this file into the change description or a scratch file, fill it in, and get it approved **before** writing code. It is the human gate in the flow: cheap to reject here, expensive to reject in review.

Triggers are listed in [AGENTS.md §Plan gate](../AGENTS.md). Delete any section that genuinely does not apply — do not answer it with "N/A" to look complete.

## 1. Problem

The user-visible need in two or three sentences. What is broken or missing today, and for whom. Not the solution.

## 2. Scope

- **In:** what this change delivers.
- **Out:** what a reader might reasonably assume is included but is not.

## 3. Smallest solution that works

Walk the Ponytail ladder and say where you stopped: does this need to exist, does the repo already provide it, does the platform or Expo provide it, does an installed dependency provide it. Name what you reused.

If you are adding a runtime dependency, justify it here and confirm Expo SDK 57 compatibility.

## 4. Files and boundaries

| File | New or changed | Why it belongs here |
| --- | --- | --- |
| `src/features/<feature>/…` | | |

Check against [architecture.md](architecture.md):

- Routes stay thin and render a feature screen.
- Nothing shared imports from `features` or `app`.
- Nothing crosses into another feature's internals.
- Feature-owned API, schemas, stores, and form logic stay in the feature.

## 5. Data, state, and contracts

- Server state, client state, or local state — and why that tier.
- Persistence: SecureStore for secrets, MMKV for non-sensitive data, or none.
- Zod validation at any untrusted boundary.
- Error surface: which `ApiError` kinds this flow handles and what the user sees for each.

## 6. UI

- Design-system atoms and tokens used; any new semantic token, with its dark-mode value.
- Loading, error, and empty states.
- Accessibility: labels, touch targets, reduced motion.
- iOS / Android / web differences, if any.
- New user-facing strings, added to both `en` and `vi`.

## 7. Verification

What proves this works and would fail if it regressed:

- Test to add or extend, and the case it covers.
- Manual check on device, with steps, when automation is impractical.
- The loop is `bun run lint`, `bun run typecheck`, `bun run test`, plus `bunx expo install --check` if dependencies changed.

## 8. Risk and rollout

- What could break for existing users, and the blast radius.
- Whether this touches the template surface — if so, the `template.version.json`, `CHANGELOG.md`, and migration-guide work it implies ([distribution.md](distribution.md)).
- Whether it needs an ADR ([adr/README.md](adr/README.md)).

## 9. Open questions

Anything that would change the plan depending on the answer. If none, say none — an empty list is a claim.

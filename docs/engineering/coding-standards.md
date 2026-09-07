# Coding standards

These rules apply to production code in this Expo SDK 57 project. Prefer the smallest clear solution that preserves the boundaries in [Project architecture](../architecture.md).

## TypeScript

- Keep strict TypeScript enabled. Do not use `any`, non-null assertions, or broad casts to silence an uncertain state.
- Model domain states explicitly with unions and narrow unknown data before use.
- Validate API responses, deep-link parameters, and persisted data at their trust boundary with Zod when their shape is not guaranteed locally.
- Prefer `type` for props and domain shapes. Use `interface` only when declaration merging or extension is intentional.
- Export the smallest public API. Keep implementation-only helpers and types private to their owner module.
- Use the `@/` alias for cross-directory imports and relative imports for nearby files within the same feature.

## Ownership and dependencies

- Keep files in `src/app` limited to routes and layouts. Route files render or re-export screens owned by `src/features`.
- A feature owns its screens, components, API functions, schemas, hooks, and client state.
- Shared modules must not import from `features` or `app`. A feature must not reach into another feature's internals.
- Promote code to a shared module only after a second real use appears.
- Prefer React state for local UI state, TanStack Query for server state, and Zustand only for client state shared outside a component subtree.

## React and React Native

- Use function components and hooks. Keep render functions pure and derive values during render instead of synchronizing redundant state in effects.
- Give every effect one external synchronization responsibility and complete cleanup for subscriptions, timers, or requests.
- Keep props focused. Prefer composition over boolean-heavy components and avoid components that combine transport, state ownership, and presentation.
- Handle loading, error, empty, offline, and retry states when a screen depends on remote data.
- Check iOS, Android, and web behavior when using platform-specific APIs. Isolate deliberate differences with `Platform.select` or platform-specific files.
- Use stable keys derived from data. Do not use array indexes when items can be inserted, removed, or reordered.

## Design system and accessibility

- Consume UI primitives and semantic tokens from `@/design-system`; do not use raw palette values in product UI.
- Use shared typography, spacing, shape, icon, and motion tokens. New animation must respect reduced-motion preferences.
- Interactive controls need an accessible name, correct role/state, visible feedback, and a touch target that meets the shared layout token.
- Support dynamic text without clipping. Do not communicate state with color alone.
- Use safe-area behavior owned by the navigator or screen exactly once; avoid stacking duplicate insets.

## Data, errors, and side effects

- Use the configured clients in `src/lib` instead of creating feature-local global clients.
- Convert transport details into domain data at the feature boundary. Do not expose Axios errors directly to UI components.
- Show actionable, localized user messages while preserving diagnostic context for approved development logging.
- Never log tokens, credentials, authorization headers, personal data, or full sensitive payloads.
- Make retry and mutation behavior idempotent where possible. Protect destructive actions against accidental repetition.

## Naming, files, and comments

- Name files in kebab-case and React components in PascalCase. Name hooks with `use` and booleans as predicates such as `isLoading` or `canSubmit`.
- Prefer named exports for reusable modules. A route or screen may use a default export where Expo Router expects it.
- Keep styles in `StyleSheet.create` unless a dynamic value must come from props or the active theme.
- Comments explain an invariant, trade-off, platform constraint, or non-obvious failure mode. Delete narration and stale comments.
- Add TSDoc only when an exported contract is not clear from its name and types.

## Definition of done

Before handoff:

1. Review the scoped diff for accidental dependency, lockfile, generated, or native changes.
2. Run `bun run lint` and `bun run typecheck` for code changes.
3. Run the smallest relevant regression test or document a manual check when automation is impractical.
4. Verify affected navigation and UI on every impacted platform.
5. Report commands run, limitations, and any accepted trade-off.

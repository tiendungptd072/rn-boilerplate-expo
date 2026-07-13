# Project architecture

This project uses Expo Router with a feature-first source structure. Route files remain small so navigation concerns do not absorb business or presentation logic.

```text
src/
├── app/          # Expo Router route entries and layouts
├── components/   # Reusable cross-feature components and UI primitives
│   └── ui/
├── design-system/ # Tokens, themes, and Atomic Design primitives
├── features/     # Product capabilities grouped by domain
│   └── <feature>/
│       ├── components/
│       ├── screens/
│       ├── api/       # Create only when the feature has remote data
│       ├── hooks/     # Create only when behavior is feature-specific
│       ├── schemas/   # Create only when runtime validation is required
│       └── store/     # Create only when the feature owns client state
├── hooks/        # Hooks shared by multiple features
├── lib/          # Configured third-party clients and infrastructure
├── navigation/   # Navigator implementations used by route layouts
├── providers/    # Root React context composition
└── types/        # Cross-cutting ambient and shared TypeScript declarations
```

Root configuration, public assets, and native project configuration stay outside `src/`, as expected by Expo tooling.

## Dependency boundaries

- `app` may import from `features`, `navigation`, `providers`, and shared modules.
- `features` may import shared `components`, `design-system`, `hooks`, and `lib` modules.
- Shared modules must not import from `features` or `app`.
- Product UI consumes the public `@/design-system` API; raw palette values stay internal to its color-token layers.
- A feature must not reach into another feature's internals. Promote genuinely shared code to a shared module only after a second real use appears.
- Keep API requests, Zod schemas, Zustand stores, and form logic inside the feature that owns them. Do not create global buckets without a cross-feature requirement.

## Route rule

Files inside `src/app` define URLs and navigation layouts. A page route should normally re-export or render a screen from `src/features`; application behavior belongs in that feature.

## Data and persistence

- Use TanStack Query for server state and cache ownership.
- Use Zustand for small client-only state that must be shared outside a component subtree.
- Use React state or context for local UI state before introducing a store.
- Store secrets and credentials with Expo SecureStore. MMKV is for fast non-secret persistence and must not contain credentials or sensitive personal data.
- Validate untrusted API and persisted data at the boundary with Zod.

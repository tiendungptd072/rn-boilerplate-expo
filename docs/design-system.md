# Design system

The design system follows Atomic Design. Product code consumes atoms and semantic tokens from `@/design-system`; it must not depend on primitive palette values directly.

## Visual direction and behavior ownership

The visual direction is Modern Neutral: low visual noise, strong typography hierarchy, consistent rhythm, subtle surfaces, minimal shadow, and semantic color. Project tokens own this visual identity. The canonical [HIG behavior standard](./design/hig-behavior.md) owns interaction, touch targets, feedback, keyboard/focus, navigation, modality, gestures, loading, and accessibility behavior.

Behavior constants live in `tokens/behavior.ts`; visual constants remain in color, typography, spacing, shape, elevation, icon, and motion tokens. Never introduce Apple-specific colors solely to imitate iOS.

```text
src/design-system/
├── atoms/               # Reusable UI primitives independent of product and form libraries
├── molecules/           # Small compositions such as FormField
├── theme/               # Light/dark theme composition and React provider
└── tokens/
    ├── colors/
    │   ├── primitive.ts # Tier 1: raw palette
    │   ├── semantic.ts  # Tier 2: purpose-based light/dark colors
    │   └── component.ts # Tier 3: component state colors
    ├── typography.ts
    ├── spacing.ts
    ├── layout.ts
    ├── shape.ts
    ├── elevation.ts
    ├── icons.ts
    ├── motion.ts
    └── behavior.ts      # Touch target, control sizing, and interaction feedback
```

## Atomic layers

- **Atoms** live in `design-system/atoms` and expose theme-aware primitives such as `AppText`, `Surface`, `Card`, `Icon`, `Button`, `TextField`, `Select`, `Checkbox`, `Toggle`, and `RadioGroup`.
- **Molecules** combine atoms into a small interaction pattern. Keep a molecule inside its feature until at least two features share it; then promote it to `design-system/molecules`.
- **Organisms** are larger reusable sections. Apply the same promotion rule rather than creating an empty global catalog.
- **Templates and pages** belong to feature screens and Expo Router routes, respectively.

## Shared application patterns

Application-aware shared components live outside the design-system package and compose its public atoms:

- `src/components/async-list` renders normalized infinite-query states. Feature hooks still own query keys, API calls, runtime schemas, cursor rules, and safe error mapping. Do not pass raw transport errors to the list.
- `src/components/permissions` renders permission rationale and recovery states. Features own native permission hooks and request permission only after a user action.

`AsyncList` preserves cached data during refresh and pagination failures. It requires a stable `keyExtractor`, prevents overlapping page requests through its TanStack Query adapter, and keeps disabled queries out of an indefinite loading state.

`PermissionGuide` maps requestable, blocked, unsupported, error, and granted states without importing camera, microphone, or location modules. Add a native permission dependency and config plugin only with the feature that requires it.

## Color contract

1. Primitive colors are raw values and are only inputs to semantic themes.
2. Semantic colors describe intent such as `content.primary`, `background.surface`, or `feedback.danger`. Application code may consume these when no component token exists.
3. Component colors describe component states such as `button.primary.pressed` and `input.focusBorder`. Reusable components must prefer these tokens.

Adding a dark-mode value is mandatory whenever a semantic token is added. Raw hex, RGB, or named colors are not allowed in product components.

## Theme usage

```tsx
import { AppText, Surface, useTheme } from '@/design-system';

function Example() {
  const theme = useTheme();

  return (
    <Surface tone="subtle" style={{ padding: theme.spacing.md }}>
      <AppText variant="bodyStrong" tone="brand">Semantic, theme-aware UI</AppText>
    </Surface>
  );
}
```

The root provider follows the operating-system appearance setting. Expo Router navigation colors are derived from the same semantic theme, so navigation and application UI cannot drift apart.

## Component Gallery

In development, open `/dev/components` to review shared component variants and states. The route is not linked from product navigation and redirects to `/` in production builds. Add a state here when it materially improves visual, behavior, dark-mode, or accessibility QA; do not modify product screens for demonstration.

## System rules

- Typography variants own font family, size, weight, line height, and letter spacing. Screens do not invent new text styles.
- Spacing uses the named 4-point scale; `xxs` is reserved for optical adjustments.
- Layout tokens define cross-screen constraints such as gutters, touch targets, and maximum content width.
- Radius, border width, and elevation are separate systems. Do not use spacing tokens as radii.
- Icons are referenced by semantic names through `Icon`; platform-specific SF Symbol and Material Symbol names stay inside its registry.
- Motion uses shared duration, easing, spring, and system reduced-motion tokens. New animations must honor the reduced-motion policy.
- Shared input primitives must remain controlled and independent of form libraries. Adapters in `src/components/form` connect them to React Hook Form and own validation messages, required labels, and field-level localization.
- Review component variants and interaction states in the component showcase on the Explore screen before migrating feature consumers. Follow the [component visual QA checklist](engineering/component-visual-qa.md) for the required platform and accessibility matrix.

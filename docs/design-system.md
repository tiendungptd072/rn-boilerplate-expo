# Design system

The design system follows Atomic Design. Product code consumes atoms and semantic tokens from `@/design-system`; it must not depend on primitive palette values directly.

```text
src/design-system/
├── atoms/               # Smallest reusable UI units: text, surface, icon
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
    └── motion.ts
```

## Atomic layers

- **Atoms** live in `design-system/atoms` and expose theme-aware primitives such as `AppText`, `Surface`, and `Icon`.
- **Molecules** combine atoms into a small interaction pattern. Keep a molecule inside its feature until at least two features share it; then promote it to `design-system/molecules`.
- **Organisms** are larger reusable sections. Apply the same promotion rule rather than creating an empty global catalog.
- **Templates and pages** belong to feature screens and Expo Router routes, respectively.

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

## System rules

- Typography variants own font family, size, weight, line height, and letter spacing. Screens do not invent new text styles.
- Spacing uses the named 4-point scale; `xxs` is reserved for optical adjustments.
- Layout tokens define cross-screen constraints such as gutters, touch targets, and maximum content width.
- Radius, border width, and elevation are separate systems. Do not use spacing tokens as radii.
- Icons are referenced by semantic names through `Icon`; platform-specific SF Symbol and Material Symbol names stay inside its registry.
- Motion uses shared duration, easing, spring, and system reduced-motion tokens. New animations must honor the reduced-motion policy.

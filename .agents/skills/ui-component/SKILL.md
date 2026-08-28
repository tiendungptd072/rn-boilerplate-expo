---
name: ui-component
description: Create or redesign a shared UI component using project visuals and HIG behavior.
---

# UI component

Use for shared Button, IconButton, input, card, ListItem, sheet, header, or other Design System work.

1. Understand the real use case and read only `AGENTS.md`, `docs/design-system.md`, `docs/design/hig-behavior.md`, the routed component spec, and relevant source files.
2. Inspect the existing component plus one or two neighbors; preserve project visual tokens and native platform semantics.
3. Define variants and default, pressed, focused, disabled, loading, selected, and error states only where applicable.
4. Compose `AppPressable` for custom actions; keep visible icons small while preserving the behavior touch target.
5. Review role, label/hint, state, screen-reader output, Dynamic Type, keyboard, dark mode, and reduced motion.
6. Add all useful states to the development gallery and cover behavior with focused tests.

Do not load auth, API, security, release, distribution, or Git Flow docs unless the actual task crosses those boundaries. Complete when the API is clear, gallery states are useful, focused checks pass, and no product screen was redesigned for demonstration.

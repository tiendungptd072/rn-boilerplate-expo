# Component visual QA

Use this checklist after changing shared components, semantic tokens, typography, or interaction states. The component showcase on the Explore screen is the primary review surface; feature screens remain the final integration check.

## Required matrix

Review every changed component in these environments:

| Dimension | Minimum coverage |
| --- | --- |
| Platform | iOS, Android, and web |
| Width | Compact phone around 390 px, tablet or narrow web, desktop web at 1440 px |
| Theme | Light and dark |
| Language | Vietnamese and English |
| Text size | Default and the largest practical accessibility size |
| Input | Touch, hardware keyboard on web, and screen reader on at least one native platform |

Use real devices or simulators for native controls. A successful JavaScript bundle does not validate native DatePicker, Switch, keyboard, safe-area, or screen-reader behavior.

## Visual checks

- No horizontal overflow, clipped labels, truncated actions, or content hidden by safe areas.
- Spacing follows tokens and remains consistent when actions wrap on compact widths.
- Typography preserves hierarchy, readable line length, and sufficient contrast.
- Light and dark themes use semantic colors without raw or theme-specific overrides.
- Long Vietnamese and English labels wrap without changing touch-target size.
- Modal, selection, focus, error, disabled, loading, read-only, and selected states remain visually distinct.
- Destructive actions are not confused with primary actions.
- Platform-native controls look intentional beside custom components.

## Interaction checks

- Every interactive target is at least `layout.minTouchTarget` in both dimensions.
- Pressed and keyboard-focus states are visible without relying on color alone.
- Disabled and loading controls cannot trigger actions.
- Forms reveal validation messages, move focus predictably, and preserve user input.
- Select closes through selection, close button, backdrop, Escape, and Android back where supported.
- Modal focus stays inside the modal and returns to its trigger after dismissal.
- Date selection respects minimum and maximum dates and cannot commit an invalid value.
- Controls remain usable with rapid taps, repeated submission, and a slow render.
- Async lists distinguish initial loading, disabled idle, empty, initial error, cached offline, refresh, pagination loading, and pagination error without clearing valid items.
- Permission guides request access only from an explicit action, route permanently denied access to Settings, and recover after returning to the app.

## Accessibility checks

- Buttons, icon-only buttons, checkbox, switch, radio group, select, and fields expose correct roles, names, values, and disabled states.
- Required and error information is announced; the visual asterisk is not the only signal.
- Decorative icons and dividers are hidden from assistive technology.
- Reading order matches visual order after responsive wrapping.
- At 200% text size, content remains reachable and actions do not overlap.
- Reduced-motion preference removes non-essential motion without hiding state changes.
- Skeletons are hidden from the accessibility tree while one concise loading status is announced.
- Async error and offline changes are announced without repeatedly reading every list row.

## Regression gate

Run the repository verification commands after visual fixes:

```bash
bun run lint
bun run typecheck
bun test tests/form-input-utils.test.js tests/design-system-tokens.test.js
bunx expo export --platform all --output-dir <temporary-directory>
git diff --check
```

Record evidence in the pull request: platform, viewport or device, theme, language, changed states, screenshots, and known limitations. Do not approve the component change while a severity P0 or P1 visual, interaction, accessibility, or data-loss defect remains.

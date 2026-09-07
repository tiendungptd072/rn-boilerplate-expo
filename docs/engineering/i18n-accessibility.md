# Internationalization and accessibility

Internationalization and accessibility are product requirements, not final polish. New screens and shared components must support both from their first usable version.

## Localization

The app supports Vietnamese and English through `LocalizationProvider`. Translation resources live under `src/i18n/locales/<language>` and use typed keys.

- Put user-facing strings in the owning locale namespace; do not hardcode them in product screens.
- Add every key to both supported languages in the same change.
- Use `useLocalization().t` for translation and `locale` for `Intl` formatting.
- Keep interpolation parameters explicit and avoid building sentences from translated fragments.
- Persist only the `system`, `vi`, or `en` preference through the shared MMKV storage.
- Provide a stable fallback and never expose missing-key crashes to users.

## Accessibility

- Every interactive element needs an accessible name and the correct role, state, and hint when the action is not obvious.
- Meet the shared minimum touch target and provide visible pressed, focused, disabled, loading, and error feedback.
- Support font scaling without clipping or hiding essential actions.
- Preserve logical reading and focus order. Move focus intentionally after dialogs, errors, or navigation when needed.
- Do not communicate meaning with color, position, motion, or icons alone.
- Announce asynchronous success, failure, and validation changes when visual updates are otherwise silent.
- Respect reduced-motion preferences and avoid unnecessary animation.

## Forms and keyboard

Use semantic input labels, appropriate keyboard and content types, clear required/error states, and predictable submit behavior. Errors should identify the field and recovery action. Keep focused controls visible above the keyboard and do not trap screen-reader focus.

## Platform behavior

Verify VoiceOver on iOS, TalkBack on Android, and keyboard/focus behavior on web for affected flows. Platform-specific behavior is acceptable when semantics and outcome remain consistent.

Shared UI work also follows [Design system](../design-system.md); screen creation follows [Add a screen](../guides/add-a-screen.md).

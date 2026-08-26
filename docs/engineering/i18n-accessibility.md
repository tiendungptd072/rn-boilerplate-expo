# Internationalization and accessibility

User-visible text belongs in the existing localization system; do not construct sentences by concatenating translated fragments. Support longer strings, plural/context rules, locale-specific formatting, right-to-left layout where relevant, and safe fallback behavior.

Interactive elements require an accessible name, role, state, adequate touch target, and logical focus order. Do not communicate state by color alone. Dynamic errors and loading changes should be announced when useful without creating repetitive noise.

Use Design System typography, contrast, spacing, and component states. Respect system font scaling, light/dark mode, and reduced motion. Verify keyboard/screen-reader behavior for forms, modal focus, and navigation changes on affected platforms.

# Add a screen

This project uses Expo Router with thin route files and feature-owned screens. A new page normally requires one screen module and one route entry; add navigator configuration only when the page is a visible tab or needs custom presentation.

## 1. Choose the route owner

- Put signed-out pages under `src/app/(auth)`.
- Put signed-in pages under `src/app/(app)`.
- Use a route group such as `(app)` to organize navigation without adding that group to the URL.
- Use `[id].tsx` for a dynamic segment and validate the received parameter before using it at a data boundary.

Do not put reusable components, data fetching, or business logic in `src/app`. Expo Router treats files there as routes.

## 2. Create the feature screen

Create only the feature directories that the screen actually needs:

```text
src/features/profile/
├── components/             # Optional feature-only UI
└── screens/
    └── profile-screen.tsx
```

```tsx
import { StyleSheet } from 'react-native';

import { AppText, spacing, Surface } from '@/design-system';

export default function ProfileScreen() {
  return (
    <Surface style={styles.screen}>
      <AppText variant="heading">Profile</AppText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
  },
});
```

Use semantic design tokens and shared components. Add loading, error, empty, offline, and retry states when the screen owns remote data.

## 3. Add a thin route

For `/profile` inside the authenticated app:

```tsx
// src/app/(app)/profile.tsx
export { default } from '@/features/profile/screens/profile-screen';
```

For `/products/:productId`:

```text
src/app/(app)/products/[productId].tsx
```

The route group does not appear in the public URL. Every page has a URL, so consider deep-link entry, missing data, and unauthorized access—not only in-app navigation.

## 4. Register navigation only when needed

The root layout already protects `(auth)` and `(app)` based on session state. Do not duplicate that guard inside each screen.

- A normal stack page needs only its route file.
- A new top-level tab must also be added to `src/navigation/app-tabs.tsx` with a title and accessible icon.
- Custom headers, modal presentation, and gestures belong in the nearest owning `_layout.tsx`.

Navigate declaratively when possible:

```tsx
import { Link } from 'expo-router';

<Link href="/profile">Open profile</Link>
```

Use `useRouter` for event-driven navigation. Prefer typed literal routes; do not build unchecked path strings from untrusted input.

## 5. Screen checklist

- Route file is thin and the screen lives in its feature.
- Screen has meaningful loading, error, empty, and offline behavior when applicable.
- Interactive elements have accessible names, roles, states, and adequate touch targets.
- Text scales without clipping and layouts work in light/dark themes.
- Safe-area insets are applied exactly once.
- Back navigation, direct deep linking, and session transitions behave correctly.
- User-facing strings follow the project's localization pattern.
- No sensitive values appear in route parameters, analytics, or logs.

## 6. Verify

```bash
bun run lint
bun run typecheck
```

Manually open the route from its normal entry point and through a direct URL/deep link. Check affected iOS, Android, and web layouts, plus loading/error states when relevant.

References: [Expo Router notation](https://docs.expo.dev/router/basics/notation/), [navigation](https://docs.expo.dev/router/basics/navigation/), and [Expo SDK 57 Router API](https://docs.expo.dev/versions/v57.0.0/sdk/router/).

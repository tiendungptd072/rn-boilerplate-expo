import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { AppText, spacing, Surface, useTheme } from '@/design-system';

export function WebBadge() {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <AppText variant="code" tone="secondary" style={styles.versionText}>
        v{version}
      </AppText>
      <Image
        accessibilityLabel="Expo"
        source={
          theme.isDark
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});

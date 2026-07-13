import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { WebBadge } from '@/components/web-badge';
import { AppText, layout, radius, spacing, Surface } from '@/design-system';
import { HintRow } from '@/features/home/components/hint-row';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <AppText variant="bodySmall">use browser devtools</AppText>;
  }
  if (Device.isDevice) {
    return (
      <AppText variant="bodySmall">
        shake device or press <AppText variant="code">m</AppText> in terminal
      </AppText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <AppText variant="bodySmall">
      press <AppText variant="code">{shortcut}</AppText>
    </AppText>
  );
}

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Surface style={styles.heroSection}>
          <AnimatedIcon />
          <AppText variant="display" style={styles.title}>
            Welcome to&nbsp;Expo
          </AppText>
        </Surface>

        <AppText variant="code" style={styles.code}>
          get started
        </AppText>

        <Surface tone="subtle" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<AppText variant="code">src/features/home</AppText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<AppText variant="code">bun run reset-project</AppText>}
          />
        </Surface>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: layout.bottomTabInset + spacing.md,
    maxWidth: layout.maxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: spacing.md,
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
});

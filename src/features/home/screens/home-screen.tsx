import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebBadge } from '@/components/web-badge';
import { AppText } from '@/design-system/atoms/app-text';
import { Button } from '@/design-system/atoms/button';
import { Surface } from '@/design-system/atoms/surface';
import { layout } from '@/design-system/tokens/layout';
import { radius } from '@/design-system/tokens/shape';
import { spacing } from '@/design-system/tokens/spacing';
import { HintRow } from '@/features/home/components/hint-row';
import { useLocalization } from '@/i18n';
import { useSession } from '@/lib/auth/session-provider';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <AppText variant="bodySmall">use browser devtools</AppText>;
  }

  return <AppText variant="bodySmall">open the Expo developer menu</AppText>;
}

export default function HomeScreen() {
  const { t } = useLocalization();
  const { signOut } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasStorageError, setHasStorageError] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setHasStorageError(false);

    try {
      await signOut();
    } catch {
      setHasStorageError(true);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Surface style={styles.heroSection}>
          <Image source={require('@/assets/images/splash-icon.png')} style={styles.logo} />
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

        <Button loading={isSigningOut} variant="secondary" onPress={handleSignOut}>
          {t('auth.logout.title')}
        </Button>

        {hasStorageError && (
          <AppText accessibilityRole="alert" tone="danger">
            {t('auth.errors.sessionPersistence')}
          </AppText>
        )}

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
  logo: {
    width: 76,
    height: 71,
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

import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, layout, spacing, Surface } from '@/design-system';
import { useLocalization } from '@/i18n';
import { useSession } from '@/lib/auth/session-provider';

export default function SignInScreen() {
  const { t } = useLocalization();
  const { signIn } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStorageError, setHasStorageError] = useState(false);

  const handleDevelopmentSignIn = async () => {
    setIsSubmitting(true);
    setHasStorageError(false);

    try {
      await signIn('development-session');
    } catch {
      setHasStorageError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <SafeAreaView style={styles.content}>
        <AppText variant="display" style={styles.centeredText}>
          {t('auth.login.title')}
        </AppText>
        <AppText tone="secondary" style={styles.centeredText}>
          {t('auth.login.integrationHint')}
        </AppText>

        {__DEV__ && (
          <Button loading={isSubmitting} onPress={handleDevelopmentSignIn}>
            {t('auth.login.demoSubmit')}
          </Button>
        )}

        {hasStorageError && (
          <AppText accessibilityRole="alert" tone="danger" style={styles.centeredText}>
            {t('auth.errors.sessionPersistence')}
          </AppText>
        )}
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    maxWidth: layout.maxContentWidth,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  centeredText: {
    textAlign: 'center',
  },
});

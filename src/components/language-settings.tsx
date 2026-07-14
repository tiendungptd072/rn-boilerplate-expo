import { StyleSheet } from 'react-native';

import { AppText, RadioGroup, radius, spacing, Surface } from '@/design-system';
import { type LanguagePreference, useLocalization } from '@/i18n';

/** Allows the user to follow the device language or choose a supported language. */
export function LanguageSettings() {
  const { preference, setLanguage, t } = useLocalization();
  const options: { value: LanguagePreference; label: string }[] = [
    { value: 'system', label: t('settings.language.system') },
    { value: 'vi', label: t('settings.language.vietnamese') },
    { value: 'en', label: t('settings.language.english') },
  ];

  return (
    <Surface tone="surface" style={styles.container}>
      <AppText variant="title">{t('settings.language.title')}</AppText>
      <RadioGroup
        accessibilityLabel={t('settings.language.title')}
        onValueChange={setLanguage}
        options={options}
        value={preference}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.md,
  },
});

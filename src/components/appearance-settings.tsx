import { StyleSheet } from 'react-native';

import {
  AppText,
  Card,
  RadioGroup,
  spacing,
  type ThemePreference,
  useThemeSettings,
} from '@/design-system';
import { useLocalization } from '@/i18n';

export function AppearanceSettings() {
  const { preference, setPreference } = useThemeSettings();
  const { t } = useLocalization();
  const appearanceOptions: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: t('settings.appearance.system') },
    { value: 'light', label: t('settings.appearance.light') },
    { value: 'dark', label: t('settings.appearance.dark') },
  ];

  return (
    <Card style={styles.container}>
      <AppText variant="title">{t('settings.appearance.title')}</AppText>
      <RadioGroup
        accessibilityLabel={t('settings.appearance.title')}
        onValueChange={setPreference}
        options={appearanceOptions}
        value={preference}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});

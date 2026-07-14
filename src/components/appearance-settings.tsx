import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, radius, spacing, Surface } from '@/design-system';
import { useThemeSettings } from '@/design-system/theme/app-theme-provider';
import type { ThemePreference } from '@/design-system/theme/themes';
import { useTheme } from '@/design-system/theme/theme-provider';

const appearanceOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Theo thiết bị' },
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
];

export function AppearanceSettings() {
  const theme = useTheme();
  const { preference, setPreference } = useThemeSettings();

  return (
    <Surface tone="surface" style={styles.container}>
      <AppText variant="title">Giao diện</AppText>
      <View accessibilityRole="radiogroup">
        {appearanceOptions.map((option) => {
          const selected = option.value === preference;

          return (
            <Pressable
              key={option.value}
              accessibilityLabel={`Giao diện ${option.label}`}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPreference(option.value)}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? theme.colors.content.brand : theme.colors.border.default },
                ]}
              >
                {selected && <View style={[styles.radioSelected, { backgroundColor: theme.colors.content.brand }]} />}
              </View>
              <AppText>{option.label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.md,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 48,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  radio: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: {
    borderRadius: radius.full,
    height: 10,
    width: 10,
  },
});

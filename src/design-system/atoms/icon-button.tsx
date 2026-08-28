import { ActivityIndicator, StyleSheet } from 'react-native';

import { AppPressable, type AppPressableProps } from './app-pressable';
import { Icon, type IconName } from './icon';
import { useTheme } from '../theme/theme-provider';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = Omit<
  AppPressableProps,
  'accessibilityLabel' | 'busy' | 'children' | 'disabled'
> & {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: IconName;
  loading?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

/** Icon-only action with a required accessible name and 44 pt minimum target. */
export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon,
  loading = false,
  size = 'md',
  style,
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  const theme = useTheme();
  const colors = theme.components.button[variant];
  const controlSize = theme.behavior.controlHeight[size];
  const iconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const iconTone = disabled
    ? 'disabled'
    : variant === 'primary' || variant === 'destructive'
      ? 'inverse'
      : variant === 'ghost'
        ? 'brand'
        : 'primary';

  return (
    <AppPressable
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      busy={loading}
      disabled={disabled}
      style={(state) => [
        styles.button,
        {
          backgroundColor: disabled
            ? colors.disabled
            : state.pressed
              ? colors.pressed
              : colors.background,
          borderColor: state.focused
            ? colors.focusRing
            : disabled
              ? colors.disabledBorder
              : state.pressed
                ? colors.pressedBorder
                : colors.border,
          borderRadius: theme.radius.full,
          borderWidth: theme.borderWidth.thin,
          height: controlSize,
          width: controlSize,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          accessibilityElementsHidden
          color={colors.foreground}
          size="small"
        />
      ) : (
        <Icon name={icon} size={iconSize} tone={iconTone} />
      )}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

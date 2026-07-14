import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { type ReactNode, useState } from 'react';

import { AppText } from './app-text';
import { useTheme } from '../theme/theme-provider';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = Omit<PressableProps, 'children' | 'disabled'> & {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
};

/**
 * Theme-aware action button with consistent pressed, disabled, loading,
 * keyboard-focus, and accessibility states.
 */
export function Button({
  accessibilityState,
  children,
  disabled = false,
  loading = false,
  onBlur,
  onFocus,
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const colors = theme.components.button[variant];
  const secondaryColors = theme.components.button.secondary;
  const unavailable = disabled || loading;

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, busy: loading, disabled: unavailable }}
      disabled={unavailable}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      style={(state) => [
        styles.button,
        {
          backgroundColor: unavailable
            ? colors.disabled
            : state.pressed
              ? colors.pressed
              : colors.background,
          borderColor: focused
            ? colors.focusRing
            : variant === 'secondary'
              ? unavailable
                ? secondaryColors.disabledBorder
                : state.pressed
                  ? secondaryColors.pressedBorder
                  : secondaryColors.border
              : colors.background,
          borderRadius: theme.radius.md,
          borderWidth: theme.borderWidth.thin,
          gap: theme.spacing.sm,
          minHeight: theme.layout.minTouchTarget,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading && <ActivityIndicator color={colors.disabledForeground} size="small" />}
      <AppText
        variant="label"
        style={{ color: unavailable ? colors.disabledForeground : colors.foreground }}
      >
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

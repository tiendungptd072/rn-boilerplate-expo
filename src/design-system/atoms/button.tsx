import { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppPressable, type AppPressableProps } from './app-pressable';
import { AppText } from './app-text';
import { useTheme } from '../theme/theme-provider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<AppPressableProps, 'busy' | 'children' | 'disabled'> & {
  children: ReactNode;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
};

/** Theme-aware action with stable loading layout and shared interaction semantics. */
export function Button({
  children,
  disabled = false,
  leadingIcon,
  loading = false,
  size = 'md',
  style,
  trailingIcon,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const colors = theme.components.button[variant];
  const height = theme.behavior.controlHeight[size];
  const horizontalPadding = size === 'sm' ? theme.spacing.md : theme.spacing.lg;

  return (
    <AppPressable
      {...props}
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
          borderRadius: theme.radius.md,
          borderWidth: theme.borderWidth.thin,
          gap: theme.spacing.sm,
          minHeight: height,
          paddingHorizontal: horizontalPadding,
          paddingVertical: theme.spacing.sm,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          accessibilityElementsHidden
          color={colors.foreground}
          importantForAccessibility="no-hide-descendants"
          size="small"
          style={styles.spinner}
        />
      )}
      <View
        style={[styles.content, { gap: theme.spacing.sm, opacity: loading ? 0 : 1 }]}
      >
        {leadingIcon}
        <AppText
          variant={size === 'sm' ? 'label' : 'bodyStrong'}
          style={{ color: disabled ? colors.disabledForeground : colors.foreground }}
        >
          {children}
        </AppText>
        {trailingIcon}
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
  },
});

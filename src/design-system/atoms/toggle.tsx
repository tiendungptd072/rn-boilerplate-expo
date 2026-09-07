import { type ComponentProps, type ComponentType, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  View,
  type PressableProps,
} from 'react-native';

import { AppText } from './app-text';
import { useTheme } from '../theme/theme-provider';

type CrossPlatformSwitchProps = ComponentProps<typeof Switch> & {
  activeThumbColor?: string;
};

const CrossPlatformSwitch = Switch as ComponentType<CrossPlatformSwitchProps>;

export type ToggleProps = Omit<
  PressableProps,
  'children' | 'disabled' | 'onPress'
> & {
  description?: string;
  disabled?: boolean;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

/** Accessible controlled switch with a full-row touch target. */
export function Toggle({
  accessibilityLabel,
  accessibilityState,
  description,
  disabled = false,
  label,
  onBlur,
  onFocus,
  onValueChange,
  style,
  value,
  ...props
}: ToggleProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="switch"
      accessibilityState={{ ...accessibilityState, checked: value, disabled }}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onPress={() => onValueChange(!value)}
      style={(state) => [
        styles.row,
        {
          backgroundColor: state.pressed ? theme.colors.background.selected : undefined,
          borderColor: focused ? theme.colors.border.focus : 'transparent',
          borderRadius: theme.radius.sm,
          borderWidth: theme.borderWidth.thin,
          gap: theme.spacing.md,
          minHeight: theme.layout.minTouchTarget,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <View style={styles.content}>
        <AppText tone={disabled ? 'disabled' : 'primary'}>{label}</AppText>
        {description && (
          <AppText tone={disabled ? 'disabled' : 'secondary'} variant="bodySmall">
            {description}
          </AppText>
        )}
      </View>
      <CrossPlatformSwitch
        {...(Platform.OS === 'web'
          ? {
              activeThumbColor: disabled
                ? theme.colors.content.disabled
                : theme.colors.content.onAction,
            }
          : {})}
        accessibilityElementsHidden
        ios_backgroundColor={theme.colors.border.default}
        pointerEvents="none"
        thumbColor={
          disabled ? theme.colors.content.disabled : theme.colors.content.onAction
        }
        trackColor={{
          false: disabled
            ? theme.colors.border.subtle
            : theme.colors.border.strong,
          true: disabled
            ? theme.colors.action.disabled
            : theme.colors.action.primary,
        }}
        value={value}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});

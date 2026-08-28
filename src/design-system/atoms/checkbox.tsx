import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
} from 'react-native';

import { AppText } from './app-text';
import { Icon } from './icon';
import { useTheme } from '../theme/theme-provider';

export type CheckboxProps = Omit<
  PressableProps,
  'children' | 'disabled' | 'onPress'
> & {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  requiredLabel?: string;
};

/** Accessible controlled checkbox with a full-row touch target. */
export function Checkbox({
  accessibilityLabel,
  accessibilityState,
  checked,
  description,
  disabled = false,
  invalid = false,
  label,
  onBlur,
  onCheckedChange,
  onFocus,
  required = false,
  requiredLabel,
  style,
  ...props
}: CheckboxProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const colors = theme.components.radio;
  const resolvedLabel =
    accessibilityLabel ??
    (required && requiredLabel ? `${label}, ${requiredLabel}` : label);

  return (
    <Pressable
      {...props}
      accessibilityLabel={resolvedLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ ...accessibilityState, checked, disabled }}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onPress={() => onCheckedChange(!checked)}
      style={(state) => [
        styles.row,
        {
          backgroundColor: state.pressed ? colors.pressedBackground : undefined,
          borderColor: focused ? colors.focusRing : 'transparent',
          borderRadius: theme.radius.sm,
          borderWidth: theme.borderWidth.thin,
          gap: theme.spacing.sm,
          minHeight: theme.layout.minTouchTarget,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: disabled
              ? theme.colors.action.disabled
              : checked
                ? theme.colors.action.primary
                : theme.colors.background.surface,
            borderColor: invalid
              ? theme.colors.feedback.danger
              : disabled
                ? colors.disabledBorder
                : checked
                  ? theme.colors.action.primary
                  : colors.border,
            borderRadius: theme.radius.xs,
            borderWidth: theme.borderWidth.thick,
          },
        ]}
      >
        {checked && <Icon name="check" size="sm" tone={disabled ? 'disabled' : 'inverse'} />}
      </View>

      <View style={styles.content}>
        <AppText tone={disabled ? 'disabled' : 'primary'}>
          {label}
          {required && (
            <AppText accessibilityElementsHidden tone="danger">
              {' *'}
            </AppText>
          )}
        </AppText>
        {description && (
          <AppText tone={disabled ? 'disabled' : 'secondary'} variant="bodySmall">
            {description}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  content: {
    flex: 1,
  },
});

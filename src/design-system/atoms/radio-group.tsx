import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { useState } from 'react';

import { AppText } from './app-text';
import { useTheme } from '../theme/theme-provider';

export type RadioOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type RadioGroupProps<TValue extends string> = {
  accessibilityLabel: string;
  onValueChange: (value: TValue) => void;
  options: readonly RadioOption<TValue>[];
  value: TValue;
};

type RadioOptionRowProps<TValue extends string> = {
  groupLabel: string;
  onSelect: (value: TValue) => void;
  option: RadioOption<TValue>;
  selected: boolean;
};

function RadioOptionRow<TValue extends string>({
  groupLabel,
  onSelect,
  option,
  selected,
}: RadioOptionRowProps<TValue>) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const colors = theme.components.radio;
  const radioBorderColor = option.disabled
    ? colors.disabledBorder
    : selected
      ? colors.selectedBorder
      : colors.border;
  const indicatorColor = option.disabled ? colors.disabledForeground : colors.indicator;

  const getStyle: PressableProps['style'] = ({ pressed }) => [
    styles.option,
    {
      backgroundColor: pressed && !option.disabled ? colors.pressedBackground : undefined,
      // Transparent instead of colors.background: a background-matched
      // border only hides itself while it exactly matches the surface
      // color, which breaks the instant the surface animates underneath it.
      borderColor: focused ? colors.focusRing : 'transparent',
      borderRadius: theme.radius.sm,
      borderWidth: theme.borderWidth.thin,
      gap: theme.spacing.sm,
      minHeight: theme.layout.minTouchTarget,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
  ];

  return (
    <Pressable
      accessibilityLabel={`${groupLabel}, ${option.label}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: option.disabled }}
      disabled={option.disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={() => onSelect(option.value)}
      style={getStyle}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: radioBorderColor,
            borderWidth: theme.borderWidth.thick,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: indicatorColor,
                borderRadius: theme.radius.full,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.content}>
        <AppText
          tone={option.disabled ? 'disabled' : 'primary'}
          style={option.disabled ? undefined : { color: colors.foreground }}
        >
          {option.label}
        </AppText>
        {option.description && (
          <AppText
            variant="bodySmall"
            tone={option.disabled ? 'disabled' : 'secondary'}
            style={option.disabled ? undefined : { color: colors.supporting }}
          >
            {option.description}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

/** Accessible, theme-aware single-select group for string-valued preferences. */
export function RadioGroup<TValue extends string>({
  accessibilityLabel,
  onValueChange,
  options,
  value,
}: RadioGroupProps<TValue>) {
  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="radiogroup">
      {options.map((option) => (
        <RadioOptionRow
          key={option.value}
          groupLabel={accessibilityLabel}
          onSelect={onValueChange}
          option={option}
          selected={option.value === value}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  radio: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  indicator: {
    height: 10,
    width: 10,
  },
  content: {
    flex: 1,
  },
});

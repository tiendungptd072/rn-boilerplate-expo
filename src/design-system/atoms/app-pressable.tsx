import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';
import { resolveInteractionState } from '@/design-system/tokens/behavior';

export type AppPressableState = PressableStateCallbackType & {
  focused: boolean;
  unavailable: boolean;
};

export type AppPressableProps = Omit<PressableProps, 'disabled' | 'style'> & {
  busy?: boolean;
  disabled?: boolean;
  feedback?: 'opacity' | 'none';
  style?: StyleProp<ViewStyle> | ((state: AppPressableState) => StyleProp<ViewStyle>);
};

/** Shared interaction behavior for custom controls; visual styling remains caller-owned. */
export function AppPressable({
  accessibilityState,
  busy = false,
  disabled = false,
  feedback = 'opacity',
  onBlur,
  onFocus,
  style,
  ...props
}: AppPressableProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const interaction = resolveInteractionState({ busy, disabled });

  return (
    <Pressable
      {...props}
      accessibilityState={{ ...accessibilityState, ...interaction.accessibilityState }}
      disabled={interaction.unavailable}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      style={(pressableState) => {
        const state = { ...pressableState, focused, unavailable: interaction.unavailable };

        return [
          styles.minimumTarget,
          {
            minHeight: theme.behavior.touchTarget.minimum,
            minWidth: theme.behavior.touchTarget.minimum,
            opacity: disabled
              ? theme.behavior.feedback.disabledOpacity
              : pressableState.pressed && feedback === 'opacity'
                ? theme.behavior.feedback.pressedOpacity
                : 1,
          },
          typeof style === 'function' ? style(state) : style,
        ];
      }}
    />
  );
}

const styles = StyleSheet.create({
  minimumTarget: {
    justifyContent: 'center',
  },
});

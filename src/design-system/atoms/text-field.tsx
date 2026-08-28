import { forwardRef, type ReactNode, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme/theme-provider';

export type TextFieldProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/** Form-library-independent native text control with theme and focus states. */
export const TextField = forwardRef<TextInput, TextFieldProps>(
  function TextField(
    {
      accessibilityState,
      containerStyle,
      disabled = false,
      editable = true,
      invalid = false,
      leading,
      multiline = false,
      onBlur,
      onFocus,
      readOnly = false,
      style,
      trailing,
      ...props
    },
    ref,
  ) {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);
    const colors = theme.components.input;
    const unavailable = disabled || !editable;
    const backgroundColor = unavailable
      ? colors.disabledBackground
      : readOnly
        ? colors.readOnlyBackground
        : colors.background;
    const borderColor = invalid
      ? colors.errorBorder
      : focused
        ? colors.focusBorder
        : colors.border;

    return (
      <View
        style={[
          styles.container,
          multiline && styles.multilineContainer,
          {
            backgroundColor,
            borderColor,
            borderRadius: theme.radius.md,
            borderWidth: theme.borderWidth.thin,
            gap: theme.spacing.sm,
            minHeight: multiline
              ? theme.behavior.controlHeight.multilineMinimum
              : theme.behavior.controlHeight.md,
            paddingHorizontal: theme.spacing.md,
          },
          containerStyle,
        ]}
      >
        {leading}
        <TextInput
          {...props}
          accessibilityState={{ ...accessibilityState, disabled: unavailable }}
          cursorColor={colors.cursor}
          editable={!disabled && editable}
          multiline={multiline}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.placeholder}
          readOnly={readOnly}
          ref={ref}
          selectionColor={colors.selection}
          style={[
            theme.typography.body,
            styles.input,
            multiline && styles.multilineInput,
            {
              color: unavailable ? colors.disabledForeground : colors.foreground,
              paddingVertical: theme.spacing.sm,
            },
            style,
          ]}
        />
        {trailing}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    flex: 1,
    minWidth: 0,
  },
  multilineContainer: {
    alignItems: 'flex-start',
  },
  multilineInput: {
    minHeight: '100%',
    textAlignVertical: 'top',
  },
});

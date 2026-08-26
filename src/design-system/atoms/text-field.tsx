import { type ReactNode, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme/theme-provider';

export type TextFieldProps = Omit<TextInputProps, 'editable' | 'readOnly' | 'style'> & {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  invalid?: boolean;
  leading?: ReactNode;
  readOnly?: boolean;
  style?: StyleProp<TextStyle>;
  trailing?: ReactNode;
};

/** Form-library-independent native text control with theme and focus states. */
export function TextField({
  accessibilityState,
  containerStyle,
  disabled = false,
  invalid = false,
  leading,
  multiline = false,
  onBlur,
  onFocus,
  readOnly = false,
  style,
  trailing,
  ...props
}: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const colors = theme.components.input;
  const backgroundColor = disabled
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
        accessibilityState={{ ...accessibilityState, disabled }}
        cursorColor={colors.cursor}
        editable={!disabled}
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
        selectionColor={colors.selection}
        style={[
          theme.typography.body,
          styles.input,
          multiline && styles.multilineInput,
          {
            color: disabled ? colors.disabledForeground : colors.foreground,
            paddingVertical: theme.spacing.sm,
          },
          style,
        ]}
      />
      {trailing}
    </View>
  );
}

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

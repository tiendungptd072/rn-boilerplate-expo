import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useTheme } from '@/design-system';

import { FormField, type FormFieldSupportProps } from './form-field';

export type FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
> = Omit<
  TextInputProps,
  'defaultValue' | 'onBlur' | 'onChangeText' | 'value'
> &
  FormFieldSupportProps & {
    name: TName;
  };

/** React Hook Form adapter for a string-valued React Native TextInput. */
export function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>({
  accessibilityHint,
  accessibilityLabel,
  editable = true,
  helperText,
  label,
  name,
  onFocus,
  placeholderTextColor,
  required,
  selectionColor,
  style,
  ...textInputProps
}: FormTextInputProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: {
      disabled: fieldDisabled,
      onBlur: onFieldBlur,
      onChange: onFieldChange,
      ref: fieldRef,
      value,
    },
    fieldState,
  } = useController({ control, name });
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const error = fieldState.error?.message;
  const enabled = editable && !fieldDisabled;
  const colors = theme.components.input;

  return (
    <FormField
      error={error}
      helperText={helperText}
      label={label}
      required={required}
    >
      <TextInput
        {...textInputProps}
        accessibilityHint={accessibilityHint ?? error ?? helperText}
        accessibilityLabel={accessibilityLabel ?? label}
        aria-invalid={Boolean(error)}
        editable={enabled}
        onBlur={() => {
          setIsFocused(false);
          onFieldBlur();
        }}
        onChangeText={onFieldChange}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        ref={fieldRef}
        selectionColor={selectionColor ?? colors.selection}
        style={[
          styles.input,
          theme.typography.body,
          {
            backgroundColor: enabled
              ? colors.background
              : colors.disabledBackground,
            borderColor: error
              ? colors.errorBorder
              : isFocused
                ? colors.focusBorder
                : colors.border,
            borderRadius: theme.radius.sm,
            borderWidth: theme.borderWidth.thin,
            color: enabled ? colors.foreground : colors.disabledForeground,
            minHeight: theme.layout.minTouchTarget,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
          style,
        ]}
        value={value}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
});

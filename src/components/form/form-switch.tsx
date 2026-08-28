import { StyleSheet, Switch } from 'react-native';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useTheme } from '@/design-system';

import { FormField, type FormFieldSupportProps } from './form-field';

export type FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
> = Omit<FormFieldSupportProps, 'required'> & {
  name: TName;
  disabled?: boolean;
  testID?: string;
};

/** React Hook Form adapter for Expo UI's boolean Switch. */
export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
>({
  disabled = false,
  helperText,
  label,
  name,
  testID,
}: FormSwitchProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({ control, name });
  const theme = useTheme();
  const unavailable = disabled || field.disabled;

  return (
    <FormField
      error={fieldState.error?.message}
      helperText={helperText}
      hideLabel
      label={label}
    >
      <Switch
        accessibilityHint={fieldState.error?.message ?? helperText}
        accessibilityLabel={label}
        accessibilityState={{ disabled: unavailable }}
        disabled={unavailable}
        ios_backgroundColor={theme.colors.border.strong}
        onValueChange={(value) => {
          field.onChange(value);
          field.onBlur();
        }}
        style={[styles.switch, unavailable && styles.disabled]}
        testID={testID}
        trackColor={{
          false: theme.colors.border.strong,
          true: theme.colors.action.primary,
        }}
        value={field.value}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  switch: {
    alignSelf: 'flex-start',
  },
});

import { Checkbox, Host } from '@expo/ui';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useTheme } from '@/design-system';

import { FormField, type FormFieldSupportProps } from './form-field';

export type FormCheckboxProps<
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

/** React Hook Form adapter for Expo UI's boolean Checkbox. */
export function FormCheckbox<
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
}: FormCheckboxProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({ control, name });
  const theme = useTheme();

  return (
    <FormField
      error={fieldState.error?.message}
      helperText={helperText}
      hideLabel
      label={label}
    >
      <Host
        colorScheme={theme.mode}
        matchContents
        seedColor={theme.colors.action.primary}
      >
        <Checkbox
          disabled={disabled || field.disabled}
          label={label}
          onValueChange={(value) => {
            field.onChange(value);
            field.onBlur();
          }}
          testID={testID}
          value={field.value}
        />
      </Host>
    </FormField>
  );
}

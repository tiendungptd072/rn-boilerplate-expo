import { useMemo } from 'react';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import {
  RadioGroup,
  type RadioOption,
} from '@/design-system';

import { FormField, type FormFieldSupportProps } from './form-field';

export type FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TValue extends string = string,
  TName extends FieldPathByValue<TFieldValues, TValue> = FieldPathByValue<
    TFieldValues,
    TValue
  >,
> = FormFieldSupportProps & {
  name: TName;
  options: readonly RadioOption<TValue>[];
  disabled?: boolean;
};

/** React Hook Form adapter for the design system's string-valued RadioGroup. */
export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TValue extends string = string,
  TName extends FieldPathByValue<TFieldValues, TValue> = FieldPathByValue<
    TFieldValues,
    TValue
  >,
>({
  disabled = false,
  helperText,
  label,
  name,
  options,
  required,
}: FormRadioGroupProps<TFieldValues, TValue, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({ control, name });
  const resolvedOptions = useMemo(
    () =>
      disabled || field.disabled
        ? options.map((option) => ({ ...option, disabled: true }))
        : options,
    [disabled, field.disabled, options],
  );

  return (
    <FormField
      error={fieldState.error?.message}
      helperText={helperText}
      label={label}
      required={required}
    >
      <RadioGroup
        accessibilityLabel={label}
        onValueChange={(value) => {
          field.onChange(value);
          field.onBlur();
        }}
        options={resolvedOptions}
        value={field.value}
      />
    </FormField>
  );
}

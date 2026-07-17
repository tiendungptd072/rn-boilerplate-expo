import { type ChangeEvent, type CSSProperties, useState } from 'react';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useTheme } from '@/design-system';

import { FormField } from './form-field';
import type {
  FormDatePickerMode,
  FormDatePickerProps,
} from './form-date-picker.types';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatInputValue(date: Date, mode: FormDatePickerMode) {
  const dateValue = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timeValue = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (mode === 'time') return timeValue;
  if (mode === 'datetime') return `${dateValue}T${timeValue}`;

  return dateValue;
}

function parseInputValue(
  input: string,
  currentValue: Date,
  mode: FormDatePickerMode,
) {
  if (mode === 'time') {
    const [hours, minutes] = input.split(':').map(Number);
    const nextValue = new Date(currentValue);
    nextValue.setHours(hours, minutes, 0, 0);
    return nextValue;
  }

  const [datePart, timePart] = input.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  if (mode === 'datetime' && timePart) {
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  return new Date(year, month - 1, day);
}

/** Web adapter using the browser's native date/time input. */
export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, Date> = FieldPathByValue<
    TFieldValues,
    Date
  >,
>({
  disabled = false,
  helperText,
  label,
  maximumDate,
  minimumDate,
  mode = 'date',
  name,
  required,
  testID,
}: FormDatePickerProps<TFieldValues, TName>) {
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
  const enabled = !disabled && !fieldDisabled;
  const colors = theme.components.input;
  const inputType = mode === 'datetime' ? 'datetime-local' : mode;
  const style: CSSProperties = {
    backgroundColor: enabled ? colors.background : colors.disabledBackground,
    borderColor: error
      ? colors.errorBorder
      : isFocused
        ? colors.focusBorder
        : colors.border,
    borderRadius: theme.radius.sm,
    borderStyle: 'solid',
    borderWidth: theme.borderWidth.thin,
    boxSizing: 'border-box',
    color: enabled ? colors.foreground : colors.disabledForeground,
    colorScheme: theme.mode,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    minHeight: theme.layout.minTouchTarget,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    width: '100%',
  };

  return (
    <FormField
      error={error}
      helperText={helperText}
      label={label}
      required={required}
    >
      <input
        aria-invalid={Boolean(error)}
        aria-label={label}
        aria-required={required}
        data-testid={testID}
        disabled={!enabled}
        max={maximumDate ? formatInputValue(maximumDate, mode) : undefined}
        min={minimumDate ? formatInputValue(minimumDate, mode) : undefined}
        onBlur={() => {
          setIsFocused(false);
          onFieldBlur();
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.value) {
            onFieldChange(parseInputValue(event.target.value, value, mode));
          }
        }}
        onFocus={() => setIsFocused(true)}
        ref={fieldRef}
        style={style}
        type={inputType}
        value={formatInputValue(value, mode)}
      />
    </FormField>
  );
}

export type { FormDatePickerProps } from './form-date-picker.types';

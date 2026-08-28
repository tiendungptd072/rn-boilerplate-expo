import {
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';

import type { FormFieldSupportProps } from './form-field';

export type FormDatePickerMode = 'date' | 'time' | 'datetime';

export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, Date> = FieldPathByValue<
    TFieldValues,
    Date
  >,
> = FormFieldSupportProps & {
  name: TName;
  disabled?: boolean;
  display?: 'default' | 'compact' | 'inline' | 'spinner' | 'calendar' | 'clock';
  formatValue?: (date: Date, locale: string) => string;
  is24Hour?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: FormDatePickerMode;
  testID?: string;
  timeZoneName?: string;
};

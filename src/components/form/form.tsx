import { type PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

export type FormProps<TFieldValues extends FieldValues> = PropsWithChildren<
  Omit<ViewProps, 'children'> & {
    form: UseFormReturn<TFieldValues>;
  }
>;

/** Supplies React Hook Form context to typed common form fields. */
export function Form<TFieldValues extends FieldValues>({
  children,
  form,
  ...viewProps
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <View {...viewProps}>{children}</View>
    </FormProvider>
  );
}

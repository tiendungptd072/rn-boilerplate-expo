import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, spacing } from '@/design-system';

export type FormFieldSupportProps = {
  label: string;
  helperText?: string;
  required?: boolean;
};

type FormFieldProps = PropsWithChildren<
  FormFieldSupportProps & {
    error?: string;
    hideLabel?: boolean;
  }
>;

/** Provides consistent labels, helper text, and validation errors for form controls. */
export function FormField({
  children,
  error,
  helperText,
  hideLabel = false,
  label,
  required = false,
}: FormFieldProps) {
  const supportingText = error ?? helperText;

  return (
    <View style={styles.container}>
      {!hideLabel && (
        <AppText variant="label">
          {label}
          {required && <AppText tone="danger"> *</AppText>}
        </AppText>
      )}

      {children}

      {supportingText && (
        <AppText
          accessibilityRole={error ? 'alert' : undefined}
          tone={error ? 'danger' : 'secondary'}
          variant="caption"
        >
          {supportingText}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
});

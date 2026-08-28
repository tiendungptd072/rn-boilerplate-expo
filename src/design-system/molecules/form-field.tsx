import { cloneElement, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/app-text';
import { resolveFieldMessage } from './form-field-state';
import { useTheme } from '../theme/theme-provider';

type FieldControlAccessibilityProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  invalid?: boolean;
};

export type FormFieldProps = {
  children: ReactElement<FieldControlAccessibilityProps>;
  error?: string;
  helperText?: string;
  label: string;
  required?: boolean;
};

/** Persistent form label and message composition for a single TextField-like control. */
export function FormField({
  children,
  error,
  helperText,
  label,
  required = false,
}: FormFieldProps) {
  const theme = useTheme();
  const message = resolveFieldMessage(error, helperText);
  const control = cloneElement(children, {
    accessibilityHint: children.props.accessibilityHint ?? message?.text,
    accessibilityLabel: children.props.accessibilityLabel ?? label,
    invalid: children.props.invalid ?? Boolean(error),
  });

  return (
    <View style={[styles.field, { gap: theme.spacing.xs }]}>
      <AppText
        accessibilityLabel={required ? `${label}, required` : label}
        variant="label"
      >
        {label}
        {required && (
          <AppText accessible={false} tone="danger" variant="label">
            {' *'}
          </AppText>
        )}
      </AppText>
      {control}
      {message && (
        <AppText
          accessibilityRole={message.kind === 'error' ? 'alert' : undefined}
          tone={message.kind === 'error' ? 'danger' : 'secondary'}
          variant="caption"
        >
          {message.text}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
  },
});

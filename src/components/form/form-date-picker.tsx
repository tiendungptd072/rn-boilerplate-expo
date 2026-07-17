import { DateTimePicker as ExpoDateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { AppText, Button, Icon, spacing, useTheme } from '@/design-system';
import { useLocalization } from '@/i18n';

import { FormField } from './form-field';
import type {
  FormDatePickerMode,
  FormDatePickerProps,
} from './form-date-picker.types';

function formatDate(date: Date, locale: string, mode: FormDatePickerMode) {
  if (mode === 'time') {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  if (mode === 'datetime') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

/** React Hook Form adapter for Expo UI's native DateTimePicker. */
export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, Date> = FieldPathByValue<
    TFieldValues,
    Date
  >,
>({
  disabled = false,
  display,
  formatValue,
  helperText,
  is24Hour,
  label,
  maximumDate,
  minimumDate,
  mode = 'date',
  name,
  required,
  testID,
  timeZoneName,
}: FormDatePickerProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({ control, name });
  const { locale, t } = useLocalization();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const error = fieldState.error?.message;
  const enabled = !disabled && !field.disabled;
  const colors = theme.components.input;
  const value = field.value;

  const closePicker = () => {
    setIsOpen(false);
    field.onBlur();
  };

  return (
    <FormField
      error={error}
      helperText={helperText}
      label={label}
      required={required}
    >
      <Pressable
        accessibilityHint={error ?? helperText}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled, expanded: isOpen }}
        disabled={!enabled}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: enabled
              ? pressed
                ? theme.colors.background.selected
                : colors.background
              : colors.disabledBackground,
            borderColor: error ? colors.errorBorder : colors.border,
            borderRadius: theme.radius.sm,
            borderWidth: theme.borderWidth.thin,
            minHeight: theme.layout.minTouchTarget,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
        testID={testID}
      >
        <AppText
          style={styles.triggerText}
          tone={enabled ? 'primary' : 'disabled'}
        >
          {formatValue?.(value, locale) ?? formatDate(value, locale, mode)}
        </AppText>
        <Icon
          name="calendar"
          size="sm"
          tone={enabled ? 'secondary' : 'disabled'}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.pickerContainer}>
          <ExpoDateTimePicker
            disabled={!enabled}
            display={display}
            is24Hour={is24Hour}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            mode={mode}
            onDismiss={closePicker}
            onValueChange={(_, selectedDate) => {
              field.onChange(selectedDate);

              if (Platform.OS === 'android') {
                closePicker();
              }
            }}
            presentation="dialog"
            testID={testID ? `${testID}-picker` : undefined}
            themeVariant={theme.mode}
            timeZoneName={timeZoneName}
            value={value}
          />

          {Platform.OS === 'ios' && (
            <Button onPress={closePicker} variant="secondary">
              {t('common.confirm')}
            </Button>
          )}
        </View>
      )}
    </FormField>
  );
}

export type { FormDatePickerProps } from './form-date-picker.types';

const styles = StyleSheet.create({
  pickerContainer: {
    gap: spacing.sm,
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    width: '100%',
  },
  triggerText: {
    flex: 1,
  },
});

import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type FieldPathByValue,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import {
  AppText,
  Icon,
  spacing,
  Surface,
  useTheme,
} from '@/design-system';
import { useLocalization } from '@/i18n';

import { FormField, type FormFieldSupportProps } from './form-field';

export type DropdownValue = string | number;

export type DropdownOption<TValue extends DropdownValue = DropdownValue> = {
  label: string;
  value: TValue;
};

export type FormDropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TValue extends DropdownValue = DropdownValue,
  TName extends FieldPathByValue<TFieldValues, TValue> = FieldPathByValue<
    TFieldValues,
    TValue
  >,
> = FormFieldSupportProps & {
  name: TName;
  options: readonly DropdownOption<TValue>[];
  disabled?: boolean;
  testID?: string;
};

/** React Hook Form single-select field with an accessible modal option list. */
export function FormDropdown<
  TFieldValues extends FieldValues = FieldValues,
  TValue extends DropdownValue = DropdownValue,
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
  testID,
}: FormDropdownProps<TFieldValues, TValue, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: {
      disabled: fieldDisabled,
      onBlur: onFieldBlur,
      onChange: onFieldChange,
      value,
    },
    fieldState,
  } = useController({ control, name });
  const { t } = useLocalization();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const error = fieldState.error?.message;
  const enabled = !disabled && !fieldDisabled;
  const colors = theme.components.input;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const closeDropdown = () => {
    setIsOpen(false);
    onFieldBlur();
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
        style={[
          styles.trigger,
          {
            backgroundColor: enabled
              ? colors.background
              : colors.disabledBackground,
            borderColor: error ? colors.errorBorder : colors.border,
            borderRadius: theme.radius.sm,
            borderWidth: theme.borderWidth.thin,
            gap: theme.spacing.sm,
            minHeight: theme.layout.minTouchTarget,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
        testID={testID}
      >
        <AppText
          numberOfLines={1}
          style={styles.triggerText}
          tone={enabled ? 'primary' : 'disabled'}
        >
          {selectedOption?.label ?? String(value)}
        </AppText>
        <Icon
          name={isOpen ? 'chevronDown' : 'chevronRight'}
          size="sm"
          tone={enabled ? 'secondary' : 'disabled'}
        />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={closeDropdown}
        statusBarTranslucent
        transparent
        visible={isOpen}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.modalRoot}>
          <Pressable
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
            onPress={closeDropdown}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.components.overlay.scrim },
            ]}
          />

          <Surface
            accessibilityViewIsModal
            elevation="lg"
            style={[
              styles.sheet,
              {
                borderRadius: theme.radius.lg,
                padding: theme.spacing.md,
              },
            ]}
            tone="elevated"
          >
            <View style={styles.sheetHeader}>
              <AppText style={styles.sheetTitle} variant="title">
                {label}
              </AppText>
              <Pressable
                accessibilityLabel={t('common.close')}
                accessibilityRole="button"
                hitSlop={8}
                onPress={closeDropdown}
                style={styles.closeButton}
              >
                <Icon name="close" />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(option) => String(option.value)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = item.value === value;

                return (
                  <Pressable
                    accessibilityLabel={item.label}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => {
                      onFieldChange(item.value);
                      closeDropdown();
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor: selected
                          ? theme.colors.background.selected
                          : undefined,
                        borderRadius: theme.radius.sm,
                        minHeight: theme.layout.minTouchTarget,
                        opacity: pressed ? 0.7 : 1,
                        paddingHorizontal: theme.spacing.sm,
                        paddingVertical: theme.spacing.sm,
                      },
                    ]}
                    testID={
                      testID ? `${testID}-option-${String(item.value)}` : undefined
                    }
                  >
                    <AppText tone={selected ? 'brand' : 'primary'}>
                      {item.label}
                    </AppText>
                  </Pressable>
                );
              }}
              style={styles.options}
            />
          </Surface>
        </SafeAreaView>
      </Modal>
    </FormField>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  option: {
    justifyContent: 'center',
  },
  options: {
    maxHeight: 360,
  },
  sheet: {
    gap: spacing.sm,
    margin: spacing.md,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sheetTitle: {
    flex: 1,
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  triggerText: {
    flex: 1,
  },
});

import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './app-text';
import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Surface } from './surface';
import { useTheme } from '../theme/theme-provider';

export type SelectOption<TValue extends string> = {
  description?: string;
  disabled?: boolean;
  label: string;
  value: TValue;
};

export type SelectProps<TValue extends string> = {
  closeLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  label: string;
  onDismiss?: () => void;
  onValueChange: (value: TValue) => void;
  options: readonly SelectOption<TValue>[];
  placeholder: string;
  testID?: string;
  value?: TValue | '';
};

/** Controlled single-select input rendered as an accessible modal list. */
export function Select<TValue extends string>({
  closeLabel,
  disabled = false,
  invalid = false,
  label,
  onDismiss,
  onValueChange,
  options,
  placeholder,
  testID,
  value,
}: SelectProps<TValue>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const colors = theme.components.input;
  const compact = width < theme.layout.compactBreakpoint;
  const selectedOption = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    onDismiss?.();
  };

  const sheetStyle: ViewStyle = {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    gap: theme.spacing.sm,
    maxHeight: '80%',
    maxWidth: 520,
    paddingBottom: Math.max(insets.bottom, theme.spacing.md),
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    width: '100%',
    ...(Platform.OS === 'web' && !compact && { borderRadius: theme.radius.xl }),
  };

  return (
    <>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: disabled
              ? colors.disabledBackground
              : pressed
                ? theme.colors.background.selected
                : colors.background,
            borderColor: invalid
              ? colors.errorBorder
              : focused
                ? colors.focusBorder
                : colors.border,
            borderRadius: theme.radius.md,
            borderWidth: theme.borderWidth.thin,
            minHeight: theme.layout.minTouchTarget,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
        testID={testID}
      >
        <AppText tone={selectedOption ? 'primary' : disabled ? 'disabled' : 'muted'}>
          {selectedOption?.label ?? placeholder}
        </AppText>
        <Icon name="chevronDown" size="sm" tone={disabled ? 'disabled' : 'secondary'} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={close}
        transparent
        visible={open}
      >
        <View
          style={[
            styles.modalRoot,
            {
              justifyContent:
                Platform.OS === 'web' && !compact ? 'center' : 'flex-end',
            },
          ]}
        >
          <Pressable
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onPress={close}
            style={[styles.backdrop, { backgroundColor: theme.components.overlay.scrim }]}
          />
          <Surface
            accessibilityViewIsModal
            elevation="lg"
            style={sheetStyle}
            tone="elevated"
          >
            <View style={styles.header}>
              <AppText variant="title">{label}</AppText>
              <IconButton
                accessibilityLabel={closeLabel}
                icon="close"
                onPress={close}
              />
            </View>
            <ScrollView
              accessibilityLabel={label}
              accessibilityRole="radiogroup"
              contentContainerStyle={{ gap: theme.spacing.xs }}
            >
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <Pressable
                    accessibilityLabel={option.label}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected, disabled: option.disabled }}
                    disabled={option.disabled}
                    key={option.value}
                    onPress={() => {
                      onValueChange(option.value);
                      close();
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor:
                          selected || pressed ? theme.colors.background.selected : undefined,
                        borderRadius: theme.radius.md,
                        gap: theme.spacing.sm,
                        minHeight: theme.layout.minTouchTarget,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                      },
                    ]}
                  >
                    <View style={styles.optionContent}>
                      <AppText
                        tone={option.disabled ? 'disabled' : 'primary'}
                        variant={selected ? 'bodyStrong' : 'body'}
                      >
                        {option.label}
                      </AppText>
                      {option.description && (
                        <AppText
                          tone={option.disabled ? 'disabled' : 'secondary'}
                          variant="bodySmall"
                        >
                          {option.description}
                        </AppText>
                      )}
                    </View>
                    {selected && <Icon name="check" size="sm" tone="brand" />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Surface>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalRoot: {
    alignItems: 'center',
    flex: 1,
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  optionContent: {
    flex: 1,
  },
});

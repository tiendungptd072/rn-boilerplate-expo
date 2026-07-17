import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormCheckbox,
  FormDatePicker,
  FormDropdown,
  FormRadioGroup,
  FormSwitch,
  FormTextInput,
} from '@/components/form';
import { AppText, Button, radius, spacing, Surface } from '@/design-system';
import { useLocalization } from '@/i18n';

const formSchema = z.object({
  acceptedTerms: z.boolean().refine(Boolean, 'Please accept the terms'),
  birthday: z.date(),
  contactMethod: z.enum(['email', 'phone']),
  fullName: z.string().trim().min(1, 'Full name is required'),
  notificationsEnabled: z.boolean(),
  role: z.enum(['admin', 'member']),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Member', value: 'member' },
] as const;

const contactOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
] as const;

/** Interactive example covering every common React Hook Form control. */
export function FormShowcase() {
  const { locale } = useLocalization();
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(
    null,
  );
  const form = useForm<FormValues>({
    defaultValues: {
      acceptedTerms: false,
      birthday: new Date(2000, 0, 1),
      contactMethod: 'email',
      fullName: '',
      notificationsEnabled: true,
      role: 'member',
    },
    resolver: zodResolver(formSchema),
  });

  const resetForm = () => {
    form.reset();
    setSubmittedValues(null);
  };

  return (
    <Surface style={styles.card} tone="subtle">
      <View style={styles.heading}>
        <AppText variant="title">Form components</AppText>
        <AppText tone="secondary" variant="bodySmall">
          React Hook Form fields validated by a Zod schema.
        </AppText>
      </View>

      <Form form={form} style={styles.form}>
        <FormTextInput<FormValues>
          autoCapitalize="words"
          label="Full name"
          name="fullName"
          placeholder="Jane Doe"
          required
        />

        <FormDatePicker<FormValues>
          label="Birthday"
          maximumDate={new Date()}
          name="birthday"
          required
        />

        <FormDropdown<FormValues, FormValues['role']>
          label="Role"
          name="role"
          options={roleOptions}
          required
        />

        <FormRadioGroup<FormValues, FormValues['contactMethod']>
          label="Preferred contact method"
          name="contactMethod"
          options={contactOptions}
          required
        />

        <FormSwitch<FormValues>
          helperText="Controls product update notifications."
          label="Enable notifications"
          name="notificationsEnabled"
        />

        <FormCheckbox<FormValues>
          label="I accept the terms and conditions"
          name="acceptedTerms"
        />

        <View style={styles.actions}>
          <Button
            onPress={form.handleSubmit(
              setSubmittedValues,
              () => setSubmittedValues(null),
            )}
            style={styles.action}
          >
            Validate form
          </Button>
          <Button
            onPress={resetForm}
            style={styles.action}
            variant="secondary"
          >
            Reset
          </Button>
        </View>
      </Form>

      {submittedValues && (
        <AppText accessibilityLiveRegion="polite" tone="success">
          Submitted {submittedValues.fullName} as {submittedValues.role} — birthday{' '}
          {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
            submittedValues.birthday,
          )}
          .
        </AppText>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  action: {
    flexGrow: 1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    gap: spacing.lg,
    padding: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
  },
});

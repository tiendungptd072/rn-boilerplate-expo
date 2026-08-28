import { type PropsWithChildren, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  Select,
  spacing,
  TextField,
  Toggle,
} from '@/design-system';

import { SharedPatternShowcase } from './shared-pattern-showcase';

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
] as const;

/** Interactive gallery for reviewing shared component states on every platform. */
export function ComponentShowcase() {
  const [checked, setChecked] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [text, setText] = useState('');

  return (
    <View style={styles.showcase}>
      <ShowcaseSection title="Actions">
        <View style={styles.row}>
          <Button leadingIcon={<Icon name="check" size="sm" tone="inverse" />}>
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Delete</Button>
        </View>
        <View style={styles.row}>
          <IconButton accessibilityLabel="Search" icon="search" />
          <IconButton accessibilityLabel="Settings" icon="settings" variant="secondary" />
          <IconButton accessibilityLabel="Close" icon="close" variant="primary" />
        </View>
        <View style={styles.row}>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <IconButton accessibilityLabel="Disabled search" disabled icon="search" />
          <IconButton accessibilityLabel="Loading" icon="settings" loading />
        </View>
      </ShowcaseSection>

      <Divider />

      <ShowcaseSection title="Standalone inputs">
        <TextField
          accessibilityLabel="Display name"
          onChangeText={setText}
          placeholder="Display name"
          value={text}
        />
        <TextField
          accessibilityLabel="Invalid value"
          invalid
          onChangeText={() => undefined}
          value="Invalid value"
        />
        <TextField
          accessibilityLabel="Read-only value"
          readOnly
          value="Read-only value"
        />
        <TextField
          accessibilityLabel="Disabled value"
          disabled
          value="Disabled value"
        />
        <Select
          closeLabel="Close"
          label="Priority"
          onValueChange={setPriority}
          options={priorityOptions}
          placeholder="Select priority"
          value={priority}
        />
        <Select
          closeLabel="Close"
          disabled
          label="Disabled priority"
          onValueChange={() => undefined}
          options={priorityOptions}
          placeholder="Disabled select"
        />
        <Toggle
          description="Receive product updates."
          label="Notifications"
          onValueChange={setNotifications}
          value={notifications}
        />
        <Checkbox
          checked={checked}
          label="I understand"
          onCheckedChange={setChecked}
        />
        <Toggle
          disabled
          label="Disabled notifications"
          onValueChange={() => undefined}
          value
        />
        <Checkbox
          checked
          disabled
          label="Disabled checkbox"
          onCheckedChange={() => undefined}
        />
      </ShowcaseSection>

      <Divider />

      <ShowcaseSection title="Shared app patterns">
        <SharedPatternShowcase />
      </ShowcaseSection>
    </View>
  );
}

function ShowcaseSection({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Card style={styles.section}>
      <AppText variant="bodyStrong">{title}</AppText>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  showcase: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

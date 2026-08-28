import { type PropsWithChildren, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Button,
  FormField,
  Icon,
  IconButton,
  Surface,
  TextField,
  type ButtonVariant,
  useTheme,
} from '@/design-system';

const buttonVariants: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
];

/** Development-only visual and interaction QA surface for shared components. */
export function ComponentGallery() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('hello@example.com');
  const [name, setName] = useState('');

  return (
    <Surface tone="canvas" style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            gap: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            paddingHorizontal: theme.layout.screenGutter,
            paddingTop: Math.max(insets.top, theme.spacing.lg),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="heading">Component Gallery</AppText>
          <AppText tone="secondary">
            Development-only states for visual, behavior, dark-mode, and accessibility QA.
          </AppText>
        </View>

        <GallerySection title="Button">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <View style={[styles.row, { gap: theme.spacing.sm }]}>
            <Button size="sm">Small</Button>
            <Button size="md" variant="secondary">Medium</Button>
            <Button size="lg" variant="outline">Large</Button>
          </View>
          <Button
            leadingIcon={<Icon name="settings" size="sm" tone="inverse" />}
          >
            Leading icon
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading without layout shift</Button>
        </GallerySection>

        <GallerySection title="IconButton">
          <View style={[styles.row, { gap: theme.spacing.sm }]}>
            <IconButton accessibilityLabel="Close gallery example" icon="close" />
            <IconButton
              accessibilityLabel="Open settings example"
              icon="settings"
              variant="secondary"
            />
            <IconButton
              accessibilityLabel="Delete example"
              icon="close"
              variant="destructive"
            />
            <IconButton accessibilityLabel="Loading example" icon="settings" loading />
            <IconButton accessibilityLabel="Disabled example" disabled icon="settings" />
          </View>
        </GallerySection>

        <GallerySection title="TextField + FormField">
          <AppText tone="secondary" variant="callout">
            Focus any enabled field to inspect focus feedback and keyboard behavior.
          </AppText>
          <FormField label="Name" helperText="Persistent labels do not rely on placeholders.">
            <TextField
              autoComplete="name"
              onChangeText={setName}
              placeholder="Enter your name"
              returnKeyType="next"
              value={name}
            />
          </FormField>
          <FormField label="Email" required>
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              returnKeyType="done"
              value={email}
            />
          </FormField>
          <FormField error="Enter a valid email address." label="Error">
            <TextField value="not-an-email" />
          </FormField>
          <FormField label="Disabled">
            <TextField disabled value="Cannot edit" />
          </FormField>
          <FormField helperText="Selectable, but not editable." label="Read only">
            <TextField readOnly value="Stable value" />
          </FormField>
          <FormField label="Password">
            <TextField autoComplete="password" secureTextEntry value="secret" />
          </FormField>
          <FormField label="Textarea">
            <TextField multiline numberOfLines={4} value="Multiline content" />
          </FormField>
        </GallerySection>
      </ScrollView>
    </Surface>
  );
}

function GallerySection({ children, title }: PropsWithChildren<{ title: string }>) {
  const theme = useTheme();

  return (
    <Surface
      tone="surface"
      style={[
        styles.section,
        {
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
          borderWidth: theme.borderWidth.hairline,
          gap: theme.spacing.md,
          padding: theme.spacing.md,
        },
      ]}
    >
      <AppText variant="headline">{title}</AppText>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 800,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    width: '100%',
  },
});

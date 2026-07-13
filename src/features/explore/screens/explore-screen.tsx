import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { AppText, Icon, layout, radius, spacing, Surface, useTheme } from '@/design-system';

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + layout.bottomTabInset + spacing.md,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: spacing['3xl'],
      paddingBottom: spacing.lg,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background.canvas }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <Surface style={styles.container}>
        <Surface style={styles.titleContainer}>
          <AppText variant="heading">Explore</AppText>
          <AppText style={styles.centerText} tone="secondary">
            This starter app includes example{`\n`}code to help you get started.
          </AppText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <Surface tone="subtle" style={styles.linkButton}>
                <AppText variant="label">Expo documentation</AppText>
                <Icon name="externalLink" size="xs" />
              </Surface>
            </Pressable>
          </ExternalLink>
        </Surface>

        <Surface style={styles.sectionsWrapper}>
          <Collapsible title="File-based routing">
            <AppText variant="bodySmall">
              Route files stay in <AppText variant="code">src/app</AppText>, while screen code lives
              in <AppText variant="code">src/features</AppText>.
            </AppText>
            <AppText variant="bodySmall">
              The root layout composes application providers and the tab navigator.
            </AppText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <AppText variant="label" tone="brand">Learn more</AppText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <Surface tone="subtle" style={styles.collapsibleContent}>
              <AppText variant="bodySmall">
                You can open this project on Android, iOS, and the web. To open the web version,
                press <AppText variant="bodySmallStrong">w</AppText> in the terminal running this
                project.
              </AppText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </Surface>
          </Collapsible>

          <Collapsible title="Images">
            <AppText variant="bodySmall">
              For static images, you can use the <AppText variant="code">@2x</AppText> and{' '}
              <AppText variant="code">@3x</AppText> suffixes to provide files for different screen
              densities.
            </AppText>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <AppText variant="label" tone="brand">Learn more</AppText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Light and dark mode components">
            <AppText variant="bodySmall">
              The design system follows the device color scheme and exposes semantic tokens rather
              than raw palette values.
            </AppText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <AppText variant="label" tone="brand">Learn more</AppText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <AppText variant="bodySmall">
              The <AppText variant="code">motion</AppText> tokens provide shared durations, easing,
              springs, and the system reduced-motion policy for Reanimated.
            </AppText>
          </Collapsible>
        </Surface>
        {Platform.OS === 'web' && <WebBadge />}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: layout.maxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['3xl'],
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    justifyContent: 'center',
    gap: spacing.xs,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});

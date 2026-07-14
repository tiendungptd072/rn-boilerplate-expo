import { type PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText, Icon, motion, radius, spacing, Surface } from '@/design-system';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <Surface tone="subtle" style={styles.button}>
          <Icon
            name="chevronRight"
            size="sm"
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </Surface>

        <AppText variant="bodySmall">{title}</AppText>
      </Pressable>
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(motion.duration.fast).reduceMotion(motion.reduceMotion)}>
          <Surface tone="subtle" style={styles.content}>
            {children}
          </Surface>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    marginLeft: spacing.lg,
    padding: spacing.lg,
  },
});

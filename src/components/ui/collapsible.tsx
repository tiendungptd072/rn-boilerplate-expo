import { type PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  AppText,
  Icon,
  layout,
  motion,
  radius,
  spacing,
  Surface,
  useTheme,
} from '@/design-system';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        style={({ pressed }) => [
          styles.heading,
          {
            backgroundColor: pressed ? theme.colors.background.selected : undefined,
            borderColor: focused ? theme.colors.border.focus : 'transparent',
            borderRadius: theme.radius.sm,
            borderWidth: theme.borderWidth.thin,
          },
        ]}
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
    minHeight: layout.minTouchTarget,
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

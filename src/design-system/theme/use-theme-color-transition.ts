import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/design-system/theme/theme-provider';

/**
 * Cross-fades a semantic color across theme switches instead of snapping.
 *
 * Shared by every style property (background, border, text) that must track
 * a theme color, so a color change reads as one cohesive fade instead of
 * some edges animating and others popping instantly.
 */
export function useThemeColorTransition(targetColor: string): SharedValue<string> {
  const theme = useTheme();
  const target = useSharedValue(targetColor);
  const startColor = useSharedValue(targetColor);
  const endColor = useSharedValue(targetColor);
  const progress = useSharedValue(1);

  useEffect(() => {
    target.value = targetColor;
  }, [target, targetColor]);

  useAnimatedReaction(
    () => target.value,
    (nextColor, previousColor) => {
      if (previousColor === null || nextColor === previousColor) return;

      // Continue from the currently rendered intermediate color when the
      // color changes again before the previous transition has completed.
      startColor.value = interpolateColor(
        progress.value,
        [0, 1],
        [startColor.value, endColor.value],
        'RGB',
      );
      endColor.value = nextColor;
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: theme.motion.duration.themeTransition,
        easing: theme.motion.easing.standard,
        reduceMotion: theme.motion.reduceMotion,
      });
    },
  );

  return useDerivedValue(() =>
    interpolateColor(progress.value, [0, 1], [startColor.value, endColor.value], 'RGB'),
  );
}

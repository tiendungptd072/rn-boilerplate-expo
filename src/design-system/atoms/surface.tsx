import type { ViewProps } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useTheme } from "@/design-system/theme/theme-provider";
import { useThemeColorTransition } from "@/design-system/theme/use-theme-color-transition";
import type { SemanticColors } from "@/design-system/tokens/colors/semantic";
import type { ElevationToken } from "@/design-system/tokens/elevation";

type SurfaceTone = keyof SemanticColors["background"];

export type SurfaceProps = ViewProps & {
  elevation?: ElevationToken;
  tone?: SurfaceTone;
};

export function Surface({
  elevation = "none",
  style,
  tone = "canvas",
  ...props
}: SurfaceProps) {
  const theme = useTheme();
  const backgroundColor = useThemeColorTransition(theme.colors.background[tone]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View
      {...props}
      style={[animatedBackgroundStyle, theme.elevation[elevation], style]}
    />
  );
}

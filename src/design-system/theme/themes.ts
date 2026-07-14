import { createComponentColorTokens } from "@/design-system/tokens/colors/component";
import {
  darkSemanticColors,
  lightSemanticColors,
  type SemanticColors,
} from "@/design-system/tokens/colors/semantic";
import { elevation } from "@/design-system/tokens/elevation";
import { iconSize } from "@/design-system/tokens/icons";
import { layout } from "@/design-system/tokens/layout";
import { motion } from "@/design-system/tokens/motion";
import { borderWidth, radius } from "@/design-system/tokens/shape";
import { spacing } from "@/design-system/tokens/spacing";
import { typography } from "@/design-system/tokens/typography";

export type ThemeMode = "light" | "dark";

export type ThemePreference = ThemeMode | "system";

function createTheme<TMode extends ThemeMode>(
  mode: TMode,
  colors: SemanticColors,
) {
  return {
    mode,
    isDark: mode === "dark",

    colors,
    components: createComponentColorTokens(colors),

    typography,
    spacing,
    layout,
    radius,
    borderWidth,
    elevation,
    iconSize,
    motion,
  } as const;
}

export const themes = {
  light: createTheme("light", lightSemanticColors),
  dark: createTheme("dark", darkSemanticColors),
} as const;

export type AppTheme = (typeof themes)[ThemeMode];

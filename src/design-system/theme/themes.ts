import { createComponentColorTokens } from '@/design-system/tokens/colors/component';
import {
  darkSemanticColors,
  lightSemanticColors,
  type SemanticColors,
} from '@/design-system/tokens/colors/semantic';
import { elevation } from '@/design-system/tokens/elevation';
import { iconSize } from '@/design-system/tokens/icons';
import { layout } from '@/design-system/tokens/layout';
import { motion } from '@/design-system/tokens/motion';
import { borderWidth, radius } from '@/design-system/tokens/shape';
import { spacing } from '@/design-system/tokens/spacing';
import { typography } from '@/design-system/tokens/typography';

function createTheme(colors: SemanticColors) {
  return {
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
  light: createTheme(lightSemanticColors),
  dark: createTheme(darkSemanticColors),
} as const;

export type ThemeMode = keyof typeof themes;
export type AppTheme = (typeof themes)[ThemeMode];

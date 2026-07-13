import type { SemanticColors } from './semantic';

export type ComponentColorTokens = {
  button: {
    primary: { background: string; foreground: string; pressed: string; disabled: string };
    secondary: { background: string; foreground: string; pressed: string; disabled: string };
  };
  input: {
    background: string;
    foreground: string;
    placeholder: string;
    border: string;
    focusBorder: string;
    errorBorder: string;
    disabledBackground: string;
  };
  card: { background: string; border: string };
  tabBar: {
    background: string;
    indicator: string;
    active: string;
    inactive: string;
  };
  icon: { primary: string; secondary: string; brand: string; disabled: string };
  brandArtwork: { gradientStart: string; gradientEnd: string; splashBackground: string };
};

export function createComponentColorTokens(colors: SemanticColors): ComponentColorTokens {
  return {
    button: {
      primary: {
        background: colors.action.primary,
        foreground: colors.content.onAction,
        pressed: colors.action.primaryPressed,
        disabled: colors.action.disabled,
      },
      secondary: {
        background: colors.action.secondary,
        foreground: colors.content.primary,
        pressed: colors.action.secondaryPressed,
        disabled: colors.action.disabled,
      },
    },
    input: {
      background: colors.background.surface,
      foreground: colors.content.primary,
      placeholder: colors.content.muted,
      border: colors.border.default,
      focusBorder: colors.border.focus,
      errorBorder: colors.feedback.danger,
      disabledBackground: colors.background.subtle,
    },
    card: {
      background: colors.background.elevated,
      border: colors.border.subtle,
    },
    tabBar: {
      background: colors.background.surface,
      indicator: colors.background.selected,
      active: colors.content.primary,
      inactive: colors.content.secondary,
    },
    icon: {
      primary: colors.content.primary,
      secondary: colors.content.secondary,
      brand: colors.content.brand,
      disabled: colors.content.disabled,
    },
    brandArtwork: {
      gradientStart: colors.content.brand,
      gradientEnd: colors.action.primaryPressed,
      splashBackground: colors.action.primary,
    },
  };
}

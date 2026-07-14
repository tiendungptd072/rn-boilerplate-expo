import type { SemanticColors } from "./semantic";

/**
 * Component-level color tokens derived from semantic colors.
 *
 * Components should consume these tokens instead of reading semantic or
 * primitive colors directly. This keeps component states consistent across
 * light and dark themes.
 */
export type ComponentColorTokens = {
  button: {
    primary: {
      background: string;
      foreground: string;
      pressed: string;
      disabled: string;
      disabledForeground: string;
      focusRing: string;
    };

    secondary: {
      background: string;
      foreground: string;
      pressed: string;
      disabled: string;
      disabledForeground: string;
      border: string;
      pressedBorder: string;
      disabledBorder: string;
      focusRing: string;
    };
  };

  input: {
    background: string;
    foreground: string;
    placeholder: string;
    border: string;
    focusBorder: string;
    errorBorder: string;
    disabledBackground: string;
    disabledForeground: string;
    readOnlyBackground: string;
    selection: string;
    cursor: string;
    helper: string;
    error: string;
  };

  card: {
    background: string;
    elevatedBackground: string;
    border: string;
    selectedBackground: string;
    selectedBorder: string;
  };

  tabBar: {
    background: string;
    border: string;
    indicator: string;
    active: string;
    inactive: string;
    badgeBackground: string;
    badgeForeground: string;
  };

  icon: {
    primary: string;
    secondary: string;
    brand: string;
    inverse: string;
    disabled: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };

  divider: {
    subtle: string;
    default: string;
    strong: string;
  };

  overlay: {
    scrim: string;
  };

  brandArtwork: {
    gradientStart: string;
    gradientEnd: string;
    splashBackground: string;
    onSplash: string;
  };
};

export function createComponentColorTokens(
  colors: SemanticColors,
): ComponentColorTokens {
  return {
    button: {
      primary: {
        background: colors.action.primary,
        foreground: colors.content.onAction,
        pressed: colors.action.primaryPressed,
        disabled: colors.action.disabled,
        disabledForeground: colors.content.disabled,
        focusRing: colors.border.focus,
      },

      secondary: {
        background: colors.action.secondary,
        foreground: colors.content.primary,
        pressed: colors.action.secondaryPressed,
        disabled: colors.action.disabled,
        disabledForeground: colors.content.disabled,
        border: colors.border.default,
        pressedBorder: colors.border.strong,
        disabledBorder: colors.border.subtle,
        focusRing: colors.border.focus,
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
      disabledForeground: colors.content.disabled,
      readOnlyBackground: colors.background.subtle,
      selection: colors.background.selected,
      cursor: colors.content.brand,
      helper: colors.content.secondary,
      error: colors.feedback.danger,
    },

    card: {
      background: colors.background.surface,
      elevatedBackground: colors.background.elevated,
      border: colors.border.subtle,
      selectedBackground: colors.background.selected,
      selectedBorder: colors.border.focus,
    },

    tabBar: {
      background: colors.background.surface,
      border: colors.border.subtle,
      indicator: colors.action.primary,
      active: colors.content.brand,
      inactive: colors.content.secondary,
      badgeBackground: colors.feedback.danger,
      badgeForeground: colors.content.onAction,
    },

    icon: {
      primary: colors.content.primary,
      secondary: colors.content.secondary,
      brand: colors.content.brand,
      inverse: colors.content.inverse,
      disabled: colors.content.disabled,
      success: colors.feedback.success,
      warning: colors.feedback.warning,
      danger: colors.feedback.danger,
      info: colors.feedback.info,
    },

    divider: {
      subtle: colors.border.subtle,
      default: colors.border.default,
      strong: colors.border.strong,
    },

    overlay: {
      scrim: colors.overlay.scrim,
    },

    brandArtwork: {
      gradientStart: colors.action.primary,
      gradientEnd: colors.action.primaryPressed,
      splashBackground: colors.action.primary,
      onSplash: colors.content.onAction,
    },
  };
}

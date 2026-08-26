import type { SemanticColors } from './semantic';

type ButtonColorTokens = {
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

/** Component state colors derived exclusively from semantic tokens. */
export type ComponentColorTokens = {
  button: {
    primary: ButtonColorTokens;
    secondary: ButtonColorTokens;
    outline: ButtonColorTokens;
    ghost: ButtonColorTokens;
    destructive: ButtonColorTokens;
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
  radio: {
    background: string;
    foreground: string;
    supporting: string;
    border: string;
    selectedBorder: string;
    indicator: string;
    pressedBackground: string;
    disabledForeground: string;
    disabledBorder: string;
    focusRing: string;
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

export function createComponentColorTokens(colors: SemanticColors): ComponentColorTokens {
  const unavailable = {
    disabled: colors.action.disabled,
    disabledBorder: colors.border.subtle,
    disabledForeground: colors.content.disabled,
    focusRing: colors.border.focus,
  };

  return {
    button: {
      primary: {
        ...unavailable,
        background: colors.action.primary,
        border: colors.action.primary,
        foreground: colors.content.onAction,
        pressed: colors.action.primaryPressed,
        pressedBorder: colors.action.primaryPressed,
      },
      secondary: {
        ...unavailable,
        background: colors.action.secondary,
        border: colors.border.default,
        foreground: colors.content.primary,
        pressed: colors.action.secondaryPressed,
        pressedBorder: colors.border.strong,
      },
      outline: {
        ...unavailable,
        background: colors.background.transparent,
        border: colors.border.default,
        foreground: colors.content.primary,
        pressed: colors.action.secondaryPressed,
        pressedBorder: colors.border.strong,
      },
      ghost: {
        ...unavailable,
        background: colors.background.transparent,
        border: colors.background.transparent,
        foreground: colors.content.brand,
        pressed: colors.action.secondaryPressed,
        pressedBorder: colors.background.transparent,
      },
      destructive: {
        ...unavailable,
        background: colors.feedback.danger,
        border: colors.feedback.danger,
        foreground: colors.content.onAction,
        pressed: colors.feedback.danger,
        pressedBorder: colors.feedback.danger,
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
    radio: {
      background: colors.background.surface,
      foreground: colors.content.primary,
      supporting: colors.content.secondary,
      border: colors.border.default,
      selectedBorder: colors.border.focus,
      indicator: colors.action.primary,
      pressedBackground: colors.background.selected,
      disabledForeground: colors.content.disabled,
      disabledBorder: colors.border.subtle,
      focusRing: colors.border.focus,
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

import { primitiveColors as color } from "./primitive";

/**
 * Semantic color contract shared by light and dark themes.
 *
 * UI components should consume these semantic tokens instead of importing
 * primitive colors directly.
 */
export type SemanticColors = {
  background: {
    /** Transparent background for ghost controls and overlays. */
    transparent: string;

    /** Main application background. */
    canvas: string;

    /** Default background for cards, inputs, sheets, and containers. */
    surface: string;

    /** Low-emphasis background used for grouped or secondary content. */
    subtle: string;

    /** Background for selected rows, tabs, and active options. */
    selected: string;

    /** Background for elevated surfaces such as dialogs and popovers. */
    elevated: string;

    /** Opposite-tone background used for inverse sections. */
    inverse: string;
  };

  content: {
    /** Primary text and high-emphasis icons. */
    primary: string;

    /** Supporting text and medium-emphasis icons. */
    secondary: string;

    /** Placeholder, metadata, and low-emphasis content. */
    muted: string;

    /** Content displayed on an inverse background. */
    inverse: string;

    /** Brand-colored text, links, and icons. */
    brand: string;

    /** Disabled text and icons. */
    disabled: string;

    /** Content displayed on a solid action background. */
    onAction: string;
  };

  border: {
    /** Very low-emphasis separators and outlines. */
    subtle: string;

    /** Default component border. */
    default: string;

    /** High-emphasis border. */
    strong: string;

    /** Focus ring and active input border. */
    focus: string;
  };

  action: {
    /** Main action fill. */
    primary: string;

    /** Pressed state for the main action. */
    primaryPressed: string;

    /** Secondary action fill. */
    secondary: string;

    /** Pressed state for a secondary action. */
    secondaryPressed: string;

    /** Destructive action fill. */
    destructive: string;

    /** Pressed state for a destructive action. */
    destructivePressed: string;

    /** Disabled action fill. */
    disabled: string;
  };

  feedback: {
    /** Success foreground such as text, icon, or strong border. */
    success: string;

    /** Success background with low emphasis. */
    successSubtle: string;

    /** Warning foreground such as text, icon, or strong border. */
    warning: string;

    /** Warning background with low emphasis. */
    warningSubtle: string;

    /** Error or destructive foreground. */
    danger: string;

    /** Error or destructive background with low emphasis. */
    dangerSubtle: string;

    /** Informational foreground. */
    info: string;

    /** Informational background with low emphasis. */
    infoSubtle: string;
  };

  overlay: {
    /** Modal, drawer, and blocking overlay backdrop. */
    scrim: string;
  };
};

export const lightSemanticColors = {
  background: {
    transparent: "transparent",
    canvas: color.neutral[50],
    surface: color.neutral[0],
    subtle: color.neutral[100],
    selected: color.blue[50],
    elevated: color.neutral[0],
    inverse: color.neutral[950],
  },

  content: {
    primary: color.neutral[950],
    secondary: color.neutral[600],
    muted: color.neutral[500],
    inverse: color.neutral[0],
    brand: color.blue[700],
    disabled: color.neutral[400],
    onAction: color.white,
  },

  border: {
    subtle: color.neutral[100],
    default: color.neutral[200],
    strong: color.neutral[300],
    focus: color.blue[600],
  },

  action: {
    primary: color.blue[600],
    primaryPressed: color.blue[700],
    secondary: color.neutral[100],
    secondaryPressed: color.neutral[200],
    destructive: color.red[600],
    destructivePressed: color.red[700],
    disabled: color.neutral[200],
  },

  feedback: {
    success: color.green[700],
    successSubtle: color.green[50],
    warning: color.amber[700],
    warningSubtle: color.amber[50],
    danger: color.red[700],
    dangerSubtle: color.red[50],
    info: color.blue[700],
    infoSubtle: color.blue[50],
  },

  overlay: {
    scrim: color.blackAlpha[56],
  },
} as const satisfies SemanticColors;

export const darkSemanticColors = {
  background: {
    transparent: "transparent",
    canvas: color.neutral[950],
    surface: color.neutral[900],
    subtle: color.neutral[800],
    selected: color.blue[950],
    elevated: color.neutral[800],
    inverse: color.neutral[0],
  },

  content: {
    primary: color.neutral[50],
    secondary: color.neutral[300],
    muted: color.neutral[400],
    inverse: color.neutral[950],
    brand: color.blue[300],
    disabled: color.neutral[600],
    onAction: color.white,
  },

  border: {
    subtle: color.whiteAlpha[8],
    default: color.whiteAlpha[12],
    strong: color.whiteAlpha[24],
    focus: color.blue[400],
  },

  action: {
    primary: color.blue[500],
    primaryPressed: color.blue[600],
    secondary: color.whiteAlpha[8],
    secondaryPressed: color.whiteAlpha[16],
    destructive: color.red[500],
    destructivePressed: color.red[600],
    disabled: color.whiteAlpha[8],
  },

  feedback: {
    success: color.green[300],
    successSubtle: color.green[950],
    warning: color.amber[300],
    warningSubtle: color.amber[950],
    danger: color.red[300],
    dangerSubtle: color.red[950],
    info: color.blue[300],
    infoSubtle: color.blue[950],
  },

  overlay: {
    scrim: color.blackAlpha[72],
  },
} as const satisfies SemanticColors;

export type SemanticColorMode = "light" | "dark";

export const semanticColorsByMode: Record<SemanticColorMode, SemanticColors> = {
  light: lightSemanticColors,
  dark: darkSemanticColors,
};

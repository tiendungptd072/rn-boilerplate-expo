import { primitiveColors as color } from './primitive';

export type SemanticColors = {
  background: {
    canvas: string;
    surface: string;
    subtle: string;
    selected: string;
    elevated: string;
    inverse: string;
  };
  content: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    brand: string;
    disabled: string;
    onAction: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
  };
  action: {
    primary: string;
    primaryPressed: string;
    secondary: string;
    secondaryPressed: string;
    disabled: string;
  };
  feedback: {
    success: string;
    successSubtle: string;
    warning: string;
    warningSubtle: string;
    danger: string;
    dangerSubtle: string;
    info: string;
    infoSubtle: string;
  };
  overlay: {
    scrim: string;
  };
};

export const lightSemanticColors: SemanticColors = {
  background: {
    canvas: color.neutral[0],
    surface: color.neutral[0],
    subtle: color.neutral[100],
    selected: color.neutral[200],
    elevated: color.neutral[0],
    inverse: color.neutral[900],
  },
  content: {
    primary: color.neutral[950],
    secondary: color.neutral[600],
    muted: color.neutral[500],
    inverse: color.neutral[0],
    brand: color.blue[600],
    disabled: color.neutral[400],
    onAction: color.white,
  },
  border: {
    subtle: color.neutral[100],
    default: color.neutral[200],
    strong: color.neutral[400],
    focus: color.blue[600],
  },
  action: {
    primary: color.blue[600],
    primaryPressed: color.blue[700],
    secondary: color.neutral[100],
    secondaryPressed: color.neutral[200],
    disabled: color.neutral[200],
  },
  feedback: {
    success: color.green[700],
    successSubtle: color.green[50],
    warning: color.amber[700],
    warningSubtle: color.amber[50],
    danger: color.red[600],
    dangerSubtle: color.red[50],
    info: color.blue[600],
    infoSubtle: color.blue[50],
  },
  overlay: {
    scrim: color.blackAlpha[56],
  },
};

export const darkSemanticColors: SemanticColors = {
  background: {
    canvas: color.neutral[950],
    surface: color.neutral[900],
    subtle: color.neutral[800],
    selected: color.neutral[700],
    elevated: color.neutral[800],
    inverse: color.neutral[50],
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
    subtle: color.neutral[800],
    default: color.neutral[700],
    strong: color.neutral[500],
    focus: color.blue[400],
  },
  action: {
    primary: color.blue[500],
    primaryPressed: color.blue[400],
    secondary: color.neutral[800],
    secondaryPressed: color.neutral[700],
    disabled: color.neutral[800],
  },
  feedback: {
    success: color.green[500],
    successSubtle: color.green[900],
    warning: color.amber[500],
    warningSubtle: color.amber[900],
    danger: color.red[500],
    dangerSubtle: color.red[900],
    info: color.blue[400],
    infoSubtle: color.blue[900],
  },
  overlay: {
    scrim: color.blackAlpha[72],
  },
};

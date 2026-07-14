import { createContext, type PropsWithChildren, useContext } from "react";

import type { AppTheme } from "@/design-system/theme/themes";

const ThemeContext = createContext<AppTheme | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  theme: AppTheme;
}>;

/**
 * Provides resolved Design System tokens to UI components.
 *
 * This provider does not decide whether the application uses light,
 * dark, or system appearance. That responsibility belongs to
 * AppThemeProvider.
 */
export function DesignSystemProvider({ children, theme }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within DesignSystemProvider");
  }

  return theme;
}

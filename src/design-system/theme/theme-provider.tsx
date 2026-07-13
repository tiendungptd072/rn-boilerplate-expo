import { createContext, type PropsWithChildren, useContext } from 'react';

import type { AppTheme } from '@/design-system/theme/themes';

const ThemeContext = createContext<AppTheme | null>(null);

type ThemeProviderProps = PropsWithChildren<{ theme: AppTheme }>;

export function DesignSystemProvider({ children, theme }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within DesignSystemProvider');
  }

  return theme;
}

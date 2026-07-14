import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getThemePreference,
  removeStoredThemePreference,
  setStoredThemePreference,
} from '@/lib/storage/theme-preference-storage';

import { DesignSystemProvider } from './theme-provider';
import { themes, type ThemeMode, type ThemePreference } from './themes';

type AppThemeContextValue = {
  preference: ThemePreference;
  resolvedMode: ThemeMode;
  isDark: boolean;
  followsSystem: boolean;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  resetToSystem: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function resolveThemeMode(
  preference: ThemePreference,
  systemMode: ReturnType<typeof useColorScheme>,
): ThemeMode {
  if (preference !== 'system') return preference;
  return systemMode === 'dark' ? 'dark' : 'light';
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemMode = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(getThemePreference);
  const resolvedMode = resolveThemeMode(preference, systemMode);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setStoredThemePreference(nextPreference);
    setPreferenceState(nextPreference);
  }, []);

  const resetToSystem = useCallback(() => {
    removeStoredThemePreference();
    setPreferenceState('system');
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(resolvedMode === 'dark' ? 'light' : 'dark');
  }, [resolvedMode, setPreference]);

  const contextValue = useMemo(
    () => ({
      preference,
      resolvedMode,
      isDark: resolvedMode === 'dark',
      followsSystem: preference === 'system',
      setPreference,
      toggleTheme,
      resetToSystem,
    }),
    [preference, resolvedMode, setPreference, toggleTheme, resetToSystem],
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      <DesignSystemProvider theme={themes[resolvedMode]}>{children}</DesignSystemProvider>
    </AppThemeContext.Provider>
  );
}

export function useThemeSettings(): AppThemeContextValue {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useThemeSettings must be used within AppThemeProvider');
  return context;
}

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type PropsWithChildren, useMemo } from 'react';

import {
  AppThemeProvider,
  useThemeSettings,
} from '@/design-system/theme/app-theme-provider';
import { useTheme } from '@/design-system/theme/theme-provider';
import { LocalizationProvider } from '@/i18n/localization-provider';
import { SessionProvider } from '@/lib/auth/session-provider';
import { queryClient } from '@/lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <LocalizationProvider>
        <AppThemeProvider>
          <ThemedAppProviders>{children}</ThemedAppProviders>
        </AppThemeProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}

/** Composes providers that require the resolved design-system theme. */
function ThemedAppProviders({ children }: PropsWithChildren) {
  const { resolvedMode: mode } = useThemeSettings();
  const theme = useTheme();
  const navigationTheme = useMemo(() => {
    const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.colors.content.brand,
        background: theme.colors.background.canvas,
        card: theme.colors.background.surface,
        text: theme.colors.content.primary,
        border: theme.colors.border.default,
        notification: theme.colors.feedback.danger,
      },
    };
  }, [mode, theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

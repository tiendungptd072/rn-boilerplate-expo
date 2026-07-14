import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { PropsWithChildren } from 'react';

import { useTheme } from '@/design-system';
import { useThemeSettings } from '@/design-system/theme/app-theme-provider';
import { queryClient } from '@/lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
  const { resolvedMode: mode } = useThemeSettings();
  const theme = useTheme();
  const baseNavigationTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      primary: theme.colors.content.brand,
      background: theme.colors.background.canvas,
      card: theme.colors.background.surface,
      text: theme.colors.content.primary,
      border: theme.colors.border.default,
      notification: theme.colors.feedback.danger,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar animated style={mode === 'dark' ? 'light' : 'dark'} />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

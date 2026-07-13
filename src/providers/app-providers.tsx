import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import type { PropsWithChildren } from 'react';

import { DesignSystemProvider, themes } from '@/design-system';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  const theme = themes[mode];
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
      <DesignSystemProvider theme={theme}>
        <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
      </DesignSystemProvider>
    </QueryClientProvider>
  );
}

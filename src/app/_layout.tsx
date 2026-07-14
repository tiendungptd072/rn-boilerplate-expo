import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/navigation/app-tabs';
import { AppThemeProvider } from '@/design-system/theme/app-theme-provider';
import { AppProviders } from '@/providers/app-providers';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppProviders>
        <AnimatedSplashOverlay />
        <AppTabs />
      </AppProviders>
    </AppThemeProvider>
  );
}

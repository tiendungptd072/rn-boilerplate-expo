import "@/global.css";
import { LocalizationProvider } from "@/i18n";

import * as SplashScreen from "expo-splash-screen";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppThemeProvider } from "@/design-system/theme/app-theme-provider";
import AppTabs from "@/navigation/app-tabs";
import { AppProviders } from "@/providers/app-providers";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <AppThemeProvider>
        <AppProviders>
          <AnimatedSplashOverlay />
          <AppTabs />
        </AppProviders>
      </AppThemeProvider>
    </LocalizationProvider>
  );
}

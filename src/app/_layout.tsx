import "@/global.css";

import * as SplashScreen from "expo-splash-screen";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/navigation/app-tabs";
import { AppProviders } from "@/providers/app-providers";
import { AppReadyProvider } from "@/providers/app-ready-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <AppReadyProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </AppReadyProvider>
    </AppProviders>
  );
}

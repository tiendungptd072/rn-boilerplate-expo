import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';
import AppTabs from '@/navigation/app-tabs';
import { AppProviders } from '@/providers/app-providers';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 200, fade: true });

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  const theme = useTheme();
  const splashHidden = useRef(false);
  const hideSplash = useCallback(() => {
    if (splashHidden.current) return;

    splashHidden.current = true;
    SplashScreen.hide();
  }, []);

  return (
    <View
      onLayout={hideSplash}
      style={[styles.app, { backgroundColor: theme.colors.background.canvas }]}>
      <AppTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

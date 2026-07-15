import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';
import { useSession } from '@/lib/auth/session-provider';
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
  const { isLoading, session } = useSession();
  const splashHidden = useRef(false);
  const hideSplash = useCallback(() => {
    if (splashHidden.current) return;

    splashHidden.current = true;
    SplashScreen.hide();
  }, []);

  if (isLoading) return null;

  return (
    <View
      onLayout={hideSplash}
      style={[styles.app, { backgroundColor: theme.colors.background.canvas }]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(session)}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

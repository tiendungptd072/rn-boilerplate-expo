import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { AppState, Platform } from 'react-native';

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(state.isConnected === true && state.isInternetReachable !== false);
  }),
);

if (Platform.OS !== 'web') {
  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (status) => {
      setFocused(status === 'active');
    });

    return () => subscription.remove();
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;

        if (status && status >= 400 && status < 500) return false;

        return failureCount < 1;
      },
      staleTime: 30_000,
    },
  },
});

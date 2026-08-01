import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
} from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

import { isApiError } from '@/lib/api-error';

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
        if (isApiError(error)) return error.retryable && failureCount < 1;
        return false;
      },
      staleTime: 30_000,
    },
  },
});

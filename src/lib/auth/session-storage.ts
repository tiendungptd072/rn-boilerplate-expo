import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_STORAGE_KEY = 'auth.session';

export async function getStoredSession(): Promise<string | null> {
  if (Platform.OS === 'web') {
    // ponytail: Keep web sessions in memory until a backend can issue an HttpOnly cookie.
    // Persisting access tokens in browser storage would expose them to injected scripts.
    return null;
  }

  return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
}

export async function storeSession(session: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  if (session === null) {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
  } else {
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, session);
  }
}

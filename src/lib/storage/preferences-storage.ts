import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV instance for non-sensitive app preferences such as language and theme.
 *
 * Credentials, tokens, and other sensitive data must use SecureStore instead.
 */
export const preferencesStorage = createMMKV({ id: 'app-storage' });

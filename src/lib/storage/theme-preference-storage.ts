import type { ThemePreference } from '@/design-system';
import { preferencesStorage } from '@/lib/storage/preferences-storage';

const THEME_PREFERENCE_KEY = 'settings.theme-preference';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** Reads and validates the saved theme preference. */
export function getThemePreference(): ThemePreference {
  const storedValue = preferencesStorage.getString(THEME_PREFERENCE_KEY);

  return isThemePreference(storedValue) ? storedValue : 'system';
}

/** Persists a non-sensitive theme preference in MMKV. */
export function setStoredThemePreference(preference: ThemePreference): void {
  preferencesStorage.set(THEME_PREFERENCE_KEY, preference);
}

/** Removes the saved theme preference so the app can follow the system mode. */
export function removeStoredThemePreference(): void {
  preferencesStorage.remove(THEME_PREFERENCE_KEY);
}

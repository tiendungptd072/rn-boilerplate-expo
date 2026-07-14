import type { ThemePreference } from "@/design-system/theme/themes";
import { appStorage } from "@/lib/storage/mmkv-storage";

const THEME_PREFERENCE_KEY = "settings.theme-preference";

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function getThemePreference(): ThemePreference {
  const storedValue = appStorage.getItem(THEME_PREFERENCE_KEY);

  return isThemePreference(storedValue) ? storedValue : "system";
}

export function setStoredThemePreference(preference: ThemePreference): void {
  appStorage.setItem(THEME_PREFERENCE_KEY, preference);
}

export function removeStoredThemePreference(): void {
  appStorage.removeItem(THEME_PREFERENCE_KEY);
}

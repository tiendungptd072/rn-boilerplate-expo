import { useLocales } from "expo-localization";
import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { preferencesStorage } from "@/lib/storage/preferences-storage";

import {
    defaultLanguage,
    isLanguagePreference,
    isSupportedLanguage,
    type LanguagePreference,
    localeByLanguage,
    resources,
    type SupportedLanguage,
    type TranslationKey,
    type TranslationParams,
} from "./locales";

const LANGUAGE_STORAGE_KEY = "settings.language-preference";

type LocalizationContextValue = {
  /**
   * Lựa chọn hiện tại của người dùng:
   * system, vi hoặc en.
   */
  preference: LanguagePreference;

  /**
   * Ngôn ngữ thực tế app đang hiển thị.
   */
  language: SupportedLanguage;

  /**
   * Locale đầy đủ dùng cho Intl.
   */
  locale: string;

  followsSystem: boolean;

  t: (key: TranslationKey, params?: TranslationParams) => string;

  setLanguage: (preference: LanguagePreference) => void;

  resetToSystem: () => void;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null,
);

/** Reads the persisted language choice, falling back to system language mode. */
function getInitialPreference(): LanguagePreference {
  const storedPreference = preferencesStorage.getString(LANGUAGE_STORAGE_KEY);

  return isLanguagePreference(storedPreference) ? storedPreference : "system";
}

/** Replaces `{{parameter}}` placeholders in a translated string. */
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

/**
 * Provides language selection and translation access to the application.
 *
 * The user's preference is persisted in MMKV. When the preference is
 * `system`, the provider resolves the first device locale to a supported
 * language and falls back to the default language when it is unsupported.
 */
export function LocalizationProvider({ children }: PropsWithChildren) {
  const deviceLocales = useLocales();

  const deviceLanguageCode = deviceLocales[0]?.languageCode;

  const systemLanguage: SupportedLanguage = isSupportedLanguage(
    deviceLanguageCode,
  )
    ? deviceLanguageCode
    : defaultLanguage;

  const [preference, setPreference] =
    useState<LanguagePreference>(getInitialPreference);

  const language: SupportedLanguage =
    preference === "system" ? systemLanguage : preference;

  /** Persists a language choice and updates translations immediately. */
  const setLanguage = useCallback((nextPreference: LanguagePreference) => {
    preferencesStorage.set(LANGUAGE_STORAGE_KEY, nextPreference);

    setPreference(nextPreference);
  }, []);

  /** Removes the saved choice so the app follows the device language again. */
  const resetToSystem = useCallback(() => {
    preferencesStorage.remove(LANGUAGE_STORAGE_KEY);

    setPreference("system");
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const currentTranslation = resources[language][key];

      const fallbackTranslation = resources[defaultLanguage][key];

      const translation = currentTranslation ?? fallbackTranslation ?? key;

      return interpolate(translation, params);
    },
    [language],
  );

  const contextValue = useMemo<LocalizationContextValue>(
    () => ({
      preference,
      language,
      locale: localeByLanguage[language],
      followsSystem: preference === "system",

      t,
      setLanguage,
      resetToSystem,
    }),
    [language, preference, resetToSystem, setLanguage, t],
  );

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

/**
 * Returns the current language state and translation helpers.
 *
 * @throws Error when called outside LocalizationProvider.
 */
export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }

  return context;
}

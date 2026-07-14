import { enTranslations, type TranslationKey } from "./locales/en";
import { viTranslations } from "./locales/vi";

export const resources = {
  en: enTranslations,
  vi: viTranslations,
} as const;

export type SupportedLanguage = keyof typeof resources;

export type LanguagePreference = SupportedLanguage | "system";

export type TranslationParams = Record<string, string | number>;

export const supportedLanguages = Object.keys(resources) as SupportedLanguage[];

export const defaultLanguage: SupportedLanguage = "vi";

export const localeByLanguage = {
  vi: "vi-VN",
  en: "en-US",
} as const satisfies Record<SupportedLanguage, string>;

export function isSupportedLanguage(
  value: unknown,
): value is SupportedLanguage {
  return value === "vi" || value === "en";
}

export function isLanguagePreference(
  value: unknown,
): value is LanguagePreference {
  return value === "system" || isSupportedLanguage(value);
}

export type { TranslationKey };

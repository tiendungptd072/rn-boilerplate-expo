import { enAuth } from "./auth";
import { enCommon } from "./common";
import { enSettings } from "./settings";

export const enTranslations = {
  ...enCommon,
  ...enAuth,
  ...enSettings,
} as const;

export type TranslationKey = keyof typeof enTranslations;

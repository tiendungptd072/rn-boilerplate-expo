import { enAuth } from "./auth";
import { enCommon } from "./common";
import { enPermissions } from "./permissions";
import { enSettings } from "./settings";

export const enTranslations = {
  ...enCommon,
  ...enPermissions,
  ...enAuth,
  ...enSettings,
} as const;

export type TranslationKey = keyof typeof enTranslations;

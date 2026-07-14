import type { TranslationKey } from "../en";

import { viAuth } from "./auth";
import { viCommon } from "./common";
import { viSettings } from "./settings";

export const viTranslations = {
  ...viCommon,
  ...viAuth,
  ...viSettings,
} satisfies Record<TranslationKey, string>;

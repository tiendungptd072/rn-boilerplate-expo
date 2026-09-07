import type { TranslationKey } from "../en";

import { viAuth } from "./auth";
import { viCommon } from "./common";
import { viPermissions } from "./permissions";
import { viSettings } from "./settings";

export const viTranslations = {
  ...viCommon,
  ...viPermissions,
  ...viAuth,
  ...viSettings,
} satisfies Record<TranslationKey, string>;

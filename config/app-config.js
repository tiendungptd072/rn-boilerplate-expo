const { z } = require('zod');

const appEnvironmentSchema = z.enum(['development', 'preview', 'production']);

const brandConfigSchema = z.object({
  androidPackage: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/),
  initialized: z.boolean(),
  iosBundleIdentifier: z.string().regex(/^[A-Za-z][A-Za-z0-9.-]+$/),
  name: z.string().trim().min(1),
  scheme: z.string().regex(/^[a-z][a-z0-9+.-]*$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
});

const initProjectConfigSchema = brandConfigSchema
  .omit({ initialized: true })
  .extend({
    assets: z
      .object({
        androidBackground: z.string().min(1).optional(),
        androidForeground: z.string().min(1).optional(),
        androidMonochrome: z.string().min(1).optional(),
        favicon: z.string().min(1).optional(),
        icon: z.string().min(1).optional(),
        iosIcon: z.string().min(1).optional(),
        splash: z.string().min(1).optional(),
      })
      .optional(),
  });

function resolveAppEnvironment(environment) {
  const appVariant = environment.APP_VARIANT;
  const publicVariant = environment.EXPO_PUBLIC_APP_ENV;

  if (appVariant && publicVariant && appVariant !== publicVariant) {
    throw new Error(
      `APP_VARIANT (${appVariant}) must match EXPO_PUBLIC_APP_ENV (${publicVariant})`,
    );
  }

  return appEnvironmentSchema.parse(appVariant ?? publicVariant ?? 'development');
}

function resolveAppVariant(brand, environment) {
  if (environment === 'production') {
    return {
      androidPackage: brand.androidPackage,
      iosBundleIdentifier: brand.iosBundleIdentifier,
      name: brand.name,
      scheme: brand.scheme,
    };
  }

  const suffix = environment === 'development' ? 'dev' : 'preview';
  const label = environment === 'development' ? 'Dev' : 'Preview';

  return {
    androidPackage: `${brand.androidPackage}.${suffix}`,
    iosBundleIdentifier: `${brand.iosBundleIdentifier}.${suffix}`,
    name: `${brand.name} ${label}`,
    scheme: `${brand.scheme}-${suffix}`,
  };
}

function assertProductionReady(brand, environment, easProjectId) {
  if (environment !== 'production') return;

  if (!brand.initialized) {
    throw new Error('Run `bun run init-project -- --config <brand.json>` before production');
  }

  if (!easProjectId) {
    throw new Error('EXPO_PROJECT_ID is required for production configuration');
  }
}

module.exports = {
  appEnvironmentSchema,
  assertProductionReady,
  brandConfigSchema,
  initProjectConfigSchema,
  resolveAppEnvironment,
  resolveAppVariant,
};

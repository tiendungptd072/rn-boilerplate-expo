import type { ConfigContext, ExpoConfig } from 'expo/config';

import brandJson from './config/brand.json';
import {
  assertProductionReady,
  brandConfigSchema,
  resolveAppEnvironment,
  resolveAppVariant,
} from './config/app-config.js';

export default ({ config }: ConfigContext): ExpoConfig => {
  const brand = brandConfigSchema.parse(brandJson);
  const environment = resolveAppEnvironment(process.env);
  const variant = resolveAppVariant(brand, environment);
  const easProjectId = process.env.EXPO_PROJECT_ID?.trim();

  assertProductionReady(brand, environment, easProjectId);

  return {
    ...config,
    name: variant.name,
    slug: brand.slug,
    version: brand.version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: variant.scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      icon: './assets/expo.icon',
      bundleIdentifier: variant.iosBundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: variant.androidPackage,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#F8F9FA',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
          dark: {
            backgroundColor: '#0D0E11',
            image: './assets/images/splash-icon.png',
          },
        },
      ],
      [
        'expo-localization',
        {
          supportedLocales: {
            ios: ['vi', 'en'],
            android: ['vi', 'en'],
          },
        },
      ],
      'expo-status-bar',
      'expo-font',
      'expo-image',
      'expo-secure-store',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appEnvironment: environment,
      router: {},
      ...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
    },
  };
};

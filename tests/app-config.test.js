import { describe, expect, test } from 'bun:test';

import appConfig from '../config/app-config.js';

const {
  assertProductionReady,
  brandConfigSchema,
  resolveAppEnvironment,
  resolveAppVariant,
} = appConfig;
const brand = brandConfigSchema.parse({
  androidPackage: 'com.example.mobileapp',
  initialized: true,
  iosBundleIdentifier: 'com.example.mobileapp',
  name: 'Mobile App',
  scheme: 'mobileapp',
  slug: 'mobile-app',
  version: '1.0.0',
});

describe('app config', () => {
  test('uses distinct identifiers for every non-production variant', () => {
    expect(resolveAppVariant(brand, 'development')).toMatchObject({
      androidPackage: 'com.example.mobileapp.dev',
      iosBundleIdentifier: 'com.example.mobileapp.dev',
      scheme: 'mobileapp-dev',
    });
    expect(resolveAppVariant(brand, 'preview')).toMatchObject({
      androidPackage: 'com.example.mobileapp.preview',
      iosBundleIdentifier: 'com.example.mobileapp.preview',
      scheme: 'mobileapp-preview',
    });
    expect(resolveAppVariant(brand, 'production')).toMatchObject({
      androidPackage: 'com.example.mobileapp',
      iosBundleIdentifier: 'com.example.mobileapp',
      scheme: 'mobileapp',
    });
  });

  test('fails when build and public runtime environments diverge', () => {
    expect(() =>
      resolveAppEnvironment({
        APP_VARIANT: 'production',
        EXPO_PUBLIC_APP_ENV: 'preview',
      }),
    ).toThrow('must match');
  });

  test('fails closed until production identity is initialized and linked', () => {
    expect(() =>
      assertProductionReady({ ...brand, initialized: false }, 'production', 'project-id'),
    ).toThrow('init-project');
    expect(() => assertProductionReady(brand, 'production')).toThrow('EXPO_PROJECT_ID');
    expect(() => assertProductionReady(brand, 'production', 'project-id')).not.toThrow();
  });
});

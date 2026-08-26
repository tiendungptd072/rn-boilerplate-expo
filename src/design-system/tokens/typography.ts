import { Platform, type TextStyle } from 'react-native';

export const fontFamilies = {
  sans:
    Platform.select({
      ios: 'system-ui',
      web: 'var(--font-display)',
      default: 'normal',
    }) ?? 'normal',
  mono:
    Platform.select({
      ios: 'ui-monospace',
      web: 'var(--font-mono)',
      default: 'monospace',
    }) ?? 'monospace',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.sans,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '600',
    letterSpacing: -1.2,
  },
  heading: {
    fontFamily: fontFamilies.sans,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fontFamilies.sans,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  headline: {
    fontFamily: fontFamilies.sans,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  callout: {
    fontFamily: fontFamilies.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmallStrong: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

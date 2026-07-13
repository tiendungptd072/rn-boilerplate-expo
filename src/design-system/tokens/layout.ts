import { Platform } from 'react-native';

export const layout = {
  maxContentWidth: 800,
  minTouchTarget: 44,
  bottomTabInset: Platform.select({ ios: 50, android: 80 }) ?? 0,
  screenGutter: 24,
} as const;

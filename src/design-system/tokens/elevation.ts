import { Platform, type ViewStyle } from 'react-native';

import { primitiveColors } from '@/design-system/tokens/colors/primitive';

function createElevation(
  elevation: number,
  shadowOpacity: 8 | 12 | 16,
  shadowRadius: number,
  shadowOffsetY: number,
): ViewStyle {
  return (
    Platform.select<ViewStyle>({
      android: { elevation },
      ios: {
        shadowColor: primitiveColors.black,
        shadowOpacity: shadowOpacity / 100,
        shadowRadius,
        shadowOffset: { width: 0, height: shadowOffsetY },
      },
      web: {
        boxShadow: `0 ${shadowOffsetY}px ${shadowRadius * 2}px ${primitiveColors.blackAlpha[shadowOpacity]}`,
      },
      default: {},
    }) ?? {}
  );
}

export const elevation = {
  none: {} satisfies ViewStyle,
  sm: createElevation(2, 8, 3, 1),
  md: createElevation(4, 12, 6, 3),
  lg: createElevation(8, 16, 12, 6),
} as const;

export type ElevationToken = keyof typeof elevation;

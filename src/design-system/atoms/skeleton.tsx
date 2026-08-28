import {
  View,
  type DimensionValue,
  type ViewProps,
} from 'react-native';

import { useTheme } from '../theme/theme-provider';
import type { RadiusToken } from '../tokens/shape';

export type SkeletonProps = ViewProps & {
  height?: DimensionValue;
  radius?: RadiusToken;
  width?: DimensionValue;
};

/** Static loading placeholder that remains safe when reduced motion is enabled. */
export function Skeleton({
  height = 16,
  radius = 'sm',
  style,
  width = '100%',
  ...props
}: SkeletonProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          backgroundColor: theme.components.skeleton.background,
          borderRadius: theme.radius[radius],
          height,
          width,
        },
        style,
      ]}
    />
  );
}

import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';
import type { ElevationToken } from '@/design-system/tokens/elevation';
import type { SemanticColors } from '@/design-system/tokens/colors/semantic';

type SurfaceTone = keyof SemanticColors['background'];

export type SurfaceProps = ViewProps & {
  elevation?: ElevationToken;
  tone?: SurfaceTone;
};

export function Surface({ elevation = 'none', style, tone = 'canvas', ...props }: SurfaceProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[{ backgroundColor: theme.colors.background[tone] }, theme.elevation[elevation], style]}
    />
  );
}

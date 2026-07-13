import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';
import type { TypographyVariant } from '@/design-system/tokens/typography';

type TextTone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'brand'
  | 'disabled'
  | 'success'
  | 'warning'
  | 'danger';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

export function AppText({ style, tone = 'primary', variant = 'body', ...props }: AppTextProps) {
  const theme = useTheme();
  const color =
    tone === 'success' || tone === 'warning' || tone === 'danger'
      ? theme.colors.feedback[tone]
      : theme.colors.content[tone];

  return <Text {...props} style={[theme.typography[variant], { color }, style]} />;
}

import { View, type ViewProps } from 'react-native';

import { useTheme } from '../theme/theme-provider';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'selected';

export type CardProps = ViewProps & {
  padded?: boolean;
  variant?: CardVariant;
};

/** Theme-aware content container for grouped information and settings. */
export function Card({
  padded = true,
  style,
  variant = 'default',
  ...props
}: CardProps) {
  const theme = useTheme();
  const colors = theme.components.card;
  const selected = variant === 'selected';
  const outlined = variant === 'outlined' || selected;

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor:
            variant === 'elevated'
              ? colors.elevatedBackground
              : selected
                ? colors.selectedBackground
                : colors.background,
          borderColor: selected ? colors.selectedBorder : colors.border,
          borderRadius: theme.radius.lg,
          borderWidth: outlined
            ? theme.borderWidth.thin
            : theme.borderWidth.none,
          padding: padded ? theme.spacing.md : theme.spacing.none,
        },
        variant === 'elevated' && theme.elevation.md,
        style,
      ]}
    />
  );
}

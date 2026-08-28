import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '../theme/theme-provider';

export type DividerProps = ViewProps & {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'subtle' | 'default' | 'strong';
};

/** Decorative separator for grouping related content. */
export function Divider({
  orientation = 'horizontal',
  style,
  tone = 'subtle',
  ...props
}: DividerProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      accessibilityElementsHidden
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        { backgroundColor: theme.components.divider[tone] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});

import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText, radius, spacing, Surface } from '@/design-system';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <AppText variant="bodySmall">{title}</AppText>
      <Surface tone="selected" style={styles.codeSnippet}>
        <AppText tone="secondary">{hint}</AppText>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: radius.sm,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
});

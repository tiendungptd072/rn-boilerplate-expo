import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

import { useTheme } from '@/design-system/theme/theme-provider';
import type { IconSizeToken } from '@/design-system/tokens/icons';

const iconNames = {
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  externalLink: { ios: 'arrow.up.right.square', android: 'open_in_new', web: 'open_in_new' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  explore: { ios: 'safari.fill', android: 'explore', web: 'explore' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
} as const;

export type IconName = keyof typeof iconNames;
type IconTone = keyof ReturnType<typeof useTheme>['components']['icon'];
type SymbolProps = ComponentProps<typeof SymbolView>;

export type IconProps = Omit<SymbolProps, 'name' | 'size' | 'tintColor'> & {
  name: IconName;
  size?: IconSizeToken | number;
  tone?: IconTone;
};

export function Icon({ name, size = 'md', tone = 'primary', ...props }: IconProps) {
  const theme = useTheme();
  const resolvedSize = typeof size === 'number' ? size : theme.iconSize[size];

  return (
    <SymbolView
      {...props}
      name={iconNames[name]}
      size={resolvedSize}
      tintColor={theme.components.icon[tone]}
    />
  );
}

import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/design-system/theme/theme-provider';

export default function AppTabs() {
  const theme = useTheme();
  const tabs = theme.components.tabBar;

  return (
    <NativeTabs
      backgroundColor={tabs.background}
      indicatorColor={tabs.indicator}
      labelStyle={{ default: { color: tabs.inactive }, selected: { color: tabs.active } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

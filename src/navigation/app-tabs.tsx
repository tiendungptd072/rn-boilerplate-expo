import { Tabs } from 'expo-router';
import {
  type ColorValue,
  Image,
  type ImageSourcePropType,
  StyleSheet,
} from 'react-native';

import { useTheme } from '@/design-system/theme/theme-provider';

export default function AppTabs() {
  const theme = useTheme();
  const tabs = theme.components.tabBar;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabs.active,
        tabBarInactiveTintColor: tabs.inactive,
        tabBarStyle: {
          backgroundColor: tabs.background,
          borderTopColor: tabs.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              color={color}
              size={size}
              source={require('@/assets/images/tabIcons/home.png')}
            />
          ),
        }}
      />

      {/* init-project:explore-demo:start */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              color={color}
              size={size}
              source={require('@/assets/images/tabIcons/explore.png')}
            />
          ),
        }}
      />
      {/* init-project:explore-demo:end */}
    </Tabs>
  );
}

type TabIconProps = {
  color: ColorValue;
  size: number;
  source: ImageSourcePropType;
};

function TabIcon({ color, size, source }: TabIconProps) {
  return (
    <Image
      source={source}
      style={[styles.icon, { height: size, tintColor: color, width: size }]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});

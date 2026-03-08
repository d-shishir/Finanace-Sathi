import React from 'react';
import { View, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/icons';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS: { name: string; icon: 'home' | 'receipt' | 'pie-chart' | 'bar-chart' | 'settings' }[] = [
  { name: 'index', icon: 'home' },
  { name: 'transactions', icon: 'receipt' },
  { name: 'budget', icon: 'pie-chart' },
  { name: 'analytics', icon: 'bar-chart' },
  { name: 'settings', icon: 'settings' },
];

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 12,
        left: 32,
        right: 32,
        height: 56,
        borderRadius: 28,
        borderCurve: 'continuous',
        backgroundColor: colors.tabBar,
        borderWidth: 1,
        borderColor: colors.tabBarBorder,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const tab = TABS[index];
        if (!tab) return null;
        const focused = state.index === index;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            onPress={() => {
              if (process.env.EXPO_OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
            }}
          >
            <AppIcon
              name={tab.icon}
              size={22}
              color={focused ? colors.tabBarActive : colors.tabBarInactive}
              strokeWidth={focused ? 1.8 : 1.5}
            />
            {focused && (
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.tabBarActive,
                  marginTop: 5,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="budget" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

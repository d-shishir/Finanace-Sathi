import React from 'react';
import { Stack } from 'expo-router/stack';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function OnboardingLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

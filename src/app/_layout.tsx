import 'react-native-get-random-values';
import React from 'react';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsDark, useThemeColors } from '@/hooks/use-theme-colors';

const queryClient = new QueryClient();

export default function RootLayout() {
  const isDark = useIsDark();
  const colors = useThemeColors();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-transaction"
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.85, 1.0],
              headerShown: true,
              headerTitle: 'Add Transaction',
            }}
          />
          <Stack.Screen
            name="transaction/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Transaction Details',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="goals/index"
            options={{
              headerShown: true,
              headerTitle: 'Savings Goals',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="goals/add"
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              headerShown: true,
              headerTitle: 'New Goal',
            }}
          />
          <Stack.Screen
            name="goals/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Goal Details',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

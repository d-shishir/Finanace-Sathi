import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { GoalCard } from '@/features/goals/goal-card';
import { Button } from '@/components/ui/button';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const router = useRouter();
  const goals = useAppStore((s) => s.goals);
  const deleteGoal = useAppStore((s) => s.deleteGoal);

  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: FontSizes.lg, color: colors.textSecondary }}>
          Goal not found
        </Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Goal', `Remove "${goal.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteGoal(goal.id);
          router.replace('/goals');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.xl }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen options={{ headerTitle: goal.name }} />
      <GoalCard goal={goal} expanded />
      <Button title="Delete Goal" onPress={handleDelete} variant="danger" fullWidth />
    </ScrollView>
  );
}

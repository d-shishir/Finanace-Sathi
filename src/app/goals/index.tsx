import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { GoalCard } from '@/features/goals/goal-card';
import { FontSizes, Spacing, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/utils/formatters';

export default function GoalsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const goals = useAppStore((s) => s.goals);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 120 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Summary */}
      <Animated.View entering={FadeInUp.duration(300)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: Spacing.sm,
          }}
        >
          <View>
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary }}>
              Total Saved
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes['2xl'],
                fontWeight: '700',
                color: colors.income,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatCurrency(totalSaved, currencySymbol)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary }}>
              Total Target
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes['2xl'],
                fontWeight: '700',
                color: colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatCurrency(totalTarget, currencySymbol)}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Goals */}
      {goals.map((goal, i) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          index={i}
          expanded
        />
      ))}

      {goals.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: Spacing['5xl'] }}>
          <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>🎯</Text>
          <Text
            style={{
              fontSize: FontSizes.lg,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            No Goals Yet
          </Text>
          <Text
            style={{
              fontSize: FontSizes.md,
              color: colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Create your first savings goal{'\n'}and start tracking your progress!
          </Text>
        </View>
      )}

      <Button
        title="+ Create New Goal"
        onPress={() => router.push('/goals/add')}
        fullWidth
        size="lg"
      />
    </ScrollView>
  );
}

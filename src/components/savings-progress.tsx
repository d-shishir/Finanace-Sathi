import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type { SavingsGoal } from '@/types';
import { ProgressBar } from './ui/progress-bar';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface GoalCardCompactProps {
  goal: SavingsGoal;
  index?: number;
}

export function GoalCardCompact({ goal, index = 0 }: GoalCardCompactProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const progress = goal.currentAmount / goal.targetAmount;

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).duration(250)}>
      <Pressable
        onPress={() =>
          router.push({ pathname: '/goals/[id]', params: { id: goal.id } })
        }
        style={({ pressed }) => ({
          width: 150,
          padding: Spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.xl,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.border,
          gap: Spacing.sm,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ fontSize: 24 }}>{goal.icon}</Text>
        <Text
          style={{
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: colors.text,
          }}
          numberOfLines={1}
        >
          {goal.name}
        </Text>
        <ProgressBar progress={progress} color={goal.color} height={4} />
        <Text
          selectable
          style={{
            fontSize: FontSizes.xs,
            color: colors.textSecondary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {formatCurrency(goal.currentAmount, currencySymbol)}
          <Text style={{ color: colors.textTertiary }}>
            {' / '}
            {formatCurrency(goal.targetAmount, currencySymbol)}
          </Text>
        </Text>
      </Pressable>
    </Animated.View>
  );
}

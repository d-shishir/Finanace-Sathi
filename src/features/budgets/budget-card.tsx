import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Budget } from '@/types';
import { getCategoryById } from '@/constants/categories';
import { ProgressBar } from '@/components/ui/progress-bar';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface BudgetCardProps {
  budget: Budget;
  index?: number;
  onPress?: () => void;
}

export function BudgetCard({ budget, index = 0, onPress }: BudgetCardProps) {
  const colors = useThemeColors();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const category = getCategoryById(budget.categoryId);
  const progress = budget.spent / budget.amount;
  const isOver = progress > 1;
  const remaining = budget.amount - budget.spent;

  const progressColor = isOver
    ? colors.danger
    : progress > 0.8
      ? colors.warning
      : colors.primary;

  return (
    <Animated.View entering={FadeInRight.delay(index * 40).duration(250)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.xl,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.lg,
          gap: Spacing.md,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: BorderRadius.sm,
                borderCurve: 'continuous',
                backgroundColor: category.color + '15',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>{category.icon}</Text>
            </View>
            <Text style={{ fontSize: FontSizes.md, fontWeight: '600', color: colors.text }}>
              {category.name}
            </Text>
          </View>
          {isOver && (
            <View
              style={{
                backgroundColor: colors.dangerLight,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 2,
                borderRadius: BorderRadius.full,
              }}
            >
              <Text
                style={{
                  fontSize: FontSizes.xs,
                  fontWeight: '600',
                  color: colors.danger,
                }}
              >
                Over budget
              </Text>
            </View>
          )}
        </View>

        <ProgressBar progress={Math.min(progress, 1)} color={progressColor} height={6} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            selectable
            style={{
              fontSize: FontSizes.sm,
              color: colors.textSecondary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {formatCurrency(budget.spent, currencySymbol)} of{' '}
            {formatCurrency(budget.amount, currencySymbol)}
          </Text>
          <Text
            selectable
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              fontVariant: ['tabular-nums'],
              color: isOver ? colors.danger : colors.income,
            }}
          >
            {isOver ? 'Over by ' : ''}
            {formatCurrency(Math.abs(remaining), currencySymbol)}
            {!isOver && ' left'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

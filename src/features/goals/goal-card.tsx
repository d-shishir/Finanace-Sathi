import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { SavingsGoal } from '@/types';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface GoalCardProps {
  goal: SavingsGoal;
  index?: number;
  expanded?: boolean;
  onPress?: () => void;
}

export function GoalCard({ goal, index = 0, expanded = false, onPress }: GoalCardProps) {
  const colors = useThemeColors();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const depositToGoal = useAppStore((s) => s.depositToGoal);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const progress = goal.currentAmount / goal.targetAmount;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    depositToGoal(goal.id, amount);
    setDepositAmount('');
    setShowDeposit(false);
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(400)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.xl,
          borderCurve: 'continuous',
          padding: Spacing.xl,
          gap: Spacing.lg,
          opacity: pressed && !expanded ? 0.8 : 1,
        })}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: BorderRadius.md,
                borderCurve: 'continuous',
                backgroundColor: goal.color + '15',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 22 }}>{goal.icon}</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text
                style={{
                  fontSize: FontSizes.lg,
                  fontWeight: '700',
                  color: colors.text,
                }}
              >
                {goal.name}
              </Text>
              <Text
                style={{
                  fontSize: FontSizes.xs,
                  color: colors.textSecondary,
                }}
              >
                Deadline: {formatDate(goal.deadline)}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: FontSizes.xl,
              fontWeight: '700',
              color: goal.color,
              fontVariant: ['tabular-nums'],
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <ProgressBar progress={progress} color={goal.color} height={8} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary }}>
              Saved
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes.lg,
                fontWeight: '700',
                color: colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatCurrency(goal.currentAmount, currencySymbol)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary }}>
              Target
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes.lg,
                fontWeight: '700',
                color: colors.textSecondary,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatCurrency(goal.targetAmount, currencySymbol)}
            </Text>
          </View>
        </View>

        {expanded && (
          <View style={{ gap: Spacing.md }}>
            {showDeposit ? (
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <TextInput
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  placeholder="Amount"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textTertiary}
                  style={{
                    flex: 1,
                    height: 44,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: BorderRadius.md,
                    paddingHorizontal: Spacing.md,
                    fontSize: FontSizes.md,
                    color: colors.text,
                    backgroundColor: colors.surfaceSecondary,
                    fontFamily: Fonts.sans,
                  }}
                />
                <Button title="Add" onPress={handleDeposit} size="sm" />
                <Button
                  title="Cancel"
                  onPress={() => setShowDeposit(false)}
                  variant="ghost"
                  size="sm"
                />
              </View>
            ) : (
              <Button
                title="Add Deposit"
                onPress={() => setShowDeposit(true)}
                variant="secondary"
                fullWidth
              />
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

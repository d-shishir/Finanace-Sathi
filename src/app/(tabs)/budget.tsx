import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BudgetCard } from '@/features/budgets/budget-card';
import { AppIcon } from '@/components/ui/icons';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, formatMonth, getCurrentMonth } from '@/utils/formatters';
import type { CategoryId } from '@/types';

export default function BudgetScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const budgets = useAppStore((s) => s.budgets);
  const addBudget = useAppStore((s) => s.addBudget);
  const deleteBudget = useAppStore((s) => s.deleteBudget);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);

  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryId>('food');
  const [newAmount, setNewAmount] = useState('');

  const currentMonth = getCurrentMonth();
  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const totalBudget = monthBudgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = monthBudgets.reduce((s, b) => s + b.spent, 0);

  const existingCategoryIds = monthBudgets.map((b) => b.categoryId);
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !existingCategoryIds.includes(c.id),
  );

  const handleAddBudget = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }
    if (process.env.EXPO_OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    addBudget(newCategory, amount);
    setNewAmount('');
    setShowAdd(false);
  };

  const handleDeleteBudget = (id: string) => {
    Alert.alert('Delete Budget', 'Remove this budget?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (process.env.EXPO_OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          deleteBudget(id);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInUp.duration(250)}
        style={{
          paddingTop: insets.top + Spacing.xl,
          paddingHorizontal: Spacing.xl,
          paddingBottom: Spacing.lg,
        }}
      >
        <Text
          style={{
            fontSize: FontSizes['2xl'],
            fontWeight: '800',
            color: colors.text,
            fontFamily: Fonts.sans,
            letterSpacing: -0.3,
          }}
        >
          Budget
        </Text>
        <Text
          style={{
            fontSize: FontSizes.sm,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {formatMonth(currentMonth)}
        </Text>
      </Animated.View>

      {/* Overview card */}
      {monthBudgets.length > 0 && (
        <Animated.View
          entering={FadeInUp.delay(100).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: BorderRadius['2xl'],
              borderCurve: 'continuous',
              padding: Spacing.xl,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: Spacing.lg,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: FontSizes.xs,
                    color: colors.textSecondary,
                  }}
                >
                  Total Budget
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: FontSizes['2xl'],
                    fontWeight: '700',
                    color: colors.text,
                    fontVariant: ['tabular-nums'],
                    marginTop: 4,
                  }}
                >
                  {formatCurrency(totalBudget, currencySymbol)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: FontSizes.xs,
                    color: colors.textSecondary,
                  }}
                >
                  Spent
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: FontSizes['2xl'],
                    fontWeight: '700',
                    color:
                      totalSpent > totalBudget ? colors.expense : colors.income,
                    fontVariant: ['tabular-nums'],
                    marginTop: 4,
                  }}
                >
                  {formatCurrency(totalSpent, currencySymbol)}
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={totalBudget > 0 ? totalSpent / totalBudget : 0}
              color={totalSpent > totalBudget ? colors.expense : colors.primary}
              backgroundColor={colors.border}
              height={8}
            />
            <Text
              style={{
                fontSize: FontSizes.xs,
                color: colors.textTertiary,
                marginTop: Spacing.sm,
                textAlign: 'right',
              }}
            >
              {totalBudget > 0
                ? Math.round((totalSpent / totalBudget) * 100)
                : 0}
              % used
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Budget List */}
      {monthBudgets.length > 0 ? (
        <Animated.View
          entering={FadeInUp.delay(200).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}
        >
          {monthBudgets.map((budget, i) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              index={i}
              onPress={() => handleDeleteBudget(budget.id)}
            />
          ))}
        </Animated.View>
      ) : !showAdd ? (
        <Animated.View
          entering={FadeInDown.delay(150).duration(250)}
          style={{ paddingVertical: Spacing['4xl'], alignItems: 'center' }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <AppIcon name="pie-chart" size={28} color={colors.textTertiary} />
          </View>
          <Text
            style={{
              fontSize: FontSizes.lg,
              fontWeight: '700',
              color: colors.text,
              marginBottom: Spacing.xs,
            }}
          >
            No budgets set
          </Text>
          <Text
            style={{
              fontSize: FontSizes.sm,
              color: colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Create category budgets to track{'\n'}your spending limits
          </Text>
        </Animated.View>
      ) : null}

      {/* Add Budget */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.xl }}
      >
        {showAdd ? (
          <Card>
            <Text
              style={{
                fontSize: FontSizes.md,
                fontWeight: '600',
                color: colors.text,
                marginBottom: Spacing.md,
              }}
            >
              Add Budget
            </Text>

            {availableCategories.length > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: Spacing.sm,
                    marginBottom: Spacing.md,
                  }}
                >
                  {availableCategories.map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => {
                        if (process.env.EXPO_OS === 'ios') {
                          Haptics.selectionAsync();
                        }
                        setNewCategory(cat.id);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: Spacing.md,
                        paddingVertical: Spacing.xs,
                        borderRadius: BorderRadius.full,
                        backgroundColor:
                          newCategory === cat.id
                            ? cat.color + '20'
                            : colors.surfaceSecondary,
                        borderWidth: newCategory === cat.id ? 1.5 : 0,
                        borderColor:
                          newCategory === cat.id ? cat.color : 'transparent',
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>{cat.icon}</Text>
                      <Text
                        style={{
                          fontSize: FontSizes.xs,
                          fontWeight: '500',
                          color:
                            newCategory === cat.id
                              ? cat.color
                              : colors.textSecondary,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  <TextInput
                    value={newAmount}
                    onChangeText={setNewAmount}
                    placeholder="Budget amount"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textTertiary}
                    style={{
                      flex: 1,
                      height: 46,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: BorderRadius.lg,
                      paddingHorizontal: Spacing.md,
                      fontSize: FontSizes.md,
                      color: colors.text,
                      backgroundColor: colors.surfaceSecondary,
                    }}
                  />
                  <Button title="Add" onPress={handleAddBudget} size="sm" />
                </View>

                <Pressable
                  onPress={() => setShowAdd(false)}
                  style={{ alignItems: 'center', marginTop: Spacing.md }}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      color: colors.textSecondary,
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text
                style={{
                  fontSize: FontSizes.sm,
                  color: colors.textSecondary,
                }}
              >
                All categories have budgets.
              </Text>
            )}
          </Card>
        ) : (
          <Button
            title="+ Add Budget Category"
            onPress={() => {
              if (process.env.EXPO_OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setShowAdd(true);
            }}
            variant="secondary"
            fullWidth
          />
        )}
      </Animated.View>
    </ScrollView>
  );
}

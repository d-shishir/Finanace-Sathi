import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { AppIcon } from '@/components/ui/icons';
import { SectionTitle } from '@/components/ui/section-title';
import { ChartCard } from '@/components/ui/chart-card';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { TransactionItem } from '@/components/transaction-item';
import { SpendingChart } from '@/components/spending-chart';
import { GoalCardCompact } from '@/components/savings-progress';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/utils/formatters';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profile = useAppStore((s) => s.profile);
  const transactions = useAppStore((s) => s.transactions);
  const goals = useAppStore((s) => s.goals);
  const getMonthlyIncome = useAppStore((s) => s.getMonthlyIncome);
  const getMonthlyExpense = useAppStore((s) => s.getMonthlyExpense);
  const getTotalBalance = useAppStore((s) => s.getTotalBalance);
  const getCategorySpending = useAppStore((s) => s.getCategorySpending);

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();
  const totalBalance = getTotalBalance();
  const categorySpending = getCategorySpending();
  const { currencySymbol } = profile;

  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
    : 0;
  const avgDailySpending = monthlyExpense / 30;

  const hasTransactions = transactions.length > 0;
  const hasGoals = goals.length > 0;
  const hasCategoryData = Object.keys(categorySpending).length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{
            paddingTop: insets.top + Spacing.lg,
            paddingHorizontal: Spacing.xl,
            paddingBottom: Spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: FontSizes['2xl'],
                fontWeight: '700',
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              {getGreeting()}
            </Text>
            <Text
              style={{
                fontSize: FontSizes.sm,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {format(new Date(), 'MMMM yyyy')}
            </Text>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
              {(profile.name || 'FS').slice(0, 2).toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View
          entering={FadeInUp.delay(50).duration(300)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg }}
        >
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: BorderRadius['2xl'],
              borderCurve: 'continuous',
              padding: Spacing.xl,
            }}
          >
            <Text
              style={{
                fontSize: FontSizes.sm,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: Spacing.xs,
              }}
            >
              Total Balance
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes['4xl'],
                fontWeight: '700',
                color: '#FFFFFF',
                fontVariant: ['tabular-nums'],
                letterSpacing: -1,
              }}
            >
              {formatCurrency(totalBalance, currencySymbol)}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: Spacing.md,
                marginTop: Spacing.xl,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AppIcon name="arrow-up" size={14} color="#34D399" />
                  <Text style={{ fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.7)' }}>
                    Income
                  </Text>
                </View>
                <Text
                  selectable
                  style={{
                    fontSize: FontSizes.lg,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {formatCurrency(monthlyIncome, currencySymbol)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AppIcon name="arrow-down" size={14} color="#F87171" />
                  <Text style={{ fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.7)' }}>
                    Expenses
                  </Text>
                </View>
                <Text
                  selectable
                  style={{
                    fontSize: FontSizes.lg,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {formatCurrency(monthlyExpense, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(300)}
          style={{
            paddingHorizontal: Spacing.xl,
            flexDirection: 'row',
            gap: Spacing.md,
            marginBottom: Spacing.xl,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: BorderRadius.xl,
              borderCurve: 'continuous',
              padding: Spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary, marginBottom: 4 }}>
              Savings Rate
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes.xl,
                fontWeight: '700',
                color: savingsRate >= 0 ? colors.income : colors.expense,
                fontVariant: ['tabular-nums'],
              }}
            >
              {savingsRate.toFixed(1)}%
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: BorderRadius.xl,
              borderCurve: 'continuous',
              padding: Spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary, marginBottom: 4 }}>
              Daily Avg
            </Text>
            <Text
              selectable
              style={{
                fontSize: FontSizes.xl,
                fontWeight: '700',
                color: colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatCurrency(avgDailySpending, currencySymbol)}
            </Text>
          </View>
        </Animated.View>

        {/* Spending by Category */}
        {hasCategoryData && (
          <Animated.View
            entering={FadeInUp.delay(150).duration(300)}
            style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
          >
            <ChartCard
              title="Spending by Category"
              subtitle="This month"
              rightElement={<AppIcon name="pie-chart" size={18} color={colors.textSecondary} />}
            >
              <SpendingChart data={categorySpending} />
            </ChartCard>
          </Animated.View>
        )}

        {/* Savings Goals */}
        {hasGoals && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(300)}
            style={{ marginBottom: Spacing.xl }}
          >
            <SectionTitle
              title="Savings Goals"
              actionText="View All"
              onAction={() => router.push('/goals')}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}
            >
              {goals.map((goal, i) => (
                <GoalCardCompact key={goal.id} goal={goal} index={i} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Recent Transactions */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(300)}
        >
          <SectionTitle
            title="Recent Transactions"
            actionText={hasTransactions ? 'See All' : undefined}
            onAction={hasTransactions ? () => router.push('/(tabs)/transactions') : undefined}
          />
          {hasTransactions ? (
            transactions.slice(0, 5).map((tx, i) => (
              <TransactionItem key={tx.id} transaction={tx} index={i} showDate />
            ))
          ) : (
            <View style={{ paddingHorizontal: Spacing.xl, paddingVertical: Spacing['3xl'], alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: BorderRadius.lg,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing.md,
                }}
              >
                <AppIcon name="receipt" size={24} color={colors.textTertiary} />
              </View>
              <Text
                style={{
                  fontSize: FontSizes.md,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: Spacing.xs,
                }}
              >
                No transactions yet
              </Text>
              <Text
                style={{
                  fontSize: FontSizes.sm,
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}
              >
                Tap + to add your first transaction
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <FloatingAddButton />
    </View>
  );
}

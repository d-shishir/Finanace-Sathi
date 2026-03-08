import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, subMonths } from 'date-fns';
import { ChartCard } from '@/components/ui/chart-card';
import { SpendingChart } from '@/components/spending-chart';
import { WeeklyChart } from '@/components/weekly-chart';
import { LineChart } from '@/components/charts/line-chart';
import { InsightCard } from '@/features/analytics/insight-card';
import { AppIcon } from '@/components/ui/icons';
import { getCategoryById } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/utils/formatters';
import type { InsightMessage } from '@/types';

export default function AnalyticsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const transactions = useAppStore((s) => s.transactions);
  const getMonthlyIncome = useAppStore((s) => s.getMonthlyIncome);
  const getMonthlyExpense = useAppStore((s) => s.getMonthlyExpense);
  const getCategorySpending = useAppStore((s) => s.getCategorySpending);
  const getWeeklySpending = useAppStore((s) => s.getWeeklySpending);
  const getTotalSavings = useAppStore((s) => s.getTotalSavings);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();
  const categorySpending = getCategorySpending();
  const weeklySpending = getWeeklySpending();
  const totalSavings = getTotalSavings();
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
      : 0;
  const avgDailySpending = monthlyExpense / 30;

  const monthlyTrendData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      const monthStr = format(month, 'yyyy-MM');
      const expense = transactions
        .filter((t) => t.type === 'expense' && t.date.slice(0, 7) === monthStr)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        label: format(month, 'MMM'),
        value: expense,
      };
    });
  }, [transactions]);

  const insights = useMemo<InsightMessage[]>(() => {
    if (transactions.length === 0) {
      return [
        {
          id: '0',
          message:
            'Start adding transactions to see personalized insights about your spending habits.',
          type: 'info',
          icon: 'info',
        },
      ];
    }

    const messages: InsightMessage[] = [];

    if (savingsRate > 20) {
      messages.push({
        id: '1',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Excellent financial discipline!`,
        type: 'success',
        icon: 'trending-up',
      });
    } else if (savingsRate < 10 && monthlyIncome > 0) {
      messages.push({
        id: '2',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing non-essential spending.`,
        type: 'warning',
        icon: 'info',
      });
    }

    const topCategory = Object.entries(categorySpending).sort(
      (a, b) => b[1] - a[1],
    )[0];
    if (topCategory) {
      const cat = getCategoryById(topCategory[0]);
      const pct =
        monthlyExpense > 0
          ? ((topCategory[1] / monthlyExpense) * 100).toFixed(0)
          : '0';
      messages.push({
        id: '3',
        message: `${cat.name} is your top spending category at ${pct}% of total expenses.`,
        type: 'info',
        icon: 'bar-chart',
      });
    }

    if (totalSavings > 0) {
      messages.push({
        id: '4',
        message: `You've saved ${formatCurrency(totalSavings, currencySymbol)} across all your goals.`,
        type: 'success',
        icon: 'trending-up',
      });
    }

    return messages;
  }, [transactions, savingsRate, categorySpending, totalSavings, currencySymbol]);

  const hasData = transactions.length > 0;

  const statCards = [
    {
      label: 'Avg. Daily',
      value: formatCurrency(avgDailySpending, currencySymbol),
      color: colors.expense,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      color: savingsRate >= 0 ? colors.income : colors.expense,
    },
    {
      label: 'Transactions',
      value: transactions.length.toString(),
      color: colors.text,
    },
    {
      label: 'Total Saved',
      value: formatCurrency(totalSavings, currencySymbol),
      color: colors.income,
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInUp.delay(0).duration(250)}
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
          Financial Report
        </Text>
        <Text
          style={{
            fontSize: FontSizes.sm,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {hasData
            ? 'Your monthly financial overview'
            : 'Add transactions to see your report'}
        </Text>
      </Animated.View>

      {/* Income vs Expense */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <ChartCard
          title="Income vs Expense"
          subtitle="This month"
          rightElement={
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <AppIcon name="arrow-up" size={18} color={colors.income} />
              <AppIcon name="arrow-down" size={18} color={colors.expense} />
            </View>
          }
        >
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <View
              style={{
                flex: 1,
                padding: Spacing.lg,
                borderRadius: BorderRadius.lg,
                borderCurve: 'continuous',
                backgroundColor: colors.incomeLight,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AppIcon name="arrow-up" size={16} color={colors.income} />
                <Text
                  style={{
                    fontSize: FontSizes.xs,
                    color: colors.income,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Income
                </Text>
              </View>
              <Text
                selectable
                style={{
                  fontSize: FontSizes.xl,
                  fontWeight: '700',
                  color: colors.income,
                  fontVariant: ['tabular-nums'],
                  marginTop: 4,
                }}
              >
                {formatCurrency(monthlyIncome, currencySymbol)}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                padding: Spacing.lg,
                borderRadius: BorderRadius.lg,
                borderCurve: 'continuous',
                backgroundColor: colors.expenseLight,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AppIcon name="arrow-down" size={16} color={colors.expense} />
                <Text
                  style={{
                    fontSize: FontSizes.xs,
                    color: colors.expense,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Expense
                </Text>
              </View>
              <Text
                selectable
                style={{
                  fontSize: FontSizes.xl,
                  fontWeight: '700',
                  color: colors.expense,
                  fontVariant: ['tabular-nums'],
                  marginTop: 4,
                }}
              >
                {formatCurrency(monthlyExpense, currencySymbol)}
              </Text>
            </View>
          </View>
        </ChartCard>
      </Animated.View>

      {/* Monthly Spending Trend */}
      {hasData && (
        <Animated.View
          entering={FadeInUp.delay(150).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <ChartCard
            title="Spending Trend"
            subtitle="Last 6 months"
            rightElement={
              <AppIcon name="trending-up" size={18} color={colors.primary} />
            }
          >
            <LineChart
              data={monthlyTrendData}
              height={140}
              color={colors.primary}
              formatValue={(v) => formatCurrency(v, currencySymbol)}
            />
          </ChartCard>
        </Animated.View>
      )}

      {/* Category Breakdown */}
      {Object.keys(categorySpending).length > 0 && (
        <Animated.View
          entering={FadeInUp.delay(200).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <ChartCard
            title="Category Breakdown"
            subtitle="Where your money goes"
            rightElement={
              <AppIcon name="bar-chart" size={18} color={colors.primary} />
            }
          >
            <SpendingChart data={categorySpending} />
          </ChartCard>
        </Animated.View>
      )}

      {/* Weekly */}
      {weeklySpending.some((v) => v > 0) && (
        <Animated.View
          entering={FadeInUp.delay(250).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <ChartCard
            title="Weekly Trend"
            subtitle="Last 7 days"
            rightElement={
              <AppIcon name="trending-up" size={18} color={colors.primary} />
            }
          >
            <WeeklyChart data={weeklySpending} />
          </ChartCard>
        </Animated.View>
      )}

      {/* Quick Stats */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md }}>
          <AppIcon name="bar-chart" size={20} color={colors.text} />
          <Text
            style={{
              fontSize: FontSizes.lg,
              fontWeight: '700',
              color: colors.text,
              letterSpacing: -0.2,
            }}
          >
            Quick Stats
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}
        >
          {statCards.map((stat, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.delay(350 + i * 60).duration(250)}
              style={{
                width: '47%',
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.xl,
                borderCurve: 'continuous',
                padding: Spacing.lg,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: FontSizes.xs,
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {stat.label}
              </Text>
              <Text
                selectable
                style={{
                  fontSize: FontSizes.xl,
                  fontWeight: '700',
                  color: stat.color,
                  fontVariant: ['tabular-nums'],
                  marginTop: 4,
                }}
              >
                {stat.value}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Insights */}
      <Animated.View
        entering={FadeInUp.delay(550).duration(250)}
        style={{ paddingHorizontal: Spacing.xl }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md }}>
          <AppIcon name="info" size={20} color={colors.text} />
          <Text
            style={{
              fontSize: FontSizes.lg,
              fontWeight: '700',
              color: colors.text,
              letterSpacing: -0.2,
            }}
          >
            Insights
          </Text>
        </View>
        <View style={{ gap: Spacing.md }}>
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/category-badge';
import { getCategoryById, PAYMENT_METHODS } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const router = useRouter();
  const transactions = useAppStore((s) => s.transactions);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: FontSizes.lg, color: colors.textSecondary }}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const category = getCategoryById(transaction.categoryId);
  const paymentMethod = PAYMENT_METHODS.find((p) => p.id === transaction.paymentMethod);
  const isExpense = transaction.type === 'expense';

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(transaction.id);
            router.replace('/(tabs)/transactions');
          },
        },
      ]
    );
  };

  const DetailRow = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: FontSizes.md, color: colors.textSecondary }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon && <Text style={{ fontSize: 14 }}>{icon}</Text>}
        <Text
          selectable
          style={{
            fontSize: FontSizes.md,
            fontWeight: '500',
            color: colors.text,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.xl }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen options={{ headerTitle: isExpense ? 'Expense' : 'Income' }} />

      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{ alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl }}
      >
        <CategoryBadge categoryId={transaction.categoryId} size="lg" />
        <Text
          style={{
            fontSize: FontSizes.md,
            fontWeight: '500',
            color: colors.textSecondary,
          }}
        >
          {category.name}
        </Text>
        <Text
          selectable
          style={{
            fontSize: FontSizes['4xl'],
            fontWeight: '800',
            color: isExpense ? colors.expense : colors.income,
            fontVariant: ['tabular-nums'],
            fontFamily: Fonts.sans,
          }}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount, currencySymbol)}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(300)}>
        <Card variant="elevated">
          <DetailRow label="Type" value={transaction.type} icon={isExpense ? '📤' : '📥'} />
          <DetailRow label="Category" value={category.name} icon={category.icon} />
          <DetailRow label="Date" value={formatDate(transaction.date)} icon="📅" />
          <DetailRow label="Time" value={formatTime(transaction.date)} icon="🕐" />
          <DetailRow
            label="Payment"
            value={paymentMethod?.name ?? transaction.paymentMethod}
            icon={paymentMethod?.icon}
          />
          {transaction.note && (
            <DetailRow label="Note" value={transaction.note} icon="📝" />
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(300)} style={{ gap: Spacing.md }}>
        <Button title="Delete Transaction" onPress={handleDelete} variant="danger" fullWidth />
      </Animated.View>
    </ScrollView>
  );
}

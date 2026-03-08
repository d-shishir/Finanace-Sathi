import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type { Transaction } from '@/types';
import { getCategoryById } from '@/constants/categories';
import { CategoryBadge } from './ui/category-badge';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface TransactionItemProps {
  transaction: Transaction;
  index?: number;
  showDate?: boolean;
}

export function TransactionItem({
  transaction,
  index = 0,
  showDate = false,
}: TransactionItemProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const category = getCategoryById(transaction.categoryId);
  const isExpense = transaction.type === 'expense';

  return (
    <Animated.View entering={FadeInRight.delay(index * 30).duration(250)}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/transaction/[id]',
            params: { id: transaction.id },
          })
        }
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.xl,
          gap: Spacing.md,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <CategoryBadge categoryId={transaction.categoryId} size="md" />

        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={{
              fontSize: FontSizes.md,
              fontWeight: '500',
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {transaction.note || category.name}
          </Text>
          <Text
            style={{
              fontSize: FontSizes.xs,
              color: colors.textSecondary,
            }}
          >
            {showDate ? formatDate(transaction.date) : formatTime(transaction.date)}
            {' · '}
            {category.name}
          </Text>
        </View>

        <Text
          selectable
          style={{
            fontSize: FontSizes.md,
            fontWeight: '600',
            fontVariant: ['tabular-nums'],
            color: isExpense ? colors.expense : colors.income,
          }}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount, currencySymbol)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

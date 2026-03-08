import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { TransactionType, Transaction } from '@/types';
import { AppIcon } from '@/components/ui/icons';
import { TransactionItem } from '@/components/transaction-item';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

const TYPE_FILTERS: { label: string; value: TransactionType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
];

export default function TransactionsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const transactions = useAppStore((s) => s.transactions);
  const getFilteredTransactions = useAppStore((s) => s.getFilteredTransactions);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return getFilteredTransactions({
      type: typeFilter === 'all' ? undefined : typeFilter,
      search: search || undefined,
    });
  }, [transactions, typeFilter, search, getFilteredTransactions]);

  const renderItem = useCallback(
    ({ item, index }: { item: Transaction; index: number }) => (
      <TransactionItem transaction={item} index={index} showDate />
    ),
    [],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        entering={FadeInUp.duration(250)}
        style={{
          paddingTop: insets.top + Spacing.xl,
          paddingHorizontal: Spacing.xl,
          paddingBottom: Spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: FontSizes['2xl'],
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Transactions
        </Text>

        <View
          style={{
            marginTop: Spacing.md,
            height: 44,
            backgroundColor: colors.surface,
            borderRadius: BorderRadius.lg,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <AppIcon name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textTertiary}
            style={{
              flex: 1,
              fontSize: FontSizes.md,
              color: colors.text,
            }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <AppIcon name="x" size={16} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: Spacing.sm,
            marginTop: Spacing.md,
          }}
        >
          {TYPE_FILTERS.map((filter) => {
            const isActive = typeFilter === filter.value;
            return (
              <Pressable
                key={filter.value}
                onPress={() => {
                  if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
                  setTypeFilter(filter.value);
                }}
                style={{
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.sm,
                  borderRadius: BorderRadius.full,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSizes.sm,
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                  }}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingVertical: Spacing['5xl'], alignItems: 'center' }}>
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
                marginBottom: Spacing.lg,
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
              No transactions found
            </Text>
            <Text
              style={{
                fontSize: FontSizes.sm,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              {search ? 'Try a different search term' : 'Start by adding your first transaction'}
            </Text>
          </View>
        }
      />

      <FloatingAddButton />
    </View>
  );
}

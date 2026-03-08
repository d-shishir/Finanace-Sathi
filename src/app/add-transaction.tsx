import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { TransactionType, CategoryId, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

export default function AddTransactionScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const addTransaction = useAppStore((s) => s.addTransaction);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('food');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }

    addTransaction({
      type,
      amount: parsedAmount,
      categoryId,
      date: new Date().toISOString(),
      note,
      paymentMethod,
    });

    router.replace('/(tabs)');
  };

  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    borderCurve: 'continuous' as const,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.md,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: Fonts.sans,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: Spacing.xl,
          gap: Spacing.xl,
          paddingBottom: Spacing['5xl'],
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Selector */}
        <Animated.View entering={FadeInUp.duration(300)}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            Type
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {(['expense', 'income'] as TransactionType[]).map((t) => {
              const isActive = type === t;
              const typeColors: Record<string, string> = {
                expense: colors.expense,
                income: colors.income,
              };
              return (
                <Pressable
                  key={t}
                  onPress={() => {
                    setType(t);
                    if (t === 'expense') setCategoryId('food');
                    else if (t === 'income') setCategoryId('salary');
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: Spacing.md,
                    borderRadius: BorderRadius.lg,
                    borderCurve: 'continuous',
                    alignItems: 'center',
                    backgroundColor: isActive ? typeColors[t] + '15' : colors.surface,
                    borderWidth: isActive ? 1.5 : 0,
                    borderColor: isActive ? typeColors[t] : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      fontWeight: '600',
                      color: isActive ? typeColors[t] : colors.textSecondary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInUp.delay(50).duration(300)}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            Amount
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: FontSizes['2xl'],
                fontWeight: '300',
                color: colors.textTertiary,
              }}
            >
              {currencySymbol}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              autoFocus
              placeholderTextColor={colors.textTertiary}
              style={[
                inputStyle,
                {
                  flex: 1,
                  fontSize: FontSizes['2xl'],
                  fontWeight: '700',
                  height: 56,
                  fontVariant: ['tabular-nums'],
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Category */}
        <Animated.View entering={FadeInUp.delay(100).duration(300)}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {categories.map((cat) => {
              const isActive = categoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderRadius: BorderRadius.full,
                    backgroundColor: isActive ? cat.color + '20' : colors.surface,
                    borderWidth: isActive ? 1.5 : 0,
                    borderColor: isActive ? cat.color : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? cat.color : colors.textSecondary,
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View entering={FadeInUp.delay(150).duration(300)}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            Payment Method
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
            {PAYMENT_METHODS.map((pm) => {
              const isActive = paymentMethod === pm.id;
              return (
                <Pressable
                  key={pm.id}
                  onPress={() => setPaymentMethod(pm.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    borderRadius: BorderRadius.full,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{pm.icon}</Text>
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      fontWeight: '600',
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                    }}
                  >
                    {pm.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Note */}
        <Animated.View entering={FadeInUp.delay(200).duration(300)}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.text,
              marginBottom: Spacing.sm,
            }}
          >
            Note
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.textTertiary}
            style={inputStyle}
          />
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(250).duration(300)}>
          <Button title="Save Transaction" onPress={handleSave} fullWidth size="lg" />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

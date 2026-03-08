import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CURRENCIES } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

export default function CurrencyScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setProfile = useAppStore((s) => s.setProfile);
  const [selected, setSelected] = useState('USD');

  const handleContinue = () => {
    const curr = CURRENCIES.find((c) => c.code === selected)!;
    setProfile({ currency: curr.code, currencySymbol: curr.symbol });
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/(onboarding)/income');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + Spacing['3xl'],
      }}
    >
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: '700',
            color: colors.text,
            lineHeight: 38,
          }}
        >
          Select your{'\n'}currency
        </Text>
        <Text
          style={{
            fontSize: FontSizes.md,
            color: colors.textSecondary,
            marginTop: Spacing.sm,
            lineHeight: 22,
          }}
        >
          Choose the currency you use most often.
        </Text>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xl,
          gap: Spacing.sm,
          paddingBottom: Spacing['5xl'],
        }}
      >
        {CURRENCIES.map((currency, i) => {
          const isSelected = selected === currency.code;
          return (
            <Animated.View
              key={currency.code}
              entering={FadeInUp.delay(i * 30).duration(250)}
            >
              <Pressable
                onPress={() => {
                  if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
                  setSelected(currency.code);
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Spacing.lg,
                  borderRadius: BorderRadius.lg,
                  borderCurve: 'continuous',
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: colors.border,
                  gap: Spacing.md,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: BorderRadius.md,
                    borderCurve: 'continuous',
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.2)'
                      : colors.surfaceSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.lg,
                      fontWeight: '700',
                      color: isSelected ? '#FFFFFF' : colors.text,
                    }}
                  >
                    {currency.symbol}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: FontSizes.md,
                      fontWeight: '600',
                      color: isSelected ? '#FFFFFF' : colors.text,
                    }}
                  >
                    {currency.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      color: isSelected ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                    }}
                  >
                    {currency.code}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '700' }}>
                      ✓
                    </Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <Animated.View
        entering={FadeInDown.delay(150).duration(300)}
        style={{
          paddingHorizontal: Spacing.xl,
          paddingBottom: insets.bottom + Spacing.lg,
        }}
      >
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => ({
            height: 54,
            borderRadius: 27,
            borderCurve: 'continuous',
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ fontSize: FontSizes.lg, fontWeight: '600', color: '#FFFFFF' }}>
            Continue
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

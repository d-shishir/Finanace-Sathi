import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

export default function IncomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setProfile = useAppStore((s) => s.setProfile);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const [income, setIncome] = useState('');

  const handleContinue = () => {
    const amount = parseFloat(income) || 0;
    setProfile({ monthlyIncome: amount });
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/(onboarding)/priorities');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing['3xl'],
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{ paddingHorizontal: Spacing.xl }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: '700',
              color: colors.text,
              lineHeight: 38,
            }}
          >
            What's your{'\n'}monthly income?
          </Text>
          <Text
            style={{
              fontSize: FontSizes.md,
              color: colors.textSecondary,
              marginTop: Spacing.sm,
              lineHeight: 22,
            }}
          >
            This helps us personalize your budget recommendations.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(100).duration(300)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: Spacing.xl,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
            }}
          >
            <Text style={{ fontSize: 44, fontWeight: '300', color: colors.textTertiary }}>
              {currencySymbol}
            </Text>
            <TextInput
              value={income}
              onChangeText={setIncome}
              placeholder="0"
              keyboardType="numeric"
              autoFocus
              placeholderTextColor={colors.textTertiary}
              style={{
                fontSize: 44,
                fontWeight: '700',
                color: colors.text,
                fontVariant: ['tabular-nums'],
                minWidth: 100,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: FontSizes.sm,
              color: colors.textSecondary,
              marginTop: Spacing.lg,
            }}
          >
            per month (before taxes)
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(300)}
          style={{
            paddingHorizontal: Spacing.xl,
            paddingBottom: insets.bottom + Spacing.lg,
            gap: Spacing.md,
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
          <Pressable
            onPress={() => router.push('/(onboarding)/priorities')}
            style={({ pressed }) => ({
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text
              style={{ fontSize: FontSizes.md, fontWeight: '500', color: colors.textSecondary }}
            >
              Skip for now
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

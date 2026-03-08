import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { FINANCIAL_PRIORITIES } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

export default function PrioritiesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setProfile = useAppStore((s) => s.setProfile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [selected, setSelected] = useState<string[]>([]);

  const togglePriority = (id: string) => {
    if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    setProfile({ priorities: selected, onboardingComplete: true });
    completeOnboarding();
    if (process.env.EXPO_OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.replace('/(tabs)');
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
          What are your{'\n'}financial goals?
        </Text>
        <Text
          style={{
            fontSize: FontSizes.md,
            color: colors.textSecondary,
            marginTop: Spacing.sm,
            lineHeight: 22,
          }}
        >
          Select all that apply. We'll tailor your experience.
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
        {FINANCIAL_PRIORITIES.map((priority, i) => {
          const isSelected = selected.includes(priority.id);
          return (
            <Animated.View
              key={priority.id}
              entering={FadeInUp.delay(i * 30).duration(250)}
            >
              <Pressable
                onPress={() => togglePriority(priority.id)}
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
                <Text style={{ fontSize: 22 }}>{priority.icon}</Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: FontSizes.md,
                    fontWeight: '600',
                    color: isSelected ? '#FFFFFF' : colors.text,
                  }}
                >
                  {priority.label}
                </Text>
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
        entering={FadeInDown.delay(200).duration(300)}
        style={{
          paddingHorizontal: Spacing.xl,
          paddingBottom: insets.bottom + Spacing.lg,
          gap: Spacing.md,
        }}
      >
        <Pressable
          onPress={handleFinish}
          disabled={selected.length === 0}
          style={({ pressed }) => ({
            height: 54,
            borderRadius: 27,
            borderCurve: 'continuous',
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: selected.length === 0 ? 0.4 : pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ fontSize: FontSizes.lg, fontWeight: '600', color: '#FFFFFF' }}>
            Let's Go!
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            completeOnboarding();
            router.replace('/(tabs)');
          }}
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
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/icons';
import { FontSizes, Spacing, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

const PAGES: {
  icon: 'wallet' | 'bar-chart' | 'target';
  title: string;
  subtitle: string;
}[] = [
  {
    icon: 'wallet',
    title: 'Your Money,\nYour Rules',
    subtitle:
      'Take full control of your finances with smart tracking, budgets, and insights.',
  },
  {
    icon: 'bar-chart',
    title: 'See Where\nIt All Goes',
    subtitle:
      'Beautiful charts and breakdowns show exactly where your money flows.',
  },
  {
    icon: 'target',
    title: 'Reach Your\nGoals Faster',
    subtitle:
      'Set savings targets, track progress, and build the future you deserve.',
  },
];

export default function WelcomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useAppStore((s) => s.profile);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (profile.onboardingComplete) {
      router.replace('/(tabs)');
    }
  }, [profile.onboardingComplete]);

  if (profile.onboardingComplete) return null;

  const currentPage = PAGES[page];

  const handleNext = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (page < PAGES.length - 1) {
      setPage(page + 1);
    } else {
      router.push('/(onboarding)/currency');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: Spacing['3xl'],
        }}
      >
        <Animated.View
          key={`icon-${page}`}
          entering={FadeIn.duration(300)}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing['3xl'],
          }}
        >
          <AppIcon name={currentPage.icon} size={40} color={colors.primary} />
        </Animated.View>

        <Animated.Text
          key={`title-${page}`}
          entering={FadeInUp.delay(80).duration(300)}
          style={{
            fontSize: FontSizes['4xl'],
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            lineHeight: 44,
          }}
        >
          {currentPage.title}
        </Animated.Text>

        <Animated.Text
          key={`sub-${page}`}
          entering={FadeInUp.delay(150).duration(300)}
          style={{
            fontSize: FontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: Spacing.lg,
            lineHeight: 22,
            paddingHorizontal: Spacing.lg,
          }}
        >
          {currentPage.subtitle}
        </Animated.Text>
      </View>

      <View
        style={{
          paddingHorizontal: Spacing.xl,
          paddingBottom: Spacing['2xl'],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing['2xl'],
          }}
        >
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === page ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === page ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
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
          <Text
            style={{
              fontSize: FontSizes.lg,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            {page >= PAGES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

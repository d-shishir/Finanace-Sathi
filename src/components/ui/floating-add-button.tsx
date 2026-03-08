import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/icons';
import { useThemeColors } from '@/hooks/use-theme-colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingAddButton() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/add-transaction');
      }}
      style={[
        {
          position: 'absolute',
          bottom: insets.bottom + 80,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          borderCurve: 'continuous',
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
        },
        animatedStyle,
      ]}
    >
      <AppIcon name="plus" size={22} color="#FFFFFF" strokeWidth={2} />
    </AnimatedPressable>
  );
}

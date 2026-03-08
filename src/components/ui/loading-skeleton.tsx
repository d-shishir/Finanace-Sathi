import React, { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width,
  height,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps) {
  const colors = useThemeColors();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function TransactionSkeleton() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
      <Skeleton width={40} height={40} borderRadius={12} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={12} />
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View
      style={{
        padding: 20,
        borderRadius: 16,
        gap: 12,
      }}
    >
      <Skeleton width={100} height={14} />
      <Skeleton width={160} height={28} />
      <Skeleton width={80} height={12} />
    </View>
  );
}

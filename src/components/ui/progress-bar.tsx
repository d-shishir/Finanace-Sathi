import React, { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color,
  height = 8,
  backgroundColor,
  style,
  animated = true,
}: ProgressBarProps) {
  const colors = useThemeColors();
  const width = useSharedValue(0);
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(clampedProgress, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      width.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={[
        {
          height,
          backgroundColor: backgroundColor ?? colors.surfaceSecondary,
          borderRadius: height / 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: color ?? colors.accent,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

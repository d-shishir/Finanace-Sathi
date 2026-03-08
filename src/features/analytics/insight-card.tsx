import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { InsightMessage } from '@/types';
import { AppIcon } from '@/components/ui/icons';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ICON_NAMES = ['info', 'trending-up', 'bar-chart', 'arrow-up', 'arrow-down'] as const;

function isIconName(s: string): s is (typeof ICON_NAMES)[number] {
  return (ICON_NAMES as readonly string[]).includes(s);
}

interface InsightCardProps {
  insight: InsightMessage;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const colors = useThemeColors();

  const bgColors = {
    info: colors.infoLight,
    warning: colors.warningLight,
    success: colors.accentLight,
  };

  const textColors = {
    info: colors.info,
    warning: colors.warning,
    success: colors.accent,
  };

  const iconColor = textColors[insight.type];

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(250)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          padding: Spacing.lg,
          backgroundColor: bgColors[insight.type],
          borderRadius: BorderRadius.lg,
          borderCurve: 'continuous',
        }}
      >
        {isIconName(insight.icon) ? (
          <AppIcon name={insight.icon} size={20} color={iconColor} />
        ) : (
          <Text style={{ fontSize: 20 }}>{insight.icon}</Text>
        )}
        <Text
          style={{
            flex: 1,
            fontSize: FontSizes.sm,
            fontWeight: '500',
            color: textColors[insight.type],
            lineHeight: 20,
          }}
        >
          {insight.message}
        </Text>
      </View>
    </Animated.View>
  );
}

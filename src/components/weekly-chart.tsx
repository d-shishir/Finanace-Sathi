import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { format, subDays } from 'date-fns';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCompactCurrency } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface WeeklyChartProps {
  data: number[];
  height?: number;
}

export function WeeklyChart({ data, height = 120 }: WeeklyChartProps) {
  const colors = useThemeColors();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const maxValue = Math.max(...data, 1);
  const now = new Date();

  const dayLabels = Array.from({ length: 7 }, (_, i) =>
    format(subDays(now, 6 - i), 'EEE')
  );

  return (
    <View style={{ gap: Spacing.sm }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: Spacing.sm,
          height,
        }}
      >
        {data.map((value, i) => {
          const barHeight = Math.max((value / maxValue) * height * 0.85, 4);
          const isToday = i === 6;

          return (
            <Animated.View
              key={i}
              entering={FadeInUp.delay(i * 40).duration(250)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              {value > 0 && (
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '600',
                    color: colors.textSecondary,
                    fontVariant: ['tabular-nums'],
                    marginBottom: 4,
                  }}
                >
                  {formatCompactCurrency(value, currencySymbol)}
                </Text>
              )}
              <View
                style={{
                  width: '65%',
                  height: barHeight,
                  backgroundColor: isToday ? colors.primary : colors.surfaceSecondary,
                  borderRadius: BorderRadius.sm,
                  borderCurve: 'continuous',
                }}
              />
            </Animated.View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        {dayLabels.map((label, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 10,
                color: i === 6 ? colors.text : colors.textTertiary,
                fontWeight: i === 6 ? '600' : '400',
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

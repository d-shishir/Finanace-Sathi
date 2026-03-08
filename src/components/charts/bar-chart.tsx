import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export interface BarChartDataItem {
  label: string;
  value: number;
  color?: string;
  highlighted?: boolean;
}

interface BarChartProps {
  data: BarChartDataItem[];
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  barColor?: string;
  highlightColor?: string;
}

export function BarChart({
  data,
  height = 120,
  showValues = true,
  formatValue,
  barColor,
  highlightColor,
}: BarChartProps) {
  const colors = useThemeColors();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const defaultBarColor = barColor ?? colors.surfaceSecondary;
  const defaultHighlightColor = highlightColor ?? colors.primary;

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
        {data.map((item, i) => {
          const barHeight = Math.max((item.value / maxValue) * height * 0.85, 4);
          const isHighlighted = item.highlighted ?? false;
          const color = item.color ?? (isHighlighted ? defaultHighlightColor : defaultBarColor);

          return (
            <Animated.View
              key={`${item.label}-${i}`}
              entering={FadeInUp.delay(i * 60).duration(400)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              {showValues && item.value > 0 && (
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '600',
                    color: colors.textSecondary,
                    fontVariant: ['tabular-nums'],
                    marginBottom: 4,
                  }}
                >
                  {formatValue ? formatValue(item.value) : item.value}
                </Text>
              )}
              <View
                style={{
                  width: '70%',
                  height: barHeight,
                  backgroundColor: color,
                  borderRadius: BorderRadius.sm,
                  borderCurve: 'continuous',
                }}
              />
            </Animated.View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        {data.map((item, i) => (
          <View key={`label-${i}`} style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 10,
                color: item.highlighted ? colors.text : colors.textTertiary,
                fontWeight: item.highlighted ? '600' : '400',
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

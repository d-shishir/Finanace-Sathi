import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export interface PieChartDataItem {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface PieChartProps {
  data: PieChartDataItem[];
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string;
}

export function PieChart({
  data,
  size = 160,
  strokeWidth = 20,
  showLegend = true,
  centerLabel,
  centerValue,
}: PieChartProps) {
  const colors = useThemeColors();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  if (total === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: size }}>
        <Text style={{ fontSize: FontSizes.md, color: colors.textSecondary }}>
          No data available
        </Text>
      </View>
    );
  }

  let cumulativePercent = 0;

  return (
    <View style={{ flexDirection: showLegend ? 'row' : 'column', alignItems: 'center', gap: Spacing.xl }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${center}, ${center}`}>
            {data
              .filter((item) => item.value > 0)
              .map((item) => {
                const percent = item.value / total;
                const dashArray = circumference * percent;
                const offset = circumference * cumulativePercent;
                cumulativePercent += percent;

                return (
                  <Circle
                    key={item.label}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                  />
                );
              })}
          </G>
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={{ position: 'absolute', alignItems: 'center' }}>
            {centerValue && (
              <Text
                selectable
                style={{
                  fontSize: FontSizes.xl,
                  fontWeight: '700',
                  color: colors.text,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {centerValue}
              </Text>
            )}
            {centerLabel && (
              <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary }}>
                {centerLabel}
              </Text>
            )}
          </View>
        )}
      </View>

      {showLegend && (
        <View style={{ flex: 1, gap: Spacing.sm }}>
          {data
            .filter((item) => item.value > 0)
            .slice(0, 6)
            .map((item) => {
              const percent = ((item.value / total) * 100).toFixed(0);
              return (
                <View
                  key={item.label}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: item.color,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: FontSizes.xs,
                      color: colors.textSecondary,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {item.icon ? `${item.icon} ` : ''}{item.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSizes.xs,
                      fontWeight: '600',
                      color: colors.text,
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {percent}%
                  </Text>
                </View>
              );
            })}
        </View>
      )}
    </View>
  );
}

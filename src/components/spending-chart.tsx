import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getCategoryById } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency } from '@/utils/formatters';
import { useAppStore } from '@/store/app-store';

interface SpendingChartProps {
  data: Record<string, number>;
  size?: number;
}

export function SpendingChart({ data, size = 160 }: SpendingChartProps) {
  const colors = useThemeColors();
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const radius = (size - 20) / 2;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  if (total === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: size }}>
        <Text style={{ fontSize: FontSizes.md, color: colors.textSecondary }}>
          No spending data
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xl }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          {entries.map(([catId, amount]) => {
            const percent = amount / total;
            const dashArray = circumference * percent;
            const dashOffset = -circumference * cumulativePercent;
            cumulativePercent += percent;
            const category = getCategoryById(catId);

            return (
              <Circle
                key={catId}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={category.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </Svg>
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
          }}
        >
          <Text
            selectable
            style={{
              fontSize: FontSizes.xl,
              fontWeight: '700',
              color: colors.text,
              fontVariant: ['tabular-nums'],
            }}
          >
            {formatCurrency(total, currencySymbol)}
          </Text>
          <Text
            style={{
              fontSize: FontSizes.xs,
              color: colors.textSecondary,
            }}
          >
            Total Spent
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, gap: Spacing.sm }}>
        {entries.slice(0, 5).map(([catId, amount]) => {
          const category = getCategoryById(catId);
          const percent = ((amount / total) * 100).toFixed(0);
          return (
            <View
              key={catId}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: category.color,
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
                {category.name}
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
    </View>
  );
}

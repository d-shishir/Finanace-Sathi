import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export interface LineChartDataItem {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartDataItem[];
  height?: number;
  width?: number;
  color?: string;
  showDots?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChart({
  data,
  height = 120,
  color,
  showDots = true,
  showLabels = true,
  showGrid = true,
  formatValue,
}: LineChartProps) {
  const colors = useThemeColors();
  const lineColor = color ?? colors.accent;

  if (data.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height }}>
        <Text style={{ fontSize: FontSizes.md, color: colors.textSecondary }}>
          No data available
        </Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const paddingH = 16;
  const paddingV = 20;
  const chartHeight = height - paddingV * 2;
  const svgWidth = 300;
  const chartWidth = svgWidth - paddingH * 2;

  const points = data.map((item, i) => {
    const x = paddingH + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingV + chartHeight - ((item.value - minValue) / range) * chartHeight;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ gap: Spacing.sm }}>
      <View style={{ height, aspectRatio: svgWidth / height }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${height}`}>
          {showGrid &&
            [0.25, 0.5, 0.75].map((pct) => {
              const y = paddingV + chartHeight * (1 - pct);
              return (
                <Line
                  key={pct}
                  x1={paddingH}
                  y1={y}
                  x2={svgWidth - paddingH}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
              );
            })}

          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {showDots &&
            points.map((point, i) => (
              <Circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={3.5}
                fill={lineColor}
                stroke={colors.surface}
                strokeWidth={2}
              />
            ))}
        </Svg>
      </View>

      {showLabels && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: paddingH,
          }}
        >
          {data.map((item, i) => (
            <Text
              key={i}
              style={{
                fontSize: 10,
                color: colors.textTertiary,
                textAlign: 'center',
              }}
            >
              {item.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Card } from './card';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  rightElement?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  style,
  rightElement,
}: ChartCardProps) {
  const colors = useThemeColors();

  return (
    <Card variant="elevated" style={style}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: Spacing.lg,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: FontSizes.md,
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: FontSizes.xs,
                color: colors.textSecondary,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightElement}
      </View>
      {children}
    </Card>
  );
}

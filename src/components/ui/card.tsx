import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'dark';
  padding?: number;
}

export function Card({ children, style, variant = 'default', padding }: CardProps) {
  const colors = useThemeColors();

  const variants: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      borderCurve: 'continuous',
      padding: padding ?? Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      borderCurve: 'continuous',
      padding: padding ?? Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dark: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.xl,
      borderCurve: 'continuous',
      padding: padding ?? Spacing.xl,
    },
  };

  return <View style={[variants[variant], style]}>{children}</View>;
}

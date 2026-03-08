import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();

  const sizeStyles: Record<
    string,
    { height: number; paddingHorizontal: number; fontSize: number }
  > = {
    sm: { height: 36, paddingHorizontal: Spacing.lg, fontSize: FontSizes.sm },
    md: { height: 48, paddingHorizontal: Spacing.xl, fontSize: FontSizes.md },
    lg: { height: 54, paddingHorizontal: Spacing['2xl'], fontSize: FontSizes.lg },
  };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary, text: '#FFFFFF' },
    secondary: { bg: colors.surfaceSecondary, text: colors.text },
    outline: { bg: 'transparent', text: colors.text, border: colors.border },
    ghost: { bg: 'transparent', text: colors.textSecondary },
    danger: { bg: colors.danger, text: '#FFFFFF' },
  };

  const s = sizeStyles[size];
  const v = variantStyles[variant];

  const containerStyle: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.paddingHorizontal,
    backgroundColor: v.bg,
    borderRadius: size === 'lg' ? s.height / 2 : BorderRadius.lg,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    opacity: disabled ? 0.4 : 1,
    ...(v.border ? { borderWidth: 1, borderColor: v.border } : {}),
    ...(fullWidth ? { width: '100%' } : {}),
  };

  const textStyle: TextStyle = {
    fontSize: s.fontSize,
    fontWeight: '600',
    color: v.text,
  };

  return (
    <Pressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [containerStyle, pressed && { opacity: 0.8 }, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

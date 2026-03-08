import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontSizes, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface SectionTitleProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, actionText, onAction }: SectionTitleProps) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
      }}
    >
      <Text
        style={{
          fontSize: FontSizes.lg,
          fontWeight: '700',
          color: colors.text,
        }}
      >
        {title}
      </Text>
      {actionText && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text
            style={{
              fontSize: FontSizes.sm,
              fontWeight: '600',
              color: colors.textSecondary,
            }}
          >
            {actionText}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

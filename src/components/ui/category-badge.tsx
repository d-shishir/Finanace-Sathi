import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { getCategoryById } from '@/constants/categories';
import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';

interface CategoryBadgeProps {
  categoryId: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function CategoryBadge({ categoryId, size = 'md', style }: CategoryBadgeProps) {
  const category = getCategoryById(categoryId);

  const sizes = {
    sm: { iconSize: 28, fontSize: 14 },
    md: { iconSize: 40, fontSize: 18 },
    lg: { iconSize: 52, fontSize: 24 },
  };

  const s = sizes[size];

  return (
    <View
      style={[
        {
          width: s.iconSize,
          height: s.iconSize,
          borderRadius: BorderRadius.md,
          borderCurve: 'continuous',
          backgroundColor: category.color + '15',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: s.fontSize }}>{category.icon}</Text>
    </View>
  );
}

interface CategoryLabelProps {
  categoryId: string;
  showIcon?: boolean;
  color?: string;
}

export function CategoryLabel({ categoryId, showIcon = true, color }: CategoryLabelProps) {
  const category = getCategoryById(categoryId);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
      {showIcon && <Text style={{ fontSize: FontSizes.sm }}>{category.icon}</Text>}
      <Text
        style={{
          fontSize: FontSizes.sm,
          color: color ?? category.color,
          fontWeight: '500',
        }}
      >
        {category.name}
      </Text>
    </View>
  );
}

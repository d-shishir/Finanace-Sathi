import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { FontSizes, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';

const GOAL_PRESETS = [
  { icon: '🛡️', name: 'Emergency Fund', color: '#10B981' },
  { icon: '✈️', name: 'Vacation', color: '#3B82F6' },
  { icon: '💻', name: 'New Laptop', color: '#8B5CF6' },
  { icon: '🏠', name: 'House', color: '#F59E0B' },
  { icon: '🚗', name: 'New Car', color: '#EF4444' },
  { icon: '📚', name: 'Education', color: '#6366F1' },
  { icon: '💍', name: 'Wedding', color: '#EC4899' },
  { icon: '🎯', name: 'Custom', color: '#6B7280' },
];

export default function AddGoalScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const addGoal = useAppStore((s) => s.addGoal);
  const currencySymbol = useAppStore((s) => s.profile.currencySymbol);

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [name, setName] = useState(GOAL_PRESETS[0].name);
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');

  const handleSave = () => {
    const amount = parseFloat(targetAmount);
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a goal name.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount.');
      return;
    }

    addGoal({
      name: name.trim(),
      targetAmount: amount,
      currentAmount: 0,
      deadline,
      icon: GOAL_PRESETS[selectedPreset].icon,
      color: GOAL_PRESETS[selectedPreset].color,
    });

    router.replace('/goals');
  };

  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    borderCurve: 'continuous' as const,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.md,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: Fonts.sans,
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: Spacing.xl,
        gap: Spacing.xl,
        paddingBottom: Spacing['5xl'],
      }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {/* Presets */}
      <Animated.View entering={FadeInUp.duration(300)}>
        <Text
          style={{
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: colors.text,
            marginBottom: Spacing.sm,
          }}
        >
          Choose a Goal Type
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {GOAL_PRESETS.map((preset, i) => {
            const isActive = selectedPreset === i;
            return (
              <Pressable
                key={i}
                onPress={() => {
                  setSelectedPreset(i);
                  if (preset.name !== 'Custom') setName(preset.name);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  borderRadius: BorderRadius.full,
                  backgroundColor: isActive ? preset.color + '20' : colors.surfaceSecondary,
                  borderWidth: isActive ? 1.5 : 0,
                  borderColor: isActive ? preset.color : 'transparent',
                }}
              >
                <Text style={{ fontSize: 16 }}>{preset.icon}</Text>
                <Text
                  style={{
                    fontSize: FontSizes.sm,
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? preset.color : colors.textSecondary,
                  }}
                >
                  {preset.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Name */}
      <Animated.View entering={FadeInUp.delay(50).duration(300)}>
        <Text
          style={{
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: colors.text,
            marginBottom: Spacing.sm,
          }}
        >
          Goal Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Dream Vacation"
          placeholderTextColor={colors.textTertiary}
          style={inputStyle}
        />
      </Animated.View>

      {/* Target Amount */}
      <Animated.View entering={FadeInUp.delay(100).duration(300)}>
        <Text
          style={{
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: colors.text,
            marginBottom: Spacing.sm,
          }}
        >
          Target Amount
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Text style={{ fontSize: FontSizes.xl, color: colors.textTertiary }}>
            {currencySymbol}
          </Text>
          <TextInput
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="10,000"
            keyboardType="numeric"
            placeholderTextColor={colors.textTertiary}
            style={[inputStyle, { flex: 1, fontVariant: ['tabular-nums'] }]}
          />
        </View>
      </Animated.View>

      {/* Deadline */}
      <Animated.View entering={FadeInUp.delay(150).duration(300)}>
        <Text
          style={{
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: colors.text,
            marginBottom: Spacing.sm,
          }}
        >
          Target Date
        </Text>
        <TextInput
          value={deadline}
          onChangeText={setDeadline}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textTertiary}
          style={inputStyle}
        />
      </Animated.View>

      {/* Save */}
      <Animated.View entering={FadeInUp.delay(200).duration(300)}>
        <Button title="Create Goal" onPress={handleSave} fullWidth size="lg" />
      </Animated.View>
    </ScrollView>
  );
}

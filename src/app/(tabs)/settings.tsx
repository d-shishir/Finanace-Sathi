import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { CURRENCIES } from '@/constants/categories';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { exportTransactionsToCSV } from '@/services/export-service';

type IconName = 'dollar' | 'moon' | 'bell' | 'download' | 'trash' | 'star' | 'info';

interface SettingRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingRow({ icon, title, subtitle, onPress, rightElement, destructive }: SettingRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      disabled={!onPress && !rightElement}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
        opacity: pressed && onPress ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: BorderRadius.sm,
          borderCurve: 'continuous',
          backgroundColor: destructive ? colors.dangerLight : colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={18} color={destructive ? colors.danger : colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: FontSizes.md,
            fontWeight: '500',
            color: destructive ? colors.danger : colors.text,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: FontSizes.xs, color: colors.textSecondary, marginTop: 1 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
      {onPress && !rightElement && (
        <AppIcon name="chevron-right" size={16} color={colors.textTertiary} />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const transactions = useAppStore((s) => s.transactions);
  const setProfile = useAppStore((s) => s.setProfile);
  const resetAllData = useAppStore((s) => s.resetAllData);

  const handleChangeCurrency = () => {
    Alert.alert(
      'Change Currency',
      'Select your currency',
      CURRENCIES.slice(0, 6).map((c) => ({
        text: `${c.symbol} ${c.name}`,
        onPress: () => setProfile({ currency: c.code, currencySymbol: c.symbol }),
      })),
    );
  };

  const handleExportData = async () => {
    if (transactions.length === 0) {
      Alert.alert('No Data', 'Add some transactions before exporting.');
      return;
    }
    try {
      await exportTransactionsToCSV(transactions, profile.currencySymbol);
    } catch {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all transactions, budgets, and goals. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetAllData();
            Alert.alert('Done', 'All data has been reset.');
          },
        },
      ],
    );
  };

  const currentCurrency = CURRENCIES.find((c) => c.code === profile.currency);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInUp.duration(250)}
        style={{
          paddingTop: insets.top + Spacing.xl,
          paddingHorizontal: Spacing.xl,
          paddingBottom: Spacing.lg,
        }}
      >
        <Text style={{ fontSize: FontSizes['2xl'], fontWeight: '700', color: colors.text }}>
          Settings
        </Text>
      </Animated.View>

      {/* Profile */}
      <Animated.View
        entering={FadeInUp.delay(40).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
                {(profile.name || 'FS').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: FontSizes.lg, fontWeight: '600', color: colors.text }}>
                {profile.name || 'Finance Sathi User'}
              </Text>
              <Text style={{ fontSize: FontSizes.sm, color: colors.textSecondary }}>
                {profile.email || 'Manage your finances'}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Preferences */}
      <Animated.View
        entering={FadeInUp.delay(80).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Text
          style={{
            fontSize: FontSizes.xs,
            fontWeight: '600',
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: Spacing.sm,
          }}
        >
          Preferences
        </Text>
        <Card>
          <SettingRow
            icon="dollar"
            title="Currency"
            subtitle={`${currentCurrency?.symbol} ${currentCurrency?.name}`}
            onPress={handleChangeCurrency}
          />
          <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 2 }} />
          <SettingRow
            icon="moon"
            title="Dark Mode"
            subtitle="Toggle dark appearance"
            rightElement={
              <Switch
                value={profile.darkMode}
                onValueChange={(value) => setProfile({ darkMode: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 2 }} />
          <SettingRow
            icon="bell"
            title="Notifications"
            subtitle="Budget alerts & reminders"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          />
        </Card>
      </Animated.View>

      {/* Data */}
      <Animated.View
        entering={FadeInUp.delay(120).duration(250)}
        style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
      >
        <Text
          style={{
            fontSize: FontSizes.xs,
            fontWeight: '600',
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: Spacing.sm,
          }}
        >
          Data
        </Text>
        <Card>
          <SettingRow icon="download" title="Export Data" subtitle="Download as CSV" onPress={handleExportData} />
          <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 2 }} />
          <SettingRow
            icon="trash"
            title="Reset All Data"
            subtitle="Delete everything and start fresh"
            onPress={handleResetData}
            destructive
          />
        </Card>
      </Animated.View>

      {/* About */}
      <Animated.View
        entering={FadeInUp.delay(160).duration(250)}
        style={{ paddingHorizontal: Spacing.xl }}
      >
        <Text
          style={{
            fontSize: FontSizes.xs,
            fontWeight: '600',
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: Spacing.sm,
          }}
        >
          About
        </Text>
        <Card>
          <SettingRow icon="info" title="Version" subtitle="1.0.0" />
          <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 2 }} />
          <SettingRow
            icon="star"
            title="Rate App"
            subtitle="If you enjoy Finance Sathi"
            onPress={() => Alert.alert('Thank You!', 'Thanks for using Finance Sathi!')}
          />
        </Card>
      </Animated.View>

      <View style={{ alignItems: 'center', marginTop: Spacing['3xl'], paddingBottom: Spacing.xl }}>
        <Text style={{ fontSize: FontSizes.xs, color: colors.textTertiary }}>
          Finance Sathi v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

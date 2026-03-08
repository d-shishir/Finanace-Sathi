import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppIcon } from '@/components/ui/icons';
import { SectionTitle } from '@/components/ui/section-title';
import { ChartCard } from '@/components/ui/chart-card';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { TransactionItem } from '@/components/transaction-item';
import { SpendingChart } from '@/components/spending-chart';
import { WeeklyChart } from '@/components/weekly-chart';
import { LineChart, type LineChartDataItem } from '@/components/charts/line-chart';
import { GoalCardCompact } from '@/components/savings-progress';
import { FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/utils/formatters';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const HeaderIcon = ({ name }: { name: any }) => {
  const colors = useThemeColors();
  return (
    <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
      <AppIcon name={name} size={18} color={colors.textSecondary} />
    </View>
  );
};

const DapprStatCard = ({ icon, value, label, hasMenu, iconColor }: any) => {
  const colors = useThemeColors();
  return (
    <View
      style={{
        width: 160,
        padding: Spacing.lg,
        backgroundColor: colors.surfaceSecondary,
        borderRadius: BorderRadius.xl,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
        <View style={{ width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <AppIcon name={icon} size={18} color={iconColor || colors.textSecondary} />
        </View>
        {hasMenu && <AppIcon name="more-vertical" size={16} color={colors.textTertiary} />}
      </View>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 }}>{value}</Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>{label}</Text>
    </View>
  );
};

const SecondaryMetricCard = ({ title, value, percentage, isPositive }: any) => {
  const colors = useThemeColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, padding: Spacing.lg, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: Spacing.sm }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: colors.text }}>{value}</Text>
        <View style={{ backgroundColor: isPositive ? '#D1FAE5' : '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: isPositive ? '#10B981' : '#EF4444' }}>{percentage}</Text>
        </View>
      </View>
    </View>
  );
};

const EmailListItem = ({ name, subject, time, image }: any) => {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSecondary, marginRight: Spacing.md, overflow: 'hidden' }}>
        {/* Placeholder for avatar */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <AppIcon name="user" size={20} color={colors.textTertiary} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: colors.textSecondary }}>{name}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text numberOfLines={1} style={{ fontSize: 15, color: colors.textTertiary }}>{subject}</Text>
      </View>
      <Text style={{ fontSize: 13, color: colors.textTertiary }}>{time}</Text>
    </View>
  );
};

const ToDoListItem = ({ title, date, icon }: any) => {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md }}>
        <AppIcon name={icon} size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{title}</Text>
        <Text style={{ fontSize: 13, color: colors.textTertiary, marginTop: 2 }}>{date}</Text>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profile = useAppStore((s) => s.profile);
  const transactions = useAppStore((s) => s.transactions);
  const goals = useAppStore((s) => s.goals);
  const getMonthlyIncome = useAppStore((s) => s.getMonthlyIncome);
  const getMonthlyExpense = useAppStore((s) => s.getMonthlyExpense);
  const getTotalBalance = useAppStore((s) => s.getTotalBalance);
  const getCategorySpending = useAppStore((s) => s.getCategorySpending);
  const getWeeklySpending = useAppStore((s) => s.getWeeklySpending);

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();
  const totalBalance = getTotalBalance();
  const categorySpending = getCategorySpending();
  const weeklySpending = getWeeklySpending();
  const { currencySymbol } = profile;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(250)}
          style={{
            paddingTop: insets.top + Spacing.xl,
            paddingHorizontal: Spacing.xl,
            paddingBottom: Spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              {getGreeting()}, {profile.name?.split(' ')[0] || 'James'}!
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <HeaderIcon name="calendar" />
            <HeaderIcon name="message-square" />
            <HeaderIcon name="bell" />
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {/* Profile Image placeholder */}
              <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }}>
                 <AppIcon name="user" size={18} color={colors.textSecondary} />
              </View>
            </View>
            <View style={{ alignSelf: 'center' }}>
               <AppIcon name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </Animated.View>

        {/* Top Navigation / Controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
             <AppIcon name="chevron-left" size={20} color={colors.textTertiary} />
             <AppIcon name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </View>

        {/* Stat Cards Row */}
        <Animated.View
          entering={FadeInUp.delay(50).duration(250)}
          style={{
            marginBottom: Spacing.lg,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}
          >
            <DapprStatCard 
              icon="wallet" 
              value={formatCurrency(totalBalance, currencySymbol)} 
              label="Your bank balance"
              hasMenu
            />
            <DapprStatCard 
              icon="pie-chart" 
              value="12" 
              label="Uncategorized transactions"
              hasMenu
              iconColor="#334155"
            />
            <DapprStatCard 
              icon="users" 
              value="7" 
              label="Employees working today"
              hasMenu
              iconColor="#334155"
            />
            <DapprStatCard 
              icon="credit-card" 
              value={formatCurrency(monthlyExpense, currencySymbol)} 
              label="This week's card spending"
              hasMenu
              iconColor="#334155"
            />
          </ScrollView>
        </Animated.View>

        {/* Secondary Metric Cards Row */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(250)}
          style={{
            paddingHorizontal: Spacing.xl,
            flexDirection: 'row',
            gap: Spacing.md,
            marginBottom: Spacing.xl,
          }}
        >
          <SecondaryMetricCard 
            title="New clients" 
            value="54" 
            percentage="+ 18.7%" 
            isPositive 
          />
          <SecondaryMetricCard 
            title="Invoices overdue" 
            value="6" 
            percentage="+ 2.7%" 
            isPositive={false} 
          />
        </Animated.View>

        {/* Revenue Chart Section */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <View style={{ 
            backgroundColor: '#D9E6EC', 
            borderRadius: BorderRadius.xl, 
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Revenue</Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.textTertiary }}>Last 7 days VS prior week</Text>
            </View>
            
            {/* Minimal Revenue Chart */}
            <View style={{ height: 180, justifyContent: 'center' }}>
               <LineChart 
                 data={weeklySpending.map((v, i) => ({ label: ['F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20'][i] || '', value: v }))} 
                 height={160}
                 color="#000000"
                 showGrid={false}
                 showDots={true}
               />
            </View>
          </View>
        </Animated.View>

        {/* Recent Emails Section */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(250)}
          style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}
        >
          <View style={{ 
            backgroundColor: '#D9E6EC', 
            borderRadius: BorderRadius.xl, 
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: Spacing.xl }}>Recent emails</Text>
            
            <EmailListItem name="Hannah Morgan" subject="Meeting scheduled" time="1:24 PM" />
            <EmailListItem name="Megan Clark" subject="Update on marketing campaign" time="12:32 PM" />
            <EmailListItem name="Brandon Williams" subject="Designly 2.0 is about to launch" time="Yesterday at 8:57 PM" />
            <EmailListItem name="Reid Smith" subject="My friend Julie loves Dappr!" time="Yesterday at 8:49 PM" />
          </View>
        </Animated.View>

        <View style={{ paddingHorizontal: Spacing.xl }}>
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl }}>
             {/* Formation Status (Black Card) */}
             <View style={{ flex: 1, backgroundColor: '#000000', borderRadius: BorderRadius.xl, padding: Spacing.xl }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 }}>Formation status</Text>
                <Text style={{ fontSize: 14, color: '#94A3B8', marginBottom: Spacing.xl }}>In progress</Text>
                
                <View style={{ height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden', marginBottom: Spacing.xl }}>
                  <View style={{ width: '40%', height: '100%', backgroundColor: '#D1FAE5' }} />
                </View>
                
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 4 }}>Estimated processing</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: Spacing.xl }}>4-5 business days</Text>
                
                <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}>
                  <Text style={{ fontWeight: '600', color: '#000000' }}>View status</Text>
                </View>
             </View>

             <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: Spacing.xl }}>Your to-Do list</Text>
                
                <ToDoListItem title="Run payroll" date="Mar 4 at 6:00 pm" icon="file-text" />
                <ToDoListItem title="Review time off request" date="Mar 7 at 6:00 pm" icon="clock" />
                <ToDoListItem title="Sign board resolution" date="Mar 12 at 6:00 pm" icon="file-text" />
                <ToDoListItem title="Finish onboarding Tony" date="Mar 12 at 6:00 pm" icon="check-square" />

                {/* Board Meeting (Black Card) */}
                <View style={{ backgroundColor: '#000000', borderRadius: BorderRadius.xl, padding: Spacing.lg, marginTop: Spacing.md }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>Board meeting</Text>
                   </View>
                   <Text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Feb 22 at 6:00 PM</Text>
                   <Text style={{ fontSize: 11, color: '#64748B', lineHeight: 16 }}>You have been invited to attend a meeting of the Board Directors.</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Savings Goals */}
        <View style={{ marginTop: Spacing.xl }}>
           <SectionTitle title="Existing Goals" actionText="View All" onAction={() => router.push('/goals')} />
           <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}
            >
              {goals.map((goal, i) => (
                <GoalCardCompact key={goal.id} goal={goal} index={i} />
              ))}
            </ScrollView>
        </View>

        {/* Recent Transactions (Original Functionality preserved) */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(250)}
          style={{ marginTop: Spacing.xl }}
        >
          <SectionTitle
            title="Recent Transactions"
            actionText={transactions.length > 0 ? 'See All' : undefined}
            onAction={
              transactions.length > 0
                ? () => router.push('/(tabs)/transactions')
                : undefined
            }
          />
          {transactions.slice(0, 5).map((tx, i) => (
            <TransactionItem key={tx.id} transaction={tx} index={i} showDate />
          ))}
        </Animated.View>

      </ScrollView>

      <FloatingAddButton />
    </View>
  );
}

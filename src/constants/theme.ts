export const Colors = {
  light: {
    background: '#E8F1F5',
    surface: '#FFFFFF',
    surfaceSecondary: '#D9E6EC',
    text: '#000000',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#CBD5E1',
    primary: '#1A1D28',
    primaryLight: '#334155',
    accent: '#10B981',
    accentLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    income: '#10B981',
    incomeLight: '#D1FAE5',
    expense: '#EF4444',
    expenseLight: '#FEE2E2',
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F8FAFC',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#000000',
    tabBarInactive: '#94A3B8',
    skeleton: '#E2E8F0',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    border: '#334155',
    primary: '#38BDF8',
    primaryLight: '#0C4A6E',
    accent: '#38BDF8',
    accentLight: '#0C4A6E',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    warning: '#FBBF24',
    warningLight: '#78350F',
    info: '#60A5FA',
    infoLight: '#1E3A5F',
    income: '#34D399',
    incomeLight: '#14532D',
    expense: '#F87171',
    expenseLight: '#7F1D1D',
    cardGradientStart: '#1E293B',
    cardGradientEnd: '#0F172A',
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    tabBarActive: '#38BDF8',
    tabBarInactive: '#64748B',
    skeleton: '#334155',
  },
} as const;

export type ThemeColors = {
  [K in keyof (typeof Colors.dark)]: string;
};

export const Fonts = {
  sans: 'System' as const,
  mono: 'monospace' as const,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

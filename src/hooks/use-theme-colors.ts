import { useColorScheme } from 'react-native';
import { Colors, type ThemeColors } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const darkMode = useAppStore((s) => s.profile.darkMode);
  const scheme = darkMode ? 'dark' : systemScheme === 'dark' ? 'dark' : 'light';
  return Colors[scheme];
}

export function useIsDark(): boolean {
  const systemScheme = useColorScheme();
  const darkMode = useAppStore((s) => s.profile.darkMode);
  return darkMode || systemScheme === 'dark';
}

import { Colors, type ThemeColors } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

export function useThemeColors(): ThemeColors {
  const darkMode = useAppStore((s) => s.profile.darkMode);
  return darkMode ? Colors.dark : Colors.light;
}

export function useIsDark(): boolean {
  const darkMode = useAppStore((s) => s.profile.darkMode);
  return darkMode;
}

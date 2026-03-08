import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/app-store';

export default function Index() {
  const isOnboarded = useAppStore((s) => s.profile.onboardingComplete);
  if (!isOnboarded) return <Redirect href={'/(onboarding)' as any} />;
  return <Redirect href={'/(tabs)' as any} />;
}

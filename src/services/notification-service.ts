import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}

export async function scheduleBudgetAlert(
  categoryName: string,
  percentUsed: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Budget Alert',
      body: `You've used ${percentUsed}% of your ${categoryName} budget this month.`,
      data: { type: 'budget_alert' },
    },
    trigger: null,
  });
}

export async function scheduleSavingsMilestone(
  goalName: string,
  percentComplete: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Savings Milestone!',
      body: `You've reached ${percentComplete}% of your "${goalName}" goal!`,
      data: { type: 'savings_milestone' },
    },
    trigger: null,
  });
}

export async function scheduleExpenseReminder(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Reminder',
      body: "Don't forget to log your expenses today!",
      data: { type: 'expense_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

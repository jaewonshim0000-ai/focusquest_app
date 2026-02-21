// ──────────────────────────────────────────────────
// Notification Service
// ──────────────────────────────────────────────────

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Initialize push notifications (request permission + register).
 */
export async function initializePushNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Notifications] Skipping push setup on web');
    return;
  }

  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    console.warn('[Notifications] Push permission denied');
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', (token) => {
    console.log('[Notifications] Push registered:', token.value);
    // TODO: Send token to backend for this user
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('[Notifications] Push registration error:', error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('[Notifications] Push received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('[Notifications] Push action:', action);
    // TODO: Navigate to relevant screen based on action.notification.data
  });
}

/**
 * Schedule a local notification (for reminders, streak alerts, etc.).
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  scheduledAt: Date,
  id?: number
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Notifications] Local notification (web):', title, body);
    return;
  }

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  await LocalNotifications.schedule({
    notifications: [
      {
        id: id ?? Date.now(),
        title,
        body,
        schedule: { at: scheduledAt },
        sound: 'default',
        smallIcon: 'ic_stat_icon_config_sample',
      },
    ],
  });
}

/**
 * Schedule task due date reminders (24h and 2h before).
 */
export async function scheduleTaskReminders(
  taskId: string,
  taskTitle: string,
  dueDate: Date
): Promise<void> {
  const now = Date.now();

  // 24-hour reminder
  const reminder24h = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
  if (reminder24h.getTime() > now) {
    await scheduleLocalNotification(
      'Task Due Tomorrow',
      `"${taskTitle}" is due in 24 hours`,
      reminder24h
    );
  }

  // 2-hour reminder
  const reminder2h = new Date(dueDate.getTime() - 2 * 60 * 60 * 1000);
  if (reminder2h.getTime() > now) {
    await scheduleLocalNotification(
      'Task Due Soon!',
      `"${taskTitle}" is due in 2 hours`,
      reminder2h
    );
  }
}

/**
 * Schedule a streak-at-risk notification for 6 PM if no session today.
 */
export async function scheduleStreakReminder(): Promise<void> {
  const now = new Date();
  const sixPm = new Date();
  sixPm.setHours(18, 0, 0, 0);

  if (now < sixPm) {
    await scheduleLocalNotification(
      'Streak at Risk! 🔥',
      "You haven't completed a focus session today. Keep your streak alive!",
      sixPm,
      9999 // Fixed ID so it overwrites previous streak reminders
    );
  }
}

/**
 * Cancel all pending local notifications.
 */
export async function cancelAllLocalNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel(pending);
  }
}

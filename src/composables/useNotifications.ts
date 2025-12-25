import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

export function useNotifications() {
  const isNativePlatform = Capacitor.isNativePlatform();

  async function requestPermissions() {
    if (!isNativePlatform) {
      console.log("Notifications not available on web platform");
      return false;
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  async function checkPermissions() {
    if (!isNativePlatform) return false;

    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === "granted";
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      return false;
    }
  }

  async function scheduleDailyReminder(time: string) {
    if (!isNativePlatform) {
      console.log("Notifications not available on web platform");
      return;
    }

    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        console.log("Notification permissions not granted");
        return;
      }
    }

    try {
      // Cancel existing notifications
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      // Parse time (HH:MM format)
      const [hours, minutes] = time.split(":").map(Number);

      // Schedule daily notification
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours || 0, minutes || 0, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "Daily Check-in",
            body: "How was your day? Don't forget to log your habits!",
            schedule: {
              at: scheduledTime,
              every: "day",
            },
            smallIcon: "ic_stat_icon",
            iconColor: "#2563eb",
          },
        ],
      });

      console.log("Daily reminder scheduled for", time);
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }

  async function cancelDailyReminder() {
    if (!isNativePlatform) return;

    try {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      console.log("Daily reminder cancelled");
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  }

  return {
    isNativePlatform,
    requestPermissions,
    checkPermissions,
    scheduleDailyReminder,
    cancelDailyReminder,
  };
}

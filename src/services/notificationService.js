const REMINDER_ENABLED_KEY = "dailyReminderEnabled";
const REMINDER_TIME_KEY = "dailyReminderTime";
const INTERVAL_KEY = "__dailyReminderInterval__";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function showReminderNotification() {
  if (Notification.permission !== "granted") return;

  new Notification("📘 Time to Learn!", {
    body: "Open VRNexGen Learn and continue your course.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "daily-learning-reminder",
    renotify: false
  });
}

export function scheduleDailyReminder(time = "10:00") {
  if (window[INTERVAL_KEY]) return; // prevent duplicate timers

  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (now >= target) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    showReminderNotification();

    const intervalId = setInterval(
      showReminderNotification,
      24 * 60 * 60 * 1000
    );

    window[INTERVAL_KEY] = intervalId;
  }, delay);

  localStorage.setItem(REMINDER_ENABLED_KEY, "true");
  localStorage.setItem(REMINDER_TIME_KEY, time);
}

export function cancelDailyReminder() {
  if (window[INTERVAL_KEY]) {
    clearInterval(window[INTERVAL_KEY]);
    delete window[INTERVAL_KEY];
  }

  localStorage.removeItem(REMINDER_ENABLED_KEY);
  localStorage.removeItem(REMINDER_TIME_KEY);
}

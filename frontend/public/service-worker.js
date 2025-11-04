/* ==========================================
   AI Health Habit Tracker - Service Worker
   Handles push notifications and user actions
   ========================================== */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  console.log("Push received:", data);

  // Simple motivational messages
  const msgs = [
    "Small steps lead to big change 💪",
    "Stay consistent — you’ve got this 🌟",
    "Progress, not perfection 🚀",
    "Keep going, your future self will thank you 🙌",
    "One more habit = one more win 🏆",
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  const title = data.title || "Habit Reminder";
  const body = `💡 ${msg}\nIt's time for: ${data.habitName || "your habit"}`;

  const options = {
    body,
    icon: "/icons/reminder.png",
    badge: "/icons/reminder.png",
    requireInteraction: true,
    vibrate: [100, 50, 100],
    data: { habitId: data.habitId, habitName: data.habitName },
    actions: [
      { action: "done", title: "✅ Mark Complete" },
      { action: "snooze", title: "🕓 Remind me later" },
      { action: "skip", title: "🚫 Skip this one" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const habitId = event.notification.data?.habitId;
  if (!habitId) return;

  let endpoint;
  switch (event.action) {
    case "done":
      endpoint = `/habits/${habitId}/toggle`;
      break;
    case "snooze":
      endpoint = `/habits/${habitId}/snooze`;
      break;
    case "skip":
      endpoint = `/habits/${habitId}/skip`;
      break;
    default:
      event.waitUntil(clients.openWindow("http://localhost:3000/habits"));
      return;
  }

  // Notify backend about user action
  event.waitUntil(
    fetch(`http://localhost:8080${endpoint}`, { method: "PATCH" })
      .then(() => {
        console.log(`${event.action} processed for habit ${habitId}`);
        // Notify open tabs to refresh
        clients.matchAll({ type: "window" }).then((tabs) =>
          tabs.forEach((tab) =>
            tab.postMessage({ type: "REFRESH_HABITS" })
          )
        );
      })
      .catch((err) =>
        console.error(`Failed to process ${event.action} for habit ${habitId}`, err)
      )
  );
});

// Lifecycle events for SW
self.addEventListener("install", () => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker activated");
  e.waitUntil(clients.claim());
});

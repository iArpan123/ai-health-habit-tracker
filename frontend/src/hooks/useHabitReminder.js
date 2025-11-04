import { useEffect } from "react";

// Custom hook: registers a service worker and subscribes user to push notifications
export default function usePushNotifications(userEmail) {
  useEffect(() => {
    if (!userEmail) return;

    // Ensure browser supports service workers + push
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return;
    }

    async function registerPush() {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("Service Worker registered:", registration);

        // Request notification permission from the user
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied");
          return;
        }

        // Subscribe user to push notifications (public VAPID key — safe to expose)
        const publicKey =
          "BFtp4YvlijAYkjlEDTe3qaKm4NiWRsA4pAuXFvk5dXT0D1pZnViS8SEesmIHtd4Srh1EaDGwtLgRjIAL0pRcauw";
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        // Send subscription to backend for storage
        await fetch("http://localhost:8080/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.toJSON().keys.p256dh,
              auth: sub.toJSON().keys.auth,
            },
            userEmail,
          }),
        });

        console.log("Push subscription saved on backend");
      } catch (err) {
        console.error("Failed to register push:", err);
      }
    }

    registerPush();

    // Helper: converts base64 public key → Uint8Array (required by PushManager)
    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }
  }, [userEmail]);
}

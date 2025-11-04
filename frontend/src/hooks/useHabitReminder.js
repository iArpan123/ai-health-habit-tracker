import { useEffect } from "react";

export default function usePushNotifications(userEmail) {
  useEffect(() => {
    if (!userEmail) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return;
    }

    async function registerPush() {
      try {
        // Register SW
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("🧩 Service Worker registered:", registration);

        // Ask permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied");
          return;
        }

        // Subscribe to push
        const publicKey =
          "BFtp4YvlijAYkjlEDTe3qaKm4NiWRsA4pAuXFvk5dXT0D1pZnViS8SEesmIHtd4Srh1EaDGwtLgRjIAL0pRcauw"; // SAME AS BACKEND
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        // Send subscription to backend
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

        console.log("✅ Push subscription saved on backend");
      } catch (err) {
        console.error("❌ Failed to register push:", err);
      }
    }

    registerPush();

    // Helper: convert base64 → Uint8Array
    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    }
  }, [userEmail]);
}

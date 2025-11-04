import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HabitList from "./pages/HabitList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { supabase } from "./supabase/supabaseClient";
import "./styles/global.css";
import "./styles/animations.css";

function App() {
  useEffect(() => {
    async function registerPush() {
      if (!("serviceWorker" in navigator && "PushManager" in window)) return;

      try {
        const reg = await navigator.serviceWorker.register("/service-worker.js");
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notifications not granted");
          return;
        }

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BFtp4YvlijAYkjlEDTe3qaKm4NiWRsA4pAuXFvk5dXT0D1pZnViS8SEesmIHtd4Srh1EaDGwtLgRjIAL0pRcauw"
          ),
        });

        // ✅ Wait until user is logged in to get email
        const { data: userData } = await supabase.auth.getUser();
        const email = userData?.user?.email;
        if (!email) {
          console.log("No email found, user not logged in yet");
          return;
        }

        console.log("🔍 Push body:", {
  userEmail: email,
  endpoint: sub.endpoint,
  keys: sub.toJSON().keys
});


        // Send to backend
        await fetch("http://localhost:8080/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: sub.toJSON().keys,
            userEmail: email,
          }),
        });

        console.log("✅ Push subscription saved for:", email);
      } catch (err) {
        console.error("❌ Push registration failed:", err);
      }
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i)
        outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    }

    registerPush();
  }, []); // runs once when app mounts

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/habits" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <HabitList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

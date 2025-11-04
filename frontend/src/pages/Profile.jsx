import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import "./Profile.css";

/**
 * 👤 Profile Page
 * Fetches the currently logged-in user's info from Supabase Auth
 * and displays it in a simple, styled container.
 */
export default function Profile() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Fetch user data once when component mounts
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      setInfo({
        name: user?.user_metadata?.full_name || "User",
        email: user?.email,
        id: user?.id,
      });
    })();
  }, []);

  if (!info) {
    // Small loader while waiting for Supabase response
    return (
      <div className="loader-wrapper">
        <div className="loader" />
      </div>
    );
  }

  // UI — basic user details
  return (
    <div className="profile-container fade-in neon-card">
      <h2 className="glow">Welcome, {info.name}</h2>
      <p>
        <strong>Email:</strong> {info.email}
      </p>
      <p>
        <strong>User ID:</strong> {info.id}
      </p>
      <p>
        <strong>Message:</strong> Happy tracking! 🌟
      </p>
    </div>
  );
}

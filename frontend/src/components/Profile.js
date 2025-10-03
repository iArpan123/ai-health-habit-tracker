import React, { useEffect, useState } from "react";
import { getProfile, logout } from "../api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        console.log("Profile response:", res.data); // Debugging
        setProfile(res.data); // should contain { email: "..." }
      } catch (err) {
        setError("Unauthorized - please login first");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload(); // Clear state + force refresh
  };

  return (
    <div>
      <h2>Profile</h2>
      {profile ? (
        <p>Welcome, your email is: {profile.email}</p>
      ) : (
        <p>{error}</p>
      )}

      {/* Logout button only if logged in */}
      {localStorage.getItem("token") && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default Profile;

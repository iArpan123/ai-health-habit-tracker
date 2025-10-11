import React, { useEffect, useState } from "react";
import { getProfile, logout } from "../api";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        setState({ loading: false, error: "Unauthorized" });
        return;
      }
      setState({ loading: false, error: null });
    })();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (state.loading) {
    return (
      <div className="container">
        <div className="panel" style={{ padding: 20 }}><Spinner /> <span className="subtle" style={{ marginLeft: 10 }}>Loading profile…</span></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="panel" style={{ padding: 20 }}>
        <div className="section-title">Profile</div>
        {profile ? (
          <div className="v-stack">
            <div><span className="subtle">Email:</span> {profile.email}</div>
            {profile.username ? <div><span className="subtle">Username:</span> {profile.username}</div> : null}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="subtle">Unauthorized — please login.</div>
        )}
      </div>
    </div>
  );
}

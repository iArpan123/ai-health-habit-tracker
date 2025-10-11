import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="brand">
        <div className="brand-badge" />
        <span>AI Health & Habit Tracker</span>
      </div>
      <div className="nav-actions">
        {!token ? (
          <>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn-ghost">Profile</Link>
            <Link to="/habits" className="btn-ghost">Habits</Link>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

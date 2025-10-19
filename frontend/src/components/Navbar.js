import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import "./Navbar.css";

export default function Navbar() {
  const [name, setName] = useState("");
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const n = data?.user?.user_metadata?.full_name || "";
      setName(n);
    });
  }, [loc.pathname]);

  const initials = name ? name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase() : "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar glass">
      <div className="nav-left">
        <Link to="/habits" className="logo">AI Health</Link>
      </div>
      <div className="nav-right">
        <Link className={loc.pathname==="/habits"?"active":""} to="/habits">Habits</Link>
        <Link className={loc.pathname==="/profile"?"active":""} to="/profile">Profile</Link>

        <div className="avatar" title={name || "User"}>{initials}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

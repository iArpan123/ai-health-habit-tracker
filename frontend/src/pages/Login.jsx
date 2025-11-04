import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

/**
 * 🔐 Login component
 * Handles Supabase email/password authentication.
 * Shows loading state, inline errors, and success toast on login.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // Attempt Supabase login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      setErr(error.message);
      toast.push(error.message, "error");
    } else {
      toast.push("Welcome back!", "success");
      navigate("/habits");
    }
  };

  // UI
  return (
    <div className="auth-container fade-in neon-card">
      <h2 className="glow">Welcome Back</h2>

      <form onSubmit={handleLogin} className="form-grid">
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {err && <div className="form-error">{err}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? <span className="btn-spinner" /> : "Login"}
        </button>
      </form>

      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

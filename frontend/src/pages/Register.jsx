import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

/**
 * ✨ Register Component
 * Handles user sign-up using Supabase Auth.
 * On success, stores name as user metadata and redirects to login.
 */
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // 🧠 Handles form submission and Supabase sign-up
  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setSubmitting(false);

    if (error) {
      setErr(error.message);
      toast.push(error.message, "error");
    } else {
      toast.push("Account created! You can log in now.", "success");
      navigate("/login");
    }
  };

  // 🧩 Registration UI
  return (
    <div className="auth-container fade-in neon-card">
      <h2 className="glow">Create Account</h2>

      <form onSubmit={handleRegister} className="form-grid">
        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          {submitting ? <span className="btn-spinner" /> : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

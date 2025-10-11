import React, { useState } from "react";
import { register } from "../api";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(username, email, password);
      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="panel" style={{ maxWidth: 520, margin: "40px auto", padding: 20 }}>
        <div className="section-title">Create Account</div>
        <form onSubmit={handleRegister} className="v-stack">
          <div>
            <div className="label">Username</div>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your handle" />
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? <span className="h-stack"><Spinner /> Creating…</span> : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { login } from "../api";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/habits", { replace: true });
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="panel" style={{ maxWidth: 520, margin: "40px auto", padding: 20 }}>
        <div className="section-title">Login</div>
        <form onSubmit={handleLogin} className="v-stack">
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
              {busy ? <span className="h-stack"><Spinner /> Signing in…</span> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HabitList from "./components/HabitList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/habits" replace />} />
          <Route path="/habits" element={
            <ProtectedRoute>
              <HabitList />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="container"><div className="panel" style={{padding:16}}>Not found</div></div>} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

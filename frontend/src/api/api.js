import axios from "axios";
import { supabase } from "../supabase/supabaseClient";

// Create a reusable axios instance
// Uses environment variable for flexibility across dev/prod
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// Attach Supabase auth token to every outgoing request
API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Habit and profile API endpoints
export const getProfile = () => API.get("/profile");
export const getHabits = () => API.get("/habits");
export const createHabit = (habit) => API.post("/habits", habit);
export const updateHabit = (id, habit) => API.put(`/habits/${id}`, habit);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);
export const toggleHabit = (id) => API.patch(`/habits/${id}/toggle`);

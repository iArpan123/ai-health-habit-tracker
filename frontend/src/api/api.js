import axios from "axios";
import { supabase } from "../supabase/supabaseClient";

const API = axios.create({ baseURL: "http://localhost:8080" });

API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Backend endpoints
export const getProfile = () => API.get("/profile");
export const getHabits = () => API.get("/habits");
export const createHabit = (habit) => API.post("/habits", habit);
export const updateHabit = (id, habit) => API.put(`/habits/${id}`, habit);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);
export const toggleHabit = (id) => API.patch(`/habits/${id}/toggle`);

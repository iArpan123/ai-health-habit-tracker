import axios from "axios";
import { supabase } from "../supabase/supabaseClient";

const API = axios.create({ baseURL: "http://localhost:8080" });

API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfile = () => API.get("/profile");
export const getHabits = () => API.get("/habits");
export const createHabit = (habit) => API.post("/habits", habit);
export const toggleHabit = (id) => API.patch(`/habits/${id}/toggle`);


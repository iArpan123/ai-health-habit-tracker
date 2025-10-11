import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 15000,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: handle 401 globally (no alerts)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Keep it quiet: just remove token so ProtectedRoute kicks in
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const register = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getProfile = () => API.get("/profile");

// ============ HABITS ==========
export const createHabit = (habit) => API.post("/habits", habit);
export const getHabits = () => API.get("/habits");
export const completeHabit = (id) => API.patch(`/habits/${id}/complete`);
export const deleteHabit = (id) => API.delete(`/habits/${id}`);

export default API;

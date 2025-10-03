import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot backend
});

// Add token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Attaching token:", token); // Debugging
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================
// Auth APIs
// ============================

// Register new user
export const register = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

// Login user and save token in localStorage
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });

  // Always overwrite token in localStorage
  if (res.data && res.data.token) {
    localStorage.setItem("token", res.data.token);
    console.log("New token saved:", res.data.token);
  } else {
    console.error("No token returned from backend");
  }

  return res;
};

// Logout user (clear token)
export const logout = () => {
  localStorage.removeItem("token");
  console.log("Token removed, logged out");
};

// Profile API (protected)
export const getProfile = () => API.get("/profile");

export default API;
 
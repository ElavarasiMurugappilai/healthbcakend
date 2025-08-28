import axios from "axios";

const API = axios.create({
  // Use Vite proxy by default; override with VITE_API_URL for prod
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000, // 10 seconds timeout
});

// ✅ Request interceptor - attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  
  return config;
}, (error) => {
  console.error("API Request Error:", error);
  return Promise.reject(error);
});

// ✅ Response interceptor - handle common errors
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
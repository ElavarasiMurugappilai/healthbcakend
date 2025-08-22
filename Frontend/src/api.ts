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
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default API;
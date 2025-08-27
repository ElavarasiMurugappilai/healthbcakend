import axios from "axios";

const API = axios.create({
  // Use Vite proxy by default; override with VITE_API_URL for prod
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000, // 10 seconds timeout
});

// ✅ Request interceptor - attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      fullUrl: `${config.baseURL}${config.url}`,
      hasAuth: !!token,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - handle common errors and auth failures
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error(`API ${status} ${error.response?.statusText}:`, message);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      console.warn("Token expired or invalid, clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Dispatch event to notify app of logout
      window.dispatchEvent(new Event("user-updated"));
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000, // 15s timeout
});

// Track retry attempts
const retryAttempts = new Map<string, number>();

// 🔑 Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      fullUrl: `${config.baseURL}${config.url}`,
      hasAuth: !!token,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// 🔑 Response interceptor with retry + silent refresh
API.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    retryAttempts.delete(requestKey);

    console.log(`✅ API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🛑 Network or CORS issue (no response at all)
    if (!error.response) {
      console.error("❌ Network/Unknown error:", error.message);
      return Promise.reject(error);
    }

    const { status } = error.response;
    const requestKey = `${originalRequest?.method}:${originalRequest?.url}`;
    const currentRetries = retryAttempts.get(requestKey) || 0;

    console.log(
      `❌ API ${status}:`,
      error.response?.data?.message || error.message
    );

    // 🔐 Handle Unauthorized
    if (status === 401 && !originalRequest._retry && currentRetries < 2) {
      originalRequest._retry = true;
      retryAttempts.set(requestKey, currentRetries + 1);

      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token || !refreshToken) {
        console.log("❌ No valid tokens, redirecting to login");
        handleAuthFailure();
        return Promise.reject(error);
      }

      try {
        console.log("🔄 Attempting silent token refresh...");
        const { data } = await axios.post(
          `${API.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        // Save new token
        localStorage.setItem("token", data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        console.log("✅ Silent refresh successful, retrying request");

        retryAttempts.delete(requestKey);
        return API(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed, forcing logout:", refreshError);
        handleAuthFailure();
        return Promise.reject(error);
      }
    }

    // 🔄 Retry for server errors (5xx)
    if (status >= 500 && currentRetries < 1) {
      retryAttempts.set(requestKey, currentRetries + 1);
      console.log(`⚠️ Server error, retrying request (attempt ${currentRetries + 1})`);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s backoff
      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

// 🧹 Auth failure handler
function handleAuthFailure() {
  console.log("🧹 Clearing invalid auth data");

  const currentPath = window.location.pathname;
  if (!["/login", "/signup", "/"].includes(currentPath)) {
    localStorage.setItem("returnUrl", currentPath);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");

  window.dispatchEvent(new Event("user-updated"));

  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
}

// 🔍 Check token validity
export const checkTokenValidity = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await axios.get(`${API.defaults.baseURL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.status === 200;
  } catch (err) {
    console.log("Token validation failed:", err);
    return false;
  }
};

// 🔄 Refresh user data
export const refreshUserData = async () => {
  try {
    const response = await API.get("/auth/me");
    const userData = response.data;

    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("user-updated"));

    return userData;
  } catch (error) {
    console.error("Failed to refresh user data:", error);
    return null;
  }
};

// Add request ID
let requestId = 0;
API.interceptors.request.use((config) => {
  config.metadata = { requestId: ++requestId };
  return config;
});

export default API;

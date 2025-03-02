import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_URL || "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Optional: Logging or Auth)
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional: Global Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

/** @format */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, // ✅ Critical for cookies
  xsrfCookieName: "token", // Optional security
  xsrfHeaderName: "X-XSRF-TOKEN" // Optional security
});

// Add response interceptor for token errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle expired/invalid tokens (redirect to login)
      window.location.href = "/login?session_expired=1";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
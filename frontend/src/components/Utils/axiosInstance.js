/** @format */

import axios from "axios";
import { isTokenExpired } from "./Auth";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
  headers: {
    // ✅ Changed "header" to "headers"
    "Content-Type": "application/json",
  },

});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
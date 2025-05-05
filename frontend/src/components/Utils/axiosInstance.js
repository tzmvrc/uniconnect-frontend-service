/** @format */

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Automatically send cookies (e.g., JWT)
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

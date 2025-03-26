/** @format */

// src/utils/auth.js

export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));
    return decodedPayload; // Returns { user_id, email, exp, ... }
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true; // If invalid, assume expired
  return decoded.exp * 1000 < Date.now(); // Convert `exp` from seconds to milliseconds
};

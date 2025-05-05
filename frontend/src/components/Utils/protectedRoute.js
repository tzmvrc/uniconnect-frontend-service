/** @format */

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../Utils/axiosInstance"; // withCredentials: true

const ProtectedRoute = ({ component: Component }) => {
  const [auth, setAuth] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("/users/check-auth")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

 
  if (auth === false) {
    // Not authenticated
    return <Navigate to="/login" />;
  }

  // Authenticated
  return <Component />;
};

export default ProtectedRoute;

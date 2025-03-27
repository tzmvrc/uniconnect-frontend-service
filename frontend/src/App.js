/** @format */

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./components/pages/LandingPage";
import SignUp from "./components/pages/SignUp";
import Notfound from "./components/pages/ErrorPath";
import FAQs from "./components/pages/Faqs";
import ForgotPass from "./components/pages/ForgotPass";
import Login from "./components/pages/Login";
import SignupVerif from "./components/pages/SignupVerif";
import Dashboard from "./components/pages/Dashboard";
import OwnProfile from "./components/pages/OwnProfile";
import ForgotNewPass from "./components/pages/ForgotNewPass";
import ForgotSuccess from "./components/pages/ForgotSuccess";
import SignUpSuccess from "./components/pages/SignUpSuccess";
import AddTopics from "./components/pages/AddTopics";
import Announcement from "./components/pages/Announcement";
import Notification from "./components/pages/Notification";
import Leaderboard from "./components/pages/Leaderboard";
import AddedTopics from "./components/pages/AddedTopics";
import AllTopics from "./components/pages/AllTopics";
import TopicNetworking from "./components/pages/TopicNetworking";
import PostDetails from "./components/pages/PostDetails";
import ForumDetails from "./components/pages/ForumDetails";
import Settings from "./components/pages/Settings";
import { isTokenExpired } from "./components/Utils/Auth";



function App() {
  useEffect(() => {
    const socket = new WebSocket("wss://https://uniconnect-service-api.onrender.com"); // Change URL if deployed

    socket.onopen = () => {
      console.log("✅ WebSocket connected!");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("🔔 Received update:", data);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed!");
    };

    return () => {
      socket.close(); // Close the socket when the component unmounts
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      alert("Session expired, please log in again."); // You can use toast instead
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Notfound />} />
          <Route index element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/FAQs" element={<FAQs />} />
          <Route path="/signupverif" element={<SignupVerif />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/@imjuan" element={<OwnProfile />} />
          <Route path="/login-forgot-password" element={<ForgotPass />} />
          <Route path="/account-verify" element={<SignupVerif />} />
          <Route path="/verify-success" element={<SignUpSuccess />} />
          <Route path="/login-set-new-password" element={<ForgotNewPass />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/topics/added" element={<AddedTopics />} />
          <Route path="/topics/all" element={<AllTopics />} />
          <Route path="/topics/networking" element={<TopicNetworking />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/announcement/:id" element={<PostDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forum/:forum_id" element={<ForumDetails />} />
          <Route
            path="/login-set-new-password-success"
            element={<ForgotSuccess />}
          />
          <Route path="/signup-add-topics" element={<AddTopics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

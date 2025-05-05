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
import OtherProfile from "./components/pages/OtherProfile";
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
import ProtectedRoute from "./components/Utils/protectedRoute";
import axios from "./components/Utils/axiosInstance";

function App() {
 
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/FAQs" element={<FAQs />} />
          <Route path="/signupverif" element={<SignupVerif />} />
          <Route path="/login-forgot-password" element={<ForgotPass />} />
          <Route path="/account-verify" element={<SignupVerif />} />
          <Route path="/verify-success" element={<SignUpSuccess />} />
          <Route path="/login-set-new-password" element={<ForgotNewPass />} />
          <Route
            path="/login-set-new-password-success"
            element={<ForgotSuccess />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute component={OwnProfile} />}
          />
          <Route
            path="/:username"
            element={<ProtectedRoute component={OtherProfile} />}
          />
          <Route
            path="/notification"
            element={<ProtectedRoute component={Notification} />}
          />
          <Route
            path="/leaderboard"
            element={<ProtectedRoute component={Leaderboard} />}
          />
          <Route
            path="/topics/added"
            element={<ProtectedRoute component={AddedTopics} />}
          />
          <Route
            path="/topics/all"
            element={<ProtectedRoute component={AllTopics} />}
          />
          <Route
            path="/topics/networking"
            element={<ProtectedRoute component={TopicNetworking} />}
          />
          <Route
            path="/announcement"
            element={<ProtectedRoute component={Announcement} />}
          />
          <Route
            path="/announcement/:announcementId"
            element={<ProtectedRoute component={Announcement} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute component={Settings} />}
          />
          <Route
            path="/forum/:forum_id"
            element={<ProtectedRoute component={ForumDetails} />}
          />
          <Route path="/signup-add-topics" element={<AddTopics />} />

          {/* Catch-All Route for 404 */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

/** @format */

import React, { useState, useEffect } from "react";
import iconViewProfile from "./images/icon-viewprofile.png";
import iconDashboard from "./images/icon-dashboard.png";
import iconNotification from "./images/icon-notification.png";
import iconTopic from "./images/icon-topic.png";
import iconAnnouncement from "./images/icon-announcement.png";
import iconSettings from "./images/icon-settings.png";
import burgerTab from "./images/burger bar.png"; // Burger menu icon
import closeTab from "./images/close bar.png"; // Close menu icon
import iconLeaderboard from "./images/icon-leaderboard.png";
import badgeIcon from "./images/badge icon.png";
import points from "./images/points.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosInstance from "../components/Utils/axiosInstance";
import { getInitials } from "../components/Utils/Helper";
import Loading from "../components/pages/Loading/Loading";
import Cookies from "js-cookie";

import {
  User,
  MessageSquare,
  Bell,
  BookOpen,
  Megaphone,
  Trophy,
  Settings,
} from "lucide-react";

const Sidebar = ({ menuCollapsed, toggleMenu }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const fullName =
    userInfo?.FirstName && userInfo?.LastName
      ? `${userInfo.FirstName} ${userInfo.LastName}`
      : "----";
  const username = userInfo?.Username
    ? `@${userInfo.Username}`
    : "Log In to UniConnect";

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "View Profile", icon: <User />, path: "/profile" },
    { name: "Dashboard", icon: <MessageSquare />, path: "/dashboard" },
    { name: "Notification", icon: <Bell />, path: "/notification" },
    { name: "Topic", icon: <BookOpen />, path: "/topics/all" },
    { name: "Announcement", icon: <Megaphone />, path: "/announcement" },
    { name: "Leaderboard", icon: <Trophy size={20} />, path: "/leaderboard" },
    { name: "Settings", icon: <Settings />, path: "/settings" },
  ];

  useEffect(() => {
    if (menuCollapsed && dropdownOpen) {
      setDropdownOpen(false);
    }
  }, [menuCollapsed, dropdownOpen]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/users/get-user-info");
        setUserInfo(response.data.user || {});
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo({});

        setTimeout(() => {
          navigate("/login");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleCloseDialog = () => {
    setShowLogoutDialog(false);
  };

  const handleConfirmLogout = async () => {
    try {
      setShowLogoutDialog(false);
      await axiosInstance.post("/users/logout");
      Cookies.remove("token");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {loading && <Loading message={""} />}
      {showLogoutDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
          <div className="w-[280px] md:w-[350px] h-[169px] md:h-[179px] bg-[#FFCDA9] p-6 rounded-[15px] shadow-lg flex flex-col justify-center items-center text-center">
            <h2 className="font-bold text-[20px] md:text-[28px] text-[#1D274D] mb-0 md:mb-1">
              Going out soon?
            </h2>
            <p className="text-[13px] md:text-[13px] text-[#1D274D]">
              Are you sure you want to log out?
              <br />
              Don’t hesitate to come back!
            </p>
            <div className="mt-4 md:mt-6 flex space-x-4">
              <button
                onClick={handleCloseDialog}
                className="w-[106px] h-[39px] rounded-[10px] border border-[#1D274D] text-[#1D274D] font-medium hover:border-[#868684]"
              >
                Back
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-[106px] h-[39px] rounded-[10px] bg-[#1D274D] text-white font-medium hover:bg-[#17203A]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Burger icon (mobile only) */}
      {menuCollapsed && (
        <button
          onClick={toggleMenu}
          className="fixed top-[25px] left-4 z-30 md:hidden"
        >
          <img src={burgerTab} alt="Open menu" className="w-6 h-6" />
        </button>
      )}

      <aside
        className={`fixed top-[75px] h-[calc(100dvh-75px)] md:h-[calc(100vh-75px)] border-r-[1px] overflow-hidden border-black p-4 flex-shrink-0 transition-all duration-300 z-20 md:z-10 flex flex-col bg-[#FFCDA9]
    ${
      menuCollapsed
        ? "translate-x-[-100%] md:translate-x-0 md:w-[100px]"
        : "translate-x-0 w-[70vw] md:w-[300px]"
    }
  `}
      >
        <button
          onClick={toggleMenu}
          className="hidden md:block text-lg font-semibold mb-0 md:mb-4 focus:outline-none text-[#141E46] text-left w-fit"
          style={{ marginLeft: menuCollapsed ? "20px" : "90%" }}
        >
          {!menuCollapsed && (
            <img
              src={closeTab}
              alt="Close menu"
              className="w-6 h-6 transition-transform duration-300"
            />
          )}
        </button>

        <div className="flex items-center space-x-2 mb-4 md:mb-6 text-[#141E46] font-semibold">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black cursor-pointer"
            onClick={toggleMenu}
          >
            {userInfo?.profile_picture ? (
              // Show Profile Picture if available
              <img
                src={userInfo.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              // Show Initials if no Profile Picture
              getInitials(fullName)
            )}
          </div>

          {!menuCollapsed && (
            <div className="leading-tight">
              <Link
                to={`/profile`}
                className="font-semibold text-[20px] md:text-[25px]"
              >
                {fullName}
              </Link>
              <p>
                <Link
                  to={`/profile`}
                  className="text-[14px] md:text-[16px] font-normal"
                >
                  {username}
                </Link>
              </p>
            </div>
          )}
        </div>

        <p className="flex items-center bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-sm text-[#141E46] w-16">
          <img src={points} alt="badge" className="w-[15px] h-[15px] mr-1" />{" "}
          {userInfo?.Points}
        </p>

        <nav className="mt-2 md:mt-6 space-y-2 flex-grow">
          {menuItems.map((item) => (
            <div className="relative" key={item.name}>
              {item.name === "Leaderboard" ? (
                // 👇 This part is hidden on laptops and above
                <div className="block md:hidden w-full">
                  <Link
                    to="/leaderboard"
                    className={`w-full text-left px-4 py-2 flex items-center ${
                      menuCollapsed ? "justify-center" : ""
                    } rounded-[10px] md:rounded-[15px] text-[14px] md:text-[18px] font-semibold transition duration-200 ${
                      location.pathname === item.path
                        ? "bg-white border-[1px] border-black"
                        : "bg-white bg-opacity-70 hover:bg-opacity-100"
                    }`}
                    style={{
                      color:
                        location.pathname === item.path ? "#D75F4D" : "#141E46",
                    }}
                  >
                    <span
                      className={`w-5 h-5 md:w-6 md:h-6 ${
                        menuCollapsed ? "" : "mr-2"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!menuCollapsed && <span>{item.name}</span>}
                  </Link>
                </div>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className={`w-full text-left px-4 py-[7px] md:py-[8px] flex items-center ${
                    menuCollapsed ? "justify-center" : ""
                  } rounded-[10px] md:rounded-[15px] text-[14px] md:text-[18px] font-semibold transition duration-200 ${
                    location.pathname === item.path
                      ? "bg-white border-[1px] border-black"
                      : "bg-white bg-opacity-70 hover:bg-opacity-100"
                  }`}
                  style={{
                    color:
                      location.pathname === item.path ? "#D75F4D" : "#141E46",
                  }}
                >
                  <span
                    className={`w-5 h-5 md:w-6 md:h-6 ${
                      menuCollapsed ? "" : "mr-2"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {!menuCollapsed && <span>{item.name}</span>}
                </Link>
              ) : (
                <button
                  className={`w-full text-left px-4 py-2 flex items-center ${
                    menuCollapsed ? "justify-center" : ""
                  } rounded-[10px] md:rounded-[15px] text-[14px] md:text-[18px] font-semibold transition duration-200 text-[#141E46] bg-white bg-opacity-70 hover:bg-opacity-100`}
                >
                  <img
                    src={item.icon}
                    alt={`${item.name} icon`}
                    className={`w-5 h-5 md:w-6 md:h-6  ${
                      menuCollapsed ? "" : "mr-2"
                    }`}
                  />
                  {!menuCollapsed && <span>{item.name}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>

        {!menuCollapsed && (
          <div className="flex justify-center mt-0 md:mt-8 mb-2 md:mb-2">
            <button
              onClick={handleLogoutClick}
              className="w-[60%] md:w-[235px] text-center px-[10px] md:px-4 py-[7px] md:py-2 rounded-[10px] md:rounded-[15px] bg-[#EB6E5B] text-[14px] md:text-[19px] text-white font-semibold hover:bg-[#D75F4D] focus:outline-none transition duration-200"
            >
              Log Out
            </button>
          </div>
        )}

        {!menuCollapsed && (
          <div className="text-center text-[11px] md:text-[13px] text-[#141E46] mb-0 md:mb-3">
            ©2024 UniConnectPh
            <br />
            All rights reserved.
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

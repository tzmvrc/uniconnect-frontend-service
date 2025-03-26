/** @format */

import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { getInitials } from "../Utils/Helper";
import { Trash2 } from "lucide-react";
import Toast from "./ToastMessage/ToastMessage";
import bell from "../images/bell.png";
import Loading from "./Loading/Loading";

const Notification = () => {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
    older: [],
  });
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const [showToast, setShowToast] = useState({
    isShown: false,
    type: "",
    message: "",
  });

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const showToastMessage = (type, message) => {
    setShowToast({ isShown: true, type: type, message: message });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notification/get-notif");
        const fetchedNotifications = response.data.notifications;
        const today = {};
        const yesterday = {};
        const older = {};

        fetchedNotifications.forEach((notif) => {
          const notifDate = new Date(notif.createdAt);
          const todayDate = new Date();
          const yesterdayDate = new Date();
          yesterdayDate.setDate(yesterdayDate.getDate() - 1);
          const section =
            notifDate.toDateString() === todayDate.toDateString()
              ? today
              : notifDate.toDateString() === yesterdayDate.toDateString()
              ? yesterday
              : older;

          const key = `${notif.type}-${notif.forumId || notif.responseId}`;

          if (!section[key]) {
            section[key] = {
              ...notif,
              users: notif.senderId ? [notif.senderId.username] : ["Unknown"], // Handle null case
              count: 1,
            };
          } else {
            section[key].users.push(
              notif.senderId ? notif.senderId.username : "Unknown"
            );
            section[key].count += 1;
          }
        });

        setNotifications({
          today: Object.values(today),
          yesterday: Object.values(yesterday),
          older: Object.values(older),
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteClick = async (section, notification) => {
    try {
      const response = await axiosInstance.delete(
        `/notification/${notification._id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete notification");
      }

      // Update state: remove the deleted notification from the correct section
      setNotifications((prev) => ({
        ...prev,
        [section]: prev[section].filter(
          (notif) => notif._id !== notification._id
        ),
      }));

      showToastMessage("success", "Deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToastMessage("error", "Failed to delete notification");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type.includes("forum")) {
      // Navigate to the specific forum
      navigate(`/forum/${notification.forumId}`);
    } else if (notification.type.includes("response")) {
      // Navigate to the forum and scroll to the response
      navigate(`/forum/${notification.forumId}`);
    } else {
      // Default navigation (e.g., user profile or main forum page)
      navigate("/forum");
    }
  };

  const [showMore, setShowMore] = useState({
    today: false,
    yesterday: false,
    older: false,
  });

  const toggleShowMore = (section) => {
    setShowMore((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderNotifications = (section, data) => {
    const visibleNotifications = showMore[section] ? data : data.slice(0, 3);

    return (
      <div className="ml-[0px] md:ml-[45px] mt-[10px] space-y-3 md:space-y-4">
        {visibleNotifications.map((notification) => {
          const userList =
            notification.users.length > 2
              ? `${notification.users[0]}, ${notification.users[1]}, and ${
                  notification.count - 2
                } others`
              : notification.users.join(", ");

          return (
            <div
              key={notification._id}
              className={`flex items-center justify-between pb-[5px] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                hoveredIndex === notification._id
                  ? "bg-slate-200"
                  : "bg-transparent"
              }`}
              onMouseEnter={() => setHoveredIndex(notification._id)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="w-[38px] h-[38px] md:w-12 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[2px] md:mr-[10px] border-[1px] border-black">
                  {getInitials(userList)}
                </div>

                <div>
                  <p className="text-[14px] md:text-[16px] font-semibold">
                    @{userList}{" "}
                    {notification.type === "forum_like"
                      ? `liked your forum.`
                      : notification.type === "forum_dislike"
                      ? `disliked your forum.`
                      : notification.type === "forum_response"
                      ? `responded to your forum.`
                      : notification.type === "response_like"
                      ? `liked your response.`
                      : notification.type === "response_dislike"
                      ? `disliked your response.`
                      : "interacted with your post."}
                  </p>

                  <p className="text-[13px] md:text-[14px] font-500">
                    {["forum_like", "forum_dislike", "forum_response"].includes(
                      notification.type
                    )
                      ? `📢 Forum: ${notification.forumTitle || "Untitled"}`
                      : ["response_like", "response_dislike"].includes(
                          notification.type
                        )
                      ? `💬 Response: ${
                          notification.responseComment || "No comment"
                        }`
                      : ""}
                  </p>
                </div>
              </div>

              <button
                className={`hidden md:block text-red-500 mr-[15px] hover:text-red-700 transition-opacity duration-200 ${
                  hoveredIndex === notification._id
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(section, notification);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        {data.length > 3 && (
          <button
            className="font-[500] text-[#1D274D] transition w-full hover:bg-slate-200 bg-slate-200 md:bg-slate-100 py-2 rounded-md"
            onClick={() => toggleShowMore(section)}
          >
            {showMore[section] ? "See Less" : "See More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="flex min-h-screen text-[#141E46]"
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />

      {showToast.isShown && (
        <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center px-4">
          <Toast
            isShown={showToast.isShown}
            type={showToast.type}
            message={showToast.message}
            onClose={handleCloseToast}
          />
        </div>
      )}

      <main
        className={`flex justify-center w-full p-2 md:p-6  bg-white overflow-hidden mt-[70px] md:mt-[85px] max-h-[calc(100vh-85px)] 
    ${menuCollapsed ? "md:ml-[110px]" : "md:ml-[310px]"} 
    mr-[0px] md:mr-[270px]`}
      >
        <div className="flex justify-center w-full md:w-[849px] ">
          <div className="border border-black rounded-[10px] md:rounded-[15px] md:w-[90%] bg-white p-4 h-screen flex flex-col">
            <div className="mb-4">
              <h1 className="text-[24px] md:text-[33px] font-semibold">
                Notifications
              </h1>
              <p className="text-[12px] md:text-[15px] font-[450] mr-[50px]">
                Get notified about important forum changes, upvotes, and new
                comments.
              </p>
              <div className="w-full h-[4px] rounded bg-[#f06c58] mt-[10px]"></div>
            </div>

            {loading ? (
              <Loading message={""} />
            ) : (
              <div className="max-h-screen overflow-y-auto pr-0 md:pr-2">
                {notifications.today.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-[18px] md:text-[25px] font-semibold ml-[10px]">
                      Today
                    </h2>
                    {renderNotifications("today", notifications.today)}
                  </div>
                )}
                {notifications.yesterday.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-[18px] md:text-[25px]  font-semibold ml-[10px]">
                      Yesterday
                    </h2>
                    {renderNotifications("yesterday", notifications.yesterday)}
                  </div>
                )}
                {notifications.older.length > 0 && (
                  <div>
                    <h2 className="text-[18px] md:text-[25px]  font-semibold ml-[10px]">
                      Older Notifications
                    </h2>
                    {renderNotifications("older", notifications.older)}
                  </div>
                )}

                {/* Simple message when there are no notifications */}
                {notifications.today.length === 0 &&
                  notifications.yesterday.length === 0 &&
                  notifications.older.length === 0 && (
                    <div className="flex flex-col items-center mt-[5%]">
                      <img
                        className="w-[100px] h-[100px]"
                        src={bell}
                        alt="No Notifications"
                      />
                      <p className="text-center text-gray-500 text-[15px] mt-[20px] ">
                        Your notifications are placed here.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;

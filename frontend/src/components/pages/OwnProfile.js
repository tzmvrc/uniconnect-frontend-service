/** @format */

import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import ForumFunctions from "../ForumFunctions";
import { useNavigate } from "react-router-dom";
import badgeIcon from "../images/badge icon.png";
import setbg from "../images/setbg.png";
import { getInitials } from "../Utils/Helper";
import axiosInstance from "../Utils/axiosInstance";
import Loading from "./Loading/Loading";

const OwnProfile = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("Created Forums");
  const [createdForums, setCreatedForums] = useState([]);
  const [savedForums, setSavedForums] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const fullname = userInfo ? `${userInfo.FirstName} ${userInfo.LastName}` : "";
  const hasBadge = userInfo ? userInfo.hasBadge : false;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchUserInfo();
      await fetchCreatedForums();
      await fetchSavedForums();
      await fetchResponseHistory();
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchTabData = async () => {
      setIsLoading(true);
      if (activeTab === "Created Forums") {
        await fetchCreatedForums();
      } else if (activeTab === "Saved Forums") {
        await fetchSavedForums();
      } else if (activeTab === "Response History") {
        await fetchResponseHistory();
      }
      setIsLoading(false);
    };

    fetchTabData();
  }, [activeTab]);

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user-info");
      setUserInfo(response.data.user || {});
      console.log("User Info Fetched:", response.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo({});
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedForums = async () => {
    try {
      console.log("Fetching created forums...");

      const response = await axiosInstance.get("/forum/owner/history");
      console.log("Raw response from API (created forums):", response.data);

      if (!response.data || !Array.isArray(response.data.forums)) {
        console.log("No created forums found.");
        setCreatedForums([]);
        return;
      }

      const forumIds = response.data.forums.map((forum) => forum._id);
      console.log("Extracted created forum IDs:", forumIds);

      if (forumIds.length === 0) {
        setCreatedForums([]);
        return;
      }
      // Fetch details of each created forum
      const forumDetailsPromises = forumIds.map((id) =>
        axiosInstance.get(`/forum/${id}`)
      );

      const forumResponses = await Promise.all(forumDetailsPromises);

      // Process the forum data
      const mappedForums = forumResponses.map((response) => {
        const forum = response.data.forum || response.data;

        // Debugging logs
        console.log("Created forum data structure:", forum);

        return {
          id: forum._id,
          title: forum.title || "Untitled Forum",
          content: forum.description || "",
          public: forum.public || false,
          status: forum.status || "Draft",
          author: forum.created_by?.username || userInfo?.Username || "Unknown",
          topic: forum.topic_id?.name || "General",
          tags: Array.isArray(forum.tags) ? forum.tags : [],
          likes: forum.likes || 0,
          dislikes: forum.dislikes || 0,
          isSaved: false,
          userLiked: false,
          userDisliked: false,
          date: forum.createdAt
            ? new Date(forum.createdAt).toLocaleDateString()
            : "Unknown",
        };
      });

      console.log("Processed created forums data:", mappedForums);
      setCreatedForums(mappedForums);
    } catch (error) {
      console.error("Error fetching created forums:", error);
      setCreatedForums([]);
    }
  };

  const fetchSavedForums = async () => {
    try {
      console.log("Fetching saved forums...");

      const response = await axiosInstance.get(`/users/saved-forums`);
      console.log("Raw response from API (saved forums):", response.data);

      const savedForumIds = response.data.savedForums;
      console.log("Extracted saved forum IDs:", savedForumIds);

      if (!savedForumIds || savedForumIds.length === 0) {
        console.log("No saved forums found");
        setSavedForums([]);
        return;
      }

      // Fetch details of each saved forum
      const forumDetailsPromises = savedForumIds.map((id) =>
        axiosInstance.get(`/forum/${id}`)
      );

      const forumResponses = await Promise.all(forumDetailsPromises);

      const forumsData = forumResponses
        .map((response) => {
          const forum = response.data.forum || response.data;

          // Skip private forums not created by current user
          if (
            !forum.public &&
            forum.created_by?.username !== userInfo?.Username
          ) {
            return null; // Exclude from results
          }

          return {
            id: forum._id,
            title: forum.title,
            content: forum.description,
            public: forum.public,
            status: forum.status,
            author: forum.created_by?.username || "Unknown",
            topic: forum.topic_id?.name || "General",
            tags: forum.tags || [],
            likes: forum.likes || 0,
            dislikes: forum.dislikes || 0,
            isSaved: true,
            userLiked: false,
            userDisliked: false,
            date: new Date(forum.createdAt).toLocaleDateString(),
          };
        })
        .filter((forum) => forum !== null); // Clean null (excluded private forums)

      console.log(
        "Processed saved forums data (excluding private ones):",
        forumsData
      );

      setSavedForums(forumsData);
    } catch (error) {
      console.error("Error fetching saved forums:", error);
      setSavedForums([]);
    }
  };

  const fetchResponseHistory = async () => {
    try {
      console.log("Fetching response history...");

      const response = await axiosInstance.get("/response/owner/history");
      console.log("Raw response from API (response history):", response.data);

      if (!response.data || !Array.isArray(response.data.forums)) {
        console.log("No response history found.");
        setResponseHistory([]);
        return;
      }

      const forumIds = response.data.forums.map((forum) => forum._id);
      console.log("Extracted response forum IDs:", forumIds);

      if (forumIds.length === 0) {
        setResponseHistory([]);
        return;
      }

      // Fetch details of each forum the user has responded to
      const forumDetailsPromises = forumIds.map((id) =>
        axiosInstance.get(`/forum/${id}`)
      );

      const forumResponses = await Promise.all(forumDetailsPromises);

      // Process the forum data
      const mappedForums = forumResponses
        .map((response) => {
          const forum = response.data.forum || response.data;

          // Skip forums that are private and not created by the current user
          if (
            !forum.public &&
            forum.created_by?.username !== userInfo?.Username
          ) {
            return null; // Filter out this forum
          }

          return {
            id: forum._id,
            title: forum.title || "Untitled Forum",
            content: forum.description || "",
            public: forum.public || false,
            status: forum.status || "Draft",
            author:
              forum.created_by?.username || userInfo?.Username || "Unknown",
            topic: forum.topic_id?.name || "General",
            tags: Array.isArray(forum.tags) ? forum.tags : [],
            likes: forum.likes || 0,
            dislikes: forum.dislikes || 0,
            isSaved: false,
            userLiked: false,
            userDisliked: false,
            date: forum.createdAt
              ? new Date(forum.createdAt).toLocaleDateString()
              : "Unknown",
          };
        })
        .filter((forum) => forum !== null); // Remove null values (i.e., skipped forums)

      console.log(
        "Processed response forum data (excluding private forums):",
        mappedForums
      );
      setResponseHistory(mappedForums);
    } catch (error) {
      console.error("Error fetching response history:", error);
      setResponseHistory([]);
    }
  };

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleForumClick = (forumId) => {
    navigate(`/forum/${forumId}`);
  };

  const getActiveForums = () => {
    switch (activeTab) {
      case "Created Forums":
        return createdForums;
      case "Saved Forums":
        return savedForums;
      case "Response History":
        return responseHistory;
      default:
        return [];
    }
  };

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="flex min-h-screen text-[#141E46]"
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      {loading && <Loading message={""} />}
      <main
        className={`flex-1 w-full p-0 md:p-6 bg-white mt-[75px] md:mt-[75px] md:mr-[260px] ${
          menuCollapsed ? "md:ml-[100px]" : "md:ml-[300px]"
        }`}
      >
        {/* Main Panel */}
        <div className="h-full w-full md:max-w-[750px] mx-auto md:border-black md:border-t md:border-l md:border-r rounded-t-[15px] bg-white p-4">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-xl h-[80px] w-full md:w-[684px] md:h-[146px] mx-auto">
            {/* Background Image */}
            <img
              src={setbg}
              alt="bg settings"
              className="h-[90px] w-full md:h-[146px] md:w-[684px]"
            />
            {/* Profile Picture */}
            <div className="absolute bottom-[-50px] md:bottom-[-70px] left-1/2 transform -translate-x-1/2 w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border-4 border-slate-700 overflow-hidden">
              <div className="w-[95px] h-[95px] md:w-full md:h-full flex items-center justify-center rounded-full text-slate-950 bg-slate-200 text-[35px] md:text-[40px]">
                {userInfo?.profile_picture ? (
                  // Show Profile Picture if available
                  <img
                    src={userInfo.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  // Show Initials if no Profile Picture
                  getInitials(fullname)
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:w-[684px] mx-auto mt-20 text-center">
            <div className="flex justify-between items-center">
              {/* Left Side */}
              <div className="text-left">
                <h2 className="text-[22px] md:text-[30px] font-bold flex items-center">
                  {userInfo
                    ? `${userInfo.FirstName} ${userInfo.LastName}`
                    : "Loading..."}
                  {hasBadge && (
                    <img
                      src={badgeIcon}
                      alt="Badge"
                      className="w-[19px] h-auto md:w-6 md:h-6 ml-2"
                    />
                  )}
                </h2>
                <p className="text-[14px] md:text-[16px] font-regular">
                  {userInfo ? `@${userInfo.Username}` : ""}
                </p>
                <p className="text-[14px] md:text-[16px] font-regular">
                  {userInfo ? userInfo.School : ""}
                </p>
              </div>

              {/* Right Side */}
              <div>
                <div className="w-[94px] h-[31px] md:w-[105px] md:h-[41px] rounded-[10px] border border-orange-400 flex items-center justify-center p-2">
                  <span className="text-[14px] md:text-[16px] font-medium">
                    {userInfo ? `${userInfo.Points} points` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Container */}
          <div className="md:w-[684px] mx-auto">
            <div className="flex justify-between w-full mt-6 border-b-[2px] border-[#141E46]">
              {["Created Forums", "Saved Forums", "Response History"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`text-[12px] md:text-[16px] font-regular ${
                      activeTab === tab
                        ? "text-[#141E46] font-semibold border-b-4 border-orange-400"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            <div className="w-full mt-6 transform transition-all duration-500 ease-out opacity-0 translate-y-[-20px] animate-slide-fade">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading...</p>
                </div>
              ) : getActiveForums().length > 0 ? (
                <ForumFunctions
                  forums={getActiveForums()}
                  userInfo={userInfo}
                  handleForumClick={handleForumClick}
                  compact={true}
                />
              ) : (
                <div className="flex justify-center text-[15px] items-center h-64">
                  <p>No {activeTab.toLowerCase()} found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnProfile;

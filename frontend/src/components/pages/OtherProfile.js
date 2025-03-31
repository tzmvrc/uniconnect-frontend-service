/** @format */

import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import ForumFunctions from "../ForumFunctions";
import { useNavigate, useParams } from "react-router-dom";
import badgeIcon from "../images/badge icon.png";
import { getInitials } from "../Utils/Helper";
import axiosInstance from "../Utils/axiosInstance";

const OtherProfile = () => {
  const { username } = useParams();
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [createdForums, setCreatedForums] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasBadge = userInfo ? userInfo.hasBadge : false;

  const navigate = useNavigate();

  const fullname = userInfo ? `${userInfo.FirstName} ${userInfo.LastName}` : "";

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const handleForumClick = (forumId) => navigate(`/forum/${forumId}`);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchUserInfo();
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (userInfo?.Username) {
      fetchUserForums();
    }
  }, [userInfo]);

  const fetchUserInfo = async () => {
    try {
      const currentUserResponse = await axiosInstance.get(
        "/users/get-user-info"
      );
      const currentUsername = currentUserResponse.data.user?.Username;

      if (
        currentUsername &&
        currentUsername.toLowerCase() === username.toLowerCase()
      ) {
        navigate("/profile");
        return false;
      }

      const response = await axiosInstance.get(`/users/${username}`);
      if (response.data.user) {
        const userData = response.data.user;
        console.log("Fetched user info:", userData);

        setUserInfo(userData);
        return true;
      } else {
        console.log("User not found.");
        setUserInfo({});
        setCreatedForums([]);
        navigate("*");
        return false;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo({});
      setCreatedForums([]);
      navigate("*");
      return false;
    }
  };

  const fetchUserForums = async () => {
    try {
      if (!userInfo?.Username) {
        console.log("No username available");
        setCreatedForums([]);
        return;
      }

      console.log("Fetching forums for username:", userInfo.Username);

      const response = await axiosInstance.get(
        `/forum/user/${userInfo.Username}`
      );
      console.log("Raw API response:", response.data);

      if (!response.data || !Array.isArray(response.data.forums)) {
        console.error("Failed to fetch forums or invalid data format");
        setCreatedForums([]);
        return;
      }

      const forumIds = response.data.forums.map((forum) => forum._id);
      console.log("Extracted forum IDs:", forumIds);

      if (forumIds.length === 0) {
        setCreatedForums([]);
        return;
      }

      // Fetch detailed data for each forum
      const forumDetailsPromises = forumIds.map((id) =>
        axiosInstance.get(`/forum/${id}`)
      );
      const forumResponses = await Promise.all(forumDetailsPromises);

      // Process and map the forum data
      const mappedForums = forumResponses.map((response) => {
        const forum = response.data.forum || response.data;

        console.log("Fetched forum details:", forum);

        return {
          id: forum._id,
          title: forum.title || "Untitled Forum",
          content: forum.description || "",
          public: forum.public ?? true,
          status: forum.status || "Published",
          author: forum.created_by?.username || userInfo?.Username || "Unknown",
          topic: forum.topic_id?.name || "General",
          tags: Array.isArray(forum.tags) ? forum.tags : [],
          likes: forum.likes ?? 0,
          dislikes: forum.dislikes ?? 0,
          isFavorited: false,
          userLiked: false,
          userDisliked: false,
          date: forum.createdAt
            ? new Date(forum.createdAt).toLocaleDateString()
            : "Unknown",
        };
      });

      console.log("Final mapped forums:", mappedForums);
      setCreatedForums(mappedForums);
    } catch (error) {
      console.error("Error fetching user forums:", error);
      setCreatedForums([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen text-[#141E46]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      <main
        className="flex-1 p-6 bg-white"
        style={{
          marginLeft: menuCollapsed ? "100px" : "300px",
          marginRight: "260px",
          marginTop: "85px",
        }}
      >
        <div
          className="mx-auto h-full border-black border-t border-l border-r rounded-t-[15px] bg-white p-4"
          style={{ width: "750px" }}
        >
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-xl w-[684px] h-[146px] mx-auto">
            <div className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 w-[140px] h-[140px] rounded-full border-4 border-slate-700 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center rounded-full text-slate-950 bg-slate-200 text-[40px]">
                {userInfo?.ProfilePicture ? (
                  // Show Profile Picture if available
                  <img
                    src={userInfo.ProfilePicture}
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
          <div className="w-[684px] mx-auto mt-20 text-center">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h2 className="text-[30px] font-bold flex items-center">
                  {fullname || "Loading..."}
                  {hasBadge && (
                    <img
                      src={badgeIcon}
                      alt="Badge"
                      className="w-[19px] h-auto md:w-6 md:h-6 ml-2"
                    />
                  )}
                </h2>
                <p className="text-[16px] font-regular">@{username}</p>
                <p className="text-[16px] font-regular">
                  {userInfo?.School || ""}
                </p>
              </div>
              <div className="w-[105px] h-[41px] rounded-[10px] border border-orange-400 flex items-center justify-center p-2">
                <span className="text-[16px] font-medium">
                  {userInfo?.Points || 0} points
                </span>
              </div>
            </div>
          </div>
          <div className="md:w-[684px] mx-auto">
            <div className="flex justify-between w-full mt-6 border-b-[2px] border-[#141E46]">
              <span className="text-[12px] md:text-[16px] font-semibold text-[#141E46] border-b-4 border-orange-400">
                Created Forums
              </span>
            </div>
          </div>
          <div className="w-[684px] mx-auto mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
              </div>
            ) : createdForums.length > 0 ? (
              <div>
                <ForumFunctions
                  forums={createdForums}
                  handleForumClick={handleForumClick}
                  compact={true}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="font-medium">No created forums yet. </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OtherProfile;

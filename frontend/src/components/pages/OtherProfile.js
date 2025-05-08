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
import Loading from "./Loading/Loading";
import setbg from "../images/setbg.png";

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
      const currentUserResponse = await axiosInstance.get("/users/get-user-info");
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
        setUserInfo(response.data.user);
        console.log("User info fetch successful.");
        return true;
      } else {
        setUserInfo({});
        setCreatedForums([]);
        navigate("*", {
          state: { title: "Oops! User not found" },
        });
        console.log("User info fetch failed.");
        return false;
      }
    } catch (error) {
      setUserInfo({});
      setCreatedForums([]);
      navigate("*", {
        state: { title: "Oops! User not found" },
      });
      console.log("User info fetch failed.");
      return false;
    }
  };
  
  const fetchUserForums = async () => {
    try {
      if (!userInfo?.Username) {
        setCreatedForums([]);
        console.log("Forum fetch failed.");
        return;
      }
  
      const response = await axiosInstance.get(`/forum/user/${userInfo.Username}`);
  
      if (!response.data || !Array.isArray(response.data.forums)) {
        setCreatedForums([]);
        console.log("Forum fetch failed.");
        return;
      }
  
      const forumIds = response.data.forums.map((forum) => forum._id);
      if (forumIds.length === 0) {
        setCreatedForums([]);
        console.log("Forum fetch successful (no forums).");
        return;
      }
  
      const forumDetailsPromises = forumIds.map((id) =>
        axiosInstance.get(`/forum/${id}`)
      );
      const forumResponses = await Promise.all(forumDetailsPromises);
  
      const mappedForums = forumResponses.map((response) => {
        const forum = response.data.forum || response.data;
  
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
  
      setCreatedForums(mappedForums);
      console.log("Forum fetch successful.");
    } catch (error) {
      setCreatedForums([]);
      console.log("Forum fetch failed.");
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
      {isLoading && <Loading message={""} />}
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

          <div className="md:w-[684px] mx-auto mt-20 text-center">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h2 className="text-[22px] md:text-[30px] font-bold flex items-center">
                  {fullname || "Loading..."}
                  {hasBadge && (
                    <img
                      src={badgeIcon}
                      alt="Badge"
                      className="w-[19px] h-auto md:w-6 md:h-6 ml-2"
                    />
                  )}
                </h2>
                <p className="text-[14px] md:text-[16px] font-regular">
                  @{username}
                </p>
                <p className="text-[14px] md:text-[16px] font-regular">
                  {userInfo?.School || ""}
                </p>
              </div>

              <div>
                <div className="w-[94px] h-[31px] md:w-[105px] md:h-[41px] rounded-[10px] border border-orange-400 flex items-center justify-center p-2">
                  <span className="text-[14px] md:text-[16px] font-medium">
                    {userInfo?.Points || 0} points
                  </span>
                </div>
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
          <div className="w-full mt-6 transform transition-all duration-500 ease-out opacity-0 translate-y-[-20px] animate-slide-fade">
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

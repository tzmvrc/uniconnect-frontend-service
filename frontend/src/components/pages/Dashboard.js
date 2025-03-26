/** @format */

import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import { useNavigate } from "react-router-dom";
import ForumFunctions from "../ForumFunctions";
import Pagination from "../Pagination";
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import CreateForumModal from "./CreateForumModal";
import Loading from "./Loading/Loading";

const Dashboard = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const navigate = useNavigate();
  const handleCreateForumClick = () => navigate("/createforum");
  const [forums, setForums] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [filteredForums, setFilteredForums] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortCriterion, setSortCriterion] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userInfo, setUserInfo] = useState(null);
  const totalItems = forums.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = forums.slice(indexOfFirstItem, indexOfLastItem);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      getForums();
    }
  }, [userInfo]);

 const getForums = async () => {
   try {
     const response = await axiosInstance.get("/forum/all");
     if (!response.data.success) throw new Error("Failed to fetch forums");

     const mappedForums = response.data.forums.map((forum) => ({
       id: forum._id,
       title: forum.title,
       content: forum.description,
       public: forum.public,
       status: forum.status,
       author: forum.created_by?.username || "Unknown",
       topic: forum.topic_id?.name || "General",
       topicId: forum.topic_id?._id, // 🔥 Save topicId too!
       tags: forum.tags || [],
       likes: forum.likes || 0,
       dislikes: forum.dislikes || 0,
       isFavorited: forum.isFavorited || false,
       userLiked: false,
       userDisliked: false,
       date: new Date(forum.createdAt).toLocaleDateString(),
     }));

     const visibleForums = mappedForums.filter(
       (forum) =>
         forum.public ||
         forum.author.toLowerCase() === userInfo?.Username.toLowerCase()
     );

     // 🔥 Match user's topic **IDs** with forum.topicId
     const userTopicIds = userInfo?.Topics || [];

     const matchingForums = [];
     const nonMatchingForums = [];

     visibleForums.forEach((forum) => {
       if (userTopicIds.includes(forum.topicId)) {
         matchingForums.push(forum);
       } else {
         nonMatchingForums.push(forum);
       }
     });

     const reorderedForums = [...matchingForums, ...nonMatchingForums];

     setForums(reorderedForums);
     setFilteredForums(reorderedForums);
   } catch (err) {
     console.error("Error fetching forums:", err);
   } finally {
     setLoading(false);
   }
 };


  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user-info");
      setUserInfo(response.data.user || {});
      console.log("User Info Fetched:", response.data.user); // ✅ Log user info here
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo({});
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setFilteredForums(
        forums.filter((forum) =>
          forum.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const handleForumClick = (forumId) => navigate(`/forum/${forumId}`);
  const handleVote = () => {};

  const handleFavoriteClick = (forumId) => {
    const updatedForums = forums.map((forum) =>
      forum.id === forumId
        ? { ...forum, isFavorited: !forum.isFavorited }
        : forum
    );

    setForums(updatedForums);
    setFilteredForums(updatedForums);
  };

  const handleSort = (criterion) => {
    setSortCriterion(criterion);
    setFilteredForums((prevForums) =>
      [...forums].sort((a, b) => {
        if (criterion === "mostLiked") {
          return b.likes - a.likes;
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      })
    );
    setShowSortOptions(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Current Page:", page);
  };

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="flex min-h-screen text-[#141E46]"
    >
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleKeyPress={handleKeyPress}
        handleSort={handleSort}
        handleForumClick={handleForumClick} // Passing handleForumClick to Header
      />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      {loading && <Loading message={""} />}

      <main
        className={`flex-1 p-4 md:p-6 bg-white w-[20%] ${
          menuCollapsed ? "md:ml-[190px] md:mr-[350px]" : "md:ml-[330px]"
        } mt-[70px] md:mt-[75px] md:mr-[290px]`}
      >
        {/* Create Forum Button */}
        <div className="flex right-0">
          <button
            onClick={() => setIsFormVisible(true)}
            className="fixed bottom-6 right-6 md:bottom-11 md:right-96 w-16 h-16 bg-[#EB6E5B] hover:bg-[#b43e2c] text-white rounded-full shadow-lg flex items-center justify-center z-20 duration-300 overflow-hidden"
          >
            <span className="text-[32px] leading-none">+</span>
          </button>
        </div>

        {/* Create Forum Form */}
        {isFormVisible && (
          <CreateForumModal onClose={() => setIsFormVisible(false)} />
        )}

        {/* Forum List */}
        {filteredForums.length > 0 ? (
          <ForumFunctions
            forums={filteredForums}
            userInfo={userInfo}
            handleVote={handleVote}
            handleForumClick={handleForumClick}
            handleFavoriteClick={handleFavoriteClick}
          />
        ) : (
          <p className="text-center mt-[50px] mb-[10px] ml-[5px]">
            No forums found based on your search.
          </p>
        )}

        {/* Pagination */}

        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default Dashboard;

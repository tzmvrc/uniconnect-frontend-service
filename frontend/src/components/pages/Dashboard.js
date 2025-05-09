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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortCriterion, setSortCriterion] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userInfo, setUserInfo] = useState(null);
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
        topicId: forum.topic_id?._id,
        tags: forum.tags || [],
        likes: forum.likes || 0,
        dislikes: forum.dislikes || 0,
        isFavorited: forum.isFavorited || false,
        userLiked: false,
        userDisliked: false,
        date: new Date(forum.createdAt).toLocaleDateString(),
        rawDate: new Date(forum.createdAt),
      }));

      const visibleForums = mappedForums.filter(
        (forum) =>
          forum.public ||
          forum.author.toLowerCase() === userInfo?.Username.toLowerCase()
      );

      // Match user's topic IDs with forum.topicId
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
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo({});
    }
  };

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (value.trim() === "") {
    setSearchResults([]); // Clear user results
    setFilteredForums(forums); // Optional: reset forum list too
  }
};


  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      const query = searchQuery.toLowerCase();

      // 1. Local forum filtering
      setFilteredForums(
        forums.filter((forum) => {
          const inTitle = forum.title.toLowerCase().includes(query);
          const inTopic = forum.topic.toLowerCase().includes(query);
          const inTags = forum.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          );
          const inContent = forum.content.toLowerCase().includes(query);
          return inTitle || inTopic || inTags || inContent;
        })
      );
      setCurrentPage(1); // Reset to first page on new search

      // 2. Backend user search
      if (searchQuery.trim() !== "") {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `users/search-user?username=${searchQuery}`
          );
          if (response.data.success) {
            setSearchResults(response.data.users); // Store user search results
          }
        } catch (err) {
          console.error("An error occurred while fetching users.");
        } finally {
          setLoading(false);
        }
      }
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

    const userTopicIds = userInfo?.Topics || [];
    const matchingForums = [];
    const nonMatchingForums = [];

    forums.forEach((forum) => {
      if (userTopicIds.includes(forum.topicId)) {
        matchingForums.push(forum);
      } else {
        nonMatchingForums.push(forum);
      }
    });

    // Apply sorting to each group separately
    const sortFn = (a, b) => {
      if (criterion === "mostLiked") {
        return b.likes - a.likes;
      } else {
        // default to "recent"
        return b.rawDate.getTime() - a.rawDate.getTime();
      }
    };

    const sortedMatchingForums = [...matchingForums].sort(sortFn);
    const sortedNonMatchingForums = [...nonMatchingForums].sort(sortFn);

    const sortedForums = [...sortedMatchingForums, ...sortedNonMatchingForums];

    setFilteredForums(sortedForums);
    setShowSortOptions(false);
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of forum list
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate pagination
  const totalItems = filteredForums.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForums.slice(indexOfFirstItem, indexOfLastItem);

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
        handleForumClick={handleForumClick}
      />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      {loading && <Loading message={""} />}

      <main
        className={`flex-1 p-4 md:p-6 bg-white w-[20%] ${
          menuCollapsed
            ? "md:ml-[120px] lg:ml-[160px]  md:mr-[20px] lg:mr-[353px]"
            : "md:ml-[305px] lg:mr-[150px]"
        } mt-[70px] md:mt-[75px] lg:mr-[290px]`}
      >
        {/* Create Forum Button */}
        <div className="flex right-0">
          <button
            onClick={() => setIsFormVisible(true)}
            className="fixed bottom-6 right-6 md:bottom-11 md:right-31  lg:right-96 w-16 h-16 bg-[#EB6E5B] hover:bg-[#b43e2c] text-white rounded-full shadow-lg flex items-center justify-center z-20 duration-300 overflow-hidden"
          >
            <span className="text-[32px] leading-none">+</span>
          </button>
        </div>

        {/* Create Forum Form */}
        {isFormVisible && (
          <CreateForumModal onClose={() => setIsFormVisible(false)} />
        )}

        {searchResults.map((user) => {
          const fullName = `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim();
          const getInitials = (name) => {
            return name
              .split(" ")
              .map((word) => word[0]?.toUpperCase())
              .join("")
              .slice(0, 2);
          };

          return (
            <div
              key={user._id}
              onClick={() => navigate(`/${user.username}`)}
              className="flex items-center justify-between border border-black cursor-pointer p-4 rounded-lg bg-white shadow-sm flex-wrap mb-[20px]"
            >
              {/* Left: Profile + Username + Forums Created */}
              <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                <div className="w-[42px] h-[42px] md:w-12 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 border border-black">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(user.first_name + " " + user.last_name)
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">@{user.username}</h4>
                  <p className="text-sm text-gray-600">
                    Forums Created: {user.forumCount}
                  </p>
                </div>
              </div>

              {/* Center: School */}
              <div className="flex-1 text-center text-sm text-gray-500 font-bold italic">
                {user.school_id?.school_name || "No School Info"}
              </div>

              {/* Right: Points */}
              <div className="text-right min-w-[60px]">
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-xl font-bold text-black">{user.points}</p>
              </div>
            </div>
          );
        })}

        {/* Forum List */}
        {filteredForums.length > 0 ? (
          <ForumFunctions
            forums={currentItems} // Use currentItems instead of filteredForums
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
        {filteredForums.length > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage} // Pass current page to component
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

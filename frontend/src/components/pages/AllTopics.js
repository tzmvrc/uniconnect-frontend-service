/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import Pagination from "../Pagination";
import ForumFunctions from "../ForumFunctions";
import axios from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import back from "../images/back Icon.png";
import Loading from "./Loading/Loading";

const AllTopics = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [topics, setTopics] = useState([]);
  const [userTopicsArray, setUserTopicsArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicForums, setTopicForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForums, setLoadingForums] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const itemsPerPage = 19;
  const navigate = useNavigate();

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

  const fetchData = async () => {
    try {
      const topicsResponse = await axios.get("/topic/all");
      let allTopics = [];
      if (topicsResponse.data.successful) {
        allTopics = topicsResponse.data.topics;

        setTopics(allTopics);
      }

      const userResponse = await axios.get("/users/get-user-info");

    
      if (userResponse.data.user) {
        const userTopics = userResponse.data.user.Topics || [];
       
        setUserTopicsArray(userTopics);
        setUserInfo(userResponse.data.user);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForumsByTopic = async (topicName, topicId) => {
    setLoadingForums(true);
    try {
      const response = await axios.get("/forum/all");

      if (response.data && Array.isArray(response.data.forums)) {
        const filteredForums = response.data.forums.filter((forum) => {
          const topicMatches =
            (forum.topic_id && forum.topic_id.name === topicName) ||
            (forum.topic_id &&
              forum.topic_id._id &&
              topicId &&
              forum.topic_id._id.toString() ===
                (typeof topicId === "object" ? topicId.toString() : topicId));

          const isAccessible =
            forum.public ||
            (userInfo &&
              ((forum.created_by && forum.created_by._id === userInfo._id) || // User created the forum
                userInfo.role === "admin" || // User is an admin
                (forum.authorized_users &&
                  forum.authorized_users.includes(userInfo._id)))); // User is authorized

          return topicMatches && isAccessible;
        });

        const mappedForums = filteredForums.map((forum) => ({
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
          isFavorited: forum.isFavorited || false,
          userLiked: false,
          userDisliked: false,
          date: new Date(forum.createdAt).toLocaleDateString(),
        }));

        setTopicForums(mappedForums);
      } else {
        console.error("Unexpected response format:", response.data);
        setTopicForums([]);
      }
    } catch (error) {
      console.error("Error fetching forums:", error);
      setTopicForums([]);
    } finally {
      setLoadingForums(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleBackClick = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
      setTopicForums([]);
    } else {
      navigate(-1);
    }
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    fetchForumsByTopic(topic.name, topic._id);
  };

  const handleForumClick = (forumId) => {
    navigate(`/forum/${forumId}`);
  };

  const handleVote = () => {};

  const handleFavoriteClick = (forumId) => {
    setTopicForums((prevForums) =>
      prevForums.map((forum) =>
        forum.id === forumId
          ? { ...forum, isFavorited: !forum.isFavorited }
          : forum
      )
    );
  };

  const isTopicAdded = (topic) => {
    if (!topic || !topic._id || !userTopicsArray.length) return false;

    const topicIdStr =
      typeof topic._id === "object" ? topic._id.toString() : topic._id;

    return userTopicsArray.some((userTopicId) => {
      const userTopicIdStr =
        typeof userTopicId === "object" ? userTopicId.toString() : userTopicId;
      return userTopicIdStr === topicIdStr;
    });
  };

  const handleToggleClick = async (topic) => {
    if (!topic || !topic._id) return;

    const isAdded = isTopicAdded(topic);
    const endpoint = isAdded ? "/topic/remove" : "/topic/add";

    try {
      const response = await axios.post(endpoint, { topicNames: [topic.name] });

      if (response.data.successful) {
        await fetchData();
        showToastMessage(
          "success",
          isAdded ? `Topic removed successfully!` : `Topic added successfully!`
        );
      } else {
        console.error("Server error:", response.data);
        showToastMessage(
          "error",
          `Error: ${response.data.message || "Failed to update topic"}`
        );
      }
    } catch (error) {
      console.error(
        "Request failed:",
        error.response ? error.response.data : error
      );
      showToastMessage(
        "error",
        `Error: ${
          error.response?.data?.message ||
          "An error occurred while updating topics"
        }`
      );
    }
  };

  const filteredTopics = topics.filter((topic) => {
    if (filter === "All") return true;
    return filter === "Added" ? isTopicAdded(topic) : !isTopicAdded(topic);
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    const aAdded = isTopicAdded(a);
    const bAdded = isTopicAdded(b);

    if (aAdded && !bAdded) return -1;
    if (!aAdded && bAdded) return 1;

    return a.name.localeCompare(b.name);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTopics.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div
      className="flex w-full h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      {loading && <Loading message={""} />}

      {/* Add Toast component */}
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />
      <div className="flex flex-col w-full items-center">
        <main
          className={`flex justify-center mb-[90px] w-full md:w-[80%] lg:w-[58%] h-full mt-[0px] transition-all duration-300 ${
            menuCollapsed ? "ml-0 md:mr-[0px] lg:mr-[210px]" : "mr-[30px] md:ml-[190px] lg:ml-[30px]"
          }`}
        >
          <div className="w-full md:w-[1050px] min-h-fit mt-20 md:mt-24 ml-[10px] md:ml-20 mr-[10px] md:mr-4 bg-white r rounded-[10px] md:rounded-xl shadow-md overflow-hidden border border-black p-4 md:p-6">
            {selectedTopic ? (
              <>
                <div
                  className={`
                hidden md:block fixed top-[0] z-20 md:top-[180px] transition-all duration-300
                ${
                  menuCollapsed
                    ? "left-[10px] md:left-[240px] "
                    : "left-[220px] md:left-[330px]"
                }
              `}
                >
                  <img
                    src={back}
                    alt="Back"
                    className="h-auto w-[25px] cursor-pointer"
                    onClick={() => setSelectedTopic(null)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <img
                    src={back}
                    alt="Back"
                    className="h-auto w-[25px] mr-[10px] md:hidden cursor-pointer"
                    onClick={() => setSelectedTopic(null)}
                  />
                  <h1 className="text-[18px] md:text-2xl font-bold text-[#141E46]">
                    {selectedTopic.name} Forums
                  </h1>
                  <button
                    className={`text-sm  md:text-base cursor-pointer font-semibold px-2 md:px-3 py-1 ml-[10px] rounded-[5px] md:rounded-lg ${
                      isTopicAdded(selectedTopic)
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                    onClick={() => handleToggleClick(selectedTopic)}
                  >
                    {isTopicAdded(selectedTopic) ? "Added" : "Not Added"}
                  </button>
                </div>
                <p className="text-[12px] md:text-[15px] text-[#141E46] mt-1 mb-4">
                  {selectedTopic.description ||
                    `Forums related to the ${selectedTopic.name} topic.`}
                </p>

                <div className="w-full h-[4px] rounded bg-[#f06c58] mt-[5px] my-4"></div>

                {loadingForums ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-xl text-[#141E46]">Loading forums...</p>
                  </div>
                ) : topicForums.length > 0 ? (
                  <ForumFunctions
                    forums={topicForums}
                    userInfo={userInfo}
                    handleVote={handleVote}
                    handleForumClick={handleForumClick}
                    handleFavoriteClick={handleFavoriteClick}
                  />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[13px] md:text-md text-[#141E46]">
                      No forums found for this topic.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[#141E46]">Topics</h1>
                <p className="text-[14px] md:text-[15px] text-[#141E46] mt-1">
                  Select your topics to personalize what appears on your feed.
                </p>

                <div className="flex text-[14px] md:text-base justify-between mb-4 items-center">
                  <div></div>
                  <select
                    className="border p-2 rounded-lg text-[#141E46]"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Topics</option>
                    <option value="Added">Added</option>
                    <option value="Not Added">Not Added</option>
                  </select>
                </div>

                <div className="w-full h-[4px] rounded bg-[#f06c58] mt-[10px] my-4"></div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="text-[#141E46] font-semibold text-md md:text-lg pb-2 pl-[40px] md:pl-[100px] pr-[20px]">
                        Topics
                      </th>
                      <th className="text-[#141E46] font-semibold text-md md:text-lg pb-2">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((topic, index) => (
                      <tr
                        key={topic._id || index}
                        className="border-t border-gray-300"
                      >
                        <td className="flex items-center pt-3">
                          <span
                            className="text-[#141E46] text-[15px] md:text-[17px] pl-[0px] md:pl-[40px] hover:underline cursor-pointer mr-4"
                            onClick={() => handleTopicClick(topic)}
                          >
                            {topic.name}
                          </span>
                        </td>
                        <td className="text-sm  md:text-base py-2">
                          <button
                            className={`cursor-pointer font-semibold px-2 md:px-3 py-1 rounded-[5px] md:rounded-lg ${
                              isTopicAdded(topic)
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                            onClick={() => handleToggleClick(topic)}
                          >
                            {isTopicAdded(topic) ? "Added" : "Not Added"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {!selectedTopic && (
              <Pagination
                totalItems={filteredTopics.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllTopics;

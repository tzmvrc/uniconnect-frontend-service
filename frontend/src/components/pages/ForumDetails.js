import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import back from "../images/back Icon.png";
import iconSave from "../images/icon-save.png";
import iconSaveColor from "../images/icon-save-color.png";
import iconLike from "../images/icon-like.png";
import iconLikeColor from "../images/icon-like-color.png";
import iconDislike from "../images/icon-dislike.png";
import iconDislikeColor from "../images/icon-dislike-color.png";
import axiosInstance from "../Utils/axiosInstance";
import { getInitials } from "../Utils/Helper";
import Responses from "./Responses";
import Loading from "./Loading/Loading";
import Toast from "./ToastMessage/ToastMessage";
import { MoreVertical } from "lucide-react";
import ConfirmDeletion from "../Confirmation/confirmation";
import EditForum from "./EditForumModal";
import { Pencil, Trash2, Lock, Unlock } from "lucide-react";


const ForumDetails = () => {
  const { forum_id } = useParams();
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingForum, setLoadingForum] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
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

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast({ isShown: false, message: "" });
    }, 1500);
  };

useEffect(() => {
  const loadData = async () => {
    try {
      // Get logged-in user
      const userResponse = await axiosInstance.get("/users/get-user-info");
      const userData = userResponse.data.user || {};
      setUserInfo(userData);

      // Get the forum
      const forumResponse = await axiosInstance.get(`/forum/${forum_id}`);
      const forumData = forumResponse.data.forum;
      const userId = userData._id;

      // Proceed if response is successful
      const isDeletedUser =
        forumData.created_by?.username?.startsWith("Deleted_User");
      const formattedUsername = isDeletedUser
        ? forumData.created_by?.username
        : forumData.created_by?.username || "Unknown";

      setForum({
        id: forumData._id,
        title: forumData.title,
        content: forumData.description,
        public: forumData.public,
        status: forumData.status,
        author: formattedUsername,
        isDeletedUser: isDeletedUser,
        fullname: `${forumData.created_by?.first_name} ${forumData.created_by?.last_name}`,
        profilePicture: forumData.created_by?.profilePicture,
        topic: forumData.topic_id?.name || "General",
        tags: forumData.tags || [],
        likes: forumData.likes || 0,
        dislikes: forumData.dislikes || 0,
        isSaved: forumData.isFavorited || false,
        isLiked: forumData.liked_by.includes(userId),
        isDisliked: forumData.disliked_by.includes(userId),
        date: new Date(forumData.createdAt).toLocaleDateString(),
      });

      setLoadingForum(false);
      fetchResponseCount();
      fetchUserForumStates(forumData._id);
    } catch (error) {
      console.error("Error loading forum:", error);

      // ✅ Navigate based on error status
      if (error.response?.status === 403) {
       navigate("*", {
         state: { title: "Oops! Forum not found" },
       });
      } else if (error.response?.status === 404) {
        navigate("*", {
          state: { title: "Oops! Forum not found" },
        });
      } else {
        // Other errors (e.g., server error)  
        navigate("/error");
      }
    }
  };

  loadData();
}, [forum_id, refreshKey]);

  const refreshForum = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const fetchUserForumStates = async (forumId) => {
    try {
      const [savedResponse, voteResponse] = await Promise.all([
        axiosInstance.get("/users/saved-forums"),
        axiosInstance.get(`/users/${forumId}/saved-votes`),
      ]);

      setForum((prevForum) => ({
        ...prevForum,
        isSaved: savedResponse.data.savedForums?.includes(forumId) || false,
        isLiked: voteResponse.data.isLiked,
        isDisliked: voteResponse.data.isDisliked,
      }));
    } catch (error) {
      console.error("Error fetching forum states:", error);
    }
  };

  const fetchResponseCount = async () => {
    try {
      const res = await axiosInstance.get(`/response/${forum_id}/count`);
      setResponseCount(res.data.count);
    
    } catch (error) {
      console.error("Error fetching response count:", error);
    }
  };

  const handleVote = async (type) => {
    if (!forum) return;

    try {
      const isCurrentlyLiked = forum.isLiked;
      const isCurrentlyDisliked = forum.isDisliked;

      let newLikes = forum.likes;
      let newDislikes = forum.dislikes;

      if (type === "like") {
        if (isCurrentlyLiked) {
          newLikes -= 1;
        } else {
          newLikes += 1;
          if (isCurrentlyDisliked) newDislikes -= 1;
        }
      } else if (type === "dislike") {
        if (isCurrentlyDisliked) {
          newDislikes -= 1;
        } else {
          newDislikes += 1;
          if (isCurrentlyLiked) newLikes -= 1;
        }
      }

      await axiosInstance.post(`/forum/${forum.id}/${type}`);

      setForum((prevForum) => ({
        ...prevForum,
        isLiked: type === "like" ? !isCurrentlyLiked : false,
        isDisliked: type === "dislike" ? !isCurrentlyDisliked : false,
        likes: newLikes,
        dislikes: newDislikes,
      }));
    } catch (error) {
      console.error("Error updating vote:", error);
    }
    refreshForum();
  };

  const handleSaveUnsave = async () => {
    if (!forum) return;

    try {
      const isCurrentlySaved = forum.isSaved;
      const url = `/forum/${forum.id}/${isCurrentlySaved ? "unsave" : "save"}`;

      if (isCurrentlySaved) {
        await axiosInstance.delete(url);
      } else {
        await axiosInstance.post(url);
      }

      // ✅ Optimistically update forum state
      setForum((prevForum) => ({
        ...prevForum,
        isSaved: !prevForum.isSaved,
      }));

   
    } catch (error) {
      console.error("Error saving/unsaving forum:", error);
    }
  };

  const handleResponseSubmit = async () => {
    if (!response) {
      showToastMessage("error", "Please enter something first");
      return; // Prevent further execution
    }

    setLoading(true);

    try {
      const createResponse = await axiosInstance.post(`/response/create`, {
        forum_id: forum_id,
        comment: response,
      });

      if (createResponse.status === 200 || createResponse.status === 201) {
      
        showToastMessage("success", "Comment Posted!");
        setResponse("");
      } else {
        console.log("Unexpected response:", createResponse);
      }
    } catch (err) {
      console.error("Error posting response:", err);
      showToastMessage("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

    refreshForum();
  };

  const handleClose = async () => {
    try {
      await axiosInstance.put(`/forum/close/${forum_id}`);
      showToastMessage("success", "Forum Closed");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error("Error deleting forum:", error);
    }
  };

  // Example: Use refreshForum after an action
  const handleOpen = async () => {
    try {
      await axiosInstance.put(`/forum/open/${forum_id}`);
      showToastMessage("success", "Forum Opened");
      setTimeout(() => {
        window.location.reload(); // ✅ Refresh without reloading
      }, 1200);
    } catch (error) {
      console.error("Error opening forum:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/forum/delete/${forum_id}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting forum:", error);
    }
  };

  const handleEdit = async () => {
    navigate(`/update-forum/${forum_id}`);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex min-h-screen text-[#141E46]">
      <Header />
      <Sidebar
        menuCollapsed={menuCollapsed}
        toggleMenu={() => setMenuCollapsed(!menuCollapsed)}
      />
      <Leaderboards />

      <div
        className={`
    hidden md:block fixed top-[0] z-20 md:top-[180px] transition-all duration-300
    ${
      menuCollapsed
        ? "left-[10px] md:left-[150px] lg:left-[170px] "
        : "left-[220px] md:left-[330px]"
    }
  `}
      >
        <img
          src={back}
          alt="Back"
          className="h-auto w-[25px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      <div
        className={`flex w-full mt-[80px] md:mt-[100px] relative ${
          menuCollapsed
            ? "ml-[5px] mr-[5px] md:ml-[200px] md:mr-[90px] lg:ml-[220px] lg:mr-[370px]"
            : "ml-[380px] mr-[310px] md:ml-[380px] md:mr-[50px] lg:ml-[380px] lg:mr-[310px]"
        }`}
      >
        <div className="flex flex-col w-full h-full max-h-[calc(100dvh-80px)] px-3 md:max-h-[calc(100vh-100px)] border border-black rounded-[5px] relative pb-16">
          {/* Toast Messages */}
          <div className="flex flex-col w-full items-center">
            <Toast
              isShown={showToast.isShown}
              type={showToast.type}
              message={showToast.message}
              onClose={handleCloseToast}
            />
          </div>
          {loadingForum && <Loading message={""} />}

          {/* Save/Unsave Button */}
          {userInfo?.Username !== forum?.author && (
            <div className="absolute top-[20px] right-4">
              <button onClick={handleSaveUnsave}>
                <img
                  src={forum?.isSaved ? iconSaveColor : iconSave}
                  alt="Save"
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            </div>
          )}

          {/* Forum Details */}
          <div className="flex flex-col px-0 md:px-4 pt-4 ">
            <div className="flex items-center mb-[5px]">
              <img
                src={back}
                alt="Back"
                className="h-auto w-[25px] mr-[10px] md:hidden cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <div className="w-[42px] h-[42px] md:w-12 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black overflow-hidden">
                {forum?.profilePicture ? (
                  // Show Profile Picture if available
                  <img
                    src={forum.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  // Show Initials if no Profile Picture
                  getInitials(forum?.fullname)
                )}
              </div>

              <p className="text-[13px] md:text-[16px] mr-4 font-[650] md:font-[600]">
                {forum?.isDeletedUser ? forum?.author : `@${forum?.author}`} ·{" "}
                {forum?.date}
              </p>
              {forum?.status === "closed" && (
                <div className="bg-[#fdb0a4] rounded-md px-4 py-1 text-sm font-bold mr-[20px]">
                  FORUM CLOSED
                </div>
              )}
              {forum?.public === false && (
                <div className="bg-[#fdb0a4] rounded-md px-4 py-1 text-sm font-bold">
                  PRIVATE
                </div>
              )}

              {userInfo?.Username === forum?.author && (
                <div className="relative ml-auto mr-[5px]">
                  <button
                    onClick={toggleMenu}
                    className="p-2 hover:bg-gray-200 rounded-md"
                  >
                    <MoreVertical size={24} />
                  </button>

                  {/* Dropdown menu */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-slate-200 border rounded-md shadow-md">
                      <button
                        onClick={() => setIsFormVisible(true)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left font-[500] hover:bg-[#141E46] hover:text-white rounded-md"
                      >
                        <Pencil size={16} />
                        Edit Forum
                      </button>

                      {forum?.status === "closed" ? (
                        <button
                          onClick={handleOpen}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left font-[500] hover:bg-[#141E46] hover:text-white rounded-md"
                        >
                          <Unlock size={17} />
                          Open Forum
                        </button>
                      ) : (
                        <button
                          onClick={handleClose}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left font-[500] hover:bg-[#141E46] hover:text-white rounded-md"
                        >
                          <Lock size={17} />
                          Close Forum
                        </button>
                      )}

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 font-[500] hover:bg-[#da4444] hover:text-white rounded-md"
                      >
                        <Trash2 size={16} />
                        Delete Forum
                      </button>

                      <ConfirmDeletion
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleDelete}
                        title={"Delete Forum?"}
                        message="Once deleted, the forum and all of its content will be permanently removed and cannot be recovered."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-[15px] md:text-lg font-[600] md:font-[400]">
              Topic: {forum?.topic}
            </h2>
            <h1 className="text-[18px] md:text-2xl font-[650] md:font-[500]">
              {forum?.title}
            </h1>
            <div className="bg-[#fdb0a4] text-[13px] md:text-sm font-[600] md:font-[500] rounded-md px-2 py-1 mt-1 inline-block w-fit">
              Tags: {forum?.tags.join(", ") || "None"}
            </div>
            <p className="whitespace-pre-line mt-[11px] md:mt-[13px] text-[14px] md:text-base">
              {forum?.content}
            </p>

            {/* Like & Dislike Buttons */}
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => handleVote("like")}
                className="flex items-center space-x-2"
              >
                <img
                  src={forum?.isLiked ? iconLikeColor : iconLike}
                  alt="Like"
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:scale-110"
                />
                <span>{forum?.likes}</span>
              </button>

              <button
                onClick={() => handleVote("dislike")}
                className="flex items-center space-x-2"
              >
                <img
                  src={forum?.isDisliked ? iconDislikeColor : iconDislike}
                  alt="Dislike"
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:scale-110"
                />
                <span>{forum?.dislikes}</span>
              </button>
            </div>

            {/* Separator */}
            <div className="w-full h-[5px] md:h-[6px] mt-[8px] border-b-[3px] rounded-full border-[#f06c58]"></div>

            <div className="flex items-center space-x-4 mt-2 mb-[5px] font-[600] text-[14px] md:text-[16px]">
              Responses
              <div className="flex items-center justify-center bg-[#f06c58] text-white rounded-[5px] w-[27px] h-[27px] ml-[12px]">
                {responseCount}
              </div>
            </div>
          </div>

          {/* Scrollable Response Section */}
          <div className="flex-grow overflow-y-auto max-h-full px-4">
            <Responses
              forum_id={forum_id}
              userInfo={userInfo}
              setResponseCount={refreshForum}
            />
          </div>

          {forum?.status === "open" && (
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 flex items-center">
              <input
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border text-[13px] md:text-base border-[#141E46] rounded-md focus:outline-none bg-[#FFCDA9] placeholder:text-[#141E46]"
              />
              <button
                onClick={handleResponseSubmit}
                disabled={loading}
                className="ml-3 px-5 py-2 bg-[#141E46] text-white text-[13px] md:text-base rounded-md hover:bg-[#e05c48] transition disabled:bg-gray-400"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Create Forum Form */}
      {isFormVisible && (
        <EditForum
          onClose={() => setIsFormVisible(false)}
          forum_id={forum_id}
        />
      )}
    </div>
  );
};

export default ForumDetails;

/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import iconLike from "../images/icon-like.png";
import iconLikeColor from "../images/icon-like-color.png";
import iconDislike from "../images/icon-dislike.png";
import iconDislikeColor from "../images/icon-dislike-color.png";
import { getInitials } from "../Utils/Helper";
import { MoreVertical } from "lucide-react";
import Toast from "./ToastMessage/ToastMessage";
import badgeIcon from "../images/badge icon.png";
import { Pencil } from "lucide-react";

const formatDate = (isoDate) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInDays = Math.floor(diffInSeconds / 86400);

  if (diffInSeconds < 60) return `now`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInDays <= 3) return `${diffInDays}d ago`;

  // Show actual date for responses older than 3 days
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};


const ResponseItem = ({ response, userInfo, setResponseCount }) => {
  const navigate = useNavigate();
 
  const author = response.created_by?.username || "";
  const username = userInfo?.Username;
  const timestamp = formatDate(response.updatedAt);
  const isModified = response.createdAt !== response.updatedAt; // Check if it's been modified
  const fullname = `${response.created_by?.first_name} ${response.created_by?.last_name}`;

  const [likes, setLikes] = useState(response.likes);
  const [dislikes, setDislikes] = useState(response.dislikes);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(response.comment);
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
    const fetchVoteStatus = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/response/${response._id}/saved-votes`
        );
        setUserLiked(data.isLiked);
        setUserDisliked(data.isDisliked);
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    const handleBadge = async () => {
      try {
        const checkBadge = await axiosInstance.get(
          `/users/check-user-badge/${author}`
        );
        setHasBadge(checkBadge.data.hasBadge);
      } catch (err) {
        console.log("Error checking badge:", err);
      }
    };

    fetchVoteStatus();
    handleBadge();
  }, [response._id, author]);

  const handleVote = async (response_id, type) => {
    try {
      let newLikes = likes;
      let newDislikes = dislikes;
      let newUserLiked = userLiked;
      let newUserDisliked = userDisliked;

      if (type === "like") {
        newUserLiked = !userLiked;
        newLikes += userLiked ? -1 : 1;
        if (userDisliked) {
          newDislikes -= 1;
          newUserDisliked = false;
        }
      } else {
        newUserDisliked = !userDisliked;
        newDislikes += userDisliked ? -1 : 1;
        if (userLiked) {
          newLikes -= 1;
          newUserLiked = false;
        }
      }

      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserLiked(newUserLiked);
      setUserDisliked(newUserDisliked);

      await axiosInstance.post(`/response/${response_id}/${type}`);
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedContent(response.comment);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axiosInstance.put(`/response/update/${response._id}`, {
        comment: updatedContent,
      });

      const { updated, message } = res.data;

      if (updated) {
        showToastMessage("success", message || "Response updated successfully");
        setIsEditing(false);
      } else {
        showToastMessage("info", message || "No changes were made.");
      }
    } catch (error) {
      console.error("Error updating response:", error);
      showToastMessage("error", "Failed to update response");
    }
  };

  const handleDelete = async () => {
    showToastMessage("success", "Response Deleted");
    setTimeout(async () => {
      try {
        await axiosInstance.delete(`/response/delete/${response._id}`, {
          content: updatedContent,
        });
        setResponseCount();
        setIsEditing(false);
      } catch (error) {
        console.error("Error deleting response:", error);
      }
    }, 900);
  };

  return (
    <div className="flex flex-col response mb-1 p-3 md:p-4 border-b-[3px] border-slate-300">
      <div className="flex flex-col items-center">
        <Toast
          isShown={showToast.isShown}
          type={showToast.type}
          message={showToast.message}
          onClose={handleCloseToast}
        />
      </div>
      <div className="flex items-center mb-[7px]">
        {hasBadge ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[2px] border-[#fa6638]">
            {response?.created_by?.profilePicture ? (
              // Show Profile Picture if available
              <img
                src={response.created_by?.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              // Show Initials if no Profile Picture
              getInitials(fullname)
            )}
          </div>
        ) : (
          <div className="w-[42px] h-[42px] md:w-12 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black">
            {response?.created_by?.profilePicture ? (
              // Show Profile Picture if available
              <img
                src={response.created_by?.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              // Show Initials if no Profile Picture
              getInitials(fullname)
            )}
          </div>
        )}

        {hasBadge ? (
          <div className="flex">
            <h3
              className="text-[13px] md:text-[14px] font-semibold cursor-pointer mr-[5px] hover:text-[#e63f3f]"
              onClick={() => navigate(`/${author}`)}
            >
              @{author}
            </h3>
            <img
              src={badgeIcon}
              alt="Badge Icon"
              className="inline-block w-5 h-5 ml-[5px] mr-[10px]"
            />
            <h3
              className="text-[14px] font-semibold cursor-pointer mr-[5px] hover:text-[#e63f3f]"
              onClick={() => navigate(`/${author}`)}
            >
              ·
            </h3>
          </div>
        ) : (
          <div>
            <h3
              className="text-[13px] md:text-[14px] font-semibold cursor-pointer mr-[5px] hover:text-[#e63f3f]"
              onClick={() => navigate(`/${author}`)}
            >
              @{author} ·
            </h3>
          </div>
        )}
        <h3 className="flex items-center gap-1 text-[13px] md:text-[14px] font-semibold">
          {isModified && <Pencil className="w-4 h-4" />}
          {timestamp}
        </h3>

        {author === username && (
          <div className="ml-auto cursor-pointer">
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={toggleMenu}
            >
              <MoreVertical size={20} />
            </button>
          </div>
        )}
      </div>

      {menuOpen && isEditing ? (
        <div>
          <input
            type="text"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="border border-[#141E46] bg-[#FFCDA9] p-2 rounded w-full mt-1"
          />
          <div className="flex space-x-4 mt-3">
            <button
              onClick={handleCancelEdit}
              className="bg-slate-200 border border-[#141E46] text-[#141E46] rounded-md px-4 py-[2px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="bg-[#141E46] text-white px-5 py-[2px] rounded-md"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-5 py-[2px] rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-[14px] font-[450] ml-[5px]">{response.comment}</p>
          <div className="flex items-center space-x-4 mt-[6px] md:mt-[10px] ml-[5px]">
            <button
              onClick={() => handleVote(response._id, "like")}
              className="flex items-center space-x-2"
            >
              <img
                src={userLiked ? iconLikeColor : iconLike}
                alt="Like"
                className="w-[20px] h-[20px]"
              />
              <span>{likes}</span>
            </button>
            <button
              onClick={() => handleVote(response._id, "dislike")}
              className="flex items-center space-x-2"
            >
              <img
                src={userDisliked ? iconDislikeColor : iconDislike}
                alt="Dislike"
                className="w-[20px] h-[20px]"
              />
              <span>{dislikes}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResponseItem;

/** @format */
import React, { useState, useEffect } from "react";
import iconLike from "./images/icon-like.png";
import iconLikeColor from "./images/icon-like-color.png";
import iconDislike from "./images/icon-dislike.png";
import iconDislikeColor from "./images/icon-dislike-color.png";
import iconSave from "./images/icon-save.png";
import iconSaveColor from "./images/icon-save-color.png";
import axiosInstance from "./Utils/axiosInstance";

const ForumFunctions = ({ forums, userInfo, handleForumClick, compact }) => {
  const [forumData, setForumData] = useState(forums);

  useEffect(() => {
    const fetchUserForumStates = async () => {
      try {
        const response = await axiosInstance.get("/users/saved-forums");
        const savedForumsData = response.data.savedForums || [];

        const updatedForums = await Promise.all(
          forums.map(async (forum) => {
            const voteStatus = await axiosInstance.get(
              `/users/${forum.id}/saved-votes`
            );

            return {
              ...forum,
              isSaved: savedForumsData.includes(forum.id),
              isLiked: voteStatus.data.isLiked,
              isDisliked: voteStatus.data.isDisliked,
            };
          })
        );

        setForumData(updatedForums);
      } catch (error) {
        console.error("Error fetching forum states:", error);
      }
    };

    fetchUserForumStates();
  }, [forums]);

  const handleSaveUnsave = async (forumId) => {
    try {
      const forumIndex = forumData.findIndex((forum) => forum.id === forumId);
      if (forumIndex === -1) return;

      const isCurrentlySaved = forumData[forumIndex].isSaved;
      const url = `/forum/${forumId}/${isCurrentlySaved ? "unsave" : "save"}`;

      if (isCurrentlySaved) {
        await axiosInstance.delete(url);
      } else {
        await axiosInstance.post(url);
      }

      // Update forumData directly
      setForumData((prevData) =>
        prevData.map((forum) =>
          forum.id === forumId ? { ...forum, isSaved: !forum.isSaved } : forum
        )
      );
    } catch (error) {
      console.error("Error saving/unsaving forum:", error);
    }
  };

  const handleVote = async (forumId, type) => {
    try {
      const forum = forumData.find((f) => f.id === forumId);
      const isCurrentlyLiked = forum.isLiked;
      const isCurrentlyDisliked = forum.isDisliked;

      let newLikes = forum.likes;
      let newDislikes = forum.dislikes;

      if (type === "like") {
        if (isCurrentlyLiked) {
          // Remove like
          newLikes -= 1;
        } else {
          // Add like
          newLikes += 1;
          if (isCurrentlyDisliked) {
            // Remove dislike if switching from dislike
            newDislikes -= 1;
          }
        }
      } else if (type === "dislike") {
        if (isCurrentlyDisliked) {
          // Remove dislike
          newDislikes -= 1;
        } else {
          // Add dislike
          newDislikes += 1;
          if (isCurrentlyLiked) {
            // Remove like if switching from like
            newLikes -= 1;
          }
        }
      }

      // Send API request
      await axiosInstance.post(`/forum/${forumId}/${type}`);

      // Update UI state
      setForumData((prevForums) =>
        prevForums.map((forum) =>
          forum.id === forumId
            ? {
                ...forum,
                isLiked: type === "like" ? !isCurrentlyLiked : false,
                isDisliked: type === "dislike" ? !isCurrentlyDisliked : false,
                likes: newLikes,
                dislikes: newDislikes,
              }
            : forum
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {forumData.map((forum) => (
        <div
          key={forum.id}
          className="bg-white p-4 rounded-lg shadow-lg text-[#141E46] border-[1px] border-black relative cursor-pointer"
          onClick={() => handleForumClick(forum.id)}
        >
          {userInfo?.Username !== forum?.author && (
            <div className="absolute top-[16px] right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveUnsave(forum.id);
                }}
              >
                <img
                  src={forum.isSaved ? iconSaveColor : iconSave}
                  alt="Save"
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <h3
              className={`font-[500] mr-[10px] ${
                compact ? "text-[17px]" : "text-[12px] md:text-[18px]"
              }`}
            >
              {"Topic: " + forum.topic}
            </h3>
            {forum?.status === "closed" && (
              <div className="hidden md:block bg-[#fdb0a4] justify-center rounded-[6px] md:rounded-md px-4 py-1 text-[11px] md:text-sm font-bold mr-[20px] w-[70px] md:w-auto">
                FORUM CLOSED
              </div>
            )}
            {forum?.public === false && (
              <div className="bg-[#fdb0a4] rounded-[6px] md:rounded-md px-3 md:px-4 py-1 text-[11px] md:text-sm font-bold">
                PRIVATE
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <h2
              className={`font-bold ${
                compact ? "text-[23px]" : "text-[20px] md:text-[28px]"
              }`}
            >
              {forum.title}
            </h2>
          </div>
          <p
            className={`text-[11px] md:text-[13px] ml-[0px] md:ml-[5px] ${
              compact ? "font-regular" : "font-medium"
            }`}
          >
            Posted on {forum.date}
            <br />
            By:{" "}
            <a
              href={`/${forum.author}`}
              className="text-[11px] md:text-[13px] hover:underline"
            >
              {forum.author || "Unknown"}
            </a>
          </p>
          <div className="flex items-center mt-[5px]">
            <div className="px-2 py-[2px] md:py-1 bg-[#F8C7BF] rounded-[4px] md:rounded-[5px] flex items-center flex-wrap">
              <span className="text-[11px] md:text-[13px] font-[600]">
                Tags:
              </span>
              <span className="ml-2 md:ml-2 text-[12px] md:text-[13px]">
                {forum.tags.map((tag, tagIndex) => (
                  <span key={tagIndex}>
                    {tag}
                    {tagIndex < forum.tags.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <p className="mb-1 md:mb-4 text-[13px] md:text-[16px] font-regular ml-[2px] mt-[10px]">
            {truncateText(forum.content, 30)}
          </p>
          <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote(forum.id, "like");
              }}
              className="flex items-center space-x-2"
            >
              <img
                src={forum.isLiked ? iconLikeColor : iconLike}
                alt="Like"
                className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:scale-110"
              />
              <span>{forum.likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote(forum.id, "dislike");
              }}
              className="flex items-center space-x-2"
            >
              <img
                src={forum.isDisliked ? iconDislikeColor : iconDislike}
                alt="Dislike"
                className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:scale-110"
              />
              <span>{forum.dislikes}</span>
            </button>
          </div>
          {forum?.status === "closed" && (
            <div className="md:hidden bg-[#fdb0a4] flex justify-center rounded-[6px] md:rounded-md  py-1 text-[11px] md:text-sm font-bold w-[110px] md:w-auto">
              FORUM CLOSED
            </div>
          )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumFunctions;

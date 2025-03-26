import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import ForumFunctions from "../ForumFunctions";

import badgeIcon from "../images/badge icon.png";

const OtherProfile = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Created Forums");
  const [forums, setForums] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        setUser(response.data.user);
        setForums(response.data.forums);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("User not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [username]);
  

  const handleForumClick = (forumId) => navigate(`/forum/${forumId}`);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const handleVote = (forumId, type) => {
    setForums((prevForums) =>
      prevForums.map((forum) => {
        if (forum.id === forumId) {
          if (type === "like") {
            return forum.userLiked
              ? { ...forum, likes: forum.likes - 1, userLiked: false }
              : { ...forum, likes: forum.likes + 1, userLiked: true, userDisliked: false };
          } else if (type === "dislike") {
            return forum.userDisliked
              ? { ...forum, dislikes: forum.dislikes - 1, userDisliked: false }
              : { ...forum, dislikes: forum.dislikes + 1, userDisliked: true, userLiked: false };
          }
        }
        return forum;
      })
    );
  };

  const handleFavoriteClick = (forumId) => {
    setForums((prevForums) =>
      prevForums.map((forum) =>
        forum.id === forumId
          ? { ...forum, isFavorited: !forum.isFavorited }
          : forum
      )
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex min-h-screen text-[#141E46]">
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      <main
        className="flex-1 p-6 bg-white"
        style={{
          marginLeft: menuCollapsed ? "100px" : "336px",
          marginRight: "22rem",
          marginTop: "116px",
        }}
      >
        {/* Main Panel */}
        <div 
          className="mx-auto h-full border-black border-t border-l border-r rounded-t-[15px] bg-white p-4"
          style={{ width: "849px" }}
        >

          {/* Header */}
          <div className="relative h-28 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-xl w-[684px] h-[146px] mx-auto">
            {/* Profile Picture */}
            <div className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 w-[140px] h-[140px] rounded-full border-4 border-white bg-orange-400 overflow-hidden">
              <img
                src={user.profilePic} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="w-[684px] mx-auto mt-20 text-center">
            <div className="flex justify-between items-center">
              
              {/* Left Side */}
              <div className="text-left">
                <h2 className="text-[30px] font-bold flex items-center">
                  {user.name}
                  <img src={badgeIcon} alt="Badge" className="w-6 h-6 ml-2" />
                </h2>
                <p className="text-[16px] font-regular">{user.username}</p>
                <p className="text-[16px] font-regular">{user.univ}</p>
              </div>

              {/* Right Side */}
              <div>
                <div className="w-[105px] h-[41px] rounded-[10px] border border-orange-400 flex items-center justify-center p-2">
                  <span className="text-[16px] font-medium">{user.points} points</span>
                </div>
              </div>
            </div>
          </div>
          
        {/* Tabs Container */}
          <div className="w-[684px] mx-auto">
            <div className="flex justify-between w-full mt-6 border-b-[2px] border-[#141E46]">
              <span className="text-[16px] font-regular text-[#141E46]">
                Created Forums
              </span>
            </div>

          {/* Tab Content */}
          <div className="w-full mt-6 transform transition-all duration-500 ease-out opacity-0 translate-y-[-20px] animate-slide-fade">
            {forums.filter((forum) => forum.author === username).length === 0 ? (
              <p className=" text-center text-gray-400  text-[14px]">
                No forums available.
              </p>
            ) : (
              <ForumFunctions
                forums={forums.filter((forum) => forum.author === username)}
                handleForumClick={handleForumClick}
                handleFavoriteClick={handleFavoriteClick}
                handleVote={handleVote}
                compact={true}
              />
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default OtherProfile;
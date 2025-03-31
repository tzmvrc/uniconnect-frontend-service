/** @format */

import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import axios from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import { getInitials } from "../Utils/Helper";
import exit from "../images/exit.png";

const CreateForumModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [forumTitle, setForumTitle] = useState("");
  const [forumDescription, setForumDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");

  const [topics, setTopics] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const username = userInfo ? `@${userInfo.Username}` : "";
  const fullName = userInfo ? `${userInfo.FirstName} ${userInfo.LastName}` : "";

  const [loading, setLoading] = useState(false);
  const [loadingmessage, setLoadingMessage] = useState("");
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

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/topic/all");
        if (response.data.successful) {
          setTopics(response.data.topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/users/get-user-info");
      setUserInfo(response.data.user || {});
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo({});
    }
  };

  const handleSelect = (topic) => {
    setSelectedTopic(topic);
    setSearchTerm(topic);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!forumTitle || !forumDescription || !tags || !selectedTopic) {
      showToastMessage("error", "All fields are required.");
      return;
    }

    try {
      const response = await axios.post("/forum/create", {
        title: forumTitle,
        description: forumDescription,
        tags: tags.split(",").map((tag) => tag.trim()),
        public: visibility === "public",
        topicName: selectedTopic,
      });

      if (response.status === 201) {
        setLoadingMessage("Creating forum");
        setLoading(true);

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (error) {
      console.error("Error creating forum:", error);
      showToastMessage(
        "error",
        error.response?.data?.message || "Failed to create forum"
      );
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-[5px] bg-black/50">
      {loading && <Loading message={loadingmessage} />}

      <main>
        <div className="flex justify-center items-start">
          <Toast
            isShown={showToast.isShown}
            type={showToast.type}
            message={showToast.message}
            onClose={handleCloseToast}
          />
          <div className="flex flex-col w-full max-w-[330px] md:max-w-[600px] mx-auto">
            <div className="w-full bg-[#FFCDA9] rounded-[10px] border-black border">
              <div className="flex mb-[10px] px-[17px] pt-[15px]">
                <h2 className="text-[17px] md:text-xl font-bold w-full">
                  Create your Forum
                </h2>
                <img
                  src={exit}
                  alt="exit icon"
                  className="h-auto w-[25px] md:w-[30px] cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="w-full border border-gray-600 mb-[15px]"></div>

              <div className="flex justify-between items-center mb-4 px-[10px]">
                <div className="flex items-center px-4">
                  <div className="w-[38px] h-[38px] md:w-11 md:h-11 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black">
                    {userInfo?.profile_picture ? (
                      // Show Profile Picture if available
                      <img
                        src={userInfo.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      // Show Initials if no Profile Picture
                      getInitials(fullName)
                    )}
                  </div>
                  <span className="text-[14px] md:text-[16px] font-medium">
                    {username}
                  </span>
                </div>

                <div className="flex bg-[#FFEBDD] rounded-[5px] border border-black py-1 px-2 md:px-6 mr-[10px] md:mr-[13px]">
                  <label className="flex items-center text-[14px] md:text-[16px]">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === "public"}
                      onChange={(e) => setVisibility(e.target.value)}
                    />{" "}
                    Public
                  </label>
                  <label className="flex items-center ml-4 text-[14px] md:text-[16px]">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === "private"}
                      onChange={(e) => setVisibility(e.target.value)}
                    />{" "}
                    Private
                  </label>
                </div>
              </div>

              <div className=" w-full relative mb-[10px] px-[20px]">
                <input
                  type="text"
                  placeholder="Enter your Topics"
                  value={searchTerm}
                  onKeyDown={(e) => e.key === "Enter" && handleFormSubmit(e)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  className="w-full p-[5px] text-[14px] md:text-[17px] bg-[#FFEBDD] border border-black rounded-[5px] placeholder:text-[14px] md:placeholder:text-[15px] placeholder-gray-600"
                />
                {isOpen && searchTerm && (
                  <ul className="absolute top-[100%] left-5 w-[88%] md:w-[95%] text-[14px] md:text-[15px] mt-2 max-h-60 overflow-y-hidden bg-[#FFEBDD] border border-black rounded-[10px] z-10 shadow-lg">
                    {topics.filter((topic) =>
                      topic.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ).length > 0 ? (
                      topics
                        .filter((topic) =>
                          topic.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((topic) => (
                          <li
                            key={topic._id}
                            className="p-2 cursor-pointer hover:bg-[#fbcaa4]"
                            onClick={() => handleSelect(topic.name)}
                          >
                            {topic.name}
                          </li>
                        ))
                    ) : (
                      <li className="p-2 text-center">No results found</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="w-full mb-[10px] px-[20px]">
                <input
                  type="text"
                  placeholder="Forum Title"
                  className="w-full p-[5px] text-[14px] md:text-[16px] bg-[#FFEBDD] border border-black rounded-[5px] placeholder:text-[14px] md:placeholder:text-[15px] placeholder-gray-600"
                  value={forumTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleFormSubmit(e)}
                  onChange={(e) => setForumTitle(e.target.value)}
                />
                <textarea
                  placeholder="Forum Description"
                  className="w-full h-[100px]  md:h-36 mt-3 p-[10px] bg-[#FFEBDD] text-[14px] md:text-[15px] border border-black rounded-[5px] mb-[5px] placeholder:text-[14px] md:placeholder:text-[15px] placeholder-gray-600"
                  value={forumDescription}
                  onChange={(e) => setForumDescription(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  className="w-full p-[5px] text-[14px] md:text-[15px] bg-[#FFEBDD] border border-black rounded-[5px] placeholder:text-[14px] md:placeholder:text-[15px] placeholder-gray-600"
                  value={tags}
                  onKeyDown={(e) => e.key === "Enter" && handleFormSubmit(e)}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="text-right mt-[15px] px-[20px] mb-[15px]">
                <button
                  onClick={handleFormSubmit}
                  className="text-white w-full font-bold bg-[#231c4b] py-1 md:py-2 rounded-[5px] hover:bg-[#2b2670]"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateForumModal;

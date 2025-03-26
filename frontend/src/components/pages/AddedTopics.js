import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Utils/axiosInstance";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";

const AddedTopics = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [addedTopics, setAddedTopics] = useState([]);
  const navigate = useNavigate();

  const fetchAddedTopics = async () => {
    try {
      const response = await axios.get("/topics/added");
      if (response.data.successful) {
        setAddedTopics(response.data.topics);
      }
    } catch (error) {
      console.error("Error fetching added topics:", error);
    }
  };

  useEffect(() => {
    fetchAddedTopics();

    // Listen for topicAdded event
    const handleTopicAdded = () => fetchAddedTopics();

    window.addEventListener("topicAdded", handleTopicAdded);
    return () => window.removeEventListener("topicAdded", handleTopicAdded);
  }, []);
  
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);
  const handleBackClick = () => navigate(-1);
  const handleClick = (topicName) => navigate(`/topics/${topicName}`);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen">
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />

      <main
        className="flex justify-center mb-[50px] w-[58%] transition-all duration-300"
        style={{ marginLeft: menuCollapsed ? "240px" : "310px" }}
      >
        <div
          className="fixed flex justify-start items-center z-10 transition-all duration-300"
          style={{
            top: "calc(116px + 2rem)",
            left: menuCollapsed ? "calc(230px + 2rem)" : "calc(300px + 2rem)",
          }}
        >
          <button onClick={handleBackClick} className="mr-4 ml-5 mt-10">
            <img
              src={require("../images/back Icon.png")}
              alt="Back"
              className="w-5 h-5"
            />
          </button>
        </div>

        <div className="w-[1050px] h-auto mt-32 ml-20 bg-white rounded-xl shadow-md overflow-hidden border border-black p-6">
          <h1 className="text-3xl font-bold text-[#141E46]">Your Topics</h1>
          <p className="text-lg text-[#141E46] mt-2">
            Explore the discussions that matter to you. View your selected
            topics or add more to personalize your feed. <br /> Click on any
            topic to filter the forum and dive deeper into what interests you
            most.
          </p>
          <hr className="my-4 border-t border-[#EB6E5B]" />

          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-[#141E46] font-semibold text-lg pb-2">
                  Topics
                </th>
              </tr>
            </thead>
            <tbody>
              {addedTopics.length > 0 ? (
                addedTopics.map((topic, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td
                      className="py-2 text-[#141E46] text-lg hover:underline cursor-pointer"
                      onClick={() => handleClick(topic.name)}
                    >
                      {topic.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center py-4 text-lg text-gray-500"
                  >
                    No topics added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AddedTopics;

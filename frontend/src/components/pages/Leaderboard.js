/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import badgeIcon from "../images/badge icon.png";
import profilePic1 from "../images/icon-user1.png";
import profilePic2 from "../images/icon-user2.png";
import back from "../images/Back.png";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import axiosInstance from "../Utils/axiosInstance";
import { getInitials } from "../Utils/Helper";

const Leaderboard = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const navigate = useNavigate();
  const [isDashboardActive] = useState(true);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const [activeTab, setActiveTab] = useState("users");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getUsersLeaderboard = async () => {
      try {
        const response = await axiosInstance.get("/leaderboard/users");
        setLeaderboard(response.data.leaderboard || []);
      } catch (error) {
        console.error("Error fetching users leaderboard:", error);
      }
    };

    getUsersLeaderboard();
  }, []);

  const schoolsData = [
    {
      name: "University of Santo Tomas",
      points: 5901,
      profilePic: require("../images/icon-univ-ust.png"),
    },
    {
      name: "De La Salle University",
      points: 5841,
      profilePic: require("../images/icon-univ-dlsu.png"),
    },
    {
      name: "University of the East",
      points: 5688,
      profilePic: require("../images/icon-univ-ue.png"),
    },
    {
      name: "University of the Philippines",
      points: 5556,
      profilePic: require("../images/icon-univ-up.png"),
    },
    {
      name: "Centro Escolar University",
      points: 5498,
      profilePic: require("../images/icon-univ-ceu.png"),
    },
    {
      name: "Mapua University",
      points: 5422,
      profilePic: require("../images/icon-mapua.png"),
    },
    {
      name: "Polytechnic University of the Philippines",
      points: 5323,
      profilePic: require("../images/icon-pup.png"),
    },
    {
      name: "Colegio de San Juan de Letran",
      points: 5008,
      profilePic: require("../images/icon-letran.png"),
    },
    {
      name: "Ateneo De Manila University",
      points: 4764,
      profilePic: require("../images/icon-ateneo.png"),
    },
    {
      name: "Adamson University",
      points: 4123,
      profilePic: require("../images/icon-adu.png"),
    },
  ];

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="flex w-full h-full"
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />

      <main
        className={`w-full h-full flex justify-center mt-20 md:mt-28 transition-all duration-300 p-3 md:p-0
    ${menuCollapsed ? "md:mr-[140px]" : "md:ml-[40px]"}
  `}
      >
        <div className="flex flex-col items-center w-full h-full md:w-[700px] bg-white rounded-xl shadow-md border border-black p-6">
          <h1 className="text-[33px] md:text-4xl flex justify-center font-bold text-[#141E46] mb-[10px] md:mb-[20px]">
            Leaderboards
          </h1>
          {/* Tab Buttons */}
          <div className="flex justify-center border-2 border-black rounded-lg w-full h-full md:w-[450px]">
            <button
              className={`w-full rounded-lg font-semibold text-lg ${
                activeTab === "users"
                  ? "bg-[#fbcaa4] shadow-md"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`w-full rounded-lg font-semibold text-lg ${
                activeTab === "schools"
                  ? "bg-[#fbcaa4] shadow-md"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("schools")}
            >
              Schools
            </button>
          </div>

          {activeTab === "users" ? (
            <div className="flex justify-center w-full h-full bg-white rounded-lg p-2 md:p-4">
              <div className="w-full md:max-w-lg">
                <p className="text-[#141E46] mb-4 text-center text-[14px] md:text-[15px] md:px-[16%]">
                  Check out the top users from across the platform and see how
                  you rank among everyone.
                </p>
                <div className="flex justify-between items-center px-[12px] mt-[20px] mb-[10px]">
                  <h2 className="text-[18px] font-bold text-[#141E46]">
                    Users
                  </h2>
                  <h2 className="text-[18px] font-bold text-[#141E46]">
                    Points
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {leaderboard.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center py-3 px-2 md:px-4"
                    >
                      {/* Clickable Profile Picture */}
                      <Link
                        to={`/otherprofile/${user.username}`}
                        className="w-10 h-10 rounded-full block"
                      >
                        <div className="w-[43px] h-[43px] md:w-full md:h-full flex items-center border border-black justify-center rounded-full text-slate-950 bg-slate-200 text-[16px]">
                          {getInitials(`${user.first_name} ${user.last_name}`)}
                        </div>
                      </Link>

                      {/* Clickable Name & Username */}
                      <div className="flex-1 text-[#141E46]">
                        <Link
                          to={`/otherprofile/${user.username}`}
                          className="font-semibold ml-[15px]"
                        >
                          {user.first_name} {user.last_name}
                        </Link>
                        <img
                          src={badgeIcon}
                          alt="Badge Icon"
                          className="inline-block w-5 h-5 ml-2"
                        />
                        <p className="text-sm ml-[15px] text-[#141E46]">
                          <Link to={`/otherprofile/${user.username}`}>
                            @{user.username}
                          </Link>
                        </p>
                      </div>

                      {/* Points Section */}
                      <div className="text-right bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-sm text-[#141E46] font-semibold w-[45px]">
                        {user.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full min-h-screen bg-white rounded-lg shadow-md p-4">
              <div className="w-full max-w-lg">
                <p className="text-[#141E46] mb-4 text-center text-[14px] md:text-[15px] md:px-[16%]">
                  Track your university's position and see how it competes with
                  others.
                </p>
                <div className="flex justify-between items-center px-[12px] mt-[20px] mb-[10px]">
                  <h2 className="text-[18px] font-bold text-[#141E46]">
                    School
                  </h2>
                  <h2 className="text-[18px] font-bold text-[#141E46]">
                    Points
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {schoolsData.map((school, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 px-4"
                    >
                      <img
                        src={school.profilePic}
                        alt={school.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{school.name}</span>
                      <div className="text-left bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-sm text-[#141E46] font-semibold w-auto">
                        {school.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;

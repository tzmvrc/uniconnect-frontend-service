/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import badgeIcon from "../images/badge icon.png";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import axiosInstance from "../Utils/axiosInstance";
import { getInitials } from "../Utils/Helper";
import LeaderboardsRules from "./LeaderboardRules";

import up_logo from "../images/icon-univ-up.png";
import ceu_logo from "../images/icon-univ-ceu.png";
import dlsu_logo from "../images/icon-univ-dlsu.png";
import ue_logo from "../images/icon-univ-ue.png";
import ust_logo from "../images/icon-univ-ust.png";
import pup_logo from "../images/icon-pup.png";
import mapua_logo from "../images/icon-mapua.png";
import letran_logo from "../images/icon-letran.png";
import ateneo_logo from "../images/icon-ateneo.png";
import adu_logo from "../images/icon-adu.png";
import feu_logo from "../images/icon-univ-feu.png";

import nu_logo from "../images/icon-univ-nu.png";
import sbu_logo from "../images/icon-univ-sbu.png";
import umak_logo from "../images/icon-univ-umak.png";
import um_logo from "../images/icon-univ-um.png";
import rtu_logo from "../images/icon-univ-rtu.png";

const Leaderboard = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const navigate = useNavigate();
  const [isDashboardActive] = useState(true);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const [activeTab, setActiveTab] = useState("users");
  const [leaderboard, setLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);

  const getSchoolLogo = (schoolName) => {
    const schoolLogos = {
      "University of the Philippines": up_logo,
      "Centro Escolar University": ceu_logo,
      "De La Salle University": dlsu_logo,
      "University of the East": ue_logo,
      "University of Santo Tomas": ust_logo,
      "Polytechnic University of the Philippines": pup_logo,
      "Mapua University": mapua_logo,
      "Letran University": letran_logo,
      "Ateneo de Manila University": ateneo_logo,
      "Adamson University": adu_logo,
      "Far Eastern University": feu_logo,
      "National University": nu_logo,
      "San Beda University": sbu_logo,
      "University of Makati": umak_logo,
      "University of Manila": um_logo,
      "Rizal Technological University": rtu_logo,
    };

    return schoolLogos[schoolName];
  };

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

  useEffect(() => {
    const getSchoolLeaderboard = async () => {
      try {
        const response = await axiosInstance.get("/leaderboard/schools");
        setSchoolLeaderboard(response.data.leaderboard || []);
      } catch (error) {
        console.error("Error fetching users leaderboard:", error);
      }
    };

    getSchoolLeaderboard();
  }, []);

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="flex w-full h-full"
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <LeaderboardsRules />

      <main
        className={`w-full h-full flex justify-center lg:justify-center md:justify-end mt-20 md:mt-28 transition-all duration-300 p-3 md:p-0
    ${
      menuCollapsed ? "md:mr-[50px] lg:mr-[140px]" : "md:ml-[200px] lg:ml-[40px]"
    }
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
                        to={`/${user.username}`}
                        className="w-10 h-10 rounded-full block"
                      >
                        <div className="w-[43px] h-[43px] md:w-full md:h-full flex items-center border border-black justify-center rounded-full text-slate-950 bg-slate-200 text-[16px]">
                          {user?.profilePicture ? (
                            // Show Profile Picture if available
                            <img
                              src={user.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            // Show Initials if no Profile Picture
                            getInitials(`${user.first_name} ${user.last_name}`)
                          )}
                        </div>
                      </Link>

                      {/* Clickable Name & Username */}
                      <div className="flex-1 text-[#141E46]">
                        <Link
                          to={`/${user.username}`}
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
                          <Link to={`/${user.username}`}>@{user.username}</Link>
                        </p>
                      </div>

                      {/* Points Section */}
                      <div className="text-center bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-sm text-[#141E46] font-semibold w-[55px]">
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
                  {schoolLeaderboard
                    .sort((a, b) => b.points - a.points) // Sort by points (highest first)
                    .slice(0, 10)
                    .map((school) => (
                      <div
                        key={school.school_name}
                        className="flex justify-between items-center py-3 px-4"
                      >
                        <div className="w-12 h-12 rounded-full  border-black border-[1px] flex items-center justify-center text-[16px] text-slate-950 bg-slate-200">
                          <img
                            src={getSchoolLogo(school.school_name)}
                            alt={`${school.school_name} Logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[14px] text-left md:text-center pl-[15px] md:pl-[0px] mr-[35px] md:mr-[0px] md:text-base text-[#141E46] font-semibold">
                          {school.school_name}
                        </span>
                        <div className="text-center bg-white py-1 border-[1px] border-black rounded-md shadow-sm text-sm text-[#141E46] font-semibold w-[50px] md:w-[60px]">
                          {school.total_points}
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

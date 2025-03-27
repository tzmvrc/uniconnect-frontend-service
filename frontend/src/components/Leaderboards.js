/** @format */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import iconRank from "./images/icon-rank.png";
import badgeIcon from "./images/badge icon.png";
import axiosInstance from "./Utils/axiosInstance";
import { getInitials } from "./Utils/Helper";

const Leaderboards = () => {
  const navigate = useNavigate();
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

  return (
    <aside className="w-[290px] fixed top-[85px] right-0 h-[calc(100vh-96px)] bg-white p-2 hidden md:block z-10">
      <div className="p-4 rounded-2xl border-[1px] border-black bg-[#FFCDA9] h-full">
        <h3 className="text-[30px] font-semibold mb-2 text-[#141E46]">
          Leaderboards
        </h3>

        {/* Top Users Section */}
        <h4 className="font-medium mb-2 text-[17px] text-[#141E46]">
          Top Users
        </h4>
        <ul className="space-y-4">
          {leaderboard.length > 0 ? (
            leaderboard
              .sort((a, b) => b.points - a.points) // Sort by points (highest first)
              .slice(0, 3) // Get top 3 users
              .map((user) => (
                <li
                  key={user._id}
                  className="text-[#141E46] flex items-center space-x-3"
                >
                  {/* Clickable Profile Picture */}
                  <Link
                    to={`/${user.username}`}
                    className="w-10 h-10 rounded-full block bg-white border-black border-[1px]"
                  >
                    <div className="w-[95px] h-[95px] md:w-full md:h-full flex items-center justify-center rounded-full text-slate-950 bg-slate-200 text-[16px]">
                      {getInitials(`${user.first_name} ${user.last_name}`)}
                    </div>
                  </Link>

                  {/* Clickable Name & Username */}
                  <div className="flex-1">
                    <Link
                      to={`/${user.username}`}
                      className="font-semibold text-[14px]"
                    >
                      {user.first_name} {user.last_name}
                    </Link>
                    <img
                      src={badgeIcon}
                      alt="Badge Icon"
                      className="inline-block w-3 h-3 ml-1"
                    />
                    <p className="text-[12px] text-gray-500">
                      <Link to={`/${user.username}`}>@{user.username}</Link>
                    </p>
                  </div>

                  {/* User Points */}
                  <div className="text-right bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-[13px] text-[#141E46] font-semibold w-[40px]">
                    {user.points}
                  </div>
                </li>
              ))
          ) : (
            <p className="text-gray-500 text-[12px]">
              No users with a badge found.
            </p>
          )}
        </ul>

        {/* See All Leaderboards Button */}
        <div className="mt-7">
          <button
            onClick={() => navigate("/leaderboard")}
            className="w-full px-4 py-1 bg-[#1D274D] rounded-[10px] text-white text-[13px] hover:bg-[#1D254A] focus:outline-none flex items-center justify-center"
            aria-label="View all leaderboards"
          >
            <img src={iconRank} alt="Rank Icon" className="w-3 h-3 mr-2" />
            See All Leaderboards
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Leaderboards;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import iconRank from "./images/icon-rank.png";
import badgeIcon from "./images/badge icon.png";
import profilePic1 from "./images/icon-user1.png";
import profilePic2 from "./images/icon-user2.png";
import iconUST from "./images/icon-univ-ust.png";
import iconDLSU from "./images/icon-univ-dlsu.png";
import iconUE from "./images/icon-univ-ue.png";
import iconUP from "./images/icon-univ-up.png";
import iconCEU from "./images/icon-univ-ceu.png";

const Leaderboards = () => {
  const navigate = useNavigate();

  const users = [
    {
      name: "Jane Doe",
      username: "@Janeey",
      points: 452,
      profilePic: profilePic2,
    },
    {
      name: "Phineas Pablo",
      username: "@PhinPab",
      points: 451,
      profilePic: profilePic1,
    },
    {
      name: "Juice Leyon",
      username: "@JuicyLey",
      points: 425,
      profilePic: profilePic1,
    },
  ];

  const schools = [
    { name: "University of Santo Tomas", profilePic: iconUST },
    { name: "De La Salle University", profilePic: iconDLSU },
    { name: "University of the Philippines", profilePic: iconUP },
    { name: "Centro Escolar University", profilePic: iconCEU },
  ];

  return (
    <aside className="w-[270px] fixed top-[85px] right-0 h-[calc(100vh-96px)] bg-white p-2 hidden md:block z-10">
      {/* Cornered shape container */}
      <div className="p-4 rounded-2xl border-[1px] border-black bg-[#FFCDA9] h-full">
        <h3 className="text-[30px] font-semibold mb-4 text-[#141E46]">
          Leaderboards
        </h3>

        {/* Top Users Section */}
        <h4 className="font-medium mb-2 text-[15px] text-[#141E46]">
          Top Users
        </h4>
        <ul className="space-y-2">
          {users.map((user, idx) => (
            <li
              key={idx}
              className="text-[#141E46] flex items-center space-x-3"
            >
              {/* Clickable Profile Picture */}
              <Link
                to={`/${user.username}`}
                className="w-10 h-10 rounded-full block bg-white border-black border-[1px]"
              >
                <img
                  src={user.profilePic}
                  alt="User Profile"
                  className="w-full h-full rounded-full"
                />
              </Link>

              {/* Clickable Name & Username */}
              <div className="flex-1">
                <Link to={`/${user.username}`} className="font-semibold text-[14px]">
                  {user.name}
                </Link>
                <img
                  src={badgeIcon}
                  alt="Badge Icon"
                  className="inline-block w-3 h-3 ml-1"
                />
                <p className="text-[12px] text-gray-500">
                  <Link to={`/${user.username}`}>{user.username}</Link>
                </p>
              </div>

              {/* User Points */}
              <div className="text-right bg-white px-2 py-1 border-[1px] border-black rounded-md shadow-sm text-[13px] text-[#141E46] font-semibold w-[40px]">
                {user.points}
              </div>
            </li>
          ))}
        </ul>

        {/* Top Schools Section */}
        <h4 className="font-medium text-[15px] mt-10 mb-2 text-[#141E46]">
          Top Schools
        </h4>
        <ul className="space-y-2">
          {schools.map((school) => (
            <li
              key={school.name}
              className="text-[#141E46] text-[13px] font-semibold flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full">
                <img
                  src={school.profilePic}
                  alt={`${school.name} Logo`}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <span>{school.name}</span>
            </li>
          ))}
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

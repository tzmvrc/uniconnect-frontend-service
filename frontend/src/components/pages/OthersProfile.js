import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profilePic from "../images/profile pic.png";
import badgeIcon from "../images/badge icon.png";
import profilePic1 from "../images/icon-user1.png";
import profilePic2 from "../images/icon-user2.png";
import bgImage from "../images/bg.png";
import logo from "../images/NLogo.png";
import back from "../images/back Icon.png";
import like from "../images/icon-like.png";
import dislike from "../images/icon-dislike.png";
import Header from '../Header';
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";

const Othersprofile= () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const [isDashboardActive] = useState(true);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const users = [
    { name: "Jane Doe", username: "@Janeey", points:452, profilePic: profilePic2 },
    { name: "Phineas Pablo", username: "@PhinPab", points:451, profilePic: profilePic1 },
    { name: "Juice Leyon", username: "@JuicyLey", points:425, profilePic: profilePic1 },
    { name: "Harry Vilenico", username: "@HarVil", points:355, profilePic: profilePic1 }
  ];

  const schools = [
    { name: "University of Santo Tomas", profilePic: require('../images/icon-univ-ust.png') },
    { name: "De La Salle University", profilePic: require('../images/icon-univ-dlsu.png') },
    { name: "University of the East", profilePic: require('../images/icon-univ-ue.png') },
    { name: "University of the Philippines", profilePic: require('../images/icon-univ-up.png') },
    { name: "Centro Escolar University", profilePic: require('../images/icon-univ-ceu.png') }
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen">

    <Header bgImage={bgImage} logo={logo} />
      <Sidebar
        menuCollapsed={menuCollapsed}
        toggleMenu={toggleMenu}
        profilePic={profilePic2}
        badgeIcon={badgeIcon}
        isDashboardActive={isDashboardActive}
      />
       <Leaderboards
        users={users}
        schools={schools}
      />

      <main className="flex-grow ml-[370px] mr-[300px] mt-16 p-4">
         {/* Back Button */}
         <button 
          onClick={handleBackClick} 
          className="">
          <img 
              src={back} 
              alt="Back" 
              className= "w-5 h-5" 
            />
        </button>
        <div className="w-[950px] ml-16 mt-14 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
    {/* Profile Header */}
    <div className="relative">
        <div className="h-28 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-xl"></div>
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
        <img
            src={profilePic2}
            alt="Profile"
            className="w-full h-full object-cover"
        />
        </div>
    </div>
    <div className="text-left mt-16">
    <div className="text-right mr-8">
        <span className="text-blue-950 font-medium bg-white border border-black px-3 py-1 rounded-md text-md">452 points</span>
    </div>
    <h2 className="text-xl font-bold text-[#141E46]"> Jane Doe <img src={badgeIcon} alt="Icon" className="inline w-5 h-5 ml-1"/> </h2>
        <p className="text-[#141E46]">@Janeey</p>
        <p className="text-md text-[#141E46]">Colegio de San Juan de Letran</p>
    </div>

  {/* Tabs */}
  <div className="flex justify-around mt-6 border-b border-gray-300 pb-2">
    <button className="text-[#141E46] font-semibold text-md border-b-2 border-orange-600">Created forums</button>
    <button className="text-[#141E46] text-md">Saved forums</button>
    <button className="text-[#141E46] text-md">Response History</button>
  </div>

  {/* Forum Card */}
  <div className="mt-4 border border-gray-200 rounded-lg p-4">
    <div className="text-smtext-[#141E46] mb-1">Topic: Networking 1</div>
    <h3 className="text-lg text-[#141E46] font-semibold mb-1">How to configure a switch?</h3>
    <p className="text-xs text-[#141E46] mb-1">Posted on 10/28/2024<br />By: @imjuan</p>
    <span className="inline-block bg-[#FFCDA9] text-[#141E46] text-xs px-2 py-1 rounded-lg mb-2">Tags: Networking</span>
    <p className="text-sm text-[#141E46] mb-2">How to configure switch in Packet Tracer? I just downloaded it and I don’t know where to start.</p>

    {/* Forum Card Footer */}
    <div className="flex justify-between items-center text-gray-500 text-sm mt-2">
            <div className="flex gap-2.5 mb-3.5">
                    <button className="border-0 bg-transparent cursor-pointer text-sm text-[#141E46] flex items-center gap-1">
                        <img 
                        src={like} 
                        alt="Like" 
                        className="w-5 h-5"
                        /> 
                        30
                    </button>
                    <button className="border-0 bg-transparent cursor-pointer text-sm text-[#141E46] flex items-center gap-1">
                        <img 
                        src={dislike} 
                        alt="Dislike" 
                        className="w-5 h-5"
                        /> 
                        3
                    </button>
                    </div>
            <button className="bg-gray-800 text-white px-4 py-1 rounded-lg text-sm">View</button>
            </div>
        </div>
        </div>
        </main>
    </div>
  );
};

export default Othersprofile;

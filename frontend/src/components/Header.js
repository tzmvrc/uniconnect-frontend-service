/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./images/bg.png";
import logo from "./images/NLogo.png";
import iconLogo from "./images/Flogo.png";
import iconSearch from "./images/icon-search.png";
import SortButton from "./pages/SortButton";
import helpIcon from "./images/help-icon.png";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = ({
  searchQuery,
  handleSearchChange,
  handleKeyPress,
  handleSort,
  handleForumClick,
}) => {
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  const toggleMenu = () => {
    setMenuCollapsed((prev) => !prev);
  };

  const handleSearchKeyPress = (event) => {
    if (handleKeyPress) handleKeyPress(event);
    if (event.key === "Enter") {
      navigate(`/dashboard?search=${searchQuery}`);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 w-full h-[75px] flex items-center px-4 z-50 md:z-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          className="block md:hidden cursor-pointer z-[999] py-2 pl-2"
          onClick={toggleMenu}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-[0] md:w-[270px] ml-[20px] h-auto cursor-pointer"
          onClick={() => handleForumClick && handleForumClick()}
        />
        <img
          src={iconLogo}
          alt="Logo"
          className="w-[37px] md:w-[0] ml-[6px] h-auto cursor-pointer"
          onClick={() => handleForumClick && handleForumClick()}
        />

        {/* Search and Sort */}
        <div className="absolute left-0 right-0 flex justify-end md:justify-center items-center space-x-4 mr-[10px] md:mr-[0]">
          <div className="relative w-[170px] md:w-[450px]">
            <input
              type="text"
              placeholder="Search forums"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyPress}
              className="w-full p-2 rounded-md text-[#141E46] text-sm pr-10"
            />
            <img
              src={iconSearch}
              alt="Search Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
            />
          </div>
          <SortButton handleSort={handleSort} />
        </div>

        {/* Help Button (Desktop only) */}
        <div className="hidden md:flex justify-end items-center w-full">
          <button onClick={() => navigate("/Faqs")} className="mr-4">
            <img src={helpIcon} alt="Help" className="w-[45px]" />
          </button>
        </div>
      </header>

      {/* Sidebar - Mobile Only */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 ease-in-out bg-white md:hidden ${
          menuCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      </div>

      {/* Overlay when menu is open */}
      {!menuCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Header;

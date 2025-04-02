/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "./images/bg.png";
import logo from "./images/NLogo.png";
import iconLogo from "./images/Flogo.png";
import iconSearch from "./images/icon-search.png";
import SortButton from "./pages/SortButton";
import { Menu, ChevronLeft, MessageCircleQuestion } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = ({
  searchQuery,
  handleSearchChange,
  handleKeyPress,
  handleSort,
  handleForumClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuCollapsed((prev) => !prev);
    setSearchExpanded(false);
  };

  const toggleSearch = () => {
    setSearchExpanded((prev) => !prev);
    setMenuCollapsed(true);
  };

  const handleSearchKeyPress = (event) => {
    if (handleKeyPress) handleKeyPress(event);
    if (event.key === "Enter") {
      navigate(`/dashboard?search=${searchQuery}`);
    }
  };

  const isSettingsPage = location.pathname.includes("/settings");

  return (
    <>
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 w-full h-[75px] flex items-center px-4 z-50"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Burger menu button */}
        {!searchExpanded && isMobile && (
          <button
            className="cursor-pointer z-[999] py-2 pl-2"
            onClick={toggleMenu}
          >
            <Menu className="w-6 h-6 text-white transition-transform duration-300 hover:scale-110" />
          </button>
        )}

        {/* Logo - hidden when search is expanded */}
        {!searchExpanded && (
          <>
            <img
              src={logo}
              alt="Logo"
              className="w-[0] md:w-[270px] ml-[20px] h-auto cursor-pointer"
              onClick={handleForumClick}
            />
            <img
              src={iconLogo}
              alt="Logo"
              className="w-[37px] md:w-[0] ml-[6px] h-auto cursor-pointer"
              onClick={handleForumClick}
            />
          </>
        )}

        {/* Search and Sort */}
        <div className="absolute left-0 right-0 flex justify-end md:justify-center items-center space-x-4 mr-[10px] md:mr-[0]">
          {/* Mobile search */}
          <div
            className={`md:hidden ${
              searchExpanded ? "w-full" : "flex items-center space-x-2"
            }`}
          >
            {searchExpanded ? (
              <div className="flex items-center w-full px-4 ml-[-10px]">
                <button onClick={toggleSearch} className="text-white mr-2 p-2">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search forums"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyPress}
                    className="w-full p-2 rounded-md text-[#141E46] text-sm pr-10"
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 p-1 rounded-md">
                    <img
                      src={iconSearch}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="bg-[#FFEBDD] p-[8px] rounded-md cursor-pointer"
                  onClick={toggleSearch}
                >
                  <img src={iconSearch} alt="Search Icon" className="w-5 h-5" />
                </div>
                <SortButton handleSort={handleSort} />
              </>
            )}
          </div>

          {/* Desktop search */}
          <div className="relative w-[170px] md:w-[450px] hidden md:block">
            <input
              type="text"
              placeholder="Search forums"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyPress}
              className="w-full p-2 rounded-md text-[#141E46] text-sm pr-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 p-1 rounded-md">
              <img src={iconSearch} alt="Search Icon" className="w-5 h-5" />
            </div>
          </div>

          <div className="hidden md:block">
            <SortButton handleSort={handleSort} />
          </div>
        </div>

        {/* Help Button (Desktop only) */}
        <div className="hidden md:flex items-center z-20 absolute right-4 top-1/2 transform -translate-y-1/2">
          <button onClick={() => navigate("/Faqs")} className="p-2">
            <MessageCircleQuestion className="w-9 h-9 text-white" />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR WITH SMOOTH TRANSITION */}
      {isMobile && (
        <div
          className={`fixed left-0 h-[calc(100vh-75px)] w-[70vw] bg-[#FFCDA9] border-r border-black z-40 transition-all duration-300 ease-in-out ${
            menuCollapsed ? "-translate-x-full" : "translate-x-0 shadow-xl"
          }`}
        >
          <Sidebar menuCollapsed={false} toggleMenu={toggleMenu} />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && !isSettingsPage && (
        <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      )}

      {/* OVERLAY WITH FADE TRANSITION */}
      {isMobile && !menuCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Header;

/** @format */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iconSort from "../images/icon-sort.png";

const SortButton = ({ handleSort }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentSort, setCurrentSort] = useState("Sort by");

  const handleSortClick = (sortType, sortText) => {
    // Check if we're not on the dashboard
    if (!location.pathname.includes("/dashboard")) {
      navigate("/dashboard");
      // Store the sort preference to apply after navigation
      localStorage.setItem(
        "pendingSort",
        JSON.stringify({ sortType, sortText })
      );
    } else {
      // Apply sort immediately if already on dashboard
      applySort(sortType, sortText);
    }
    setShowSortOptions(false);
  };

  const applySort = (sortType, sortText) => {
    handleSort(sortType);
    setCurrentSort(sortText);
  };

  // Check for pending sort action after component mounts
  React.useEffect(() => {
    const pendingSort = localStorage.getItem("pendingSort");
    if (pendingSort && location.pathname.includes("/dashboard")) {
      const { sortType, sortText } = JSON.parse(pendingSort);
      applySort(sortType, sortText);
      localStorage.removeItem("pendingSort");
    }
  }, [location.pathname]);

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setShowSortOptions((prev) => !prev)}
        className="px-3 py-[9px] bg-[#FFEBDD] text-black rounded-md flex items-center shadow-sm border border-black"
      >
        <img src={iconSort} alt="Sort Icon" className="w-4 h-4 mr-0 md:mr-2" />
        <span className="hidden md:inline">{currentSort}</span>
      </button>

      {/* Dropdown menu shifted left */}
      {showSortOptions && (
        <div className="absolute mt-2 -left-24 lg:-left-0 md:-left-10 w-[140px] bg-white border border-gray-300 rounded-md shadow-lg z-10 text-sm">
          <button
            onClick={() => handleSortClick("recent", "Most Recent")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Most Recent
          </button>
          <button
            onClick={() => handleSortClick("mostLiked", "Most Liked")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Most Liked
          </button>
        </div>
      )}
    </div>
  );
};

export default SortButton;

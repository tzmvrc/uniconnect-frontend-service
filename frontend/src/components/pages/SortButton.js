/** @format */

import React, { useState } from "react";
import iconSort from "../images/icon-sort.png";

const SortButton = ({ handleSort }) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentSort, setCurrentSort] = useState("Sort by");

  const handleSortClick = (sortType, sortText) => {
    handleSort(sortType);
    setCurrentSort(sortText);
    setShowSortOptions(false);
  };

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setShowSortOptions((prev) => !prev)}
        className="px-3 py-2 bg-[#FFEBDD] text-black rounded-md flex items-center shadow-sm border border-black"
      >
        <img src={iconSort} alt="Sort Icon" className="w-4 h-4 mr-0 md:mr-2" />
        <span className="hidden md:inline">{currentSort}</span>
      </button>

      {/* Dropdown menu shifted left */}
      {showSortOptions && (
        <div className="absolute mt-2 -left-24 md:-left-0 w-[140px] bg-white border border-gray-300 rounded-md shadow-lg z-10 text-sm">
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

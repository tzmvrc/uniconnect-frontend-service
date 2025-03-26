/** @format */

import React, { useState, useEffect } from "react";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = (
      <span key="ellipsis" className="px-3">
        ...
      </span>
    );

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="px-3 py-1 rounded-md border bg-white text-black border-gray-300 hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) pageNumbers.push(ellipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1 rounded-md border transition-all duration-200 ${
            currentPage === i
              ? "bg-[#EB6E5B] text-white border-[#aa5649]"
              : "bg-white text-black border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="px-3 py-1 rounded-md border bg-white text-black border-gray-300 hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="w-full flex items-center justify-center space-x-2 mt-10">
      <button
        onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border bg-white text-black border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        onClick={() =>
          currentPage < totalPages && handlePageClick(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border bg-white text-black border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;

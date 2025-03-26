/** @format */

import React from "react";

const confirmation = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FFCDA9] p-4 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-[27px] font-[700] text-[#1D274D] mb-[5px]">
          {title || "Confirmation"}
        </h1>
        <p className="text-sm font-[450] text-[#1D274D]">
          {message || "Are you sure you want to delete this?"}
        </p>
        <div className="flex justify-center mt-5 mb-[5px] space-x-14">
          <button
            className="px-7 py-2 bg-transparent border text-[#1D274D] font-[600] border-[#1D274D] rounded-md hover:bg-[#1D274D] hover:text-white transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-7 py-2 bg-red-500 text-white font-[500] rounded-md hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default confirmation;

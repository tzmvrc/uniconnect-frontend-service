/** @format */

import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const ToastMessage = ({ isShown, message, type = "info", onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isShown, onClose]);

  // Bottom border colors for different toast types
  const bottomBorderColors = {
    success: "border-b-4 border-green-500",
    error: "border-b-4 border-red-500",
    info: "border-b-4 border-blue-500",
  };

  // Icons for different types
  const toastIcons = {
    success: <LuCheck size={20} />,
    error: <MdErrorOutline size={20} />,
    info: <MdInfoOutline size={20} />,
  };

  return (
    <AnimatePresence>
      {isShown && (
        <div className="fixed top-5 left-0 right-0 flex justify-center z-[999]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex items-center px-3 md:px-5 py-2 md:py-3 rounded-lg shadow-lg text-[13px] md:text-[16px] bg-slate-300 text-gray-800 font-semibold ${bottomBorderColors[type]}`}
            style={{ minWidth: "200px", maxWidth: "400px" }}
          >
            {/* Icon */}
            <span className="mr-2">{toastIcons[type]}</span>

            {/* Message */}
            <span className="ml-[5px]">{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;

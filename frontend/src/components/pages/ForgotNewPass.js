/** @format */

import React, { useState } from "react";
import bg from "../images/longbg.png"; // Background image import
import logo from "../images/NLogo.png"; // Import logo image
import pass from "../images/enterpass icon.png";
import showIcon from "../images/ShowPass.png"; // Show password icon
import hideIcon from "../images/BlindPass.png"; // Hide password icon
import { useNavigate, useLocation } from "react-router-dom"; // Import navigate for back button if needed
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";

function ForgotNewPass() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const email = location.state?.email || "No email provided";
  const [loading, setLoading] = useState(false);
  const [loadingmessage, setLoadingMessage] = useState("");
  const [showToast, setShowToast] = useState({
    isShown: false,
    type: "",
    message: "",
  });

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const showToastMessage = (type, message) => {
    setShowToast({ isShown: true, type: type, message: message });
  };

  const handleVerify = async () => {
    if (newPassword === "" || confirmPassword === "") {
      showToastMessage("error", "Please fill out both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToastMessage("error", "The passwords do not match.");
      return;
    }

    // Password validation condition
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      showToastMessage(
        "error",
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }

    setLoadingMessage("Updating your password");
    setLoading(true);

    const updateResult = await updatePassword(confirmPassword);

    if (updateResult?.successful) {
      setTimeout(() => {
        setLoading(false);
        navigate("/login-set-new-password-success");
      }, 2000);
    } else {
      setLoading(false);
      showToastMessage(
        "error",
        updateResult?.message || "Failed to update password."
      );
    }
  };

  const updatePassword = async (password) => {
    try {
      const response = await axiosInstance.put("/users/update-user-pass", {
        email, // Ensure this is passed correctly
        password,
      });

      return response.data; // Return the API response for handling in `handleVerify`
    } catch (err) {
      console.error("Update password error:", err);
      return {
        successful: false,
        message: "An error occurred. Please try again later.",
      };
    }
  };

  return (
    <div
      className="flex items-start md:justify-center md:items-center min-h-screen overflow-y-hidden"
      style={{
        fontFamily: "'Inter', sans-serif", // Set font family to Inter
        backgroundImage: `url(${bg})`, // Background image
        backgroundSize: "cover",
      }}
    >
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />

      {loading && <Loading message={loadingmessage} />}
      <div className="flex flex-col items-center w-full p-4">
        <img
          className="h-auto w-[290px] md:w-[500px] cursor-pointer mb-[50px]"
          src={logo}
          alt="logo"
          onClick={() => navigate("/")}
        />

        <div className="h-auto max-h-[485px] w-full md:max-w-[520px] p-[30px] bg-[#ffc8a0] rounded-[20px] shadow-md flex justify-center">
          <div className="flex flex-col items-center w-[450px]">
            <div className="w-[300px] md:w-[430px]">
              {/* Title */}
              <h2 className="text-[27px] md:text-[30px] text-[#112061] font-bold text-left leading-[28px] md:leading-[50px]">
                Set up your new Password
              </h2>

              {/* Subtitle */}
              <p className="text-[13px] md:text-[14px] text-black mb-[20px] mt-[10px] md:mt-[0px] leading-[20px] text-left font-[480]">
                Please create a new password that's strong and unique to ensure
                your account remains secure. Aim for a mix of letters, numbers,
                and symbols.
              </p>
            </div>

            {/* New password input */}
            <div className="relative flex items-center w-[300px] md:w-[400px]">
              <img
                src={pass}
                alt="pass icon"
                className="absolute left-[7px] w-[23px] h-auto pointer-events-none ml-[13px] mb-[11px]"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                required
                value={newPassword}
                onKeyDown={(e) => e.key === "Enter" && handleVerify(e)}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[50px] pl-[60px] pr-2 mb-[10px] border-none rounded-[10px]"
              />
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-2.5 text-gray-600"
                >
                  <img
                    src={showNewPassword ? hideIcon : showIcon}
                    alt={showNewPassword ? "Hide password" : "Show password"}
                    className="w-[30px] h-auto"
                  />
                </button>
              )}
            </div>

            {/* Confirm password input */}
            <div className="relative flex items-center w-[300px] md:w-[400px]">
              <img
                src={pass}
                alt="pass icon"
                className="absolute left-[7px] w-[23px] h-auto pointer-events-none ml-[13px] mb-[11px]"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onKeyDown={(e) => e.key === "Enter" && handleVerify(e)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[50px] pl-[60px] pr-2 border-none rounded-[10px]"
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute  right-5 top-2.5 text-gray-600"
                >
                  <img
                    src={showConfirmPassword ? hideIcon : showIcon}
                    alt={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="w-[30px] h-auto"
                  />
                </button>
              )}
            </div>

            {/* Verify Button */}
            <div className="w-[250px] md:w-[350px] mt-[15px]">
              <div className="w-full text-center bg-[#eb6e5b] py-2 rounded-[20px] font-semibold cursor-pointer shadow-[0_5px_3px_rgba(0,0,0,0.2)] hover:bg-[#d25441]">
                <button
                  className="w-full h-[20px] text-white"
                  onClick={handleVerify}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotNewPass;

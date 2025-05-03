/** @format */

import bg from "../images/longbg.png";
import logo from "../images/NLogo.png";
import image from "../images/image2.png";
import emailIcon from "../images/entermail icon.png";
import back from "../images/back Icon.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import axiosInstance from "../Utils/axiosInstance";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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

  const handleProceed = async () => {
    if (!validateEmail(email)) {
      showToastMessage("error", "Please enter a valid school email.");
      return;
    }
    setLoading(true);

    const sendOtpResult = await handleSendOtp();

    if (sendOtpResult?.successful) {
      setLoadingMessage("Sending your code");
      setTimeout(() => {
        setLoading(false);
        navigate("/account-verify", {
          state: {
            email: email,
            from: "forgot",
          },
        });

      }, 2000); // Optional delay for smooth transition
    } else {
      setLoading(false); // Stop loading immediately on failure
      showToastMessage(
        "error",
        sendOtpResult?.message || "Email not found. Create your account first"
      );
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });

      // Backend returns a field `successful` which we can use to determine success
      if (response.data.successful) {
        return response.data; // Return the full response object on success
      } else {
        return response.data; // Return the failure response as-is
      }
    } catch (err) {
      showToastMessage(
        "error",
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div
      className="bg-center bg-cover min-h-screen overflow-x-hidden flex md:justify-center items-start md:items-center"
      style={{
        fontFamily: "'Inter', sans-serif", // Set font family
        backgroundImage: `url(${bg})`, // Background image
      }}
    >
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />

      {loading && <Loading message={loadingmessage} />}
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] px-4 md:px-0">
        <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-[50px] mt-0 md:mt-[30px] md:ml-[20px]">
          <div className="flex flex-col items-center justify-center">
            <img
              className="h-auto w-[290px] md:w-[500px] cursor-pointer"
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
            <img
              className="h-auto w-[250px] md:w-[450px]"
              src={image}
              alt="univ students"
            />
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center px-[10px] md:p-[20px]">
          <div className="w-full max-w-[420px] bg-[#ffc8a0] rounded-[20px] shadow-[0_30px_30px_rgba(0,0,0,0.2)] p-4 md:p-[20px] flex flex-col items-start h-auto md:mt-6 md:ml-[20px]">
            <img
              class="h-auto w-[25px] cursor-pointer mb-[3px]"
              src={back}
              alt="back Icon"
              onClick={() => navigate("/login")}
            />
            <h2 class="text-[27px]  md:text-[40px] font-bold text-[#141e46]">
              Forgot Password?
            </h2>
            <p class="text-[13px] md:text-[14px] mb-[25px] text-left text-black font-[480] leading-[20px] mr-[15px]">
              Don't worry, we got your back. Just enter your verified
              
              email to proceed.
            </p>

            <div className="relative flex items-center w-full">
              <img
                src={emailIcon}
                alt="mail icon"
                className="absolute left-2 w-[31px] h-auto pointer-events-none ml-2 mb-[4px]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProceed(e)}
                placeholder="Enter school email"
                required
                className="w-full h-[50px] p-[10px] pl-[60px] mb-[5px] border-none rounded-[20px]"
              />
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full p-[10px] rounded-[90px] bg-[#eb6e5b] text-white text-[16px] font-[550]  mt-[5px] cursor-pointer flex justify-center shadow-[0_5px_3px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:bg-[#d25441]"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;

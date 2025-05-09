/** @format */

import React, { useState, useRef, useEffect } from "react";
import bg from "../images/longbg.png"; // Background image import
import logo from "../images/NLogo.png"; // Import logo image
import back from "../images/back Icon.png";
import { useNavigate } from "react-router-dom"; // Import navigate for back button if needed
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import { useLocation } from "react-router-dom";

const SignupVerif = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // State for OTP input
  const [countdown, setCountdown] = useState(0); // Countdown for resend button
  const inputs = useRef([]); // Ref for input fields
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingmessage, setLoadingMessage] = useState("");
  const location = useLocation();
  const email = location.state?.email || "No email provided";
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

  // Clear all input fields
  const clearInputFields = () => {
    setCode(["", "", "", "", "", ""]);
    // Focus on first input after clearing
    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 10);
  };

  // Countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      handleCloseToast();
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup interval
  }, [countdown]);

  // Handle input change
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index] = value;
        return newCode;
      });

      // Automatically move focus to next input
      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleNextPage = () => {
    console.log("Navigating from:", location.state.from);

    if (location.state.from === "signup") {
      navigate("/verify-success");
    } else if (location.state.from === "login") {
      navigate("/dashboard");
    } else if (location.state.from === "forgot") {
      navigate("/login-set-new-password", { state: { email: email } });
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpValue = code.join("");

    if (otpValue.length !== 6) {
      showToastMessage("error", "Please enter a 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/otp/verify-otp", {
        email,
        otp: otpValue,
        purpose: location.state?.from,
      });

      const token = response.data?.token;
      const source = location.state?.from;

      if (!response.data.error) {
        setLoadingMessage("Verifying your Account");
        setTimeout(() => {
          setLoading(false);
          setLoadingMessage("");
          handleNextPage();
        }, 2000);
      }
    } catch (err) {
      console.error("Verification Error:", err.response?.data || err.message);
      showToastMessage("error", "Incorrect Code. Please try again");
      setLoading(false);

      // Clear input fields when verification fails
      clearInputFields();
    }
  };

  // Handle resend code click
  const handleResendClick = async (e) => {
    e.preventDefault();
    setLoadingMessage("Sending your Code");
    setLoading(true);

    await handleResendOtp();

    setTimeout(() => {
      setCountdown(120);
    }, 1600);

    // Clear input fields when resending code
    clearInputFields();
  };

  const handleResendOtp = async () => {
    try {
      const response = await axiosInstance.put("/otp/resend-otp", { email });

      if (response.data.success) {
        setLoading(false);
        showToastMessage("success", "Code sent Successfully", 1500);
      }
    } catch (err) {
      console.error("Resend Code Error:", err.response?.data || err.message);
      showToastMessage("error", "Failed to resend code", 1500);
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

        <div className="h-auto max-h-[485px] w-full md:max-w-[520px] p-[20px] bg-[#ffc8a0] rounded-[20px] shadow-md flex justify-center">
          <div className="flex flex-col items-center w-[450px]">
            <div className="w-[300px] md:w-[430px]">
              <img
                className="h-[25px] w-[28px] cursor-pointer mb-[3px]"
                src={back}
                alt="back Icon"
                onClick={() => navigate(-1)}
              />
            </div>

            <div className=" w-[300px] md:w-[430px]">
              <h2 className="text-[27px] md:text-[35px] text-[#112061] font-bold text-left">
                Enter the code
              </h2>
              <p className="text-[13px] md:text-[14px] text-black mb-[20px] text-left font-[480]">
                Please enter the code sent to your entered email to verify your
                eligibility.
              </p>
            </div>

            <div className="w-full flex justify-center">
              <div className="flex justify-between space-x-1 mb-6 w-[300px] md:w-[420px]">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                    ref={(el) => (inputs.current[index] = el)}
                    className="w-10 h-10 md:w-14 md:h-14 text-center text-2xl font-medium bg-[#917266] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d25441]"
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <p className="text-center text-sm text-blue-900 font-[480]">
                {countdown > 0 ? (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                ) : (
                  <a
                    href="/"
                    onClick={handleResendClick}
                    className="text-blue-900 font-[600] hover:underline"
                  >
                    Resend code
                  </a>
                )}
              </p>
            </div>

            <div className="w-[250px] md:w-[350px] mt-4 mb-2">
              <div className="w-full text-center bg-[#eb6e5b] rounded-[20px] font-semibold cursor-pointer shadow-[0_5px_3px_rgba(0,0,0,0.2)] hover:bg-[#d25441] ">
                <button
                  type="submit"
                  className="w-full text-white h-full py-2"
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
};

export default SignupVerif;

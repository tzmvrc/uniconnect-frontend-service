/** @format */

import bg from "../images/longbg.png";
import logo from "../images/NLogo.png";
import image from "../images/image2.png";
import emailimg from "../images/entermail icon.png";
import pass from "../images/enterpass icon.png";
import showIcon from "../images/ShowPass.png";
import hideIcon from "../images/BlindPass.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { validateEmail } from "../Utils/Helper";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    showToastMessage("error", "Please enter your email and password");
    return;
  }

  if (!validateEmail(email)) {
    showToastMessage("error", "Please enter a valid email address.");
    return;
  }

  setLoading(true);

  const isVerified = await handleCheckIfVerified();

  try {
    const response = await axiosInstance.post(
      "/users/login",
      { email, password },
      { withCredentials: true } // ✅ Ensures cookies are included in requests
    );

    if (response.data.successful) {
      // Manually check if token exists before setting it
      if (response.data.token) {
        console.log("Setting token in cookies:", response.data.token);
        Cookies.set("token", response.data.token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          secure: true,
          sameSite: "none",
          path: "/",
        });
      }

      if (!isVerified) {
        setLoadingMessage("Let's verify your account first");
        setTimeout(() => {
          setLoading(false);
          SendOtp();
          navigate("/account-verify", { state: { email, from: "login" } });
        }, 2000);
        return;
      }

      setLoadingMessage("Logging in...");
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 2000);
    } else {
      showToastMessage("error", "Login successful, but something went wrong.");
    }
  } catch (err) {
    setLoading(false);
    const errorMessage =
      err.response?.data?.message || "Something went wrong. Please try again.";
    showToastMessage("error", errorMessage);
  }
};


  const SendOtp = async () => {
    setLoadingMessage("Sending your Code");
    setLoading(true);
    await handleResendOtp();
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

  const handleCheckIfVerified = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/check-if-verified/${email}`
      );

      if (response.data.successful) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

 useEffect(() => {
   // Check if the token is available in cookies
   const token = Cookies.get("token");

   if (token) {
     // If the token exists, navigate to the dashboard
     navigate("/dashboard");
   }
 }, []); 

  return (
    <div
      className="flex items-start md:justify-center md:items-center min-h-screen overflow-y-hidden"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        margin: "0",
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
          <div className="w-full max-w-[420px] bg-[#ffc8a0] rounded-[20px] shadow-[0_30px_30px_rgba(0,0,0,0.2)] p-4 md:p-[20px] flex flex-col items-start h-auto md:h-[420px] md:mt-6 md:ml-[20px]">
            <h2 className="text-[27px]  md:text-[40px] font-bold text-[#141e46]">
              Welcome Back!
            </h2>
            <p className="text-[13px] md:text-[14px] mb-[20px] text-left text-black font-[480] leading-[20px]">
              Sign in to access your account, ask questions, explore topics, and
              help others in the Computer Science and IT community.
            </p>

            <div className="relative flex items-center w-full">
              <img
                src={emailimg}
                alt="mail icon"
                className="absolute left-2 top-[15px] w-[31px] h-auto pointer-events-none ml-2"
              />
              <input
                type="text"
                placeholder="Enter school email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                className="w-full h-[50px] p-[10px] pl-[60px] mb-[10px] border-none rounded-[10px]"
              />
            </div>

            <div className="relative flex items-center w-full">
              <img
                src={pass}
                alt="pass icon"
                className="absolute left-[7px] w-[23px] h-auto pointer-events-none ml-[13px] mb-[11px]"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                className="w-full h-[50px] pl-[60px] pr-2 mb-[10px] border-none rounded-[10px]"
                value={password}
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-2.5 text-gray-600"
                >
                  <img
                    src={showPassword ? hideIcon : showIcon}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="w-[30px] h-auto"
                  />
                </button>
              )}
            </div>

            <div className="ml-auto">
              <p
                className="font-[500] text-right text-[14px] mr-[15px] mb-[18px] cursor-pointer hover:underline hover:text-[#141e46]"
                onClick={() => navigate("/login-forgot-password")}
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full p-[10px] rounded-[90px] bg-[#eb6e5b] text-white text-[16px] font-[550] cursor-pointer flex justify-center shadow-[0_5px_3px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:bg-[#d25441]"
            >
              Login
            </button>

            <div className="font-[480] block text-center text-[14px] mt-[15px] w-full">
              <p className="text-black text-center font-[500]">
                New to UniConnect?
                <span
                  className="ml-[3px] md:ml-[6px] font-bold hover:underline cursor-pointer hover:text-[#141e46]"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import bg from "../images/longbg.png";
import { useNavigate } from "react-router-dom";
import logo from "../images/NLogo.png";

const ErrorPath = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen w-full flex justify-center items-center overflow-hidden bg-cover bg-center"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="text-center flex flex-col justify-center items-center px-5">
        <h1 class="text-[100px] text-[#ff6b6b]">404</h1>
        <h2 class="text-[40px] my-2 text-white">Oops! Page Not Found</h2>
        <p class="text-[15px] text-white my-2 mb-[20px]">
          Sorry, the page you’re looking for doesn’t exist. It might have been
          removed,
          <br /> renamed, or maybe you typed the URL incorrectly.
        </p>
        <button
          className="mt-2 text-white px-5 py-2 border-2 border-red-400 rounded cursor-pointer hover:bg-[#ff6b6b]"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
        <img class="h-auto w-[400px] mt-[80px]" src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default ErrorPath;

/** @format */

import React, { useState, useEffect } from "react";
import bg from "../images/longbg.png"; // Background image import
import logo from "../images/NLogo.png"; // Import logo image
import addIcon from "../images/add Icon.png"; // Add icon
import whiteAddIcon from "../images/White addIcon.png"; // White add icon
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";

const AddTopics = () => {
  // State to track selected topics
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState({});
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

  // Toggle selection of topics
  const toggleSelection = (topic) => {
    setSelectedTopics((prevState) => ({
      ...prevState,
      [topic]: !prevState[topic],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const topicsToAdd = Object.keys(selectedTopics).filter(
      (topic) => selectedTopics[topic]
    );

    if (topicsToAdd.length < 3) {
      showToastMessage("error", "Please select at least 3 topics.");
      setLoading(false); // Reset loading state
      return; // Exit the function if validation fails
    }

    try {
      // Send selected topics to the backend API
      const response = await axiosInstance.post(
        "/topic/add", // Replace with your API endpoint
        { topicNames: topicsToAdd }
      );

      if (response.data.successful) {
        navigate("/dashboard"); // Redirect if successful
      } else {
        showToastMessage("error", response.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  return (
    <div
      className="flex flex-col items-center md:justify-center min-h-screen overflow-hidden"
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
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="uniconnect logo"
          className="h-auto w-[290px] md:w-[500px] cursor-pointer mb-[20px] md:mb-[20px] mt-[50px] md:mt-[0px]"
        />
        {/** Main box */}
        <div className="flex flex-col items-center text-center bg-[#fbcaa4] w-[350px] md:w-[800px] h-[480px] md:h-[420px] rounded-[20px]">
          <h1 className="text-[25px] md:text-[35px] text-[#112061] font-bold mt-[20px] leading-[30px] md:leading-[50px] mx-[40px] md:mx-[0px]">
            Add topics related to your Interests
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#112061] mb-[15px] mt-[5px] md:mt-[0] leading-[20px] font-[480] mx-[25px] md:mx-[130px]">
            Your interests are important to us. Pick a few topics that are
            relevant to you or add your topic of interest and they will show up
            in your feed!
          </p>

          {/** divs for each row of topics button */}
          <div className="flex flex-col mt-[5px] md:mt-[25px] w-full items-center justify-center">
            <div className="flex flex-col md:flex-row items-center justify-between w-[600px]">
              {/** Software Engineering button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] mb-[7px] md:mb-[0px] text-sm font-medium ${
                  selectedTopics["Software Engineering"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Software Engineering")}
              >
                <img
                  src={
                    selectedTopics["Software Engineering"]
                      ? whiteAddIcon
                      : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Software Engineering
              </button>

              {/** Advance Database System button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Advance Database System"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Advance Database System")}
              >
                <img
                  src={
                    selectedTopics["Advance Database System"]
                      ? whiteAddIcon
                      : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Advance Database System
              </button>

              {/** Networking button */}
              <button
                className={`hidden md:flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Networking"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Networking")}
              >
                <img
                  src={selectedTopics["Networking"] ? whiteAddIcon : addIcon}
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Networking
              </button>
            </div>

            {/** 2nd row */}
            <div className="flex flex-wrap items-center justify-center md:justify-between w-full md:w-[640px] mt-[7px] md:mt-[15px] gap-x-4 gap-y-[7px]">
              {/** Animation button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px]  text-sm font-medium ${
                  selectedTopics["Animation"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Animation")}
              >
                <img
                  src={selectedTopics["Animation"] ? whiteAddIcon : addIcon}
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Animation
              </button>

              {/** Web Design button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Website Design"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Website Design")}
              >
                <img
                  src={
                    selectedTopics["Website Design"] ? whiteAddIcon : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Website Design
              </button>

              {/** Information Security button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Information Security"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Information Security")}
              >
                <img
                  src={
                    selectedTopics["Information Security"]
                      ? whiteAddIcon
                      : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Information Security
              </button>

              {/** Graphics button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Graphics"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Graphics")}
              >
                <img
                  src={selectedTopics["Graphics"] ? whiteAddIcon : addIcon}
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Graphics
              </button>
            </div>

            {/** 3rd row */}
            <div className="flex items-center justify-center md:justify-between w-[570px] mt-[7px] md:mt-[15px]">
              {/** Algorithm and Logic button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] mr-[17px] md:mr-[0] text-sm font-medium ${
                  selectedTopics["Algorithm and Logic"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Algorithm and Logic")}
              >
                <img
                  src={
                    selectedTopics["Algorithm and Logic"]
                      ? whiteAddIcon
                      : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Algorithm and Logic
              </button>

              {/** Intermediate Programming button */}
              <button
                className={`hidden md:flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Intermediate Programming"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Intermediate Programming")}
              >
                <img
                  src={
                    selectedTopics["Intermediate Programming"]
                      ? whiteAddIcon
                      : addIcon
                  }
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Intermediate Programming
              </button>

              {/** Robotics button */}
              <button
                className={`flex items-center py-2 pr-[15px] pl-[10px] text-sm font-medium ${
                  selectedTopics["Robotics"]
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }  rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-[0_5px_3px_rgba(0,0,0,0.2)]`}
                onClick={() => toggleSelection("Robotics")}
              >
                <img
                  src={selectedTopics["Robotics"] ? whiteAddIcon : addIcon}
                  alt="icon"
                  className="w-[20px] h-auto mr-[5px] transition-transform duration-300 ease-linear"
                />
                Robotics
              </button>
            </div>
          </div>

          {/** Buttons */}
          <div className="flex w-full justify-center mt-[30px] md:mt-[35px]">
            <div className="flex gap-x-4 md:gap-x-7 w-full justify-center md:justify-center">
              <button
                type="submit"
                class="w-[130px] md:w-[220px] p-[10px] rounded-[90px] bg-[#1C264C] text-white text-[16px] font-[550] cursor-pointer flex justify-center shadow-[0_5px_3px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:bg-[#040D2E]"
                onClick={() => navigate("/dashboard")}
              >
                Skip
              </button>

              <button
                type="submit"
                className="w-[130px] md:w-[220px] p-[10px] rounded-[90px] bg-[#eb6e5b] text-white text-[16px] font-[550] cursor-pointer flex justify-center shadow-[0_5px_3px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:bg-[#d25441]"
                onClick={handleSubmit}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopics;

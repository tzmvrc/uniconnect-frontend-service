/** @format */

import React from "react";
import Header from "../Header";
import setbg from "../images/setbg.png";
import exit from "../images/exit.png";
import forum from "../images/forumIcon.png";
import points from "../images/badgerank.png";
import ai from "../images/ai.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../Utils/Helper";
import axiosInstance from "../Utils/axiosInstance";
import { Pencil, HelpCircle, Check, X } from "lucide-react";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import AccountManagementModal from "./AccountManagementModal";

const Settings = () => {
  const tabs = [
    { id: "profile", label: "Edit Profile" },
    { id: "account", label: "Edit Account" },
    { id: "help", label: "Help" },
  ];
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const fullname = `${userData?.FirstName} ${userData?.LastName}`;
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [otp, setOtp] = useState("");
  const [tempUsername, setTempusername] = useState(username);
  const [tempEmail, setTempEmail] = useState(email); // for editing
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [confirmSchool, setConfirmSchool] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [aactiveTab, setAactiveTab] = useState("public");
  const [loading, setLoading] = useState(false);
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

  const staticPassword = "delete0";

  // Fetch user data from backend
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      // Changed endpoint to match the one in Dashboard.js
      const response = await axiosInstance.get("/users/get-user-info");
      setUserData(response.data.user || {});
      console.log("User Info Fetched:", response.data.user); // Add this to debug
      setFirstName(response.data.user.FirstName || "");
      setLastName(response.data.user.LastName || "");
      setUsername(response.data.user.Username || "");
      setTempusername(response.data.user.Username || "");
      setTempEmail(response.data.user.Email || "");
      setEmail(response.data.user.Email || "");
      setSchool(response.data.user.School || "");
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/dashboard");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const getUnderlineClasses = (activeTab) => {
    if (activeTab === "profile") {
      return "w-[95px] left-[17px] md:left-0 md:w-[105px]";
    } else if (activeTab === "account") {
      return "w-[117px] left-[137px] md:w-[135px] md:left-[139px]";
    } else if (activeTab === "help") {
      return "w-[60px] left-[278px] md:left-[317px]";
    }
    return "";
  };

  const handleUpdateUserProfile = async () => {
    // ✅ Trim all values before validation
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // ✅ Check for empty fields
    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedUsername ||
      !trimmedEmail
    ) {
      showToastMessage("error", "Please fill in all fields before saving.");
      return;
    }

    try {
      const response = await axiosInstance.put("/users/update", {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        username: trimmedUsername,
        email: trimmedEmail,
      });

      if (!response.data.success) {
        showToastMessage("error", response.data.message);
        return;
      }

      showToastMessage(
        "success",
        response.data.message || "Updated Successfully"
      );
      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Update failed. Please try again.";
      showToastMessage("error", errorMessage);
    }
  };

  const handleSendOTPEmail = async () => {

    setLoading(true);
  

    try {
        const emailLower = tempEmail.toLowerCase();

        // ✅ Basic format check
        if (!email.includes("@")) {
          showToastMessage("error", "Please enter a valid email address");
          setLoading(false);
          return;
        }
        
      // ✅ Updated to the new OTP API route
      const response = await axiosInstance.post("/otp/send-otp", {
        email: email,
        oldEmail: emailLower,
      });

      // ✅ Show success or error toast
      if (response.data.success) {
        setTimeout(() => {
          showToastMessage("success", "Code sent to your old email.");
          setOtpModalOpen(true); // Show OTP modal/input box
          setLoading(false);
        }, 1000); // You can change 1000 to any delay in milliseconds
      } else {
        setLoading(false);
        showToastMessage(
          "error",
          response.data.message || "Failed to send OTP"
        );
      }
    } catch (err) {
      setLoading(false);
      const serverMsg = err.response?.data?.message;
      showToastMessage("error", serverMsg || "Something went wrong.");
    }
  };

  const handleSaveClick = async () => {
    if (!otp) {
      showToastMessage("error", "Please enter the code");
      return;
    }

    try {
      const response = await axiosInstance.post("/otp/verify-otp", {
        email: tempEmail,
        otp: otp,
      });

      if (response.data.error) {
        showToastMessage(
          "error",
          response.data.message || "OTP verification failed."
        );
        setOtp("");
        return;
      }

      showToastMessage(
        "success",
        response.data.message || "Email verified Successfully!"
      );
      handleUpdateUserProfile();
    } catch (err) {
      // ✅ Proper error handling here
      const errorMessage =
        err.response?.data?.message ||
        "OTP verification failed. Please try again.";
      showToastMessage("error", errorMessage);
      setOtp("");
    }
  };

  const handleTabClick = (tab) => {
    setAactiveTab(tab);
  };

  return (
    <div
      className="flex justify-center max-h-screen overflow-hidden text-[#141E46]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />
      {loading && <Loading message={""} />}

      {/**border div */}
      <div className="w-full md:w-[80%] mt-[70px] relative px-4 md:p-0">
        {/**floating esc div */}
        <div className="hidden md:block float-right mt-[20px] mr-[25px]">
          <div
            className=" flex flex-col justify-center items-center h-[70px] w-[50px] cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img src={exit} alt="exit icon" className="h-[35px] w-[35px]" />
            <p className="mt-[5px] font-[550]">ESC</p>
          </div>
        </div>

        {/**Main div */}
        <h1 className="hidden md:block text-[20px] md:text-[25px] font-[650] md:ml-[90px] mt-[25px]">
          User Settings
        </h1>
        {/**Tabs */}
        <div className="mt-[20px] md:ml-[90px] md:w-[85%]">
          <div className="relative border-b-2 border-[#1D274D]">
            <div className="flex justify-around md:justify-start w-full space-x-[0px] md:space-x-[70px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 text-[14px] md:text-[17px] text-[#1D274D] ${
                    activeTab === tab.id ? "font-[550]" : "font-[500]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Underline */}
            <div
              className={`absolute bottom-0 h-1 bg-[#ff7e6a] rounded-full transition-all duration-300 ${getUnderlineClasses(
                activeTab
              )}`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full mt-[20px]">
          {/* Edit profile tab */}
          {activeTab === "profile" && (
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex flex-col items-center w-full md:w-[700px] md:h-[520px]">
                <div className="w-full flex flex-col justify-center items-center">
                  <div className=" relative">
                    {/* Background Image */}
                    <img
                      src={setbg}
                      alt="bg settings"
                      className="h-auto w-full md:w-[550px]"
                    />

                    {/* Profile Image */}
                    <div className="absolute bottom-[-60px] left-[60px] md:left-[75px] transform -translate-x-1/2 w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-full border-4 border-slate-700 overflow-hidden">
                      <div className="w-[95px] h-[95px] md:w-full md:h-full flex items-center justify-center rounded-full text-slate-950  bg-slate-200 text-[40px]">
                        {getInitials(fullname)}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info and Button */}
                  <div className="flex justify-between w-[550px] mt-[8px]">
                    <h1 className="ml-[220px] md:ml-[145px] text-[23px] md:text-[30px] pb-[5px] font-[700]">
                      {fullname}
                    </h1>

                    {/* <button
                      onClick={() => {
                        handleEditClick("FirstName", "Name");
                        setIsEditingFullName(true);
                        setLastName(userData?.LastName || "");
                      }}
                      className="px-[20px] mr-[45px] my-[8px] font-[500] rounded-[5px] bg-[#1D274D] text-white text-[14px]"
                    >
                      Edit
                    </button> */}
                  </div>
                </div>
                {/* Editing tab */}
                <div className="flex flex-col items-center justify-center w-full md:w-[520px] h-[230px] md:h-[270px] md:border border-[2px] border-black mt-[40px] md:mt-[30px] rounded-[10px] bg-[#FFEBDD]">
                  <div className="w-full flex flex-col justify-center items-center mb-[7px]">
                    {/* school div */}
                    <div className="w-full md:w-[470px] ml-[5px] ">
                      <p className="text-[12px] md:text-[14px] font-[600] mb-[0px] md:mb-[5px] mx-[20px] md:mx-[0px]">
                        SCHOOL
                      </p>
                      <div className="flex justify-between items-center mx-[20px] md:mx-[0px] ">
                        <input
                          className="rounded-[5px] border border-black w-[190px] md:w-[300px] placeholder:font-[400] placeholder:text-[14px] pl-[10px] pb-1"
                          value={isEditingSchool ? school : ""}
                          placeholder={isEditingSchool ? "" : school}
                          disabled={true}
                        />

                        <div className="flex items-center gap-1 relative group">
                          <p className="font-[500] text-[13px] md:text-[15px] mr-[0px] md:mr-[2px]">
                            Email Based
                          </p>

                          {/* Icon with custom tooltip */}
                          <HelpCircle
                            size={16}
                            className="text-gray-600 hover:text-black cursor-pointer"
                          />

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 left-[20px] md:left-1/2 -translate-x-1/2 w-[220px] bg-black text-white text-xs text-center px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            School will be automatically updated as you update
                            your email
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* username div */}
                    <div className="w-full md:w-[470px] mt-[20px] ml-[5px]">
                      <p className="text-[12px] md:text-[14px] font-[600] mb-[0px] md:mb-[5px] mx-[20px] md:mx-[0px]">
                        USERNAME
                      </p>
                      <div className="flex justify-between items-center mx-[20px] md:mx-[0px] ">
                        <input
                          className={`rounded-[5px] border border-black w-[190px] md:w-[300px] placeholder:font-[400] placeholder:text-[14px] pl-[10px] pb-1 ${
                            !isEditingUsername ? "text-gray-400" : "text-black"
                          }`}
                          value={username}
                          placeholder={tempUsername}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={!isEditingUsername}
                        />
                        <div className="flex gap-2 mr-[10px]">
                          {isEditingUsername ? (
                            <>
                              {/* Save icon */}
                              <button
                                onClick={() => {
                                  handleUpdateUserProfile();
                                }}
                                className="border border-black rounded-[5px] bg-green-700 px-[10px] py-[5px] text-white hover:bg-green-800"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>

                              {/* Cancel icon */}
                              <button
                                onClick={() => {
                                  setUsername(tempUsername);
                                  setIsEditingUsername(false);
                                }}
                                className="border border-black rounded-[5px] bg-red-700 px-[10px] py-[5px] text-white hover:bg-red-800"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setIsEditingUsername(true)}
                              className="border border-black rounded-[5px] bg-[#1D274D] px-[18px] py-[7px] text-white hover:text-[#ff9889]"
                              title="Edit Username"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* email div */}
                    <div className="w-full md:w-[470px] mt-[20px] ml-[5px]">
                      <p className="text-[12px] md:text-[14px] font-[600] mb-[0px] md:mb-[5px] mx-[20px] md:mx-[0px]">
                        EMAIL
                      </p>
                      <div className="flex justify-between items-center mx-[20px] md:mx-[0px] ">
                        <input
                          className={`rounded-[5px] border border-black w-[190px] md:w-[300px] placeholder:font-[400] placeholder:text-[14px] pl-[10px] pb-1 ${
                            !isEditingEmail ? "text-gray-400" : "text-black"
                          }`}
                          value={email}
                          placeholder={tempEmail}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditingEmail}
                        />
                        <div className="flex gap-2 mr-[10px]">
                          {isEditingEmail ? (
                            <>
                              {/* Save icon */}
                              <button
                                onClick={() => {
                                  if (!email.trim()) {
                                    showToastMessage(
                                      "error",
                                      "Email cannot be empty."
                                    );
                                    return;
                                  }

                                  setConfirmSchool(true);
                                }}
                                className="border border-black rounded-[5px] bg-green-700 px-[10px] py-[5px] text-white hover:bg-green-800"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>

                              {/* Cancel icon */}
                              <button
                                onClick={() => {
                                  setEmail(tempEmail); // Reset back to original
                                  setIsEditingEmail(false);
                                }}
                                className="border border-black rounded-[5px] bg-red-700 px-[10px] py-[5px] text-white hover:bg-red-800"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setTempEmail(email); // Set temp for editing
                                setIsEditingEmail(true);
                              }}
                              className="border border-black rounded-[5px] bg-[#1D274D] px-[18px] py-[7px] text-white hover:text-[#ff9889]"
                              title="Edit Email"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && <AccountManagementModal />}

          {/* Help tab */}
          {activeTab === "help" && (
            <div className="flex flex-col justify-center items-center">
              {/* 1st div button */}
              <div className="flex gap-[0px] md:gap-[10px] mb-[0px] md:mb-[20px] justify-center cursor-pointer text-white">
                <div className="flex justify-center md:justify-around md:w-[800px] h-[160px] space-x-[12px]">
                  {/* Public Tab */}
                  <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
                    <div
                      className={`tab ${
                        aactiveTab === "public" ? "bg-[#0b112b]" : "bg-[#bbb]"
                      } p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
                      onClick={() => handleTabClick("public")}
                    >
                      {aactiveTab !== "public" ? (
                        <>
                          <p className="text-[#0b112b] text-[14px] md:text-base font-bold">
                            View Forum
                          </p>
                          <img
                            src={forum} // Replace with your actual icon path
                            alt="Forum Icon"
                            className="h-auto w-[65px] md:w-[90px] mt-[15px] ml-[9px] md:ml-[22px]"
                          />
                        </>
                      ) : (
                        <p className="text-white text-[12px] md:text-[13px] font-[400] leading-[17px]">
                          Explore questions,
                          <br />
                          share answers, and
                          <br />
                          earn points to rise
                          <br />
                          up the leaderboard!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Private Tab */}
                  <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
                    <div
                      className={`tab ${
                        aactiveTab === "private" ? "bg-[#0b112b]" : "bg-[#bbb]"
                      } p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
                      onClick={() => handleTabClick("private")}
                    >
                      {aactiveTab !== "private" ? (
                        <>
                          <p className="text-[#0b112b] text-[14px] md:text-base font-bold">
                            Points & Badge
                          </p>
                          <img
                            src={points} // Replace with your actual icon path
                            alt="Badge Icon"
                            className="h-auto w-[70px] md:w-[90px] mt-[15px] ml-[10px] md:ml-[15px]"
                          />
                        </>
                      ) : (
                        <p className="text-white text-[13px] font-[400] leading-[17px]">
                          Earn points through
                          <br />
                          upvotes on your
                          <br />
                          responses. Collect
                          <br />
                          enough to unlock a
                          <br />
                          badge.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Other Tab */}
                  <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
                    <div
                      className={`tab ${
                        aactiveTab === "other" ? "bg-[#0b112b]" : "bg-[#bbb]"
                      } p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
                      onClick={() => handleTabClick("other")}
                    >
                      {aactiveTab !== "other" ? (
                        <>
                          <p className="text-[#0b112b] text-[14px] md:text-base font-bold">
                            How AI works
                          </p>
                          <img
                            src={ai} // Replace with your actual icon path
                            alt="AI Icon"
                            className="mt-2 w-[70px] md:w-[90px] ml-[8px] md:ml-[18px]"
                          />
                        </>
                      ) : (
                        <p className="text-white text-[13px] font-[400] leading-[17px]">
                          Simply type your
                          <br />
                          query, and the AI
                          <br />
                          will fetch useful
                          <br />
                          resources for you!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content text-[#0b112b] text-[13px] md:text-base font-[550] mb-[50px]">
                {aactiveTab === "public" && (
                  <div class="flex flex-col items-center text-center ml-[5px] md:ml-[60px]">
                    <div className="text-left">
                      <h2 class="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          To browse the forum, simply scroll through the list of
                          questions posted by other users.
                        </li>
                        <li>
                          Use the search bar at the top to quickly find topics
                          or specific questions.
                        </li>
                        <li>
                          Click on any question to view its details and
                          responses.
                        </li>
                        <li>
                          To contribute, click "Reply" to share your answer or
                          add to the discussion.
                        </li>
                      </ul>
                      <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          Be sure to read the full question before responding,
                          and aim to provide clear, helpful answers.
                        </li>
                        <li>
                          Upvote responses you find useful to help others and
                          reward quality contributions.
                        </li>
                        <li>
                          Remember, thoughtful answers can earn you points and
                          boost your ranking!
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2nd option */}
                {aactiveTab === "private" && (
                  <div className="flex flex-col items-center text-center  ml-[5px] md:ml-[60px]">
                    <div className="text-left">
                      <h2 class="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          Points are earned based on the upvotes and downvotes
                          your responses receive.
                        </li>
                        <li>
                          Your points are calculated as:{" "}
                          <span className="font-bold text-[#ff6b6b]">
                            (Total Upvotes - Downvotes) ÷ Number of Responses.
                          </span>
                        </li>
                        <li>
                          To earn a badge, you need to collect at least 50
                          points.
                        </li>
                      </ul>
                      <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          Be sure to read the full question before responding,
                          and aim to provide clear, helpful answers.
                        </li>
                        <li>
                          Upvote responses you find useful to help others and
                          reward quality contributions.
                        </li>
                        <li>
                          Remember, thoughtful answers can earn you points and
                          boost your ranking!
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3rd option */}
                {aactiveTab === "other" && (
                  <div className="flex flex-col items-center text-center  ml-[5px] md:ml-[60px]">
                    <div className="text-left">
                      <h2 class="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          The AI in the forum helps you find relevant resources
                          based on your questions or commands.
                        </li>
                        <li>
                          Simply type your question or command, and the AI will
                          return links and sources that match your
                          <br /> query.
                        </li>
                        <li>
                          For commands, use formats like{" "}
                          <span class="font-bold text-[#ff6b6b]">
                            @uc search [Tags1]
                          </span>{" "}
                          for more targeted AI responses.
                        </li>
                      </ul>
                      <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul class="list-disc pl-5">
                        <li>
                          Be as specific as possible with your questions for the
                          AI to return the most useful results.
                        </li>
                        <li>
                          The AI is here to assist, but always double-check
                          sources and use your judgment when
                          <br /> reviewing links.
                        </li>
                        <li>
                          Explore the suggestions the AI gives you—they might
                          lead to new insights or helpful resources!
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex justify-center mt-[25px]">
                  <p>
                    For more questions and answer, visit our{" "}
                    <span
                      className="text-[#002ACA] underline cursor-pointer"
                      onClick={() => navigate("/FAQs")}
                    >
                      help page - FAQs
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {otpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="flex flex-col items-center bg-[#FFCDA9] border-black border p-4 rounded-lg w-[350px]">
            <h2 className="text-[20px] font-semibold">Verify your Email</h2>

            <p className="text-sm text-center mx-[25px]">
              Continue by verifying the code that just sent to your old email:
            </p>
            <p className="text-sm mb-4 text-center font-[700] mx-[25px]">
              {tempEmail}
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border bg-[#FFEBDD] placeholder-gray-600 rounded px-3 py-2 w-full mb-4 text-center"
            />

            <div className="flex justify-center space-x-5">
              <button
                className="bg-transparent border border-[#231c4b] px-5 py-2 rounded"
                onClick={() => {
                  setIsEditingFullName(false);
                  setIsEditingSchool(false);
                  setIsEditingEmail(false);
                  setOtpModalOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                className="text-white px-7 font-[600] bg-[#231c4b] py-2 rounded-[5px] hover:bg-[#2b2670]"
                onClick={handleSaveClick}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmSchool && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="flex flex-col items-center bg-[#FFCDA9] border-black border p-4 rounded-lg w-[350px]">
            <h2 className="text-[20px] font-semibold">Note:</h2>

            <p className="text-sm text-center mx-[25px]">
              Changing your email means changing your school. All of your points
              will be transfered to your new school.
            </p>

            <div className="flex justify-center space-x-7 mt-[25px]">
              <button
                className="bg-transparent border border-[#231c4b] px-5 py-2 rounded"
                onClick={() => {
                  // setIsEditingFullName(false);
                  // setIsEditingSchool(false);
                  // setIsEditingEmail(false);
                  setConfirmSchool(false);
                }}
              >
                Cancel
              </button>

              <button
                className="text-white px-5 font-[600] bg-[#231c4b] py-2 rounded-[5px] hover:bg-[#2b2670]"
                onClick={() => {
                  setConfirmSchool(false);
                  handleSendOTPEmail();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

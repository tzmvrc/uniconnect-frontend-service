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
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [confirmSchool, setConfirmSchool] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingFullname, setIsEditingFullname] = useState(false);
  const [setIsEditingFullName] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [updatePicture, setUpdatePicture] = useState(false);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and GIF files are allowed.");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size should not exceed 5MB.");
      return;
    }

    // Read file and preview (optional)
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result); // Assuming you have a state for previewing the image
    };
    reader.readAsDataURL(file);

    // Store the file for upload
    setSelectedFile(file); // Assuming you have a state for handling file upload
  };

const handleProfilePictureUpdate = async () => {
  if (!selectedFile) {
    showToastMessage("error", "Please select an image before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("profile-picture", selectedFile);

  try {
    setLoading(true);
    const response = await axiosInstance.put(
      "/users/upload-profile-picture", // Match backend endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure auth
        },
      }
    );

    if (response.data?.profilePicture) {
      // Update state
      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture, // Match backend key
      }));

      // Reset UI
      setPreviewImage(null);
      setSelectedFile(null);
      setUpdatePicture(false);

      showToastMessage(
        "success",
        response.data.message || "Profile picture updated successfully!"
      );
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 700);
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Upload Error:", error);
    showToastMessage(
      "error",
      error.response?.data?.message || "Failed to update profile picture"
    );
  } finally {
    setLoading(false);
  }
};


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
      return "w-[117px] left-[152px] md:w-[135px] md:left-[139px]";
    } else if (activeTab === "help") {
      return "w-[60px] left-[306px] md:left-[317px]";
    }
    return "";
  };

  const validateUsernameInput = (value) => {
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      showToastMessage("error", "Username can only contain letters, numbers, and underscores.");
      return false;
    }
    if (value.length > 20) {
      showToastMessage("error", "Username cannot exceed 20 characters.");
      return false;
    }
    return true;
  };
  
  
  const validateFirstNameInput = (value) => {
    if (!value.trim()) {
      showToastMessage("error", "First name cannot be empty");
      return false;
    }
    
    if (/\s{2,}/.test(value)) {
      showToastMessage("error", "First name cannot contain consecutive spaces");
      return false;
    }
    
    if (value.length > 20) {
      showToastMessage("error", "First name cannot exceed 20 characters");
      return false;
    }
    
    if (/\d/.test(value)) {
      showToastMessage("error", "First name cannot contain numbers");
      return false;
    }
    
    return true;
  };
  
  
  const validateLastNameInput = (value) => {
    if (!value.trim()) {
      showToastMessage("error", "Last name cannot be empty");
      return false;
    }
    
    if (/\s{2,}/.test(value)) {
      showToastMessage("error", "Last name cannot contain consecutive spaces");
      return false;
    }
    
    if (value.length > 15) {
      showToastMessage("error", "Last name cannot exceed 15 characters");
      return false;
    }
    
    if (/\d/.test(value)) {
      showToastMessage("error", "Last name cannot contain numbers");
      return false;
    }
    
    return true;
  };


  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9_]*$/.test(value) && value.length <= 20) {
      setUsername(value);
    }
  };

  const handleFirstNameChange = (e) => {
    let value = e.target.value;
  
    value = value.replace(/[^A-Za-z ]/g, "");
    value = value.replace(/\s{2,}/g, " ");
      if (value.length > 20) {
      value = value.slice(0, 20);
    }
    setFirstName(value);
  };
  
  const handleLastNameChange = (e) => {
    let value = e.target.value;
  
    value = value.replace(/[^A-Za-z ]/g, "");
    value = value.replace(/\s{2,}/g, " ");
      if (value.length > 15) {
      value = value.slice(0, 15);
    }
    setLastName(value);
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

  // Validate username and last name
  if (!validateUsernameInput(trimmedUsername) || !validateFirstNameInput(trimmedLastName) || !validateLastNameInput(trimmedLastName)) {
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
                  <div className="relative">
                    {/* Background Image */}
                    <img
                      src={setbg}
                      alt="bg settings"
                      className="h-auto w-full md:w-[550px]"
                    />

                    {/* Profile Image with External Edit Icon */}
                    <div className="absolute bottom-[-60px] left-[60px] md:left-[75px] transform -translate-x-1/2 w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-full border-4 border-[#1D274D] overflow-visible">
                      {/* Profile Image/Initials */}
                      <div className="w-[95px] h-[95px] md:w-full md:h-full flex items-center justify-center rounded-full text-slate-950 bg-slate-200 text-[40px] overflow-hidden">
                        {userData?.profile_picture ? (
                          <img
                            src={userData.profile_picture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          getInitials(fullname)
                        )}
                      </div>

                      {/* Edit Icon - Floating Outside */}
                      <div
                        className="absolute -bottom-2 -right-2 bg-[#1D274D] p-2 rounded-full cursor-pointer hover:bg-slate-600 transition z-10"
                        onClick={() => setUpdatePicture(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info and Button */}
                  <div className="flex justify-between w-[550px] mt-[15px]">
                    {isEditingFullname ? (
                      <div className="ml-[160px] md:ml-[160px] flex gap-2">
                        <div className="flex flex-col md:flex-row ml-[50px] md:ml-[0px] gap-2">
                          <input
                            className="rounded-[5px] border border-black w-[120px] md:w-[120px] placeholder:font-[400] placeholder:text-[14px] pl-[10px] pb-1"
                            value={firstName}
                            placeholder="First Name"
                            onChange={handleFirstNameChange}
                          />
                          <input
                            className="rounded-[5px] border border-black w-[120px] md:w-[120px] placeholder:font-[400] placeholder:text-[14px] pl-[10px] pb-1"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={handleLastNameChange}
                          />
                        </div>
                        <div className="flex gap-2 justify-center items-center md:justify-end ml-[15px] md:ml-[10px]">
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
                              setIsEditingFullname(false);
                            }}
                            className="border border-black rounded-[5px] bg-red-700 px-[10px] py-[5px] text-white hover:bg-red-800"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <h1 className="ml-[220px] md:ml-[160px] text-[23px] md:text-[30px] pb-[5px] font-[700]">
                          {fullname}
                        </h1>
                        <button
                          onClick={() => {
                            setIsEditingFullname(true);
                          }}
                          className="border ml-[40px] md:ml-[127px] border-black rounded-[5px] bg-[#1D274D] px-[17px] py-[6px] text-white hover:text-[#ff9889]"
                          title="Edit Name"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Editing tab */}
                <div className="flex flex-col items-center justify-center w-full md:w-[520px] h-[230px] md:h-[270px] md:border border-[2px] border-black mt-[40px] md:mt-[30px] rounded-[10px] bg-[#FFEBDD]">
                  <div className="w-full flex flex-col justify-center items-center mb-[7px]">
                    {/* username div */}
                    <div className="w-full md:w-[470px]  ml-[5px]">
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
                          onChange={handleUsernameChange}
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

                    {/* school div */}
                    <div className="w-full md:w-[470px] mt-[20px] ml-[5px] ">
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

                        <div className="flex items-center mr-[30px]  relative group">
                          {/* Icon with custom tooltip */}
                          <HelpCircle
                            size={20}
                            className="text-gray-600 hover:text-black cursor-pointer"
                          />

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 right-0 md:left-1/2 md:-translate-x-1/2 w-[200px] bg-black text-white text-xs text-center px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            Create new account for new school
                          </div>
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

                        <div className="flex items-center mr-[30px] relative group">
                          {/* Icon with custom tooltip */}
                          <HelpCircle
                            size={20}
                            className="text-gray-600 hover:text-black cursor-pointer"
                          />

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 right-0 md:left-1/2 md:-translate-x-1/2 w-[200px] bg-black text-white text-xs text-center px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            Email Cannot be changed. Create a new account for
                            new one
                          </div>
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
                  <div className="flex flex-col items-center text-center ml-[5px] md:ml-[60px]">
                    <div className="text-left">
                      <h2 className="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul className="list-disc pl-5">
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
                      <h2 className="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul className="list-disc pl-5">
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
                      <h2 className="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul className="list-disc pl-5">
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
                      <h2 className="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul className="list-disc pl-5">
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
                      <h2 className="font-bold mb-[8px] text-[#ff6b6b]">
                        Instructions:
                      </h2>
                      <ul className="list-disc pl-5">
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
                          <span className="font-bold text-[#ff6b6b]">
                            @uc search [Tags1]
                          </span>{" "}
                          for more targeted AI responses.
                        </li>
                      </ul>
                      <h2 className="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">
                        Tips:
                      </h2>
                      <ul className="list-disc pl-5">
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

      {updatePicture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col items-center text-center bg-[#FFCDA9] rounded-lg w-[300px] md:w-[400px] shadow-lg p-6">
              <p className="text-[22px] md:text-[25px] font-bold w-full">
                Upload Profile Picture
              </p>
              <p className="text-[13px] md:text-[14px] font-[500] mx-[10px] md:mx-[20px]">
                Select an image to personalize your profile.
              </p>

              <div className="flex flex-col items-center w-[90%] mt-[10px]">
                {/* Image Upload Box */}
                <label
                  htmlFor="fileInput"
                  className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition"
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-[170px] object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 text-gray-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        Click to upload a photo
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG or PNG (Max 5MB)
                      </p>
                    </>
                  )}
                </label>

                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex justify-center space-x-[20px] md:space-x-[40px] w-[80%] text-[14px] md:text-base mt-[20px]">
                <button
                  className="border-2 border-[#1D274D] font-semibold py-[5px] px-[25px] rounded-md text-[#1D274D]"
                  onClick={() => {
                    setUpdatePicture(false);
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#1D274D] text-white font-[500] py-[5px] px-[30px] rounded-md"
                  onClick={handleProfilePictureUpdate}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

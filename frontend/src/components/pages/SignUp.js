/** @format */

import logo from "../images/NLogo.png";
import bg from "../images/longbg.png";
import image2 from "../images/image2.png";
import schoolIcon from "../images/enterschool icon.png";
import nameIcon from "../images/entername icon.png";
import usernIcon from "../images/username icon.png";
import emailIcon from "../images/entermail icon.png";
import passIcon from "../images/enterpass icon.png";
import confirmIcon from "../images/confirmpass icon.png";
import showIcon from "../images/ShowPass.png";
import hideIcon from "../images/BlindPass.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";

const SignUp = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingmessage, setLoadingMessage] = useState("");

  const [showToast, setShowToast] = useState({
    isShown: false,
    type: "",
    message: "",
  });

  const dropdownRef = useRef(null);

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const showToastMessage = (type, message) => {
    setShowToast({ isShown: true, type: type, message: message });
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axiosInstance.get("/school/get-all-schools");
        setSchools(res.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
        showToastMessage("error", "Failed to fetch schools.");
      } 
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateFirstName = (value) => {
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

  const validateLastName = (value) => {
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

  const validateUsername = (value) => {
    if (!value.trim()) {
      showToastMessage("error", "Username cannot be empty");
      return false;
    }
    
    if (/\s/.test(value)) {
      showToastMessage("error", "Username cannot contain spaces");
      return false;
    }
    
    if (value.length > 20) {
      showToastMessage("error", "Username cannot exceed 20 characters");
      return false;
    }
    
    return true;
  };

  const handleFirstNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^A-Za-z ]/g, "");
    value = value.replace(/\s{2,}/g, " ");
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    let value = e.target.value;
  
    value = value.replace(/[^A-Za-z ]/g, "");
    value = value.replace(/\s{2,}/g, " ");
    setLastName(value);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9_]*$/.test(value)) {
      setUsername(value);
    }
  };

  const handlePassword = () => {
    if (newPassword === "" || confirmPassword === "") {
      showToastMessage("error", "Please fill out all password fields");
      return false;
    }

    if (newPassword !== confirmPassword) {
      showToastMessage("error", "The passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSelect = (school) => {
    setSelectedUniversity(school.school_name);
    setSearchTerm(school.school_name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(e.target.value.length > 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      showToastMessage("error", "Please enter your university");
      return false;
    }

    const universityExists = schools.some(
      (school) => school.school_name.toLowerCase() === trimmedSearchTerm
    );

    if (!universityExists) {
      showToastMessage("error", "Please select a valid university");
      return false;
    } else {
      return true;
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckEmail = async () => {
    try {
      const response = await axiosInstance.get(
        `/school/get-school-domain/${selectedUniversity}`
      );

      if (response.data && response.data.domain) {
        const schoolDomain = response.data.domain.toLowerCase();
        const emailLower = email.toLowerCase();

        if (!emailLower.includes("@")) {
          showToastMessage("error", "Please enter a valid email address");
          return false;
        }

        if (emailLower.includes(schoolDomain)) {
          return true;
        } else {
          showToastMessage(
            "error",
            `Email must be associated with ${selectedUniversity}`
          );
          return false;
        }
      } else {
        showToastMessage("error", "Could not retrieve school domain.");
        return false;
      }
    } catch (err) {
      console.error("Email Validation Error:", err);
      showToastMessage(
        "error",
        "Error checking email domain. Please try again."
      );
      return false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && filteredSchools.length === 1) {
        handleSelect(filteredSchools[0]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredSchools]);

  const handleValidation = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isUsernameValid = validateUsername(username);

    if (!isFirstNameValid || !isLastNameValid || !isUsernameValid) {
      // If any validation fails, show appropriate errors and return
      return;
    }

    if (!firstName || !lastName || !username) {
      showToastMessage("error", "Please fill out all fields");
      return;
    }

    const emailValid = await handleCheckEmail();
    const passwordValid = handlePassword();
    const schoolValid = handleFormSubmit(e);

    if (!emailValid || !passwordValid || !schoolValid) {
      return;
    }

    try {
      setLoadingMessage("Creating your Account");
      setLoading(true);
      
      const response = await axiosInstance.post("/users/signup", {
        school_name: selectedUniversity,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username,
        email: email.trim(),
        password: newPassword, 
      });

      if (response.data.successful) {
        setLoading(false);
        navigate("/account-verify", {
          state: { email: email.trim(), from: "signup" },
        });
      }
    } catch (err) {
      setLoading(false);
      console.error("Signup Error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      showToastMessage("error", errorMessage);
    }
  };

  // We don't need the render error message helper anymore since we're using toast

  return (
    <div
      className="flex justify-center items-center min-h-screen overflow-y-hidden bg-cover bg-center text-white"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `url(${bg})`,
      }}
    >
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />

      {loading && <Loading message={loadingmessage} />}

      <div className="flex flex-col md:flex-row w-[1300px] rounded-[20px]">
        <div className="flex-1 flex flex-col justify-center items-center p-5 text-center">
          <div className="flex flex-col items-center mt-[0px] md:mt-[35px]">
            <img
              className="h-auto w-[290px] md:w-[500px] cursor-pointer"
              src={logo}
              alt="logo"
              onClick={() => navigate("/")}
            />
            <h1 className="text-[24px] md:text-[28px] font-bold mt-[5px]">
              Your <span className="text-[#fa815c]">Connection</span> starts here!
            </h1>
            <img
              src={image2}
              alt="image2"
              className="h-auto w-[250px] md:w-[450px]"
            />
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center px-[25px] md:px-[50px] mb-[40px] md:mb-[0px]">
          <div className="w-full md:max-h-[520px] md:max-w-[550px] p-[20px] md:p-[20px] bg-[#ffc8a0] rounded-[20px] shadow-md">
            <h2 className="text-[27px] md:text-[40px] text-[#141e46] font-bold">
              Register
            </h2>
            <p className="text-[13px] md:text-[14px] text-black mb-[20px] leading-[20px] text-left font-[480]">
              Create an account to ask questions, share knowledge, and connect
              with a community of learners. Sign up today and start your
              journey!
            </p>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-[10px] relative" ref={dropdownRef}>
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={schoolIcon}
                    alt="Search Icon"
                    className="absolute left-[13px] w-[24px] h-auto pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Type your University"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                  />
                </div>
                {isOpen && filteredSchools.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg z-50 w-[90%] min-w-[200px] max-h-[200px] overflow-y-auto shadow-lg mt-1"
                  >
                    {filteredSchools.map((school, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer transition-all duration-200 bg-white text-black text-lg hover:bg-[#fa815c] hover:text-white"
                        onClick={() => handleSelect(school)}
                      >
                        {school.school_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col md:flex-row gap-[10px] mb-[10px]">
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={nameIcon}
                    alt="First Name Icon"
                    className="absolute left-[10px] h-auto w-[30px]"
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                  />
                </div>
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={nameIcon}
                    alt="Last Name Icon"
                    className="absolute left-[10px] h-auto w-[30px]"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-[10px] mb-[10px]">
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={usernIcon}
                    alt="Username Icon"
                    className="absolute h-auto w-[27px] left-[12px]"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                  />
                </div>
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={emailIcon}
                    alt="Mail Icon"
                    className="absolute h-auto w-[29px] left-[11px]"
                  />
                  <input
                    type="email"
                    placeholder="School Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-[10px] mb-[10px]">
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={passIcon}
                    alt="Password Icon"
                    className="absolute h-auto w-[21px] left-[15px]"
                  />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword && (
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1.7 text-gray-600"
                    >
                      <img
                        src={showNewPassword ? hideIcon : showIcon}
                        alt={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        className="w-[30px] h-auto"
                      />
                    </button>
                  )}
                </div>
                <div className="relative w-full flex items-center border border-gray-300 rounded-[10px] pl-[40px] bg-white">
                  <img
                    src={confirmIcon}
                    alt="Confirm Password Icon"
                    className="absolute h-auto w-[28px] left-[12px]"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full p-[10px] pl-[11px] text-base border-none outline-none text-black rounded-[10px]"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1.7 text-gray-600"
                    >
                      <img
                        src={showConfirmPassword ? hideIcon : showIcon}
                        alt={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="w-[30px] h-auto"
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center text-center mb-[10px]">
              </div>

              <div className="text-center bg-[#eb6e5b] rounded-[20px] mx-[5px] font-semibold cursor-pointer mb-[10px] shadow-[0_5px_3px_rgba(0,0,0,0.2)] hover:bg-[#d25441]">
                <button
                  type="submit"
                  className="w-full h-[40px] rounded-full"
                  onClick={handleValidation}
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div id="login-link">
              <p className="text-[14px] text-black font-[480] text-center">
                Already have an account?{" "}
                <span
                  className="ml-[0px] md:ml-[5px] font-bold cursor-pointer hover:text-[#112061] hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

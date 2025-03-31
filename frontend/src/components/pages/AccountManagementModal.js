/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import showIcon from "../images/ShowPass.png";
import hideIcon from "../images/BlindPass.png";

const AccountManagementModal = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteAccountVisible, setDeleteAccountVisibile] = useState(false);
  const [isEnterpassVisible, setEnterpassVisible] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    isShown: false,
    type: "",
    message: "",
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const showToastMessage = (type, message) => {
    setShowToast({ isShown: true, type: type, message: message });
  };

  const handleDeleteAccount = () => {
    setDeletePasswordError("");
    setDeleteAccountVisibile(true);
  };

  const handleSubmit = () => {
    // Validate password change inputs
    if (!currentPassword) {
      showToastMessage("error", "Current password cannot be empty.");

      return;
    }
    if (!newPassword) {
      showToastMessage("error", "New password cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastMessage(
        "error",
        "New Password and Confirm Password do not match."
      );
      return;
    }

    setErrorMessage(""); // Clear any previous errors
    setIsModalVisible(true); // Show confirmation modal
  };

  const handleSavePassword = async () => {
    try {
      setLoading(true);

      // Call backend API to update password
      const response = await axiosInstance.put("/users/update-user-pass", {
        currentPassword,
        newPassword,
      });

      if (response.data.successful) {
        showToastMessage("success", "Password updated successfully!");

        // Reset form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsModalVisible(false);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update password";
      showToastMessage("error", errorMsg);

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleDeleteAccountConfirmation = async () => {
    if (!deletePassword) {
      setDeletePasswordError("Password cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setDeletePasswordError("");

      const response = await axiosInstance.delete("/users/delete-acct", {
        data: { password: deletePassword },
      });

      if (response.data.success) {
        showToastMessage(
          "success",
          "Your account has been successfully deleted."
        );
        localStorage.clear();

        setTimeout(() => {
          navigate("/");
        }, 1800);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete account";

      setDeletePasswordError(errorMsg);
      showToastMessage("error", errorMsg);
    } finally {
      setLoading(false);
      setEnterpassVisible(false);
      setDeletePassword("");
    }
  };

  return (
    <div className="flex flex-col items-center mt-[30px] md:mt-[0px]">
      <Toast
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleCloseToast}
      />
      {loading && <Loading message={""} />}

      <div className="flex flex-col items-center h-[530px] w-[800px]">
        {/* Password Change Section */}
        <div className="flex flex-col items-center w-[400px]">
          <h2 className="text-[25px] font-[600]">Account Password</h2>
          <p className="text-center text-[13px] md:text-[14px] font-[500]">
            To enhance your account security, <br />
            please choose a new password.
          </p>

          {/* Current Password Input */}
          <div className="relative mt-[15px]">
            <input
              className="w-[280px] h-[30px] md:w-[300px] md:h-[35px] border border-black bg-white rounded-[10px] pl-[10px] pr-[35px]"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {currentPassword && (
              <img
                src={showPasswords.current ? hideIcon : showIcon}
                alt="Toggle visibility"
                className="absolute top-[50%] right-[10px] transform -translate-y-[50%] cursor-pointer w-[20px] h-[20px]"
                onClick={() => togglePasswordVisibility("current")}
              />
            )}
          </div>

          {/* New Password Input */}
          <div className="relative mt-[10px]">
            <input
              className="w-[280px] h-[30px] md:w-[300px] md:h-[35px] border border-black bg-white rounded-[10px] pl-[10px] pr-[35px]"
              type={showPasswords.new ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPassword && (
              <img
                src={showPasswords.new ? hideIcon : showIcon}
                alt="Toggle visibility"
                className="absolute top-[50%] right-[10px] transform -translate-y-[50%] cursor-pointer w-[20px] h-[20px]"
                onClick={() => togglePasswordVisibility("new")}
              />
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative mt-[10px]">
            <input
              className="w-[280px] h-[30px] md:w-[300px] md:h-[35px] border border-black bg-white rounded-[10px] pl-[10px] pr-[35px]"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && (
              <img
                src={showPasswords.confirm ? hideIcon : showIcon}
                alt="Toggle visibility"
                className="absolute top-[50%] right-[10px] transform -translate-y-[50%] cursor-pointer w-[20px] h-[20px]"
                onClick={() => togglePasswordVisibility("confirm")}
              />
            )}
          </div>

          {/* Change Password Button */}
          <button
            className="text-white bg-[#1D274D] rounded-[10px] px-[35px] py-[5px] mt-[10px]"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>

        {/* Password Change Confirmation Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col items-center text-center bg-[#FFCDA9] rounded-lg w-[300px] md:w-[350px] shadow-lg p-4 md:p-6">
                <p className="text-[22px] md:text-[25px] font-bold w-full">
                  Confirm Changes
                </p>
                <p className="text-[13px] md:text-[14px] font-[500] mx-[30px] md:mx-[0]">
                  Are you sure you want to update your password?
                </p>
                <div className="flex justify-between w-[80%] text-[14px] md:text-base mt-[20px]">
                  <button
                    className="border-2 border-[#1D274D] font-semibold py-[5px] px-[20px] rounded-md text-[#1D274D] mr-2"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1D274D] text-white font-semibold py-[5px] px-[33px] rounded-md"
                    onClick={handleSavePassword}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border border-[#1D274D] w-[45%] md:w-full mt-[50px]"></div>

        {/* Account Deletion Section */}
        <div className="flex flex-col items-center mt-[40px]">
          <h1 className="text-[25px] font-[600]">Account Deletion</h1>
          <p className="text-center text-[13px] md:text-[14px] font-[500]">
            No longer need your account?
          </p>
          <button
            className="mt-[10px] border-2 border-[#ff6b6b] rounded-[10px] px-[35px] py-[5px] hover:bg-[#ff6b6b] hover:text-white"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

        {/* Delete Account Confirmation Modal */}
        {isDeleteAccountVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col items-center text-center bg-[#FFCDA9] rounded-lg w-[300px] md:w-[400px] shadow-lg p-6">
                <p className="text-[22px] md:text-[25px] font-bold w-full">
                  Delete Account
                </p>
                <p className="text-[13px] md:text-[14px] font-[500] mx-[10px] md:mx-[20px]">
                  Are you sure you want to delete your account? This action is
                  permanent.
                </p>
                <div className="flex justify-center space-x-[20px] md:space-x-[40px] w-[80%] text-[14px] md:text-base mt-[20px]">
                  <button
                    className="border-2 border-[#1D274D] font-semibold py-[5px] px-[25px] rounded-md text-[#1D274D]"
                    onClick={() => setDeleteAccountVisibile(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1D274D] text-white font-[500] py-[5px] px-[25px] rounded-md"
                    onClick={() => {
                      setDeleteAccountVisibile(false);
                      setEnterpassVisible(true);
                    }}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Password Confirmation Modal */}
        {isEnterpassVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col items-center text-center bg-[#FFCDA9] rounded-lg w-[400px] shadow-lg p-6">
                <p className="text-[25px] font-bold w-full">Delete Account</p>
                <p className="text-[14px] font-[500]">
                  Please enter your password to confirm
                  <br /> account deletion.
                </p>

                {/* Password Input */}
                <div className="relative mt-[10px] w-[300px]">
                  <input
                    className="w-full h-[35px] border border-black bg-white rounded-[10px] pl-[10px] pr-[35px]"
                    type={showPasswords.delete ? "text" : "password"}
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />

                  {/* Eye Icon */}
                  {deletePassword && (
                    <img
                      src={showPasswords.delete ? hideIcon : showIcon}
                      alt="Toggle visibility"
                      className="absolute top-[50%] right-[10px] transform -translate-y-[50%] cursor-pointer w-[20px] h-[20px]"
                      onClick={() => togglePasswordVisibility("delete")}
                    />
                  )}
                </div>

                <div className="flex justify-between w-[80%] mt-[20px]">
                  <button
                    className="border-2 border-[#1D274D] font-semibold py-[5px] px-[20px] rounded-md text-[#1D274D] mr-2"
                    onClick={() => setEnterpassVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#1D274D] text-white font-[500] py-[5px] px-[25px] rounded-md"
                    onClick={handleDeleteAccountConfirmation}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagementModal;

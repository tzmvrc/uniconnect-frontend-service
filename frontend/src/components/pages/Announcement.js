import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import exit from "../images/exit.png";
import Toast from "./ToastMessage/ToastMessage";
import Loading from "./Loading/Loading";
import ConfirmDeletion from "../Confirmation/confirmation";
import Pagination from "../Pagination";
import { MoreVertical } from "lucide-react";

const Announcement = () => {
  const { announcementId } = useParams();
  const location = useLocation();
  const isViewingSpecificAnnouncement = !!announcementId;

  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const toggleMenu = () => {
    setMenuCollapsed((prevState) => !prevState);
  };

  const [userInfo, setUserInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [singleAnnouncement, setSingleAnnouncement] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const [showToast, setShowToast] = useState({
    isShown: false,
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of announcements per page

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const showToastMessage = (type, message) => {
    setShowToast({ isShown: true, type: type, message: message });
  };

  const getInitials = (firstName, lastName) => {
    let initials = "";
    if (firstName) initials += firstName.charAt(0);
    if (lastName) initials += lastName.charAt(0);
    return initials.toUpperCase() || "U";
  };

  // NEW FUNCTION: Format username to handle deleted users
  const formatUsername = (username) => {
    // Check if the username starts with "deleted_user_"
    const isDeletedUser = username?.startsWith("deleted_user_");
    return isDeletedUser ? username : `@${username}`;
  };

  const truncateText = (text, limit = 150) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const fetchSingleAnnouncement = async (id) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/announcement/${id}?t=${Date.now()}`
      );
      if (response.data.success) {
        setSingleAnnouncement(response.data.announcement);
        setIsViewModalOpen(true);
      } else {
        console.error("Failed to fetch announcement:", response.data);
        showToastMessage("error", "Failed to load announcement");
      }
    } catch (error) {
      console.error("Error fetching single announcement:", error);
      showToastMessage("error", "Failed to load announcement");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/announcement/all?t=${Date.now()}`
      );
      if (response.data.success) {
        const filteredAnnouncements =
          response.data.announcements?.filter(
            (announcement) => !announcement.isDeleted
          ) || [];

        // Sort announcements in descending order based on creation date
        const sortedAnnouncements = filteredAnnouncements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setAnnouncements(sortedAnnouncements);
      } else {
        console.error(
          "Unsuccessful response when fetching announcements:",
          response.data
        );
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user-info");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcementId) {
      fetchSingleAnnouncement(announcementId);
    }
  }, [announcementId, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToastMessage(
        "error",
        "Both title and content are required to post an announcement."
      );
      return;
    }

    if (!userInfo || !userInfo.Username) {
      showToastMessage(
        "error",
        "You must be logged in to post an announcement."
      );
      return;
    }

    try {
      setLoading(true);
      setIsFormVisible(false);
      setLoadingMessage(
        isEditing ? "Updating Announcement" : "Creating Announcement"
      );

      if (isEditing && currentAnnouncementId) {
        // Editing existing announcement
        const response = await axiosInstance.put(
          `/announcement/${currentAnnouncementId}`,
          {
            username: userInfo.Username,
            title: title.trim(),
            description: description.trim(),
          }
        );

        if (response.data) {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          setTitle("");
          setDescription("");
          setIsFormVisible(false);
          setIsEditing(false);
          setCurrentAnnouncementId(null);
          setLoading(false);
          showToastMessage("success", "Announcement updated successfully!");
          if (isViewModalOpen && singleAnnouncement) {
            fetchSingleAnnouncement(singleAnnouncement.id);
          }
          fetchAnnouncements();
        }
      } else {
        // Creating new announcement
        const response = await axiosInstance.post("/announcement/create", {
          username: userInfo.Username,
          title: title.trim(),
          description: description.trim(),
        });

        if (response.data) {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          setTitle("");
          setDescription("");
          setIsFormVisible(false);
          setLoading(false);
          showToastMessage("success", "Announcement posted successfully!");
          fetchAnnouncements();
        }
      }
    } catch (error) {
      console.error("Error with announcement:", error);
      setLoading(false);
      const errorMsg =
        error.response?.data?.message ||
        (isEditing
          ? "Failed to update announcement"
          : "Failed to post announcement");

      showToastMessage("error", errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;

    try {
      setLoading(true);
      setLoadingMessage("Deleting Announcement");
      setIsModalOpen(false);

      const response = await axiosInstance.delete(
        `/announcement/${announcementToDelete}`,
        {
          data: { username: userInfo.Username },
        }
      );

      if (response.data) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        showToastMessage("success", "Announcement deleted successfully!");
        setIsViewModalOpen(false);

        // If we're viewing a specific announcement and it was deleted, navigate back
        if (isViewingSpecificAnnouncement) {
          window.history.pushState({}, "", "/announcement");
        }

        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to delete announcement";
      showToastMessage("error", errorMsg);
    } finally {
      setShowOptionsFor(null);
      setAnnouncementToDelete(null);
    }
  };

  const handleEdit = (announcement) => {
    setTitle(announcement.title);
    setDescription(announcement.description);
    setIsEditing(true);
    setCurrentAnnouncementId(announcement.id);
    setIsFormVisible(true);
    setShowOptionsFor(null);

    // If in view modal, close it when editing
    if (isViewModalOpen && !isViewingSpecificAnnouncement) {
      setIsViewModalOpen(false);
    }
  };

  const toggleOptions = (announcementId) => {
    if (showOptionsFor === announcementId) {
      setShowOptionsFor(null);
    } else {
      setShowOptionsFor(announcementId);
    }
  };

  // Trigger confirmation modal for deletion
  const initiateDelete = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setIsModalOpen(true);
    setShowOptionsFor(null);
  };

  const handleViewAnnouncement = (announcement) => {
    if (!isViewingSpecificAnnouncement) {
      setSingleAnnouncement(announcement);
      setIsViewModalOpen(true);

      // Update URL without full page reload
      window.history.pushState({}, "", `/announcement/${announcement.id}`);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSingleAnnouncement(null);

    // Always return to the base announcement URL when closing the modal
    window.history.pushState({}, "", "/announcement");
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Get current announcements for pagination
  const indexOfLastAnnouncement = currentPage * itemsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - itemsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const userInitials = userInfo
    ? getInitials(userInfo.FirstName, userInfo.LastName)
    : "";
  const username = userInfo ? `@${userInfo.Username}` : "";
  const fullName = userInfo
    ? `${userInfo.FirstName || ""} ${userInfo.LastName || ""}`.trim()
    : "";

  return (
    <div
      className="flex min-h-screen text-[#141E46]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <Leaderboards />
      {loading && <Loading message={loadingMessage} />}

      <div
        className={`flex flex-col w-full md:mr-[330px] mt-[70px] md:items-center ${
          menuCollapsed ? "md:ml-[150px]" : "md:ml-[350px]"
        }`}
      >
        <Toast
          isShown={showToast.isShown}
          type={showToast.type}
          message={showToast.message}
          onClose={handleCloseToast}
        />
        {/* Current User Info and Post Creator */}
        <div className="flex flex-col justify-center mt-[3px] md:mt-[30px] w-full mr-4 md:mr-4  md:ml-4 md:w-[700px] h-[80px] md:border border-gray-500 rounded-[5px]">
          <div className="flex mx-[20px] md:mx-[20px]">
            <div className="w-[38px] h-[38px] md:w-11 md:h-11 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border border-black aspect-square">
              {userInfo?.profile_picture ? (
                // Show Profile Picture if available
                <img
                  src={userInfo.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                // Show Initials if no Profile Picture
                getInitials(fullName)
              )}
            </div>
            <button
              className="border border-gray-500 p-2 w-full rounded-md text-left text-[14px] md:text-base hover:bg-gray-300"
              onClick={() => {
                setIsFormVisible(true);
                setIsEditing(false);
                setCurrentAnnouncementId(null);
                setTitle("");
                setDescription("");
              }}
            >
              What's on your mind?
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-[0px] md:mt-[10px] w-full md:w-[700px] min-h-fit px-4 md:p-0">
          {isLoading ? (
            <div className="w-full text-center py-4">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="w-full text-center py-4">
              No announcements found
            </div>
          ) : (
            currentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="flex w-full">
                <div className="flex flex-col justify-center w-full mt-[15px] mb-[2px] border border-black p-[15px] rounded-lg relative">
                  <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black">
                        {announcement.created_by?.profilePicture ? (
                          // Show Profile Picture if available
                          <img
                            src={announcement.created_by.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          // Show Initials if no Profile Picture
                          announcement.created_by?.username
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                      <span className="text-[14px] font-medium">
                        {/* MODIFIED: Check if username starts with "deleted_user_" */}
                        {formatUsername(announcement.created_by?.username)}
                      </span>
                    </div>

                    {/* Ellipsis button for user's own announcements */}
                    {userInfo &&
                      userInfo.Username === announcement.created_by.username && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleOptions(announcement.id);
                            }}
                            className="text-xl font-bold p-2 hover:bg-gray-200 rounded-full"
                          >
                            <MoreVertical size={24} />
                          </button>

                          {showOptionsFor === announcement.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-200 border rounded-md shadow-md">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEdit(announcement);
                                }}
                                className="block w-full px-4 py-2 text-left font-[500] hover:bg-[#141E46] hover:text-white rounded-md"
                              >
                                Edit
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  initiateDelete(announcement.id);
                                }}
                                className="block w-full px-4 py-2 text-left text-red-600 font-[500] hover:bg-[#da4444] hover:text-white rounded-md"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>

                  <div
                    onClick={() => handleViewAnnouncement(announcement)}
                    className="w-full cursor-pointer"
                  >
                    <h1 className="text-[25px] font-bold">
                      {announcement.title}
                    </h1>
                    <p className="text-[13px] font-[500] mb-[10px]">
                      Posted on{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[14px] font-[450]">
                      {truncateText(announcement.description)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination component */}
          {!isLoading && announcements.length > 0 && (
            <div className="w-full mt-6 mb-8">
              <Pagination
                totalItems={announcements.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Modal for Creating/Editing Announcements */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-3 md:px-0">
          <div className="flex flex-col bg-[#FFCDA9] rounded-lg w-full md:w-[550px] shadow-lg">
            <div className="flex px-[15px] pb-[10px] pt-[12px]">
              <h2 className="text-[17px] md:text-xl font-bold w-full">
                {isEditing
                  ? "Edit your Announcement"
                  : "Create your Announcement"}
              </h2>
              <img
                src={exit}
                alt="exit icon"
                className="h-auto w-[25px] md:w-[30px] cursor-pointer"
                onClick={() => {
                  setIsFormVisible(false);
                  setTitle("");
                  setDescription("");
                  setIsEditing(false);
                  setCurrentAnnouncementId(null);
                }}
              />
            </div>
            <div className="w-full border border-gray-600"></div>

            <div className="px-[15px] pb-[15px] pt-[15px]">
              <div className="flex justify-center items-center mb-[15px]">
                <div className="flex items-center w-full">
                  <div className="w-[38px] h-[38px] md:w-11 md:h-11 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black">
                    {userInfo?.profile_picture ? (
                      // Show Profile Picture if available
                      <img
                        src={userInfo.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      // Show Initials if no Profile Picture
                      userInitials
                    )}
                  </div>
                  <span className="text-[14px] md:text-[16px] font-medium">
                    {username}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full p-2 border bg-[#FFEBDD] border-black rounded-md mb-[10px] h-[33px] placeholder-gray-700 text-[14px]"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write something..."
                  className="w-full h-[150px] p-2 border bg-[#FFEBDD] border-black rounded-md mb-2 md:mb-4 placeholder-gray-700 text-[14px]"
                ></textarea>
                <div className="flex justify-center space-x-4">
                  <button
                    type="submit"
                    className="text-white w-full font-bold bg-[#231c4b] py-1 md:py-2 rounded-[5px] hover:bg-[#2b2670]"
                  >
                    {isEditing ? "Update" : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Announcement Modal */}
      {isViewModalOpen && singleAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-3 md:px-0">
          <div className="flex flex-col bg-[#FFCDA9] rounded-lg w-full md:w-[700px] shadow-lg max-h-[80vh] overflow-auto">
            <div className="flex px-[15px] pb-[10px] pt-[12px] items-center justify-between sticky top-0 bg-[#FFCDA9] z-10">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 mr-[10px] border-[1px] border-black">
                  {singleAnnouncement.created_by?.profilePicture ? (
                    // Show Profile Picture if available
                    <img
                      src={singleAnnouncement.created_by?.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    // Show Initials if no Profile Picture
                    singleAnnouncement.created_by?.username
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <span className="text-[14px] font-medium">
                  {/* MODIFIED: Check if username starts with "deleted_user_" */}
                  {formatUsername(singleAnnouncement.created_by?.username)}
                </span>
              </div>

              <div className="flex items-center">
                {userInfo &&
                  userInfo.Username === singleAnnouncement.created_by.username && (
                    <div className="flex mr-4">
                      <button
                        onClick={() => handleEdit(singleAnnouncement)}
                        className="border border-gray-600 mr-3 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => initiateDelete(singleAnnouncement.id)}
                        className="border border-red-600 px-3 py-1 rounded-md hover:bg-red-100 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                <img
                  src={exit}
                  alt="exit icon"
                  className="h-auto w-[25px] md:w-[30px] cursor-pointer"
                  onClick={closeViewModal}
                />
              </div>
            </div>
            <div className="w-full border border-gray-600"></div>

            <div className="px-[15px] pb-[20px] pt-[15px]">
              <h1 className="text-[25px] md:text-[30px] font-bold mb-2">
                {singleAnnouncement.title}
              </h1>
              <p className="text-[13px] font-[500] mb-[15px]">
                Posted on{" "}
                {new Date(singleAnnouncement.createdAt).toLocaleDateString()}
              </p>
              <p className="text-[14px] md:text-[16px] font-[450] whitespace-pre-wrap">
                {singleAnnouncement.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmDeletion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={"Delete Announcement?"}
        message="Once deleted, this announcement will be permanently removed and cannot be recovered."
      />
    </div>
  );
};

export default Announcement;
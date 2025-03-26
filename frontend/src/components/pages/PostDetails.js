import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import back from "../images/back Icon.png";
import menu from "../images/menu.png";
import exit from "../images/exit.png";
import { useNavigate } from "react-router-dom";

const PostDetails = () => {
  // Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteFeedbackMessage, setDeleteFeedbackMessage] = useState("");

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Hackaton in Makati: Github Challenge 2024",
      postedDate: "10/28/2024",
      description:
        "Date: December 2-3, 2024  <br/>Time: 8:00 AM - 5:00 PM <br/>Location: [Innovation Lab], Makati City <br/><br/>Collaborate, create, and contribute!<br/> This two-day hackathon brings together developers passionate about open-source projects. Team up, tackle real-world challenges, and make meaningful contributions to open-source solutions. With experienced mentors on-site, it’s a fantastic opportunity to learn, share, and grow. Prizes will be awarded for the most innovative solutions!",
    },
    {
      id: 2,
      title: "Creative Editing Masterclass: Adobe Premiere & After Effects",
      postedDate: "11/18/2024",
      description:
        "Date: October 30, 2024 <br/>Time: 10:00 AM - 5:00 PM <br/>Location: [Creative Studio], Makati City  <br/><br/>Unleash your editing skills with Adobe Premiere and After Effects! This full-day masterclass is designed for aspiring and professional video editors who want to take their editing skills to the next level. Learn advanced techniques, from color grading to motion graphics, and create stunning visual content that stands out. Bring your creativity and get ready for hands-on learning from industry professionals.",
    },
    {
      id: 3,
      title: "Valorant Showdown: Manila Esports Tournament",
      postedDate: "10/18/2024",
      description:
        "Date: November 22, 2024 <br/>Time: 11:00 AM - 7:00 PM <br/>Location: [Manila Esports Arena], Manila <br/><br/>Ready to prove you're Manila's top Valorant team? Join the fierce competition in the Manila Valorant Showdown! Teams will face off in tactical battles, with the winners taking home epic prizes and citywide bragging rights. <br/><br/>Tournament Mechanics:<br/>Team Size: 5 players per teamFormat: Best of 3 matches, Single EliminationMap Pool: Ascent, Bind, Haven, Split, Icebox, LotusEntry Fee: PHP 1,000 per teamPrize Pool: PHP 50,000 for the champions, PHP 20,000 for 2nd place<br/><br/>Team Rules:<br/>Teams must have a full roster of 5 players.Players must be 16 years or older.Substitutes are allowed but must be registered before the event starts.All participants must follow the tournament’s code of conduct, including fair play and respect for all players.<br/><br/>Assemble your squad and compete for the title of Valorant champions in this high-energy tournament!",
    },
    {
      id: 4,
      title: "Seminar: The Future of Artificial Intelligence",
      postedDate: "10/10/2024",
      description:
        "Join this seminar to explore the latest advancements in Artificial Intelligence, machine learning, and their real-world applications. Whether you're an IT professional or a curious learner, this session will provide insights into how AI is shaping the future.",
    },
    {
      id: 5,
      title: "Demo own announcement update function",
      postedDate: "10/10/2024",
      description:
        "Trial for view only since there is nothing to fetch from the database. <br/> Updated ui for update and delete announcement.",
    },
  ]);

  // Find the matching post based on the id
  const post = announcements.find(
    (announcement) => announcement.id === parseInt(id)
  );

  // State for original values
  const [originalTitle, setOriginalTitle] = useState(post?.title || "");
  const [originalDescription, setOriginalDescription] = useState(
    post?.description || ""
  );

  // Derived state
  const isModified =
    title.trim() !== originalTitle.trim() ||
    description.trim() !== originalDescription.trim();

  // Handlers
  const toggleMenu = () => {
    setMenuCollapsed((prevState) => !prevState);
  };

  const handleOptionsToggle = () => {
    setShowOptions((prevState) => !prevState);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
    setShowOptions(false);
  };

  const confirmDelete = () => {
    setDeleteFeedbackMessage("Announcement Deleted");
    setTimeout(() => {
      setDeleteFeedbackMessage("");
      setIsDeleteModalVisible(false);
      navigate("/announcement");
    }, 1800);
  };

  const handleEdit = () => {
    if (post) {
      setOriginalTitle(post.title);
      setOriginalDescription(post.description);
      setTitle(post.title);
      setDescription(post.description);
      setIsEditModalVisible(true);
      setShowOptions(false);
    }
  };

  const handleUpdate = () => {
    setSuccessMessage("");
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Both title and description are required.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setErrorMessage(""); // Clear error if validation passes

    setAnnouncements((prevState) =>
      prevState.map((announcement) =>
        announcement.id === post.id
          ? { ...announcement, title, description }
          : announcement
      )
    );
    setIsEditModalVisible(false);
    setSuccessMessage("Announcement updated successfully!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <div
      className="flex flex-col min-h-screen text-[#141E46]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />
      <div className="flex min-h-screen">
        <Sidebar menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <Leaderboards />
        <div
          className="flex flex-col w-full ml-[0px] mr-[375px] mt-[120px]"
          style={{ marginLeft: menuCollapsed ? "140px" : "300px" }}
        >
          {/* Success Message */}
          {successMessage && (
            <div className="w-full flex justify-center mt-[15px]">
              <div className="flex justify-center w-[700px] py-[5px] bg-[#b9e49d] text-black font-[500] text-[14px] rounded-md shadow-md transform transition-all duration-500 ease-out opacity-0 translate-y-[-20px] animate-slide-fade">
                {successMessage}
              </div>
            </div>
          )}

          <div className="flex justify-center items-center h-[90%] ">
            <div className="h-[90%] mt-[90px]">
              <img
                src={back}
                alt="back icon"
                className="h-auto w-[25px] cursor-pointer mr-[10px]"
                onClick={() => navigate("/announcement")}
              />
            </div>
            <div className="flex flex-col mt-[30px] w-[700px] min-h-[100%] border border-black rounded-[5px]">
              <div className="flex flex-col px-[20px] pt-[20px]">
                <div className="flex justify-between items-start">
                  <h1 className="text-[25px] font-bold">{post.title}</h1>

                  {/* Show 3 dots button only if the post id matches */}
                  {post.id === 5 && (
                    <div className="relative">
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-300 focus:outline-none"
                        onClick={handleOptionsToggle}
                      >
                        <img
                          src={menu} // Use the image here
                          alt="Options"
                          className="w-5 h-5"
                        />
                      </button>

                      {showOptions && (
                        <div className="absolute top-[35px] right-4 w-[190px] bg-[#D9D9D9] border border-black shadow-lg rounded-md">
                          <button
                            onClick={handleEdit}
                            className="block w-full px-4 py-2 text-left text-sm text-[#141E46] font-[500] hover:bg-[#E0AFA8]"
                          >
                            Edit Announcement
                          </button>
                          <button
                            onClick={handleDelete}
                            className="block w-full px-4 py-2 text-left text-sm text-[#141E46] font-[500] hover:bg-[#E0AFA8]"
                          >
                            Delete Announcement
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[13px] font-[500] mb-[10px]">
                  {post.postedDate}
                </p>
                <p
                  className="text-[14px] font-[450]"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#FFCDA9] rounded-lg w-[550px] shadow-lg">
            <div className="flex px-[15px] pt-[12px] pb-[10px]">
              <h2 className="text-xl font-bold w-full">Update Announcement</h2>
              <img
                src={exit}
                alt="exit icon"
                className="w-[30px] cursor-pointer"
                onClick={() => setIsEditModalVisible(false)} // Close modal
              />
            </div>

            <div className="w-full border border-gray-600 mb-[15px]"></div>

            <div className="px-[15px] pb-[15px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent page reload
                  handleUpdate(); // Update the post
                }}
              >
                {/* Error Message */}
                {errorMessage && (
                  <div className="text-red-500 text-sm  ml-[5px] mb-[5px]">
                    {errorMessage}
                  </div>
                )}

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} // Update title state
                  placeholder="Title"
                  className="w-full p-2  text-[20px] placeholder:text-[15px] placeholder:font-[470] font-bold mb-[15px] bg-[#FFEBDD] border border-black rounded-md"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} // Update description state
                  placeholder="Description"
                  className="w-full h-[220px] p-2 text-[14px] bg-[#FFEBDD] border border-black rounded-md mb-[10px]"
                ></textarea>
                <button
                  type="submit"
                  disabled={!isModified} // Disable button if no changes
                  className={`py-2 w-full rounded-md ${
                    isModified
                      ? "bg-[#1D274D] text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* Feedback message at the top */}
          {deleteFeedbackMessage && (
            <div className="absolute top-5 w-full flex justify-center">
              <div className="flex justify-center w-[700px] py-[5px] bg-[#b9e49d] text-black font-[500] text-[14px] rounded-md shadow-md animate-slide-fade">
                {deleteFeedbackMessage}
              </div>
            </div>
          )}

          {/* Centered Confirmation Modal */}
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col items-center text-center bg-[#FFCDA9] rounded-lg w-[400px] shadow-lg p-6">
              <h2 className="text-[25px] font-bold w-full">
                Delete Announcement?
              </h2>
              <p className="text-[14px] font-[500]">
                Are you sure you want to delete
                <br />
                this announcement?
              </p>
              <div className="flex justify-between mt-[20px] w-[80%]">
                <button
                  onClick={() => setIsDeleteModalVisible(false)}
                  className="border-2 border-[#1D274D] font-[600] py-2 px-[25px] rounded-md mr-2 text-[#1D274D]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-[#1D274D] text-white font-[450] py-2 px-[30px] rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;

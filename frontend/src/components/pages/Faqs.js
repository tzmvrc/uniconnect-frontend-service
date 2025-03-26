/** @format */

import React, { useState } from "react";
import logo from "../images/NLogo.png";
import forum from "../images/forumIcon.png";
import points from "../images/badgerank.png";
import ai from "../images/ai.png";
import mailIcon from "../images/mail icon.png";
import socialsIcon from "../images/socials icon.png";
import facebook from "../images/facebook.png";
import github from "../images/github.png";
import twitter from "../images/twitter.png";
import instagram from "../images/instagram.png";
import searchBar from "../images/Search bar.png";
import forum1 from "../images/forum1.png";
import forum2 from "../images/forum2.png";
import response from "../images/response help.png";
import manage from "../images/manage forum.png";
import leaderboard from "../images/Leaderboards.png";
import aiworks from "../images/ai works.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Faqs = () => {
  // State to track which question is currently expanded
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    // Reset scroll position to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("public");

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const navigate = useNavigate();

  // Sample FAQ data
  const faqData = [
    {
      question: "What should I do if I forget my password?",
      answer:
        "If you forget your password, click on the 'Forgot Password?' link on the login page. Enter your registered email address, and we will send you instructions to reset your password.",
    },
    {
      question: "How can I change my password?",
      answer:
        "To change your password, log into your account and navigate to the 'Account Settings' section. From there, you can update your password.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button on the homepage. Fill in the required details, including your email address and password, and follow the prompts to complete your registration.",
    },
    {
      question: "What if I don’t receive the password reset email?",
      answer:
        "If you don’t receive the password reset email, please check your spam or junk folder. If you still don’t see it, ensure you entered the correct email address and try again.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account by accessing the 'Account Settings' section and selecting the 'Delete Account' option. Follow the prompts to confirm the deletion. Please contact our support team through the 'Contact Us' page if you need assistance.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can contact customer support by visiting the 'Contact Us' page and filling out the contact form. You can also reach us at support@example.com.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take your privacy seriously. We implement industry-standard security measures to protect your personal information. Please refer to our Privacy Policy for more details.",
    },
    {
      question: "Can I update my profile information?",
      answer:
        "Yes, you can update your profile information by logging into your account and navigating to the 'Profile' section in the account settings.",
    },
    // Add more questions here
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className="bg-cover bg-no-repeat bg-center min-h-screen p-5 overflow-hidden animate-slide-fade"
      style={{
        fontFamily: "'Inter', sans-serif", // Set font family
        backgroundColor: "#1A244A",
        backgroundSize: "cover",
      }}
    >
      <div class="flex justify-center items-center flex-col text-white">
        <img
          class="h-auto w-[290px] md:w-[400px] mb-[20px] md:mb-[40px] cursor-pointer"
          src={logo}
          alt="logo"
          onClick={() => navigate("/")}
        />
        <h2 class="text-[25px] md:text-[40px] font-semibold md:font-bold mb-[20px] md:mb-[0px]">
          How can we Help?
        </h2>
      </div>

      {/* 1st div button */}
      <div className="flex gap-[0px] md:gap-[10px] mb-[0px] md:mb-[20px] justify-center cursor-pointer text-white">
        <div className="flex justify-center md:justify-around md:w-[800px] h-[160px] space-x-[12px]">
          {/* Public Tab */}
          <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
            <div
              className={`tab ${
                activeTab === "public" ? "bg-[#0b112b]" : "bg-[#bbb]"
              } p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
              onClick={() => handleTabClick("public")}
            >
              {activeTab !== "public" ? (
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
                <p className="text-white text-[11px] md:text-[13px] font-[400] leading-[12px] md:leading-[17px]">
                  Explore questions, share answers, and earn points to rise up
                  the leaderboard!
                </p>
              )}
            </div>
          </div>

          {/* Private Tab */}
          <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
            <div
              className={`tab ${
                activeTab === "private" ? "bg-[#0b112b]" : "bg-[#bbb]"
              } p-[7px] md:p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
              onClick={() => handleTabClick("private")}
            >
              {activeTab !== "private" ? (
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
                <p className="text-white text-[11px] md:text-[13px] font-[400] leading-[12px] md:leading-[17px]">
                  Earn points through upvotes on your responses. Collect enough
                  to unlock a badge.
                </p>
              )}
            </div>
          </div>

          {/* Other Tab */}
          <div className="bg-[#ff6b6b] rounded-[5px] h-[100px] w-[110px] md:h-[155px] md:w-[165px] border-2 border-[#ff6b6b]">
            <div
              className={`tab ${
                activeTab === "other" ? "bg-[#0b112b]" : "bg-[#bbb]"
              } p-[10px] rounded-[5px] cursor-pointer w-[105px] h-[95px] md:h-[150px] md:w-[162px] border-2 border-black`}
              onClick={() => handleTabClick("other")}
            >
              {activeTab !== "other" ? (
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
                <p className="text-white text-[11px] md:text-[13px] font-[400] leading-[12px] md:leading-[17px]">
                  Simply type your query, and the AI will fetch useful resources
                  for you!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      {/* 1st option */}
      <div className="tab-content text-white text-[13px] md:text-base mb-[50px]">
        {activeTab === "public" && (
          <div class="flex flex-col items-center text-center">
            <div className="text-left">
              <h2 class="font-bold mb-[8px] text-[#ff6b6b]">Instructions:</h2>
              <ul class="list-disc pl-5">
                <li>
                  To browse the forum, simply scroll through the list of
                  questions posted by other users.
                </li>
                <li>
                  Use the search bar at the top to quickly find topics or
                  specific questions.
                </li>
                <li>
                  Click on any question to view its details and responses.
                </li>
                <li>
                  To contribute, click "Reply" to share your answer or add to
                  the discussion.
                </li>
              </ul>
              <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be sure to read the full question before responding, and aim
                  to provide clear, helpful answers.
                </li>
                <li>
                  Upvote responses you find useful to help others and reward
                  quality contributions.
                </li>
                <li>
                  Remember, thoughtful answers can earn you points and boost
                  your ranking!
                </li>
              </ul>
              <div class=" flex justify-center mt-[70px]">
                <img
                  src={searchBar}
                  alt="search bar"
                  class="h-auto w-[700px]"
                />
              </div>
              <h1 class="mt-[20px] font-bold mb-[8px] text-[#ff6b6b]">
                Search Bar Help
              </h1>
              <p>
                Use the search bar to quickly find questions or topics in the
                forum. Just type a keyword or phrase,
                <br />
                and relevant results will appear instantly. You can also refine
                your search by using specific tags or
                <br />
                categories.
              </p>
              <h2 class="font-bold mb-[8px] mt-[10px]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be specific with your keywords to get more accurate results.
                </li>
                <li>Use multiple keywords to narrow down your search.</li>
                <li>Check the most upvoted responses for helpful answers!</li>
              </ul>
            </div>
            <div class=" flex flex-col space-y-[20px] md:space-y-[0px] md:flex-row justify-center items-center md:justify-around mt-[70px] w-full md:w-[1000px]">
              <img
                src={forum1}
                alt="search bar"
                class="h-auto w-[300px] md:w-[450px]"
              />
              <img
                src={forum2}
                alt="search bar"
                class="h-auto w-[300px] md:w-[450px]"
              />
            </div>
            <div class=" flex justify-around mt-[50px] w-[1000px]">
              <img
                src={response}
                alt="search bar"
                class="h-auto w-[380px] md:w-[500px]"
              />
            </div>

            <div class="text-left">
              <h1 class="mt-[20px] font-bold mb-[8px] text-[#ff6b6b]">
                Responses Help
              </h1>
              <p>
                To respond to a question, simply click "Reply" and type your
                answer. Your response will be visible
                <br />
                to the entire community.
              </p>
              <h2 class="font-bold mb-[8px] mt-[10px]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be specific with your keywords to get more accurate results.
                </li>
                <li>Keep your responses relevant to the question.</li>
                <li>
                  Helpful answers are more likely to get upvoted, boosting your
                  points and rank!
                </li>
              </ul>
            </div>
            <div class=" flex justify-around mt-[70px] w-[1000px]">
              <img
                src={manage}
                alt="search bar"
                class="h-auto w-[380px] md:w-[500px]"
              />
            </div>
            <div class="text-left">
              <h1 class="mt-[20px] font-bold mb-[8px] text-[#ff6b6b]">
                Manage Your Forum
              </h1>
              <p>As the owner of a forum post, you have the ability to:</p>
              <ul class="list-disc pl-5">
                <li>
                  Edit: Update your question or details at any time by clicking
                  the "Edit" button.
                </li>
                <li>
                  Close: Close your forum if you no longer need responses. This
                  will prevent further replies.
                </li>
                <li>
                  Delete: Permanently remove your forum by selecting the
                  "Delete" option.
                </li>
              </ul>
              <h2 class="font-bold mb-[8px] mt-[10px]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Use the edit function to clarify or update your post as
                  needed.
                </li>
                <li>
                  Close your forum once you've received sufficient answers to
                  avoid unnecessary responses.
                </li>
                <li>
                  Be cautious when deleting, as this action cannot be undone.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 2nd option */}
        {activeTab === "private" && (
          <div className="flex flex-col items-center text-center">
            <div className="text-left">
              <h2 class="font-bold mb-[8px] text-[#ff6b6b]">Instructions:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Points are earned based on the upvotes and downvotes your
                  responses receive.
                </li>
                <li>
                  Your points are calculated as:{" "}
                  <span className="font-bold">
                    (Total Upvotes - Downvotes) ÷ Number of Responses.
                  </span>
                </li>
                <li>
                  To earn a badge, you need to collect at least 50 points.
                </li>
              </ul>
              <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be sure to read the full question before responding, and aim
                  to provide clear, helpful answers.
                </li>
                <li>
                  Upvote responses you find useful to help others and reward
                  quality contributions.
                </li>
                <li>
                  Remember, thoughtful answers can earn you points and boost
                  your ranking!
                </li>
              </ul>
            </div>
            <div class=" flex justify-around mt-[50px] w-[1000px]">
              <img
                src={leaderboard}
                alt="search bar"
                class="h-auto w-[380px] md:w-[800px]"
              />
            </div>
            <div className="text-left mt-[40px]">
              <h2 class="font-bold mb-[8px] text-[#ff6b6b]">Leaderboard</h2>
              <p>
                The leaderboard showcases the top contributors in the forum,
                highlighting users based on their
                <br />
                points and badges. Here’s what you need to know:
              </p>
              <ul class="list-disc pl-5 mt-[10px]">
                <li>
                  <span class="font-bold text-[#ff6b6b]">User Rankings:</span>{" "}
                  View the rankings of all users based on the points they’ve
                  earned from upvotes
                  <br />
                  on their responses. Higher points indicate greater
                  contributions to the community.
                </li>
                <li>
                  <span class="font-bold text-[#ff6b6b]">School Rankings:</span>{" "}
                  The leaderboard also displays rankings by school, allowing you
                  to see how
                  <br />
                  your institution compares to others. School contributions are
                  aggregated to show collective
                  <br />
                  achievements.
                </li>
                <li>
                  <span class="font-bold text-[#ff6b6b]">
                    (Total Upvotes - Total Downvotes) ÷ Total Responses of Users
                    in That School. This reflects
                    <br />
                    the collective contributions of all users from each school.
                  </span>
                </li>
                <li>
                  <span class="font-bold text-[#ff6b6b]">Stay Updated:</span>{" "}
                  Regularly check the leaderboard to track your progress and see
                  how you rank
                  <br />
                  against others in your school and the overall community.
                </li>
              </ul>
              <h2 class="font-bold mb-[8px] mt-[40px]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Aim for quality contributions to climb the leaderboard and
                  earn recognition.
                </li>
                <li>
                  Engage with other users to build a reputation and gain more
                  upvotes.
                </li>
                <li>
                  Celebrate your achievements and strive to improve your rank!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 3rd option */}
        {activeTab === "other" && (
          <div className="flex flex-col items-center text-center">
            <div className="text-left">
              <h2 class="font-bold mb-[8px] text-[#ff6b6b]">Instructions:</h2>
              <ul class="list-disc pl-5">
                <li>
                  The AI in the forum helps you find relevant resources based on
                  your questions or commands.
                </li>
                <li>
                  Simply type your question or command, and the AI will return
                  links and sources that match your
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
              <h2 class="font-bold mb-[8px] mt-[40px] text-[#ff6b6b]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be as specific as possible with your questions for the AI to
                  return the most useful results.
                </li>
                <li>
                  The AI is here to assist, but always double-check sources and
                  use your judgment when
                  <br /> reviewing links.
                </li>
                <li>
                  Explore the suggestions the AI gives you—they might lead to
                  new insights or helpful resources!
                </li>
              </ul>
            </div>
            <div class=" flex justify-around mt-[50px] w-[1000px]">
              <img
                src={aiworks}
                alt="search bar"
                class="h-auto w-[380px] md:w-[500px]"
              />
            </div>
            <div className="text-left mt-[40px]">
              <h2 class="font-bold mb-[8px] text-[#ff6b6b]">How AI Works</h2>
              <p>
                Our AI enhances your experience in the forum by providing
                relevant resources based on your
                <br />
                questions or commands. Here’s how it functions:
              </p>
              <ul class="list-disc pl-5 mt-[10px]">
                <li>
                  Instant Resource Retrieval: When you type a question or
                  command, the AI searches through the
                  <br /> forum and the web to find the most relevant links and
                  information to help you.
                </li>
                <li>
                  User Commands: You can interact with the AI using specific
                  commands. For example, using
                  <br />
                  <span class="font-bold text-[#ff6b6b]">
                    @uc search [tag1] [tag2]
                  </span>{" "}
                  allows the AI to automatically gather the forum title and
                  search the
                  <br />
                  internet for related links across different websites.
                </li>
                <li>
                  Tailored Responses: The AI analyzes your queries and user
                  interactions to improve its ability to
                  <br /> provide accurate and useful responses tailored to your
                  needs.
                </li>
              </ul>
              <h2 class="font-bold mb-[8px] mt-[40px]">Tips:</h2>
              <ul class="list-disc pl-5">
                <li>
                  Be as specific as possible with your questions to get the best
                  results.
                </li>
                <li>
                  Explore the links provided by the AI for additional insights
                  and resources.
                </li>
                <li>
                  Use the AI as a tool to complement your research and learning
                  in the forum!
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Questions and Answers */}
      <div class="bg-[#0b112b] text-center p-[20px] rounded-[10px] max-w-[850px] mx-auto mt-[100px]">
        <h1 class="text-white text-[25px] md:text-[45px] font-bold">
          Questions & Answers
        </h1>
        <p class="text-white text-[13px] md:text-[14px] font-[300]">
          If you have any other questions - please get in touch
        </p>
        <div class="mt-[30px] md:ml-[90px] md:mr-[90px]">
          {faqData.map((faq, index) => (
            <div
              key={index}
              class="bg-[#1a1e33] my-[10px] p-[12px] rounded-[10px] cursor-pointer"
            >
              <div
                class="flex justify-between items-center text-white text-[14px] md:text-[15px] text-left font-medium"
                onClick={() => toggleAnswer(index)}
              >
                <h3>{faq.question}</h3>
                <span class="text-[18px] text-[#ff6b6b]">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-[12px] md:mt-[14px]  text-[#bbb] text-[13px] md:text-[14px] leading-[1.5] text-left mr-[17px]">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-[35px] text-[14px] mb-[20px] font-light text-white">
          <p>
            <span class="font-[500]">Still have questions?</span>
            <br /> Get in touch with our team
          </p>
        </div>
      </div>

      {/* Contact Us */}
      <div className="mt-[120px] mb-[80px] text-white">
        <div className="text-center mb-[50px]">
          <h1 class="text-[30px] md:text-[45px] font-bold">Contact Us</h1>
          <p class="text-[14px] font-[300] mx-[50px] md:mx-[0px]">
            We're here to help! Whether you have questions, feedback, or need
            assistance, our
            <br />
            team is ready to support you. Here's how you can get in touch with
            us:
          </p>
        </div>

        <div class="flex flex-col md:flex-row justify-center items-center md:items-start">
          <div className="bg-[#0b112b] rounded-[20px] flex flex-col text-center items-center py-[20px] w-[330px] md:w-[430px] mr-[0px] md:mr-[50px]">
            <img
              src={mailIcon}
              alt="mail Icon"
              class="h-auto w-[50px] md:w-[70px]"
            />
            <h1 class="text-[20px] md:text-[30px] font-[600]">Email</h1>
            <p class="text-[14px] font-[300] mx-[50px] md:mx-[0px]">
              Feel free to reach out to us with any general questions or <br />
              request. We'll do our best to get back to you.
              <br />
              You can contact us at
            </p>
            <a href="https://mail.google.com/" target="_blank" rel="noreferrer">
              <p className="underline font-[500] mt-[29px] mb-[19px] text-[14px] cursor-pointer hover:text-[#ff6b6b]">
                uniconnectph@gmail.com
              </p>
            </a>
          </div>

          <div className="bg-[#0b112b] rounded-[20px] flex flex-col text-center items-center py-[20px] ml-[0px] md:ml-[50px] mt-[25px] md:mt-[0px] w-[330px] md:w-[430px]">
            <img
              src={socialsIcon}
              alt="mail Icon"
              class="h-auto w-[50px] md:w-[70px]"
            />
            <h1 class="text-[20px] md:text-[30px] font-[600]">Socials</h1>
            <p class="text-[14px] mb-[30px] font-[300] mx-[50px] md:mx-[0px]">
              Stay connected with us on our Socials! Follow us for the <br />
              latest updates, announcements, and tips. You can also reach <br />
              out through direct messages if you have any questions.
            </p>
            <div className="flex h-auto mb-[15px] mr-[10px]">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="facebook social"
                  class="cursor-pointer items-center pl-[13px]"
                />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={github}
                  alt="github social"
                  class="cursor-pointer items-center pl-[13px]"
                />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={twitter}
                  alt="twitter social"
                  class="cursor-pointer items-center pl-[13px]"
                />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={instagram}
                  alt="instagram social"
                  class="cursor-pointer items-center pl-[13px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-[20px] mb-[0px] md:mb-[10px]">
        <div className="w-full md:w-[1300px] h-[1px] md:h-[2px] bg-[#6d6d6d] mx-auto"></div>
        <p className="text-[#6d6d6d] mt-[10px] text-[12px] font-[400] md:font-[500]">
          © Copyright 2022, All Rights Reserved by uniconnect group
        </p>
      </div>
    </div>
  );
};

export default Faqs;

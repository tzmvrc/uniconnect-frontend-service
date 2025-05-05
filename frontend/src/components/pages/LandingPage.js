/** @format */

import logo from "../images/NLogo.png";
import bg from "../images/longbg.png";
import image1 from "../images/image1.png";
import feature1 from "../images/community.png";
import feature2 from "../images/badgerank.png";
import feature3 from "../images/ai.png";
import feature4 from "../images/topics.png";
import feature5 from "../images/image3.png";
import image2 from "../images/image2.png";
import mailIcon from "../images/mail icon.png";
import socialsIcon from "../images/socials icon.png";
import wordmark from "../images/wordmark.png";
import facebook from "../images/facebook.png";
import github from "../images/github.png";
import twitter from "../images/twitter.png";
import instagram from "../images/instagram.png";
import arrow from "../images/Arrow.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Reset scroll position to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      className="bg-center bg-cover min-h-screen overflow-x-hidden p-[5px]"
      style={{
        fontFamily: "'Inter', sans-serif", // Set font family
        backgroundImage: `url(${bg})`, // Background image
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } },
        }}
        className="flex flex-col items-center md:flex-row md:items-center md:justify-between md:max-w-[1300px] md:max-[1355px]:w-[1180px]  md:mx-auto md:w-[1250px] md:mt-[15px]"
      >
        {/* Content on the left */}
        <motion.div
          className="flex flex-col items-center md:block md:flex-1 text-white text-center md:text-left mb-[25px] md:mb-[85px]"
          variants={itemVariants}
        >
          <motion.img
            className="md:hidden w-[250px] md:w-[550px] h-auto "
            src={image1}
            alt="image1"
            variants={itemVariants}
          />

          <img
            className="w-[250px] md:w-[500px] h-auto mb-[10px] mt-[20px] md:mt-[80px] "
            src={logo}
            alt="uniconnect logo"
          />
          <h1 className="text-[28px] md:text-[50px] font-bold mb-[10px] leading-[35px] md:leading-[55px]">
            Elevate your studies with <br /> Peer Support
          </h1>
          <p className="text-[13px] md:text-[15px] font-normal mb-[10px] md:mb-[20px] md:mx-[0px] mx-[40px]">
            From homework help to study group discussions, connect with peers to
            <br /> share knowledge, get answers, and excel together.
          </p>
          <motion.button
            className="block w-auto p-[8px] px-[18px] text-[15px] font-medium text-white bg-[#eb6e5b] border-2 border-transparent rounded-[8px] cursor-pointer transition-all duration-300 ease-in-out mt-[10px] hover:bg-[#d25441] hover:scale-[1.02]"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.1 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.img
          className="hidden md:flex w-[250px] md:w-[550px] h-auto "
          src={image1}
          alt="image1"
          variants={itemVariants}
        />
      </motion.div>

      {/* Feature section */}
      <div className="p-[40px_20px] text-white mt-[0px] md:mt-[80px] flex justify-around md:flex-wrap text-center">
        <div className="flex flex-col md:flex-row md:justify-center w-[1600px] items-center">
          <div className="m-[20px] flex-1 min-w-[300px] max-w-[400px] flex flex-col items-center text-center">
            <img
              src={feature1}
              alt="Community Powered Q&A"
              className="h-[150px] w-auto mt-[23px]"
            />
            <h3 className="text-[20px] mb-[10px] font-bold">
              Community Powered Q&A
            </h3>
            <p className="text-[14px] font-light mx-[15px] md:mx-[30px]">
              Ask questions and get support from fellow students in Computer
              Science and IT. Together, you'll solve problems and learn new
              skills.
            </p>
          </div>
          <div className="m-[20px] mt-[21px] flex-1 min-w-[300px] max-w-[400px] flex flex-col items-center text-center">
            <img
              src={feature2}
              alt="Badgerank"
              className="mt-[43px] h-[130px] w-auto"
            />
            <h3 className="text-[20px] mb-[10px] font-bold">
              Earn Points and Top the Leaderboards
            </h3>
            <p className="text-[14px] font-light mx-[15px] md:mx-[15px]">
              Contribute by helping others and earn medals for your efforts.
              Rise through the ranks, not just in the forum, but also within
              your school's community.
            </p>
          </div>
          <div className="m-[20px] mt-[14px] flex-1 min-w-[300px] max-w-[400px] flex flex-col items-center text-center">
            <img
              src={feature3}
              alt="AI Assistance"
              className="mt-[25px] h-[150px] w-auto mb-[5px]"
            />
            <h3 className="text-[20px] mb-[10px] font-bold">
              AI Powered Assistance
            </h3>
            <p className="text-[14px] font-light mx-[15px] md:mx-[45px]">
              Need extra help? Our AI assistant provides quick access to
              relevant links and resources, giving you a head start in your
              research.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-[80px] text-white">
        <div className="flex flex-col items-center md:flex-row md:items-start mb-[40px] max-w-[1300px] w-60%">
          <img
            src={feature4}
            alt="feature4"
            className="w-[320px] md:w-[500px] h-auto"
          />
          <div className="flex-1 mb-[30px] ml-[0px] md:ml-[85px] mt-[16px]">
            <h1 className="text-[20px] md:text-[30px] mb-[10px] text-center md:text-left font-bold leading-[30px] md:leading-[45px]">
              Explore Topics in Computer Science
              <br />& Information Technology
            </h1>
            <p className="text-[14px] font-light text-center md:text-left mx-[30px] md:mx-[0px]">
              Our forum covers a variety of Computer Science and IT subjects,
              making it
              <br />
              easy to find help and share knowledge. Whether you're tackling a
              coding
              <br />
              challenge or exploring the latest tech trends, you'll find the
              right space to
              <br />
              ask questions, give answers, and grow.
              <br />
              <br />
              Join our community to learn, collaborate, and earn ranks based on
              your
              <br />
              contributions, with AI tools to help you along the way.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row md:items-start mb-[40px] mt-[0px] md:mt-[25px] md:max-w-[1300px] md:w-[1080px]">
          <div className="flex-1 mb-[30px] mt-[10px] md:mt-[110px]">
            <h1 className="text-[20px] md:text-[30px] mb-[10px] font-bold text-center md:text-left leading-[30px] md:leading-[45px]">
              AI-Assisted Search for Instant Help
            </h1>
            <p className="text-[14px] font-light text-center md:text-left mx-[40px] md:mx-[0px]">
              Our forum features a smart AI assistant that makes finding answers
              easier.
              <br />
              Simply type a command like "@uc /questions example: set up react
              js", and
              <br />
              the AI will instantly return a list of relevant links from the
              web. No need to
              <br />
              sift through countless resources—our AI brings you exactly what
              you need,
              <br />
              helping you find answers faster and focus on learning.
            </p>
          </div>
          <img
            src={feature5}
            alt="feature5"
            className="w-[300px] md:w-[495px] h-auto"
          />
        </div>
      </div>

      {/* Join Us section */}
      <div>
        <div className="items-center text-center mt-[80px] md:mt-[100px] mb-[100px] flex flex-col">
          <h1 className="text-white text-[30px] md:text-[45px] font-bold mx-[20px] md:mx-[0px]">
            Join the <span className="text-[#eb6e5b]">Community</span> today
          </h1>
          <img
            src={image2}
            alt="image2"
            className="h-auto w-[300px] md:w-[450px] ml-[23px] md:ml-[35px] mb-[1px]"
          />
          <p className="text-white text-[14px] font-light mx-[50px] md:mx-[0px]">
            Whether you're solving coding problems, sharing knowledge, or just
            starting your Computer Science and IT journey,
            <br />
            our forum is the place to grow. With a supportive community, AI
            assistance, and opportunities to earn ranks and
            <br />
            medals, there's no limit to what you can achieve. Start exploring
            and learning today!
          </p>
          <button
            className="w-[130px] p-[7px] px-[18px] text-[15px] font-medium text-white bg-[#eb6e5b] border-2 border-transparent rounded-[8px] cursor-pointer transition-all duration-300 ease-in-out mt-[30px] hover:bg-[#d25441] hover:scale-102"
            onClick={() => navigate("/SignUp")}
          >
            Join Us
          </button>
        </div>
      </div>

      {/* Contact Us */}
      <div className="mt-[120px] mb-[80px] text-white">
        <div className="text-center mb-[50px]">
          <h1 className="text-[30px] md:text-[45px] font-bold">Contact Us</h1>
          <p className="text-[14px] font-[300] mx-[50px] md:mx-[0px]">
            We're here to help! Whether you have questions, feedback, or need
            assistance, our
            <br />
            team is ready to support you. Here's how you can get in touch with
            us:
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
          <div className="bg-[#0b112b] rounded-[20px] flex flex-col text-center items-center py-[20px] w-[330px] md:w-[430px] mr-[0px] md:mr-[50px]">
            <img
              src={mailIcon}
              alt="mail Icon"
              className="h-auto w-[50px] md:w-[70px]"
            />
            <h1 className="text-[20px] md:text-[30px] font-[600]">Email</h1>
            <p className="text-[14px] font-[300] mx-[50px] md:mx-[0px]">
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
              className="h-auto w-[50px] md:w-[70px]"
            />
            <h1 className="text-[20px] md:text-[30px] font-[600]">Socials</h1>
            <p className="text-[14px] mb-[30px] font-[300] mx-[50px] md:mx-[0px]">
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
                  className="cursor-pointer items-center pl-[13px]"
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
                  className="cursor-pointer items-center pl-[13px]"
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
                  className="cursor-pointer items-center pl-[13px]"
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
                  className="cursor-pointer items-center pl-[13px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="flex justify-center mt-[150px] mb-[10px]">
        <div className="flex justify-around w-[1500px]">
          <div className="hidden md:block w-[400px] ml-[10px] mt-[80px]">
            <img
              src={wordmark}
              alt="wordmark"
              className="ml-[10px] h-auto w-[270px]"
            />
            <h1 className="text-[25px] font-[620] text-[#6d6d6d] leading-[30px] mt-[7px]">
              Join us in shaping the future of
              <br />
              Students as it evolve into a reality
            </h1>
          </div>

          <div className="mt-[70px]">
            <p className="text-[#6d6d6d] text-[12px] font-semibold mb-[12px]">
              FOLLOW US
            </p>
            <div className="flex h-auto w-[150px]">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="facebook social"
                  className="mb-[15px] mr-[10px] cursor-pointer"
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
                  className="mb-[15px] mr-[10px] cursor-pointer"
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
                  className="mb-[15px] mr-[10px] cursor-pointer"
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
                  className="mb-[15px] mr-[10px] cursor-pointer"
                />
              </a>
            </div>
            <button
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium text-[#6d6d6d] bg-transparent border border-[#6d6d6d] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:border-[#eb6e5b] hover:rounded-[80px] hover:text-white"
              onClick={() => navigate("/FAQs")}
            >
              Contact Us
              <img
                src={arrow}
                alt="go to socials"
                className="w-[12px] h-auto transition-transform duration-300 ease-linear"
              />
            </button>
          </div>

          <div className="mt-[70px]">
            <p className="text-[#6d6d6d] text-[12px] font-semibold mb-[7px]">
              ABOUT US
            </p>
            <p className="text-[#6d6d6d] text-[12px] font-semibold mb-[7px]">
              PRIVACY AND POLICY
            </p>
            <p className="text-[#6d6d6d] text-[12px] font-semibold mb-[7px]">
              TERMS AND CONDITIONS
            </p>
            <button
              className="flex items-center gap-2 py-2 px-4 text-sm font-medium mt-[10px] text-[#6d6d6d] bg-transparent border border-[#6d6d6d] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:border-[#eb6e5b] hover:rounded-[80px] hover:text-white"
              onClick={() => navigate("/FAQs")}
            >
              FAQs Page
              <img src={arrow} alt="go to FAQs page" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="w-[1270px] h-[1px] md:h-[2px] bg-gray-600 mx-auto mb-2.5"></div>
        <p className="text-[#6d6d6d] mt-[10px] mb-[3px] text-[10px] md:text-[12px] font-[500] md:font-[600]">
          © Copyright 2022, All Rights Reserved by uniconnect group
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

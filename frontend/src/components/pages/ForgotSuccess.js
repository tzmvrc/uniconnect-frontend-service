import React from "react";
import bg from "../images/longbg.png"; // Background image import
import logo from "../images/NLogo.png"; // Import logo image
import successIcon from "../images/success.png";
import { useNavigate } from "react-router-dom"; // Import navigate for back button if needed
import { motion } from "framer-motion"; // Import motion for animations

const ForgotSuccess = () => {
  const navigate = useNavigate();

  // Animation variants for the container and elements
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3, // Delay between child animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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
      <motion.div
        className="flex flex-col items-center w-[1000px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.img
          className="h-auto w-[290px] md:w-[500px] cursor-pointer mb-[20px] md:mb-[50px] mt-[50px] md:mt-[0px]"
          src={logo}
          alt="logo"
          onClick={() => navigate("/")}
          variants={itemVariants}
        />

        <motion.div
          className="flex flex-col items-center text-center bg-[#fbcaa4] w-[350px] md:w-[800px] h-[390px] md:h-[420px] rounded-[20px]"
          variants={itemVariants}
        >
          <motion.img
            src={successIcon}
            alt="success Icon"
            className="h-auto w-[80px] md:w-[150px] mt-[30px] mb-[20px]"
            animate={{
              scale: [1, 1.1, 1], // Scale animation for a subtle pulse
            }}
            transition={{
              duration: 1,
              repeat: Infinity, // Keeps looping
              repeatType: "reverse", // Reverses the animation back and forth
            }}
          />
          <motion.h1
            className="text-[25px] md:text-[40px] text-[#112061] font-bold leading-[30px] md:leading-[50px] mb-[10px] md:mb-[5px]"
            variants={itemVariants}
          >
            Password Successfully Updated!
          </motion.h1>
          <motion.p
            className="text-[14px] text-[#112061] mb-[15px] leading-[20px] font-[480] mx-[20px] md:mx-[160px]"
            variants={itemVariants}
          >
            If you have any questions or need assistance, feel free to reach out
            to our support team. Enjoy your journey with UniConnect!
            <br />
            <br />
            You can now log in to your account
          </motion.p>

          <motion.button
            type="submit"
            class="w-[100px] p-[8px] rounded-[10px] bg-[#eb6e5b] text-white text-[16px] font-[550] cursor-pointer flex justify-center shadow-[0_5px_3px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:bg-[#d25441]"
            onClick={() => navigate("/login")}
          >
            Login
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotSuccess;

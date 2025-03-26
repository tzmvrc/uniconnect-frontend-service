/** @format */

import React from "react";
import { Discuss } from "react-loader-spinner";

const Loading = ({ message }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[50] backdrop-blur-[5px] bg-black/50">
      <Discuss
        visible={true}
        height="70"
        width="70"
        ariaLabel="discuss-loading"
        wrapperStyle={{}}
        wrapperClass="discuss-wrapper"
        color="#fff"
        backgroundColor="#F4442E"
      />
      <h2 className="text-[14px] md:text-[16px] text-white font-700 mt-[15px]">
        {message}
      </h2>
    </div>
  );
};

export default Loading;

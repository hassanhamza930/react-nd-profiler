import React from "react";
import { BiLoader } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <BiLoader className="animate-spin text-2xl" />
    </div>
  );
};

export default Loading;

import React from "react";

const Button = ({ title }) => {
  return (
    <button className="my-5 px-6 py-[10px] bg-[#a6a3e0] font-[700] rounded-[18px] text-center text-[#2e1a47] text-lg w-full">
      {title}
    </button>
  );
};

export default Button;

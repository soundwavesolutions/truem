import React from "react";

const Input = ({ title, children, ...rest }) => {
  return (
    <div className="w-full relative cursor-pointer mb-5">
      <input
        type="text"
        className={`p-[10px] text-[#181818] bg-[#ffffff] rounded w-full border-[1px] border-[#a8a8a8]`}
        placeholder={title}
        required
        {...rest}
      />
      {children ? children : null}
    </div>
  );
};

export default Input;

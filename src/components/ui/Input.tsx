import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <input
      className={twMerge(
        `h-11 w-full block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none`,
        className
      )}
      {...rest}
    />
  );
};

export default Input;

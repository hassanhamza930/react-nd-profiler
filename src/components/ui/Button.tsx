;
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        `rounded-3xl bg-primary h-12 w-fit px-4 md:px-8 text-white text-lg md:text-md font-regular disabled:cursor-not-allowed flex justify-center items-center disabled:opacity-70 hover:opacity-90 transition-all`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

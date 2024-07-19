import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  width?: string;
  height?: string;
}

const Button = ({ text, onClick, className, width, height }: ButtonProps) => {
  return (
    <button
      className={`px-3.5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className} ${width} ${height}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

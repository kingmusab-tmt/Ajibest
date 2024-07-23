import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-1/2">
      <div className="relative w-20 h-20">
        <div className="absolute w-full h-full border-4 border-blue-600 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
        <div className="absolute w-20 h-20 border-4 border-red-500 border-t-transparent border-b-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

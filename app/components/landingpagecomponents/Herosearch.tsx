import React from "react";

const Herosearch = () => {
  return (
    <div className="flex flex-wrap items-center bg-blue-100 dark:bg-slate-800 mt-0 p-4 sm:p-8 space-y-4 sm:space-y-0 sm:space-x-4 rounded-md w-full sm:w-3/4 h-28 sm:h-36">
      <div className="flex items-center w-full sm:w-auto text-black dark:text-white">
        {/* Location dropdown */}
        <select className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 mr-2 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="maiduguri">Maiduguri</option>
          <option value="gombe">Gombe</option>
          <option value="damaturu">Damaturu</option>
          <option value="bauchi">Bauchi</option>
        </select>
        {/* Property type dropdown */}
        <select className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 mr-2 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="farm land">Farm Land</option>
          <option value="residential land">Residential Land</option>
          <option value="house for sell">House for Sell</option>
          <option value="house for Rent">House for Rent</option>
        </select>

        {/* Property amount drop down */}
        <select className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 mr-2 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="threehunded to fivehundred">
            N300,000 - N500,000
          </option>
          <option value="six-onemillion">N600,000 - N1,000,000</option>
          <option value="onemillion to onepointfive">
            N1,000,000 - N1,500,000
          </option>
          <option value="twomillion to twopointfive">
            N2,000,000 - N2,500,000
          </option>
          <option value="threemillion to fivepointfive">
            N3,000,000 - N5,500,000
          </option>
          <option value="sixmillion and above">N6,000,000 - N10,000,000</option>
        </select>

        {/* Search icon */}
        <button className="w-auto sm:w-auto bg-indigo-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Herosearch;

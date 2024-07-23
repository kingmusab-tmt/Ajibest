import { useContext } from "react";
import LayoutContext from "../generalcomponents/LayoutContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AccountTabs = () => {
  const { openModal } = useContext(LayoutContext);
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 m-4">
      <div className="w-full lg:w-1/4 bg-blue-300 p-4 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 text-gray-700 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700">
            Property Calculator
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Easily get your budget estimated based on your location of interest
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={openModal}
          >
            Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;

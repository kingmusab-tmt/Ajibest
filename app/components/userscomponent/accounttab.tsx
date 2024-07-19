import { Tab, TabPanels, TabPanel, TabGroup, TabList } from "@headlessui/react";
import { useContext } from "react";
import LayoutContext from "../generalcomponents/LayoutContext";
import Image from "next/image";
import bank1 from "@/public/images/monipoint.png";
import bank2 from "@/public/images/Sterling new logo.png";
import bank3 from "@/public/images/GTBank_logo.svg.png";

const banks = [
  {
    name: "Monipoint",
    logo: bank1,
    accountNumber: "1234567890",
    username: "john_doe",
  },
  {
    name: "Sterling",
    logo: bank2,
    accountNumber: "2345678901",
    username: "john_doe",
  },
  {
    name: "GT",
    logo: bank3,
    accountNumber: "3456789012",
    username: "john_doe",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AccountTabs = () => {
  const { openModal } = useContext(LayoutContext);
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4">
      <div className="w-full lg:w-3/4 mb-4 lg:mb-0">
        <TabGroup>
          <TabList className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
            {banks.map((bank) => (
              <Tab
                key={bank.name}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium text-gray-700",
                    "rounded-lg focus:outline-none",
                    selected
                      ? "bg-white shadow"
                      : "text-gray-500 hover:bg-white/[0.12] hover:text-gray-700"
                  )
                }
              >
                {bank.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2">
            {banks.map((bank) => (
              <TabPanel
                key={bank.name}
                className={classNames(
                  "bg-white p-3 rounded-lg shadow",
                  "focus:outline-none"
                )}
              >
                <div className="flex flex-col items-start">
                  <Image
                    src={bank.logo}
                    alt={`${bank.name} logo`}
                    className="h-14 mb-4 w-14"
                  />
                  <p>
                    <strong>Bank Name:</strong> {bank.name}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {bank.accountNumber}
                  </p>
                  <p>
                    <strong>Username:</strong> {bank.username}
                  </p>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
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

// components/UserDashboardSidebar.tsx
import React from "react";
import Image from "next/image";
import companyimage from "@/public/ajibestlogo.jpg";
import {
  FaBars,
  FaHome,
  FaUser,
  FaLandmark,
  FaHistory,
  FaSignOutAlt,
  FaCreditCard,
} from "react-icons/fa";
import { signOut } from "next-auth/react";

interface User {
  name: string;
  // accountBalance: string;
  isLoggedIn: boolean;
}

interface UserDashboardSidebarProps {
  user: User;
  isOpen: boolean;
  toggleSidebar: () => void;
  setSelectedComponent: (component: string) => void;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({
  user,
  isOpen,
  toggleSidebar,
  setSelectedComponent,
}) => {
  const handleLinkClick = (component: string) => {
    setSelectedComponent(component);
    toggleSidebar();
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-blue-800 text-white flex flex-col transition-width duration-300 fixed ${
          isOpen ? "w-64" : "w-0 sm:w-24"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="text-white z-10">
            <FaBars />
          </button>
          {/* {isOpen && (
            <h2 className="text-xl text-center font-semibold">
              A.A Ajibest Land Vendor
            </h2>
          )} */}
        </div>
        <div className="flex items-center justify-center mt-4">
          <Image
            src={companyimage}
            alt="Profile"
            width={150}
            height={150}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        {isOpen && (
          <div className="mt-2 text-center">
            <h2 className="text-xl font-semibold">{user.name}</h2>
          </div>
        )}
        <nav className="mt-5 flex-1">
          <ul className="space-y-1 px-4">
            {[
              { icon: FaHome, label: "Dashboard", component: "UserInfo" },
              {
                icon: FaLandmark,
                label: "Manage Property",
                component: "ManageProperty",
              },
              {
                icon: FaUser,
                label: "Manage User",
                component: "ManageUsers",
              },
              {
                icon: FaHistory,
                label: "Manage Transaction",
                component: "ManageTransactions",
              },
              {
                icon: FaCreditCard,
                label: "Manage Payment",
                component: "ManagePayments",
              },
              { icon: FaUser, label: "Profile", component: "UpdateProfile" },
              { icon: FaSignOutAlt, label: "Logout", component: "" },
            ].map(({ icon: Icon, label, component }, index) => (
              <li key={index}>
                {label === "Logout" ? (
                  <button
                    title={label}
                    className="w-full sm:py-5 flex items-center px-4 py-2 text-white hover:bg-gray-700 hover:text-white rounded"
                    onClick={() => signOut()}
                  >
                    <Icon className="mr-3" />
                    {isOpen && label}
                  </button>
                ) : (
                  <button
                    title={label}
                    className="w-full sm:py-5 flex items-center px-4 py-2 text-white hover:bg-gray-700 hover:text-white rounded"
                    onClick={() => handleLinkClick(component)}
                  >
                    <Icon className="mr-3" />
                    {isOpen && label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="text-white fixed z-10 top-4 left-4"
        >
          <FaBars />
        </button>
      )}
    </div>
  );
};

export default UserDashboardSidebar;

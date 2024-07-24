"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  FaBell,
  FaUserEdit,
  FaHeadset,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
// import SearchBox from "./searchbox";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface ProfileTopNavBarProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  notifications: Array<{ _id: string; message: string }>;
  setSelectedComponent: (component: string) => void;
}

const ProfileTopNavBar: React.FC<ProfileTopNavBarProps> = ({
  user,
  notifications,
  setSelectedComponent,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data: session } = useSession();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBellClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleLinkClick = (component: string) => {
    setSelectedComponent(component);
  };

  const isUrl = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(user?.image) ? user.image : `/uploads/${user.image}`;
  return (
    <div className="w-full bg-blue-800 text-white flex items-center p-4 shadow-lg relative">
      <div className="flex items-center">
        <h1 className="font-bold pl-6">Admin Dashboard</h1>
      </div>
      <div className="flex-grow mx-4">{/* <SearchBox /> */}</div>
      <div className="flex items-center space-x-4 relative">
        <button
          className="text-white focus:outline-none relative"
          onClick={handleBellClick}
        >
          <FaBell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        {isNotificationsOpen && (
          <div className="backdrop backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none right-0 top-16 lg:-left-96">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className=" bg-white w-[500px] pl-10 justify-end ml-auto border-red-500 mr-28 text-blue-700 py-4 shadow-md"
              >
                {notification.message}
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <Image
            src={`${imageSrc}`}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={handleProfileClick}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={() => handleLinkClick("UpdateProfile")}
                className="flex items-center p-2 w-full hover:bg-gray-100"
              >
                <FaUserEdit className="mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => handleLinkClick("ContactSupport")}
                className="flex items-center p-2 w-full hover:bg-gray-100"
              >
                <FaHeadset className="mr-2" />
                Provide Support
              </button>
              {session && session.user.role === "Admin" && (
                <Link href="/userprofile">
                  <button className="flex items-center p-2 w-full hover:bg-gray-100">
                    <FaUser className="mr-2" />
                    User Profile
                  </button>
                </Link>
              )}
              <button
                className="flex items-center p-2 w-full hover:bg-gray-100"
                onClick={() => signOut()}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTopNavBar;

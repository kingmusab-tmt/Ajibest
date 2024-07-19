"use client";
import classNames from "classnames";
import { useState } from "react";
import UsersPage from "./users";
import UserRole from "./updateUserRole";
import NotificationForm from "./notification";

type Section =
  | "User Management"
  | "Manage User Role"
  | "Notify User(s)"
  | "Change User Password"
  | "Update User Payment";

const ManageUsers: React.FC = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("User Management");

  const renderSection = () => {
    switch (currentSection) {
      case "User Management":
        return <UsersPage />;
      case "Manage User Role":
        return <UserRole />;
      case "Notify User(s)":
        return <NotificationForm />;
      case "Update User Payment":
        return <p>User</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <nav className="mb-6">
        {[
          "User Management",
          "Manage User Role",
          "Notify User(s)",
          "Update User Payment",
        ].map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section as Section)}
            className={classNames(
              "px-4 py-2 rounded-md mr-2",
              {
                "bg-blue-500 text-white": currentSection === section,
                "bg-gray-200 text-gray-700": currentSection !== section,
              },
              "transition-colors duration-300"
            )}
          >
            {section}
          </button>
        ))}
      </nav>
      <div className="transition-opacity duration-500 ease-in-out">
        {renderSection()}
      </div>
    </div>
  );
};

export default ManageUsers;

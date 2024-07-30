"use client";
import classNames from "classnames";
import { useState } from "react";
import UsersPage from "./users";
import UserRole from "./updateUserRole";
import NotificationForm from "./notification";
import AdminPayment from "./adminpayment";

type Section =
  | "Users Details"
  | "Manage User Role"
  | "Notify User(s)"
  | "Change User Password";
// | "Make Payment for User";

const ManageUsers: React.FC = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("Users Details");

  const renderSection = () => {
    switch (currentSection) {
      case "Users Details":
        return <UsersPage />;
      case "Manage User Role":
        return <UserRole />;
      case "Notify User(s)":
        return <NotificationForm />;
      // case "Make Payment for User":
      //   return <AdminPayment />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <nav className="mb-6 flex">
        {[
          "Users Details",
          "Manage User Role",
          "Notify User(s)",
          // "Make Payment for User",
        ].map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section as Section)}
            className={classNames(
              "px-2 sm:px-4 py-2 rounded-md mr-2 text-xs sm:text-lg",
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

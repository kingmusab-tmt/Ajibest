"use client";
import classNames from "classnames";
import { useState } from "react";

type Section =
  | "Verify User Payment"
  | "Make Payment for User"
  | "Update User Payments"
  | "Change Password";

const ManagePayments: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(
    "Update User Payments"
  );

  const renderSection = () => {
    switch (currentSection) {
      case "Verify User Payment":
        return <p>Payment</p>;
      case "Make Payment for User":
        return <p>Payment</p>;
      case "Update User Payments":
        return <p>Payment</p>;
      case "Change Password":
        return <p>Payment</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <nav className="mb-6">
        {[
          "Personal Information",
          "Bank Account Detail",
          "Next of Kin Detail",
          "Change Password",
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

export default ManagePayments;

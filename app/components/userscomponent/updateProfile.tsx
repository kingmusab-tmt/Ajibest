"use client";
import classNames from "classnames";
import { useState } from "react";
import PersonalInformation from "./userprofile";
import BankAccountDetail from "./userBankdetail";
import NextOfKinDetail from "./nextOfkin";
import ChangePassword from "../generalcomponents/updatepassword";

type Section =
  | "Personal Information"
  | "Bank Account Detail"
  | "Next of Kin Detail"
  | "Change Password";

const NavigationComponent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(
    "Personal Information"
  );

  const renderSection = () => {
    switch (currentSection) {
      case "Personal Information":
        return <PersonalInformation />;
      case "Bank Account Detail":
        return <BankAccountDetail />;
      case "Next of Kin Detail":
        return <NextOfKinDetail />;
      case "Change Password":
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="p-2">
      <nav className="mb-6 flex">
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
              "px-2 sm:px-4 sm:py-2 rounded-md mr-2 text-xs sm:text-lg",
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

export default NavigationComponent;

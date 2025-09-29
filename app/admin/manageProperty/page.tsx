"use client";
import classNames from "classnames";
import { useState } from "react";
import NewProperty from "./createNewProperty";
import Properties from "./propertylisting";
import PropertyAssignmentForm from "./PropertyAssignmentForm";

type Section = "Create New Property" | "Update Property" | "Assign Property";

const ManageProperty: React.FC = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("Update Property");

  const renderSection = () => {
    switch (currentSection) {
      case "Create New Property":
        return <NewProperty />;
      case "Update Property":
        return <Properties />;
      case "Assign Property":
        return <PropertyAssignmentForm />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <nav className="mb-10 flex">
        {["Create New Property", "Update Property", "Assign Property"].map(
          (section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section as Section)}
              className={classNames(
                "p-4 sm:px-4 sm:py-2 rounded-md mr-2 text-xs sm:text-lg",
                {
                  "bg-blue-500 text-white": currentSection === section,
                  "bg-gray-200 text-gray-700": currentSection !== section,
                },
                "transition-colors duration-300"
              )}
            >
              {section}
            </button>
          )
        )}
      </nav>
      <div className="transition-opacity duration-500 ease-in-out">
        {renderSection()}
      </div>
    </div>
  );
};

export default ManageProperty;

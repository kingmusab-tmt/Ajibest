"use client";
import classNames from "classnames";
import { useState } from "react";
import AdminFAQEditor from "@/app/admin/manageWebContent/AdminFAQEditor";
import AdminHeroEditor from "@/app/admin/manageWebContent/hero-content";
import StatsAdminPanel from "@/app/admin/manageWebContent/StatsAdminPanel";

type Section = "Update FAQ" | "Update Hero Content" | "Update Stats";

const ManageWebContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("Update FAQ");

  const renderSection = () => {
    switch (currentSection) {
      case "Update FAQ":
        return <AdminFAQEditor />;
      case "Update Hero Content":
        return <AdminHeroEditor />;
      case "Update Stats":
        return <StatsAdminPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <nav className="mb-10 flex">
        {["Update FAQ", "Update Hero Content", "Update Stats"].map(
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

export default ManageWebContent;

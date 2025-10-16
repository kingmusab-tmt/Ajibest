"use client";
import classNames from "classnames";
import { useState } from "react";
import NewProperty from "./createNewProperty";
import Properties from "./propertylisting";
import PropertyAssignmentForm from "./PropertyAssignmentForm";
import AdminWithdrawalsPage from "./withdrawals";

type Section =
  | "Create New Property"
  | "Update Property"
  | "Assign Property"
  | "Withdrawal Requests";

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
      case "Withdrawal Requests":
        return <AdminWithdrawalsPage />;
      default:
        return null;
    }
  };

  const sections: Section[] = [
    "Create New Property",
    "Update Property",
    "Assign Property",
    "Withdrawal Requests",
  ];

  const getSectionIcon = (section: Section) => {
    switch (section) {
      case "Create New Property":
        return "🏗️";
      case "Update Property":
        return "📋";
      case "Assign Property":
        return "🔗";
      case "Withdrawal Requests":
        return "💰";
      default:
        return "📄";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Property Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage properties, assignments, and withdrawal requests
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-700">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={classNames(
                  "flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-max",
                  "hover:scale-105 transform",
                  {
                    "bg-blue-600 text-white shadow-lg shadow-blue-500/25":
                      currentSection === section,
                    "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200":
                      currentSection !== section,
                  }
                )}
              >
                <span className="text-base">{getSectionIcon(section)}</span>
                <span className="hidden sm:inline">{section}</span>
                <span className="sm:hidden">
                  {section
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {currentSection}
          </h2>
          <div className="mt-2 w-12 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="transition-all duration-300 ease-in-out transform">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={classNames(
                "flex flex-col items-center p-2 rounded-lg text-xs transition-all duration-200 min-w-0 flex-1 mx-1",
                {
                  "bg-blue-50 text-blue-600": currentSection === section,
                  "text-gray-600": currentSection !== section,
                }
              )}
            >
              <span className="text-lg mb-1">{getSectionIcon(section)}</span>
              <span className="text-xs font-medium truncate w-full text-center">
                {section.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add padding for mobile bottom nav */}
      <div className="sm:hidden h-20"></div>
    </div>
  );
};

export default ManageProperty;

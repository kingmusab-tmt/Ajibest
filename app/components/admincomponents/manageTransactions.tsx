"use client";
import classNames from "classnames";
import { useState } from "react";
import TransactionHistory from "./transactionhistory";

type Section =
  // | "One Time Payments Transactions"
  // | "Installment Payment Transactions"
  // | "Rent Transactions"
  // | "Users Transaction Summary"
  // | "Payment Gateway Transactions"
  "All Transactions";

const ManageTransactions: React.FC = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("All Transactions");

  const renderSection = () => {
    switch (currentSection) {
      case "All Transactions":
        return <TransactionHistory />;
      // case "One Time Payments Transactions":
      //   return <TransactionHistory />;
      // case "Installment Payment Transactions":
      //   return <TransactionHistory />;
      // case "Rent Transactions":
      //   return <TransactionHistory />;
      // case "Payment Gateway Transactions":
      //   return <TransactionHistory />;
      // case "Users Transaction Summary":
      //   return <TransactionHistory />;
      default:
        return "All Transactions";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <nav className="mb-6">
        {[
          // "One Time Payments Transactions",
          // "Installment Payment Transactions",
          // "Rent Transactions",
          // "Users Transaction Summary",
          "All Transactions",
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

export default ManageTransactions;

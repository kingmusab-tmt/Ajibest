"use client";

import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const MessageModal: FC<MessageModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return createPortal(
    isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className={`p-6 rounded-t-lg ${getBackgroundColor()}`}>
            <h2 className="text-white text-lg font-bold">{title}</h2>
          </div>
          <div className="p-6">
            <p>{message}</p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    ) : null,
    document.body
  );
};

export default MessageModal;

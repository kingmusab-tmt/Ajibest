"use client";

import { useState } from "react";

interface EmailVerificationProps {
  token: string;
}

const EmailVerification = ({ token }: EmailVerificationProps) => {
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    // Make a POST request to the verification API
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      style={{ minHeight: "100vh" }}
    >
      {verified ? (
        <div className="text-green-500 text-lg">Verified!</div>
      ) : (
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleVerify}
        >
          Verify
        </button>
      )}
    </div>
  );
};

export default EmailVerification;

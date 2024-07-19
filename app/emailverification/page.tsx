"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Call the verification API
      fetch("/api/emailverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Account has been activated.") {
            setVerificationStatus("Email verified successfully!");
          } else {
            setVerificationStatus("Verification failed. Please try again.");
          }

          // Redirect to the login page after showing the status message
          setTimeout(() => {
            router.push("/login");
          }, 3000); // 3 seconds delay
        })
        .catch((error) => {
          setVerificationStatus("An error occurred. Please try again.");

          // Redirect to the login page after showing the status message
          setTimeout(() => {
            router.push("/login");
          }, 5000); // 3 seconds delay
          throw error;
        });
    } else {
      // Redirect to login if no token is found
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Email Verification</h2>
        <p>{verificationStatus || "Verifying your email..."}</p>
      </div>
    </div>
  );
};

export default VerifyPage;

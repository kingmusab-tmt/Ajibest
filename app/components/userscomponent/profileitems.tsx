"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/types/usertypes";
import { useSession } from "next-auth/react";

const UserInfo: React.FC = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/users/searchbyemail");
          if (response.ok) {
            const data = await response.json();
            setUserData({
              ...data.user,
            });
          } else {
            return;
          }
        } catch (error) {
          throw error;
        }
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-xl font-bold mb-4">User Information</h2> */}
      <div className="flex space-x-5 w-full mb-10">
        <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-green-600 ">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
              />
            </svg>
          </span>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Remaining Balance
          </h3>
          <p className="text-sm sm:text-lg">
            {formatter.format(userData?.remainingBalance ?? 0)}
          </p>
        </div>
        <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-blue-600">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>
          </span>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Total Property Purchased
          </h3>
          <p className="text-lg">{userData?.totalPropertyPurchased}</p>
        </div>
      </div>
      <div className="flex space-x-5 w-full mb-10">
        <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-yellow-600">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </span>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Total Payment Made
          </h3>
          <p className="text-sm sm:text-lg">
            {" "}
            {userData?.totalPaymentMade
              ? formatter.format(userData.totalPaymentMade)
              : formatter.format(0)}{" "}
          </p>
        </div>
        <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-yellow-600">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </span>
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Total Payment To be Made
          </h3>
          <p className="text-sm sm:text-lg">
            {" "}
            {userData?.totalPaymentToBeMade
              ? formatter.format(userData.totalPaymentToBeMade)
              : formatter.format(0)}{" "}
          </p>
        </div>
        {session?.user.role === "Agent" && (
          <>
            <div className="w-1/2 bg-white border rounded-lg p-4 shadow-lg shadow-green-600">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </span>
              <h3 className="text-lg font-semibold mb-2">Referral Earnings</h3>
              <p className="text-lg">{userData?.referralEarnings}</p>
            </div>
            <div className="w-1/2 bg-white border rounded-lg p-4 shadow-lg shadow-green-600">
              <span>
                <svg
                  version="1.1"
                  baseProfile="tiny"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="50px"
                  height="50px"
                  viewBox="0 0 24 24"
                  overflow="visible"
                >
                  <g>
                    <rect y="0" fill="none" width="24" height="24" />
                    <g transform="translate(2.000000, 2.000000)">
                      <path
                        fill-rule="evenodd"
                        fill="#5C85DE"
                        d="M10,10c2.9,0,5.2-2.3,5.2-5.2c0-2.9-2.3-5.2-5.2-5.2S4.8,1.9,4.8,4.8
			C4.8,7.7,7.1,10,10,10L10,10z"
                      />
                      <path
                        fill-rule="evenodd"
                        fill="#5C85DE"
                        d="M10,12.7c-3.5,0-10.5,1.7-10.5,5.2v2.6h21v-2.6C20.5,14.4,13.5,12.7,10,12.7L10,12.7z
			"
                      />
                      <path
                        fill-rule="evenodd"
                        fill="#3367D6"
                        d="M10,10c2.9,0,5.2-2.3,5.2-5.2c0-2.9-2.3-5.2-5.2-5.2V10L10,10z"
                      />
                      <path
                        fill-rule="evenodd"
                        fill="#3367D6"
                        d="M10,12.7v7.8h10.5v-2.6C20.5,14.4,13.5,12.7,10,12.7L10,12.7z"
                      />
                    </g>
                  </g>
                </svg>
              </span>
              <h3 className="text-lg font-semibold mb-2">
                Number of Referrals
              </h3>
              <p className="text-lg">{userData?.numberOfReferrals}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;

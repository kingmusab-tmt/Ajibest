"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserDashboardSidebar from "../components/userscomponent/usernav";
import ProfileTopNavBar from "../components/userscomponent/profiletopnav";
import AccountTabs from "../components/userscomponent/accounttab";
import UserInfo from "../components/userscomponent/profileitems";
import TransactionHistory from "../components/generalcomponents/transactionhistory";
import UpdateProfile from "../components/userscomponent/updateProfile";
import PropertyListing from "../components/userscomponent/propertyListing";
import MyProperty from "../components/userscomponent/userproperties";
import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";
import SupportTab from "../components/userscomponent/SupportTab";

interface Notification {
  id: number;
  message: string;
}

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
  // accountBalance: string;
  isLoggedIn: boolean;
}

const Userprofile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedComponent, setSelectedComponent] = useState("UserInfo");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notify");
        const fetchedNotifications = await response.json();
        if (Array.isArray(fetchedNotifications)) {
          const filteredNotifications = fetchedNotifications.filter(
            (notification) =>
              notification.recipient === "all" ||
              notification.recipient === session?.user?.email
          );
          setNotifications(filteredNotifications);
        } else {
          console.error(
            "Expected an array of notifications, but received something else"
          );
        }
      } catch (error) {
        throw error;
      }
    };
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [session?.user?.email, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!session?.user) {
    return null; // This will never be reached because of the redirection above
  }
  const role = session.user.role;
  const user: User = {
    name: session.user.name || "Unknown User",
    email: session.user.email || "No Email",
    image: session.user.image || "/public/ajibestlogo.png",
    role: session.user.role || "",
    // accountBalance: "",
    isLoggedIn: false,
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "UserInfo":
        return (
          <>
            <UserInfo />
            <AccountTabs />
          </>
        );
      case "MyProperty":
        return <MyProperty />;
      case "PropertyListing":
        return <PropertyListing />;
      case "TransactionHistory":
        return <TransactionHistory />;
      case "UpdateProfile":
        return <UpdateProfile />;
      case "SupportTab":
        return <SupportTab />;
      default:
        return <UserInfo />;
    }
  };

  return (
    <ProtectedRoute roles={["User", "Agent", "Admin"]}>
      <div className="flex h-screen overflow-hidden">
        {isClient ? (
          <>
            <UserDashboardSidebar
              user={user}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              setSelectedComponent={setSelectedComponent}
            />
            <div
              className={`flex flex-col flex-grow transition-margin duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-0 sm:ml-24"
              }`}
            >
              <ProfileTopNavBar
                user={user}
                notifications={notifications}
                setSelectedComponent={setSelectedComponent}
              />
              <main className=" flex-grow bg-white overflow-auto max-h-svh">
                {renderComponent()}
              </main>
            </div>
          </>
        ) : (
          <>
            <UserDashboardSidebar
              user={user}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              setSelectedComponent={setSelectedComponent}
            />
            <div
              className={`flex flex-col flex-grow transition-margin duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-0 sm:ml-24"
              }`}
            >
              <ProfileTopNavBar
                user={user}
                notifications={notifications}
                setSelectedComponent={setSelectedComponent}
              />
              <main className=" flex-grow bg-white overflow-auto max-h-svh">
                {renderComponent()}
              </main>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Userprofile;

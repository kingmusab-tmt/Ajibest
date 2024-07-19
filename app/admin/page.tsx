"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserDashboardSidebar from "../components/admincomponents/adminnav";
import ProfileTopNavBar from "../components/admincomponents/profiletopnav";
import ManageProperty from "../components/admincomponents/manageProperty";
import ManageUsers from "../components/admincomponents/manageUser";
import ManageTransactions from "../components/admincomponents/manageTransactions";
import ManagePayments from "../components/admincomponents/managePayment";
import UpdateProfile from "../components/userscomponent/updateProfile";
import DashboardPage from "../components/admincomponents/admindashboard";

interface Notification {
  _id: string;
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

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedComponent, setSelectedComponent] = useState("UserInfo");
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notify");
        const fetchedNotifications = await response.json();
        const filteredNotifications = fetchedNotifications.data.filter(
          (notification) =>
            notification.recipient === "all" ||
            notification.recipient === session?.user?.email
        );
        setNotifications(filteredNotifications);
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
      case "DashboardPage":
        return (
          <>
            <DashboardPage
              transactions={undefined}
              users={undefined}
              properties={undefined}
            />
          </>
        );
      case "ManageProperty":
        return <ManageProperty />;
      case "ManageUsers":
        return <ManageUsers />;
      case "ManageTransactions":
        return <ManageTransactions />;
      case "ManagePayments":
        return <ManagePayments />;
      case "UpdateProfile":
        return <UpdateProfile />;
      default:
        return (
          <DashboardPage
            transactions={undefined}
            users={undefined}
            properties={undefined}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
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
        <main className="flex-grow p-4 bg-white overflow-auto">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Container,
} from "@mui/material";

import UserDashboardSidebar from "./adminComponents/adminnav";
import ProfileTopNavBar from "./adminComponents/profiletopnav";
import ManageProperty from "./manageProperty/page";
import ManageUsers from "./manageUser/page";
import ManageTransactions from "./manageTransactions/page";
import ManagePayments from "./managePayment/page";
import UpdateProfile from "../components/userscomponent/updateProfile";
import DashboardPage from "./admindashboard";
import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";
import ManageWebContent from "./manageWebContent/page";

interface Notification {
  _id: string;
  message: string;
}

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
  isLoggedIn: boolean;
}

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedComponent, setSelectedComponent] = useState("UserInfo");
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notify", {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });

        const fetchedNotifications = await response.json();
        const filteredNotifications = fetchedNotifications.data.filter(
          (notification) =>
            notification.recipient === "all" ||
            notification.recipient === session?.user?.email
        );
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
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

  useEffect(() => {
    const handleComponentChange = () => {
      router.replace(`/admin?/${selectedComponent}`);
    };
    handleComponentChange();
  }, [selectedComponent, router]);

  // Handle sidebar auto-close on mobile when clicking on menu items
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [selectedComponent, isMobile, isSidebarOpen]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user: User = {
    name: session.user.name || "Unknown User",
    email: session.user.email || "No Email",
    image: session.user.image || "ajibestlogo.png",
    role: session.user.role || "",
    isLoggedIn: false,
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "DashboardPage":
        return <DashboardPage />;
      case "ManageProperty":
        return <ManageProperty />;
      case "ManageUsers":
        return <ManageUsers />;
      case "ManageTransactions":
        return <ManageTransactions />;
      case "ManagePayments":
        return <ManagePayments />;
      case "ManageWebContent":
        return <ManageWebContent />;
      case "UpdateProfile":
        return <UpdateProfile />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <UserDashboardSidebar
          user={user}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setSelectedComponent={setSelectedComponent}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: {
              xs: 0,
              md: isSidebarOpen ? "280px" : "80px",
            },
            transition: theme.transitions.create(["margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: {
              xs: "100%",
              md: isSidebarOpen ? "calc(100% - 280px)" : "calc(100% - 80px)",
            },
          }}
        >
          <ProfileTopNavBar
            user={user}
            notifications={notifications}
            setSelectedComponent={setSelectedComponent}
          />

          <Container
            maxWidth={false}
            sx={{
              flexGrow: 1,
              p: 3,
              backgroundColor: theme.palette.background.default,
              overflow: "auto",
              maxHeight: "calc(100vh - 64px)", // Subtract AppBar height
            }}
          >
            {renderComponent()}
          </Container>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default AdminPage;

"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, useTheme, useMediaQuery, Container } from "@mui/material";

import UserDashboardSidebar from "./adminComponents/adminnav";
import ProfileTopNavBar from "./adminComponents/profiletopnav";
import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";
import LoadingSpinner from "../components/generalcomponents/loadingSpinner";

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

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
            notification.recipient === session?.user?.email,
        );
        setNotifications(filteredNotifications);
      } catch (error) {
        // Failed to fetch notifications
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

  // Handle sidebar auto-close on mobile when route changes
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  if (status === "loading") {
    return <LoadingSpinner />;
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

  return (
    <ProtectedRoute roles={["Admin"]}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <UserDashboardSidebar
          user={user}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
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
          <ProfileTopNavBar user={user} notifications={notifications} />

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
            {children}
          </Container>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default AdminLayout;

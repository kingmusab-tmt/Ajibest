"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Chip,
  alpha,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Support as SupportIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Dashboard as DashboardIcon,
  HomeWork as HomeWorkIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  Menu as MenuIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material";
import companyimage from "@/public/ajibestlogo.jpg";
import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
  isLoggedIn: boolean;
}

interface Notification {
  id: number;
  message: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Menu items for sidebar navigation
  const menuItems = [
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      path: "/userDashboard",
    },
    {
      icon: <HomeWorkIcon />,
      label: "My Properties",
      path: "/userDashboard/MyProperty",
    },
    {
      icon: <ShoppingCartIcon />,
      label: "Buy/Rent Property",
      path: "/userDashboard/PropertyListing",
    },
    {
      icon: <HistoryIcon />,
      label: "Transaction History",
      path: "/userDashboard/TransactionHistory",
    },
    {
      icon: <SupportIcon />,
      label: "Contact Support",
      path: "/userDashboard/SupportTab",
    },
    {
      icon: <PersonIcon />,
      label: "Profile",
      path: "/userDashboard/UpdateProfile",
    },
  ];

  useEffect(() => {
    setIsClient(true);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Notification handlers
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfileAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    handleClose();
  };

  const isActivePath = (path: string) => {
    if (path === "/userDashboard") {
      return pathname === "/userDashboard";
    }
    return pathname.startsWith(path);
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
          (notification: any) =>
            notification.recipient === "all" ||
            notification.recipient === session?.user?.email
        );
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
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

  // Image URL validation
  const isUrl = (str: string) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (status === "loading" || !isClient) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
    isLoggedIn: true,
  };

  const imageSrc =
    user?.image && isUrl(user.image) ? user.image : `/uploads/${user.image}`;

  // Calculate main content style based on sidebar state
  const getMainContentStyle = () => {
    if (isMobile) {
      return {
        width: "100%",
        marginTop: "50px",
        transition: theme.transitions.create(["margin", "width"], {
          duration: theme.transitions.duration.standard,
        }),
      };
    }

    return {
      width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 80px)",
      // marginLeft: isSidebarOpen ? 240 : 80,
      marginTop: "68px",
      transition: theme.transitions.create(["margin", "width"], {
        duration: theme.transitions.duration.standard,
      }),
    };
  };

  // Sidebar Content
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarOpen ? "space-between" : "center",
        }}
      >
        {isSidebarOpen && (
          <Typography
            variant="h6"
            sx={{ color: "common.white", fontWeight: 700 }}
          >
            AJIBEST
          </Typography>
        )}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "common.white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          px: isSidebarOpen ? 2 : 1,
        }}
      >
        <Avatar
          sx={{
            width: isSidebarOpen ? 64 : 48,
            height: isSidebarOpen ? 64 : 48,
            mb: 2,
            border: `2px solid ${theme.palette.common.white}`,
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={companyimage}
            alt="Profile"
            width={isSidebarOpen ? 64 : 48}
            height={isSidebarOpen ? 64 : 48}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Avatar>
        {isSidebarOpen && (
          <Typography
            variant="h6"
            sx={{
              color: "common.white",
              fontWeight: 600,
              textAlign: "center",
              fontSize: "1rem",
            }}
          >
            {user.name}
          </Typography>
        )}
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mx: 2, mb: 1 }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!isSidebarOpen ? item.label : ""} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  color: "common.white",
                  backgroundColor: isActivePath(item.path)
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  justifyContent: isSidebarOpen ? "initial" : "center",
                  px: isSidebarOpen ? 2 : 1,
                  py: 1.5,
                  minHeight: 48,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarOpen ? 2 : "auto",
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isSidebarOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 1 }}>
        <ListItem disablePadding>
          <Tooltip title={!isSidebarOpen ? "Logout" : ""} placement="right">
            <ListItemButton
              onClick={() => signOut()}
              sx={{
                borderRadius: 2,
                color: "common.white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                justifyContent: isSidebarOpen ? "initial" : "center",
                px: isSidebarOpen ? 2 : 1,
                py: 1.5,
                minHeight: 48,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSidebarOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {isSidebarOpen && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <ProtectedRoute roles={["User", "Agent", "Admin"]}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {/* Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? isSidebarOpen : true}
          onClose={toggleSidebar}
          sx={{
            display: { xs: isSidebarOpen ? "block" : "none", md: "block" },
            width: isSidebarOpen ? 240 : 80,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: isSidebarOpen ? 240 : 80,
              boxSizing: "border-box",
              backgroundColor: theme.palette.primary.main,
              color: "common.white",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Mobile Menu Button */}
        {isMobile && !isSidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: "fixed",
              top: 4,
              left: 4,
              zIndex: theme.zIndex.drawer + 2,
              backgroundColor: theme.palette.primary.main,
              color: "common.white",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              boxShadow: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            ...getMainContentStyle(),
          }}
        >
          {/* Fixed Top Navigation Bar */}
          <AppBar
            position="fixed"
            elevation={4}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "common.white",
              backdropFilter: "blur(10px)",
              width: isMobile
                ? "100%"
                : isSidebarOpen
                ? "calc(100% - 240px)"
                : "calc(100% - 80px)",
              marginLeft: isMobile ? 0 : isSidebarOpen ? 240 : 80,
              transition: theme.transitions.create(["margin", "width"], {
                duration: theme.transitions.duration.standard,
              }),
              zIndex: theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar
              sx={{
                justifyContent: "space-between",
                minHeight: { xs: 60, sm: 68 },
                px: { xs: 2, sm: 3 },
              }}
            >
              {/* Title with Icon */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 32,
                    backgroundColor: "secondary.main",
                    borderRadius: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    background: "linear-gradient(45deg, #fff 30%, #e0e0e0 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Profile Dashboard
                </Typography>
              </Box>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Notifications and Profile */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Notifications Bell with Badge */}
                <IconButton
                  color="inherit"
                  onClick={handleNotificationsClick}
                  sx={{
                    position: "relative",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Badge
                    badgeContent={notifications.length}
                    color="error"
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Profile Avatar */}
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Avatar
                    src={imageSrc}
                    alt="Profile"
                    sx={{
                      width: 42,
                      height: 42,
                      border: `2px solid ${alpha(
                        theme.palette.common.white,
                        0.8
                      )}`,
                      boxShadow: 2,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Box>

              {/* Notifications Menu */}
              <Menu
                anchorEl={notificationsAnchorEl}
                open={Boolean(notificationsAnchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    width: { xs: "90vw", sm: 400 },
                    maxWidth: "100%",
                    maxHeight: 400,
                    mt: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ p: 2, pb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      Notifications
                    </Typography>
                    {notifications.length > 0 && (
                      <Chip
                        label={notifications.length}
                        size="small"
                        color="primary"
                        variant="filled"
                      />
                    )}
                  </Box>
                </Box>

                <Divider />

                {notifications.length > 0 ? (
                  <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <MenuItem
                          onClick={handleClose}
                          sx={{
                            py: 1.5,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <MuiListItemIcon>
                            <EmailIcon color="primary" fontSize="small" />
                          </MuiListItemIcon>
                          <MuiListItemText
                            primary={notification.message}
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { fontWeight: 500 },
                            }}
                          />
                        </MenuItem>
                        {index < notifications.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <NotificationsIcon
                      sx={{
                        fontSize: 48,
                        color: "text.secondary",
                        opastate: 0.5,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No new notifications
                    </Typography>
                  </Box>
                )}
              </Menu>

              {/* Profile Menu */}
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    width: 300,
                    maxWidth: "100%",
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* User Info with Avatar */}
                <Box
                  sx={{
                    px: 2,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={imageSrc}
                    alt="Profile"
                    sx={{
                      width: 50,
                      height: 50,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" noWrap>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                {/* Menu Items */}
                <MenuItem
                  onClick={() =>
                    handleNavigation("/userDashboard/UpdateProfile")
                  }
                  sx={{ py: 1.5 }}
                >
                  <MuiListItemIcon>
                    <EditIcon color="primary" />
                  </MuiListItemIcon>
                  <MuiListItemText primary="Edit Profile" />
                </MenuItem>

                <MenuItem
                  onClick={() => handleNavigation("/userDashboard/SupportTab")}
                  sx={{ py: 1.5 }}
                >
                  <MuiListItemIcon>
                    <SupportIcon color="primary" />
                  </MuiListItemIcon>
                  <MuiListItemText primary="Contact Support" />
                </MenuItem>

                {session && session.user.role === "Admin" && (
                  <MenuItem
                    component={Link}
                    href="/admin"
                    onClick={handleClose}
                    sx={{ py: 1.5 }}
                  >
                    <MuiListItemIcon>
                      <AdminIcon color="primary" />
                    </MuiListItemIcon>
                    <MuiListItemText primary="Admin Dashboard" />
                  </MenuItem>
                )}

                <Divider />

                <MenuItem
                  onClick={() => signOut()}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <MuiListItemIcon>
                    <LogoutIcon color="error" />
                  </MuiListItemIcon>
                  <MuiListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      sx: { color: "error.main" },
                    }}
                  />
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              overflow: "auto",
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </Container>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default DashboardLayout;

import React from "react";
import Image from "next/image";
import companyimage from "@/public/ajibestlogo.jpg";
import { signOut } from "next-auth/react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Landscape as LandscapeIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  CreditCard as CreditCardIcon,
  Adjust as AdjustIcon,
} from "@mui/icons-material";

interface User {
  name: string;
  isLoggedIn: boolean;
}

interface UserDashboardSidebarProps {
  user: User;
  isOpen: boolean;
  toggleSidebar: () => void;
  setSelectedComponent: (component: string) => void;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({
  user,
  isOpen,
  toggleSidebar,
  setSelectedComponent,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLinkClick = (component: string) => {
    setSelectedComponent(component);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const menuItems = [
    { icon: <HomeIcon />, label: "Dashboard", component: "UserInfo" },
    {
      icon: <LandscapeIcon />,
      label: "Manage Property",
      component: "ManageProperty",
    },
    { icon: <PersonIcon />, label: "Manage User", component: "ManageUsers" },
    {
      icon: <HistoryIcon />,
      label: "Manage Transaction",
      component: "ManageTransactions",
    },
    {
      icon: <CreditCardIcon />,
      label: "Manage Payment",
      component: "ManagePayments",
    },
    {
      icon: <AdjustIcon />,
      label: "Manage Web Content",
      component: "ManageWebContent",
    },
    { icon: <PersonIcon />, label: "Profile", component: "UpdateProfile" },
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mb: 2,
            border: `2px solid ${theme.palette.common.white}`,
          }}
        >
          <Image
            src={companyimage}
            alt="Profile"
            width={64}
            height={64}
            style={{ objectFit: "cover" }}
          />
        </Avatar>
        {isOpen && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: "white",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {user.name}
          </Typography>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleLinkClick(item.component)}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: "white", fontWeight: 500 },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => signOut()}
            sx={{
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            {isOpen && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { color: "white", fontWeight: 500 },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen && isMobile}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: theme.palette.primary.main,
            backgroundImage: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: isOpen ? 280 : 80,
            backgroundColor: theme.palette.primary.main,
            backgroundImage: "none",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Menu Button when sidebar is closed */}
      {!isOpen && isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default UserDashboardSidebar;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Backdrop,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Support as SupportIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

interface ProfileTopNavBarProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  notifications: Array<{ _id: string; message: string }>;
  setSelectedComponent: (component: string) => void;
}

const ProfileTopNavBar: React.FC<ProfileTopNavBarProps> = ({
  user,
  notifications,
  setSelectedComponent,
}) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationsMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLinkClick = (component: string) => {
    setSelectedComponent(component);
    handleProfileMenuClose();
  };

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

  const imageSrc =
    user?.image && isUrl(user.image) ? user.image : `/uploads/${user.image}`;

  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.primary.main,
          boxShadow: theme.shadows[3],
        }}
      >
        <Toolbar>
          {/* Title */}
          <Typography
            variant="h6"
            component="h1"
            sx={{
              flexGrow: 0,
              fontWeight: "bold",
              ml: { xs: 1, md: 2 },
              display: { xs: "none", sm: "block" },
            }}
          >
            Admin Dashboard
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications Icon */}
          <IconButton
            size="large"
            aria-label={`show ${notifications.length} new notifications`}
            color="inherit"
            onClick={handleNotificationsMenuOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${theme.palette.common.white}`,
              }}
            >
              {user?.image ? (
                <Image
                  src={imageSrc}
                  alt="Profile"
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <PersonIcon />
              )}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={isNotificationsMenuOpen}
        onClose={handleNotificationsMenuClose}
        onClick={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 400,
            mt: 1.5,
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: "bold" }}>
          Notifications
        </Typography>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem>
            <ListItemText primary="No new notifications" />
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification._id} sx={{ py: 1.5 }}>
              <ListItemText
                primary={notification.message}
                primaryTypographyProps={{
                  sx: { fontSize: "0.9rem" },
                }}
              />
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            width: 200,
            mt: 1.5,
          },
        }}
      >
        <MenuItem onClick={() => handleLinkClick("UpdateProfile")}>
          <EditIcon sx={{ mr: 2, fontSize: 20 }} />
          Edit Profile
        </MenuItem>

        <MenuItem onClick={() => handleLinkClick("ContactSupport")}>
          <SupportIcon sx={{ mr: 2, fontSize: 20 }} />
          Provide Support
        </MenuItem>

        {session && session.user.role === "Admin" && (
          <Link
            href="/userDashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem>
              <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
              User Profile
            </MenuItem>
          </Link>
        )}

        <Divider />

        <MenuItem onClick={() => signOut()}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Backdrop for Notifications (alternative approach) */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          display: { xs: "flex", md: "none" },
        }}
        open={isNotificationsMenuOpen && isMobile}
        onClick={handleNotificationsMenuClose}
      >
        <Paper
          sx={{
            width: "90%",
            maxWidth: 400,
            maxHeight: "70%",
            overflow: "auto",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Notifications
          </Typography>
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No new notifications" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem key={notification._id}>
                  <ListItemText primary={notification.message} />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Backdrop>
    </>
  );
};

export default ProfileTopNavBar;

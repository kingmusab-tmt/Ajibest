"use client";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineGoogle,
} from "react-icons/ai";
import { useSession, signOut } from "next-auth/react";
import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import logo from "@/public/ajibestlogo.png";
import LayoutContext from "../generalcomponents/LayoutContext";
import LoadingSpinner from "../generalcomponents/loadingSpinner";

// Material UI imports
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { openModal } = useContext(LayoutContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Next.js navigation hooks
  const pathname = usePathname();

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseDrawer = () => {
    setMenuOpen(false);
  };

  // Reset loading when route changes complete
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleNavigation = (item) => {
    // Show loading spinner
    setLoading(true);

    // Close mobile drawer if open
    if (menuOpen) {
      setMenuOpen(false);
    }

    // If item has custom onClick (like modal), execute it and don't wait for navigation
    if (item.onClick) {
      item.onClick();
      setLoading(false); // Hide spinner immediately for modal actions
    }

    // For regular navigation, the useEffect above will handle hiding the spinner
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
    // The spinner will be hidden by the route change when redirect happens
  };

  const isUrl = (str) => {
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
    typeof session?.user?.image === "string"
      ? isUrl(session.user.image)
        ? session.user.image
        : `/uploads/${session.user.image}`
      : undefined;

  // Navigation items
  const navItems = [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/#services", scroll: true },
    { label: "Properties", href: "/#featured-properties", scroll: true },
    { label: "FAQs", href: "/#faq", scroll: true },
    { label: "Payment Calculator", onClick: openModal },
    { label: "Contact Us", href: "/contact" },
  ];

  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250, height: "100%", bgcolor: "background.paper" }}
      role="presentation"
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <IconButton onClick={handleCloseDrawer}>
          <AiOutlineClose />
        </IconButton>
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component={item.onClick ? "div" : Link}
            href={item.href}
            onClick={() => handleNavigation(item)}
            sx={{
              color: "text.primary",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {session ? (
          <>
            <Button fullWidth onClick={handleSignOut} sx={{ mb: 1 }}>
              Sign out
            </Button>
            <Button
              fullWidth
              component={Link}
              href={session.user.role === "Admin" ? "/admin" : "/userDashboard"}
              onClick={() =>
                handleNavigation({
                  href:
                    session.user.role === "Admin" ? "/admin" : "/userDashboard",
                })
              }
              sx={{ mb: 1 }}
            >
              Dashboard
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Avatar
                src={imageSrc}
                alt="Profile picture"
                component={Link}
                href={
                  session.user.role === "Admin" ? "/admin" : "/userDashboard"
                }
                onClick={() =>
                  handleNavigation({
                    href:
                      session.user.role === "Admin"
                        ? "/admin"
                        : "/userDashboard",
                  })
                }
                sx={{ cursor: "pointer" }}
              />
            </Box>
          </>
        ) : (
          <>
            <Button
              fullWidth
              component={Link}
              href="/login"
              onClick={() => handleNavigation({ href: "/login" })}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              component={Link}
              href="/signup"
              onClick={() => handleNavigation({ href: "/signup" })}
              variant="contained"
            >
              Signup
            </Button>
          </>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
        <IconButton
          component={Link}
          href="https://www.instagram.com/barebykristen/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineInstagram />
        </IconButton>
        <IconButton
          component={Link}
          href="https://web.facebook.com/barebykristen/?_rdc=1&_rdr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineFacebook />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.google.com/maps/place/BARE+by+Kristen/@40.894809,-73.976772,17z/data=!3m1!4b1!4m8!3m7!1s0x89c2f6fb1daad08d:0x5f51ba263038f799!8m2!3d40.894809!4d-73.976772!9m1!1b1!16s%2Fg%2F1yg6d443k?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineGoogle />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          style={{ cursor: "pointer" }}
          priority
        />
      </Box>
    </Box>
  );

  return (
    <>
      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      <AppBar
        position="fixed"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 2,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            onClick={() => handleNavigation({ href: "/" })}
          >
            <Image
              src={logo}
              alt="logo"
              width={60}
              height={60}
              style={{ cursor: "pointer" }}
              priority
            />
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={item.onClick ? "div" : Link}
                href={item.href}
                scroll={item.scroll}
                onClick={() => handleNavigation(item)}
                sx={{
                  mx: 1,
                  color: "text.primary",
                  cursor: "pointer",
                  "&:hover": {
                    color: "blue",
                    fontWeight: "bold",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Section */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {session ? (
              <>
                <Button
                  onClick={handleSignOut}
                  sx={{
                    mx: 1,
                    color: "text.primary",
                    "&:hover": {
                      color: "blue",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Sign out
                </Button>
                <Button
                  component={Link}
                  href={
                    session.user.role === "Admin" ? "/admin" : "/userDashboard"
                  }
                  onClick={() =>
                    handleNavigation({
                      href:
                        session.user.role === "Admin"
                          ? "/admin"
                          : "/userDashboard",
                    })
                  }
                  sx={{
                    mx: 1,
                    color: "text.primary",
                    "&:hover": {
                      color: "blue",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Dashboard
                </Button>
                <IconButton
                  component={Link}
                  href={
                    session.user.role === "Admin" ? "/admin" : "/userDashboard"
                  }
                  onClick={() =>
                    handleNavigation({
                      href:
                        session.user.role === "Admin"
                          ? "/admin"
                          : "/userDashboard",
                    })
                  }
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    src={imageSrc}
                    alt="Profile picture"
                    sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/login"
                  onClick={() => handleNavigation({ href: "/login" })}
                  sx={{
                    mx: 1,
                    color: "text.primary",
                    "&:hover": {
                      color: "blue",
                      fontWeight: "bold",
                      borderBottom: "2px solid",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  onClick={() => handleNavigation({ href: "/signup" })}
                  variant="contained"
                  sx={{ mx: 1 }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={handleNav}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <AiOutlineMenu />
          </IconButton>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={menuOpen}
          onClose={handleCloseDrawer}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: "65%" },
          }}
        >
          {drawerContent}
        </Drawer>
      </AppBar>
    </>
  );
};

export default Navbar;

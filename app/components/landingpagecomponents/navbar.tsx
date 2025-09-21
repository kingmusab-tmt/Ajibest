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
import { useContext, useState } from "react";
import logo from "@/public/ajibestlogo.png";
import LayoutContext from "../generalcomponents/LayoutContext";

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
  Typography,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { openModal } = useContext(LayoutContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseDrawer = () => {
    setMenuOpen(false);
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
    { label: "FAQs", href: "/#faq", scroll: true },
    { label: "Payment Calculator", href: "", onClick: openModal },
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
            component={Link}
            href={item.href}
            onClick={() => {
              handleCloseDrawer();
              if (item.onClick) item.onClick();
            }}
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {session ? (
          <>
            <Button fullWidth onClick={() => signOut()} sx={{ mb: 1 }}>
              Sign out
            </Button>
            <Button
              fullWidth
              component={Link}
              href={session.user.role === "Admin" ? "/admin" : "/userprofile"}
              onClick={handleCloseDrawer}
              sx={{ mb: 1 }}
            >
              Dashboard
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Avatar
                src={imageSrc}
                alt="Profile picture"
                component={Link}
                href={session.user.role === "Admin" ? "/admin" : "/userprofile"}
                onClick={handleCloseDrawer}
              />
            </Box>
          </>
        ) : (
          <>
            <Button
              fullWidth
              component={Link}
              href="/login"
              onClick={handleCloseDrawer}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              component={Link}
              href="/signup"
              onClick={handleCloseDrawer}
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
        >
          <AiOutlineInstagram />
        </IconButton>
        <IconButton
          component={Link}
          href="https://web.facebook.com/barebykristen/?_rdc=1&_rdr"
        >
          <AiOutlineFacebook />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.google.com/maps/place/BARE+by+Kristen/@40.894809,-73.976772,17z/data=!3m1!4b1!4m8!3m7!1s0x89c2f6fb1daad08d:0x5f51ba263038f799!8m2!3d40.894809!4d-73.976772!9m1!1b1!16s%2Fg%2F1yg6d443k?entry=ttu"
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
        <Box component={Link} href="/">
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
              component={Link}
              href={item.href}
              scroll={item.scroll || false}
              onClick={item.onClick}
              sx={{
                mx: 1,
                color: "text.primary",
                "&:hover": {
                  color: "blue", // change color to blue on hover
                  fontWeight: "bold", // make text bold on hover
                  borderBottom: "2px solid", // optional, if you still want the underline effect
                  borderColor: "primary.main",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Desktop Auth Section */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          {session ? (
            <>
              <Button
                onClick={() => signOut()}
                sx={{ mx: 1, color: "text.primary" }}
              >
                Sign out
              </Button>
              <Button
                component={Link}
                href={session.user.role === "Admin" ? "/admin" : "/userprofile"}
                sx={{ mx: 1, color: "text.primary" }}
              >
                Dashboard
              </Button>
              <IconButton
                component={Link}
                href={session.user.role === "Admin" ? "/admin" : "/userprofile"}
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
                sx={{
                  mx: 1,
                  color: "text.primary",
                  "&:hover": {
                    color: "blue", // change color to blue on hover
                    fontWeight: "bold", // make text bold on hover
                    borderBottom: "2px solid", // optional, if you still want the underline effect
                    borderColor: "primary.main",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/signup"
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
  );
};

export default Navbar;

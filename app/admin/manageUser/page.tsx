"use client";
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Menu,
  People,
  AdminPanelSettings,
  Notifications,
  Sms,
  Security,
} from "@mui/icons-material";
import UsersPage from "./users";
import UserRole from "./updateUserRole";
import NotificationForm from "./notification";
import SendBulkSMS from "./sendSms";

type Section =
  | "Users Details"
  | "Manage User Role"
  | "Notify User(s)"
  | "Send SMS to User(s)";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
}

const ManageUsers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentSection, setCurrentSection] =
    useState<Section>("Users Details");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sections: {
    key: Section;
    label: string;
    icon: React.ReactElement;
    description: string;
  }[] = [
    {
      key: "Users Details",
      label: "Users Details",
      icon: <People />,
      description: "View and manage all user accounts",
    },
    {
      key: "Manage User Role",
      label: "User Roles",
      icon: <AdminPanelSettings />,
      description: "Update user permissions and access levels",
    },
    {
      key: "Notify User(s)",
      label: "Notifications",
      icon: <Notifications />,
      description: "Send notifications to users",
    },
    {
      key: "Send SMS to User(s)",
      label: "Bulk SMS",
      icon: <Sms />,
      description: "Send SMS messages to multiple users",
    },
  ];

  const currentIndex = sections.findIndex(
    (section) => section.key === currentSection
  );

  const handleSectionChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setCurrentSection(sections[newValue].key);
  };

  const handleMobileSectionChange = (section: Section) => {
    setCurrentSection(section);
    setMobileDrawerOpen(false);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "Users Details":
        return <UsersPage />;
      case "Manage User Role":
        return <UserRole />;
      case "Notify User(s)":
        return <NotificationForm />;
      case "Send SMS to User(s)":
        return <SendBulkSMS />;
      default:
        return <UsersPage />;
    }
  };

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Typography
        variant="h6"
        sx={{ px: 2, mb: 2, display: "flex", alignItems: "center" }}
      >
        <Security sx={{ mr: 1 }} />
        Admin Panel
      </Typography>
      <List>
        {sections.map((section, index) => (
          <ListItem key={section.key} disablePadding>
            <ListItemButton
              selected={currentSection === section.key}
              onClick={() => handleMobileSectionChange(section.key)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentSection === section.key ? "white" : "inherit",
                  minWidth: 40,
                }}
              >
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={section.label}
                secondary={isSmallMobile ? undefined : section.description}
                secondaryTypographyProps={{
                  sx: {
                    color:
                      currentSection === section.key
                        ? "rgba(255,255,255,0.8)"
                        : "text.secondary",
                    fontSize: "0.75rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* App Bar for Mobile */}
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "white",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}
          >
            User Management
          </Typography>
          <Chip label="Admin" color="primary" variant="outlined" size="small" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Desktop Tabs */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: "none", md: "block" },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ px: 3, pt: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Manage user accounts, permissions, and communications
            </Typography>
          </Box>

          <Tabs
            value={currentIndex}
            onChange={handleSectionChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: 2,
              "& .MuiTab-root": {
                minHeight: 60,
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                margin: "4px",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                },
              },
            }}
          >
            {sections.map((section, index) => (
              <Tab
                key={section.key}
                icon={section.icon}
                iconPosition="start"
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="600">
                      {section.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="inherit"
                      sx={{ opastate: 0.8 }}
                    >
                      {section.description}
                    </Typography>
                  </Box>
                }
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Mobile Section Indicator */}
        <Paper
          elevation={1}
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
          onClick={() => setMobileDrawerOpen(true)}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {sections.find((s) => s.key === currentSection)?.label}
            </Typography>
            <Typography variant="body2" sx={{ opastate: 0.8 }}>
              {sections.find((s) => s.key === currentSection)?.description}
            </Typography>
          </Box>
          <Menu />
        </Paper>

        {/* Content Area */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ p: { xs: 2, md: 0 } }}>{renderSection()}</Box>
        </Paper>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default ManageUsers;

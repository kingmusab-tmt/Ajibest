"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Payment as PaymentIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import NewProperty from "./createNewProperty";
import Properties from "./propertylisting";
import PropertyAssignmentForm from "./PropertyAssignmentForm";
import AdminWithdrawalsPage from "./withdrawals";

type Section =
  | "Create New Property"
  | "Update Property"
  | "Assign Property"
  | "Withdrawal Requests";

const ManageProperty: React.FC = () => {
  const [currentSection, setCurrentSection] =
    useState<Section>("Update Property");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const renderSection = () => {
    switch (currentSection) {
      case "Create New Property":
        return <NewProperty />;
      case "Update Property":
        return <Properties />;
      case "Assign Property":
        return <PropertyAssignmentForm />;
      case "Withdrawal Requests":
        return <AdminWithdrawalsPage />;
      default:
        return null;
    }
  };

  const sections: Section[] = [
    "Create New Property",
    "Update Property",
    "Assign Property",
    "Withdrawal Requests",
  ];

  const getSectionIcon = (section: Section) => {
    switch (section) {
      case "Create New Property":
        return <AddIcon />;
      case "Update Property":
        return <EditIcon />;
      case "Assign Property":
        return <LinkIcon />;
      case "Withdrawal Requests":
        return <PaymentIcon />;
      default:
        return <AddIcon />;
    }
  };

  const getTabLabel = (section: Section) => {
    if (!isMobile) return section;

    // Mobile abbreviations
    switch (section) {
      case "Create New Property":
        return "Create";
      case "Update Property":
        return "Update";
      case "Assign Property":
        return "Assign";
      case "Withdrawal Requests":
        return "Withdrawals";
      default:
        return section;
    }
  };

  // Desktop Tabs Component
  const DesktopTabs = () => (
    <Paper
      sx={{
        borderRadius: 2,
        mb: 3,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Tabs
        value={currentSection}
        onChange={(_, newValue) => setCurrentSection(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 72,
          "& .MuiTab-root": {
            minHeight: 72,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            mx: 0.5,
            my: 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-1px)",
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          },
          "& .Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[4],
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }}
      >
        {sections.map((section) => (
          <Tab
            key={section}
            value={section}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getSectionIcon(section)}
                <span>{getTabLabel(section)}</span>
              </Box>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <BottomNavigation
      value={currentSection}
      onChange={(_, newValue) => setCurrentSection(newValue)}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        height: 70,
      }}
    >
      {sections.map((section) => (
        <BottomNavigationAction
          key={section}
          value={section}
          label={getTabLabel(section)}
          icon={getSectionIcon(section)}
          sx={{
            minWidth: "auto",
            padding: "8px 12px",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.75rem",
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
            },
            "&.Mui-selected": {
              color: theme.palette.primary.main,
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.8rem",
                fontWeight: 700,
              },
            },
          }}
        />
      ))}
    </BottomNavigation>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        pb: isMobile ? 10 : 0, // Add padding for mobile bottom nav
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", sm: "2rem", lg: "2.5rem" },
                    color: theme.palette.text.primary,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Property Management
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    mt: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Manage properties, assignments, and withdrawal requests
                </Typography>
              </Box>

              <Chip
                icon={<AdminIcon />}
                label="Admin Panel"
                variant="filled"
                color="primary"
                sx={{
                  px: 1,
                  py: 2,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                }}
              />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Navigation & Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Desktop Navigation */}
        {!isMobile && <DesktopTabs />}

        {/* Content Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {currentSection}
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Content */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[6],
            },
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, lg: 4 },
              "&:last-child": { pb: { xs: 2, sm: 3, lg: 4 } },
            }}
          >
            <Box
              sx={{
                transition: "all 0.3s ease-in-out",
                transform: "translateY(0)",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              {renderSection()}
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </Box>
  );
};

export default ManageProperty;

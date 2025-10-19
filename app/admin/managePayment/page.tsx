"use client";
import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Fade,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  VerifiedUser as VerifyIcon,
  Update as UpdateIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import AdminPayment from "./adminpayment";

type Section = "Make Payment for User";

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
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box sx={{ pt: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `payment-tab-${index}`,
    "aria-controls": `payment-tabpanel-${index}`,
  };
}

const ManagePayments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabs = [
    {
      label: "Make Payment for User",
      icon: <PaymentIcon />,
      content: <AdminPayment />,
      description: "Process payments on behalf of users",
      badge: "Active",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0c1a2d 0%, #1a3a5f 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Navigation and Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* Sidebar Navigation - Desktop */}
          {!isMobile && (
            <Box sx={{ width: { lg: 280 } }}>
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  orientation="vertical"
                  variant="scrollable"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: theme.palette.primary.main,
                      width: 3,
                    },
                    "& .MuiTab-root": {
                      minHeight: 70,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "16px 24px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    },
                    "& .Mui-selected": {
                      backgroundColor: theme.palette.action.selected,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  }}
                >
                  {tabs.map((tab, index) => (
                    <Tab
                      key={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="inherit">
                            {tab.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.7,
                              display: "block",
                              mt: 0.5,
                            }}
                          >
                            {tab.description}
                          </Typography>
                        </Box>
                      }
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              </Paper>
            </Box>
          )}

          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            {/* Mobile Tabs */}
            {isMobile && (
              <Paper
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    "& .MuiTab-root": {
                      minHeight: 60,
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                    "& .Mui-selected": {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  }}
                >
                  {tabs.map((tab, index) => (
                    <Tab
                      key={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                      label={tab.label}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              </Paper>
            )}

            {/* Tab Content */}
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                minHeight: 400,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {tabs.map((tab, index) => (
                  <TabPanel key={tab.label} value={currentTab} index={index}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {tab.label}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {tab.description}
                      </Typography>
                    </Box>
                    {tab.content}
                  </TabPanel>
                ))}
              </CardContent>
            </Paper>

            {/* Quick Actions - Mobile */}
            {isMobile && (
              <Card sx={{ mt: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<PaymentIcon />}
                      label="New Payment"
                      variant="outlined"
                      clickable
                    />
                    <Chip
                      icon={<VerifyIcon />}
                      label="Verify"
                      variant="outlined"
                      clickable
                    />
                    <Chip
                      icon={<UpdateIcon />}
                      label="Update"
                      variant="outlined"
                      clickable
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Payment Management System • Secure & Reliable
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ManagePayments;

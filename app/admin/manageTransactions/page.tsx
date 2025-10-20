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
  Chip,
  Fade,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  House as HouseIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp,
  Refresh,
  Download,
  FilterList,
} from "@mui/icons-material";
import TransactionHistory from "../adminComponents/transactionhistory";

type Section = "All Transactions";

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
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
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
    id: `transaction-tab-${index}`,
    "aria-controls": `transaction-tabpanel-${index}`,
  };
}

const ManageTransactions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabs = [
    {
      label: "All Transactions",
      icon: <ReceiptIcon />,
      content: <TransactionHistory />,
      description: "View and manage all transaction records",
      badge: "Live",
      color: "#1976d2",
    },
  ];

  // Mock transaction stats
  const transactionStats = [
    {
      label: "Total Volume",
      value: "$2.8M",
      change: "+12.5%",
      color: "#1976d2",
    },
    { label: "Successful", value: "2,456", change: "+8.2%", color: "#2e7d32" },
    { label: "Pending", value: "134", change: "-3.1%", color: "#ed6c02" },
    { label: "Failed", value: "23", change: "+2.4%", color: "#d32f2f" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f1a2d 0%, #1a365d 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}

        {/* Main Content Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* Sidebar Navigation - Desktop */}
          {!isMobile && (
            <Box sx={{ width: { lg: 320 } }}>
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="h6" gutterBottom>
                    Transaction Types
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Filter by transaction category
                  </Typography>
                </Box>

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
                      minHeight: 80,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "16px 20px",
                      transition: "all 0.3s ease",
                      borderBottom: "1px solid",
                      borderColor: "divider",
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
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body1" fontWeight="inherit">
                            {tab.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opastate: 0.7,
                              display: "block",
                              mt: 0.5,
                            }}
                          >
                            {tab.description}
                          </Typography>
                          <Chip
                            label={tab.badge}
                            size="small"
                            sx={{
                              mt: 1,
                              backgroundColor: `${tab.color}20`,
                              color: tab.color,
                              fontSize: "0.6rem",
                              height: 20,
                            }}
                          />
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
                      fontSize: "0.8rem",
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

            {/* Content Header with Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tabs[currentTab].label}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {tabs[currentTab].description}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
                <IconButton size="small">
                  <Download />
                </IconButton>
                <IconButton size="small">
                  <FilterList />
                </IconButton>
              </Box>
            </Box>

            {/* Tab Content */}
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                minHeight: 600,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {tabs.map((tab, index) => (
                  <TabPanel key={tab.label} value={currentTab} index={index}>
                    {tab.content}
                  </TabPanel>
                ))}
              </CardContent>
            </Paper>

            {/* Quick Stats - Mobile */}
            {isMobile && (
              <Card sx={{ mt: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction Overview
                  </Typography>
                  <Grid container spacing={2}>
                    {transactionStats.map((stat) => (
                      <Grid item xs={6} key={stat.label}>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {stat.label}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              stat.change.startsWith("+")
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {stat.change}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Transaction Management System • Secure & Real-time
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ManageTransactions;

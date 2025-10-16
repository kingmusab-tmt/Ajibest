"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/types/usertypes";
import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
  Stack,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Apartment,
  Payments,
  Schedule,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  TrendingUp,
  People,
  Home,
  CheckCircle,
  Payment,
  House,
} from "@mui/icons-material";
import LoadingSpinner from "../generalcomponents/loadingSpinner";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Analytics Data Interface
interface AnalyticsData {
  propertyStatistics: {
    totalPropertiesPurchased: number;
    totalPropertiesRented: number;
    totalPaymentMade: number;
    totalPaymentToBeMade: number;
    purchasedPropertiesUnderPayment: number;
    rentedPropertiesUnderPayment: number;
  };
  personalInformation: {
    email: string;
    phone: string;
    address: string;
    lastLogin: string | null;
  };
  accountSummary: {
    status: string;
    registrationDate: string;
    nextPaymentDate: string | null;
    nextPaymentAmountDue: number;
  };
  propertiesUnderPayment: Array<{
    title: string;
    propertyId: string;
    propertyType: string;
    listingPurpose: string;
    paymentMethod: string;
    initialPayment: number;
    totalPaid: number;
    remainingBalance: number;
    nextPaymentDate: string | null;
    nextPaymentAmount: number;
    paymentProgress: {
      percentage: number;
      paymentsMade: number;
      totalPayments: number;
    };
  }>;
  propertiesPurchased: Array<{
    title: string;
    propertyId: string;
    propertyType: string;
    paymentDate: string;
    paymentMethod: string;
    propertyPrice: number;
    status: string;
  }>;
  propertiesRented: Array<{
    title: string;
    propertyId: string;
    propertyType: string;
    paymentDate: string;
    paymentMethod: string;
    propertyPrice: number;
    status: string;
  }>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, md: 3 } }}>{children}</Box>}
    </div>
  );
}

const UserInfo: React.FC = () => {
  const { data: session, status } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetch("/api/users/analyticss", {
            headers: {
              "Cache-Control": "no-cache, no-store",
            },
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setAnalyticsData(result.data);
            }
          }
        } catch (error) {
          console.error("Error fetching analytics data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (status === "authenticated") {
      fetchAnalyticsData();
    }
  }, [session, status]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Stats cards using analytics data
  const statsCards = [
    {
      title: "Total Properties Purchased",
      value: analyticsData?.propertyStatistics.totalPropertiesPurchased ?? 0,
      format: "number",
      icon: <Apartment sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.1
      )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
    },
    {
      title: "Total Property Rented",
      value: analyticsData?.propertyStatistics.totalPropertiesRented ?? 0,
      format: "number",
      icon: <House sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.info.main,
        0.1
      )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
    },
    {
      title: "Total Payments Made",
      value: analyticsData?.propertyStatistics.totalPaymentMade ?? 0,
      format: "currency",
      icon: <Payments sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.success.main,
        0.1
      )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
    },
    {
      title: "Total Payment to be Made",
      value: analyticsData?.propertyStatistics.totalPaymentToBeMade ?? 0,
      format: "currency",
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.warning.main,
        0.1
      )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
    },
    {
      title: "Purchased Properties Under Payment",
      value:
        analyticsData?.propertyStatistics.purchasedPropertiesUnderPayment ?? 0,
      format: "number",
      icon: <Apartment sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.1
      )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
    },
    {
      title: "Rented Property Under Payment",
      value:
        analyticsData?.propertyStatistics.rentedPropertiesUnderPayment ?? 0,
      format: "number",
      icon: <House sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.info.main,
        0.1
      )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
    },
  ];

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!analyticsData) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Failed to load analytics data. Please try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={session?.user?.image || ""}
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                border: "3px solid white",
              }}
            >
              {session?.user?.name?.[0] || "U"}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
            >
              {session?.user?.name || "User"}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Chip
                label={session?.user?.role || "User"}
                color="secondary"
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                }}
              />
              <Chip
                label={analyticsData.accountSummary.status}
                color={
                  analyticsData.accountSummary.status === "Active"
                    ? "success"
                    : "warning"
                }
                size="small"
                variant="outlined"
              />
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, mt: { xs: 0.5, sm: 0 } }}
              >
                Member since{" "}
                {formatDate(analyticsData.accountSummary.registrationDate)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card
              elevation={1}
              sx={{
                height: "100%",
                background: stat.gradient,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <Box sx={{ color: stat.color, mb: 1 }}>
                  {React.cloneElement(stat.icon, {
                    sx: { fontSize: { xs: 30, md: 40 } },
                  })}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", md: "1.25rem" } }}
                >
                  {stat.format === "currency"
                    ? formatter.format(stat.value as number)
                    : stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Account Summary Card */}
      <Card
        elevation={1}
        sx={{
          mb: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarToday color="primary" /> Payment Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next Payment Date
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatDate(analyticsData.accountSummary.nextPaymentDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next Payment Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {formatter.format(
                    analyticsData.accountSummary.nextPaymentAmountDue
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Paid
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatter.format(
                    analyticsData.propertyStatistics.totalPaymentMade
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Remaining Balance
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  {formatter.format(
                    analyticsData.propertyStatistics.totalPaymentToBeMade
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            "& .MuiTab-root": {
              py: 1.5,
              minHeight: 48,
              fontSize: { xs: "0.8rem", md: "0.875rem" },
            },
          }}
        >
          <Tab
            icon={<Person sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label="Profile Info"
          />
          <Tab
            icon={<Home sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label="My Properties"
          />
        </Tabs>

        {/* Profile Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    <Person color="primary" /> Personal Information
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Email color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={analyticsData.personalInformation.email}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Phone color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={
                          analyticsData.personalInformation.phone ||
                          "Not provided"
                        }
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={
                          analyticsData.personalInformation.address ||
                          "Not provided"
                        }
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CalendarToday color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Login"
                        secondary={formatDate(
                          analyticsData.personalInformation.lastLogin
                        )}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    <CalendarToday color="primary" /> Account Summary
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Status</Typography>
                      <Chip
                        label={analyticsData.accountSummary.status}
                        color={
                          analyticsData.accountSummary.status === "Active"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Registration Date</Typography>
                      <Typography variant="body2" textAlign="right">
                        {formatDate(
                          analyticsData.accountSummary.registrationDate
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Next Payment Date</Typography>
                      <Typography variant="body2" textAlign="right">
                        {formatDate(
                          analyticsData.accountSummary.nextPaymentDate
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">
                        Next Payment Amount
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        {formatter.format(
                          analyticsData.accountSummary.nextPaymentAmountDue
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Properties Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {/* Properties Under Payment Card */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={1}
                sx={{
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Payment color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      Properties Under Payment (
                      {analyticsData.propertiesUnderPayment.length})
                    </Typography>
                  </Box>

                  {analyticsData.propertiesUnderPayment.length > 0 ? (
                    <Stack spacing={2}>
                      {analyticsData.propertiesUnderPayment.map(
                        (property, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              background: alpha(
                                theme.palette.warning.light,
                                0.05
                              ),
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {property.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Chip
                                label={property.propertyType}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={property.listingPurpose}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={property.paymentProgress.percentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                mb: 1,
                                backgroundColor: alpha(
                                  theme.palette.warning.main,
                                  0.2
                                ),
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: theme.palette.warning.main,
                                },
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.875rem",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                Paid: {formatter.format(property.totalPaid)}
                              </Typography>
                              <Typography variant="body2">
                                Remaining:{" "}
                                {formatter.format(property.remainingBalance)}
                              </Typography>
                            </Box>
                            {property.nextPaymentDate && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "0.875rem",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  Next Payment:{" "}
                                  {formatDate(property.nextPaymentDate)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {formatter.format(property.nextPaymentAmount)}
                                </Typography>
                              </Box>
                            )}
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{ mt: 1 }}
                              startIcon={<Payment />}
                            >
                              Continue Payment
                            </Button>
                          </Paper>
                        )
                      )}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Payment
                        sx={{
                          fontSize: 48,
                          color: theme.palette.text.disabled,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No properties under payment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start your property journey today!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Owned Properties Card */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={1}
                sx={{
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CheckCircle color="success" />
                    <Typography variant="h6" fontWeight="bold">
                      Owned Properties (
                      {analyticsData.propertiesPurchased.length +
                        analyticsData.propertiesRented.length}
                      )
                    </Typography>
                  </Box>

                  {analyticsData.propertiesPurchased.length > 0 ||
                  analyticsData.propertiesRented.length > 0 ? (
                    <Stack spacing={2}>
                      {/* Purchased Properties */}
                      {analyticsData.propertiesPurchased.map(
                        (property, index) => (
                          <Paper
                            key={`purchased-${index}`}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              background: alpha(
                                theme.palette.success.light,
                                0.05
                              ),
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {property.title} (Purchased)
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Chip
                                label={property.propertyType}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label="Fully Paid"
                                size="small"
                                color="success"
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {formatter.format(property.propertyPrice)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(property.paymentDate)}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{ mt: 1 }}
                              startIcon={<Home />}
                            >
                              View Property
                            </Button>
                          </Paper>
                        )
                      )}

                      {/* Rented Properties */}
                      {analyticsData.propertiesRented.map((property, index) => (
                        <Paper
                          key={`rented-${index}`}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            background: alpha(theme.palette.info.light, 0.05),
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {property.title} (Rented)
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Chip
                              label={property.propertyType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label="Active Rental"
                              size="small"
                              color="info"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {formatter.format(property.propertyPrice)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(property.paymentDate)}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            startIcon={<Home />}
                          >
                            View Property
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Home
                        sx={{
                          fontSize: 48,
                          color: theme.palette.text.disabled,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No owned properties yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Complete your first purchase to see it here!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserInfo;

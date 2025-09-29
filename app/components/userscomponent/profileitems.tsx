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
} from "@mui/icons-material";

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
  const [userData, setUserData] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/users/searchbyemail", {
            headers: {
              "Cache-Control": "no-cache, no-store",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData({ ...data.user });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    if (status === "authenticated") {
      fetchUserData();
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsCards = [
    {
      title: "Remaining Balance",
      value: userData?.remainingBalance ?? 0,
      format: "currency",
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.success.main,
        0.1
      )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
    },
    {
      title: "Total Properties",
      value: userData?.totalPropertyPurchased ?? 0,
      format: "number",
      icon: <Apartment sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.1
      )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
    },
    {
      title: "Total Paid",
      value: userData?.totalPaymentMade ?? 0,
      format: "currency",
      icon: <Payments sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.warning.main,
        0.1
      )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
    },
    {
      title: "Pending Payments",
      value: userData?.totalPaymentToBeMade ?? 0,
      format: "currency",
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.error.main,
        0.1
      )} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`,
    },
    ...(session?.user.role === "Agent"
      ? [
          {
            title: "Referral Earnings",
            value: userData?.referralEarnings ?? 0,
            format: "currency",
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: theme.palette.info.main,
            gradient: `linear-gradient(135deg, ${alpha(
              theme.palette.info.main,
              0.1
            )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
          },
          {
            title: "Referrals",
            value: userData?.numberOfReferrals ?? 0,
            format: "number",
            icon: <People sx={{ fontSize: 40 }} />,
            color: theme.palette.secondary.main,
            gradient: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
          },
        ]
      : []),
  ];

  const propertiesUnderPayment = userData?.propertyUnderPayment || [];
  const ownedProperties = userData?.propertyPurOrRented || [];

  if (status === "loading") {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
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
              src={userData?.image || session?.user?.image || ""}
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                border: "3px solid white",
              }}
            >
              {userData?.name?.[0] || session?.user?.name?.[0] || "U"}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
            >
              {userData?.name || session?.user?.name || "User"}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Chip
                label={userData?.role || "User"}
                color="secondary"
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                }}
              />
              <Chip
                label={userData?.isActive ? "Verified" : "Pending Verification"}
                color={userData?.isActive ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, mt: { xs: 0.5, sm: 0 } }}
              >
                Member since{" "}
                {formatDate(userData?.dateOfRegistration || new Date())}
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
                        secondary={userData?.email || session?.user?.email}
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
                        secondary={userData?.phoneNumber || "Not provided"}
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
                          userData?.address
                            ? `${userData.address}, ${userData.lga}, ${userData.state}, ${userData.country}`
                            : "Not provided"
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
                        secondary={
                          userData?.lastLoginTime
                            ? formatDate(userData.lastLoginTime)
                            : "Never"
                        }
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
                        label={userData?.isActive ? "Active" : "Inactive"}
                        color={userData?.isActive ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Registration Date</Typography>
                      <Typography variant="body2" textAlign="right">
                        {formatDate(userData?.dateOfRegistration || new Date())}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">
                        Favorite Properties
                      </Typography>
                      <Typography variant="body2">
                        {userData?.favouriteProperties?.length || 0}
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
                      Properties Under Payment ({propertiesUnderPayment.length})
                    </Typography>
                  </Box>

                  {propertiesUnderPayment.length > 0 ? (
                    <Stack spacing={2}>
                      {propertiesUnderPayment.map((property, index) => {
                        const totalPrice =
                          property.paymentHisotry[0]?.propertyPrice || 0;
                        const paidAmount =
                          ((property as any).initialPayment ?? 0) +
                          (property.paymentHisotry?.reduce(
                            (sum, payment) => sum + payment.amount,
                            0
                          ) ?? 0);
                        const progress =
                          totalPrice > 0 ? (paidAmount / totalPrice) * 100 : 0;

                        return (
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
                                label={property.paymentPurpose}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
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
                              }}
                            >
                              <Typography variant="body2">
                                Paid: {formatter.format(paidAmount)}
                              </Typography>
                              <Typography variant="body2">
                                Total: {formatter.format(totalPrice)}
                              </Typography>
                            </Box>
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
                        );
                      })}
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
                      Owned Properties ({ownedProperties.length})
                    </Typography>
                  </Box>

                  {ownedProperties.length > 0 ? (
                    <Stack spacing={2}>
                      {ownedProperties.map((property, index) => (
                        <Paper
                          key={index}
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

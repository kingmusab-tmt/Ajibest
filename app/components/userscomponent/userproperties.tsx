"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Box,
  Chip,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { PaystackButton } from "react-paystack";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PropertyDetail from "./propertydetail";
import {
  Home,
  CalendarToday,
  Payments,
  Visibility,
  CheckCircle,
  Schedule,
  AccountBalanceWallet,
  ArrowForward,
  Favorite,
  Share,
  LocationOn,
  SquareFoot,
  Bed,
  Bathroom,
} from "@mui/icons-material";

interface PaymentHisotry {
  paymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
}

interface Property {
  title: string;
  propertyId: string;
  paymentDate?: Date;
  propertyPrice: number;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  paymentPurpose: "For Sale" | "For Renting";
  paymentHisotry?: PaymentHisotry[];
  description: string;
  location: string;
  initialPayment: number;
  listingPurpose: string;
  bedrooms: number;
  amenities: string[];
  purchased: boolean;
  rented: boolean;
  utilities: string[];
  image?: string;
}

interface UserProperties {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
}

interface User {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
}

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
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, md: 2 } }}>{children}</Box>}
    </div>
  );
}

const MyProperty = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [userProperties, setUserProperties] = useState<UserProperties | null>(
    null
  );
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await axios.get("/api/users/searchbyemail", {
          headers: {
            "Cache-Control": "no-store",
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        setError("Error fetching user properties");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserProperties({
        propertyPurOrRented: userData.propertyPurOrRented,
        propertyUnderPayment: userData.propertyUnderPayment,
      });
    }
  }, [userData]);

  const handleSuccess = async (reference: any, property: Property) => {
    try {
      const data = {
        reference,
        propertyId: property.propertyId,
        amount: Number(amount?.toFixed(0)),
        email: session?.user.email,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        paymentPurpose: property.paymentPurpose,
      };
      const response = await axios.post("/api/verifyTransaction", data);
      if (response.status === 200) {
        router.push("/userprofile");
      } else {
        setError("Transaction Failed. Please try again.");
      }
    } catch (error) {
      setError(`Error processing payment: ${error}`);
    }
  };

  const config = (property: Property, amount: number) => ({
    email: session?.user.email as string,
    amount: amount * 100,
    publicKey: "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73",
  });

  const componentProps = (property: Property, amount: number) => ({
    ...config(property, amount),
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: session?.user.name,
        },
      ],
    },
    text: "Pay Now",
    onSuccess: ({ reference }) => handleSuccess(reference, property),
    onClose: () => console.log("Payment closed"),
  });

  const handleClickOpen = (property: Property) => {
    setSelectedProperty(property);
    setAmountError(null);
    if (property.paymentHisotry && property.paymentHisotry.length > 0) {
      setAmount(
        property.paymentHisotry[property.paymentHisotry.length - 1].amount || 0
      );
    } else {
      setAmount(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProperty(null);
    setAmount(null);
    setAmountError(null);
  };

  const handleDetailOpen = (property: Property) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailProperty(null);
  };

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

  const getPaymentProgress = (property: Property) => {
    if (!property.paymentHisotry || property.paymentHisotry.length === 0)
      return 0;
    const lastPayment =
      property.paymentHisotry[property.paymentHisotry.length - 1];
    const totalPaid = lastPayment.totalPaymentMade;
    const totalPrice = lastPayment.propertyPrice;
    return totalPrice > 0 ? (totalPaid / totalPrice) * 100 : 0;
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
        >
          Loading your properties...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {error}
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          size={isMobile ? "medium" : "large"}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  const ownedProperties = userProperties?.propertyPurOrRented || [];
  const paymentProperties = userProperties?.propertyUnderPayment || [];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            fontWeight: "bold",
            mb: 1,
          }}
        >
          My Properties
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
        >
          Manage your property portfolio and payments
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
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
            icon={<CheckCircle sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label={`Owned (${ownedProperties.length})`}
          />
          <Tab
            icon={<Schedule sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label={`In Progress (${paymentProperties.length})`}
          />
        </Tabs>

        {/* Owned Properties Tab */}
        <TabPanel value={tabValue} index={0}>
          {ownedProperties.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
              }}
            >
              <CheckCircle
                sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
              >
                No owned properties yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Complete your first purchase to see it here!
              </Typography>
              {/* <Button
                href="/properties"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                startIcon={<Home />}
              >
                Browse Properties
              </Button> */}
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {ownedProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {/* Property Image */}
                    <Box sx={{ position: "relative", height: 160 }}>
                      <Avatar
                        variant="rounded"
                        src={property.image}
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: theme.palette.primary.light,
                        }}
                      >
                        <Home sx={{ fontSize: 48 }} />
                      </Avatar>
                      <Chip
                        label="Fully Owned"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                          fontWeight: "bold",
                          mb: 1,
                        }}
                      >
                        {property.title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <LocationOn
                          color="action"
                          sx={{ fontSize: 18, mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {property.location}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 2 }}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip
                          label={property.propertyType}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<SquareFoot sx={{ fontSize: 16 }} />}
                          label={
                            property.bedrooms
                              ? `${property.bedrooms} Bed`
                              : "Land"
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {formatter.format(property.propertyPrice)}
                        </Typography>
                        <Chip
                          icon={<CheckCircle />}
                          label="Paid"
                          color="success"
                          size="small"
                        />
                      </Box>

                      {property.paymentDate && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Purchased: {formatDate(property.paymentDate)}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                      <Button
                        size={isMobile ? "small" : "medium"}
                        variant="outlined"
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => handleDetailOpen(property)}
                        sx={{ borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Properties Under Payment Tab */}
        <TabPanel value={tabValue} index={1}>
          {paymentProperties.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
              }}
            >
              <Schedule
                sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
              >
                No ongoing payments
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Start a new property purchase to see it here!
              </Typography>
              <Button
                href="/properties"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                startIcon={<Home />}
              >
                Browse Properties
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {paymentProperties.map((property) => {
                const progress = getPaymentProgress(property);
                const lastPayment =
                  property.paymentHisotry?.[property.paymentHisotry.length - 1];

                return (
                  <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[8],
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* Property Image */}
                      <Box sx={{ position: "relative", height: 160 }}>
                        <Avatar
                          variant="rounded"
                          src={property.image}
                          sx={{
                            width: "100%",
                            height: "100%",
                            bgcolor: theme.palette.warning.light,
                          }}
                        >
                          <Home sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Chip
                          label="In Progress"
                          color="warning"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: "bold",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          {property.title}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Payment Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(
                                theme.palette.warning.main,
                                0.2
                              ),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: theme.palette.warning.main,
                              },
                            }}
                          />
                        </Box>

                        {/* Payment Info */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">Remaining:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {lastPayment
                                ? formatter.format(lastPayment.remainingBalance)
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Next Payment:
                            </Typography>
                            <Typography variant="body2">
                              {lastPayment
                                ? formatDate(lastPayment.nextPaymentDate)
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {lastPayment
                            ? formatter.format(lastPayment.amount)
                            : "N/A"}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0, gap: 1 }}>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="contained"
                          fullWidth
                          startIcon={<Payments />}
                          onClick={() => handleClickOpen(property)}
                          sx={{ borderRadius: 2 }}
                        >
                          Pay Now
                        </Button>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="outlined"
                          fullWidth
                          startIcon={<Visibility />}
                          onClick={() => handleDetailOpen(property)}
                          sx={{ borderRadius: 2 }}
                        >
                          Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Payment Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Payments sx={{ mr: 1, verticalAlign: "middle" }} />
          Make Payment
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <DialogContentText
            sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Enter the amount you want to pay for{" "}
            <strong>{selectedProperty?.title}</strong>
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Amount (₦)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount || ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAmount(value);
              setAmountError(null);
            }}
            error={!!amountError}
            helperText={amountError}
            sx={{ mb: 2 }}
          />

          {selectedProperty && (
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Payment Summary:
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Property:</Typography>
                <Typography variant="body2">
                  {selectedProperty.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Type:</Typography>
                <Typography variant="body2">
                  {selectedProperty.propertyType}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Minimum Payment:</Typography>
                <Typography variant="body2">
                  {formatter.format(selectedProperty.initialPayment)}
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const property = userProperties?.propertyUnderPayment.find(
                (property) =>
                  property.propertyId === selectedProperty?.propertyId
              );
              if (property && amount! < property.initialPayment) {
                setAmountError("Amount cannot be less than initial payment");
              } else {
                setAmountError(null);
                (
                  document.querySelector(".paystack-button") as HTMLElement
                )?.click();
              }
            }}
            variant="contained"
            size={isMobile ? "medium" : "large"}
            startIcon={<Payments />}
            sx={{ borderRadius: 2 }}
          >
            Proceed to Pay
          </Button>
          <Box sx={{ display: "none" }}>
            <PaystackButton
              className="paystack-button"
              {...componentProps(selectedProperty!, amount!)}
            />
          </Box>
        </DialogActions>
      </Dialog>

      <PropertyDetail
        open={detailOpen}
        handleClose={handleDetailClose}
        property={detailProperty}
      />
    </Container>
  );
};

export default MyProperty;

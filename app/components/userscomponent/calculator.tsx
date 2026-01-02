"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

// Default property prices in case of fetch failure
const defaultPropertyPrices = {
  land: {
    quarter: 175000,
    half: 350000,
    full: 700000,
  },
  house: {
    "2-bedroom": 2100000,
    "3-bedroom": 3100000,
    "4-bedroom": 4100000,
    "5-bedroom": 5100000,
    "6-bedroom": 6100000,
    "7-bedroom": 7100000,
  },
  farm: {
    "2-bedroom": 1900000,
    "3-bedroom": 2900000,
    "4-bedroom": 3900000,
    "5-bedroom": 4900000,
    "6-bedroom": 5900000,
    "7-bedroom": 6900000,
  },
  commercial: {
    "2-bedroom": 2500000,
    "3-bedroom": 3500000,
    "4-bedroom": 4500000,
    "5-bedroom": 5500000,
    "6-bedroom": 6500000,
    "7-bedroom": 7500000,
  },
  office: {
    "2-bedroom": 2300000,
    "3-bedroom": 3300000,
    "4-bedroom": 4300000,
    "5-bedroom": 5300000,
    "6-bedroom": 6300000,
    "7-bedroom": 7300000,
  },
  shop: {
    "2-bedroom": 2200000,
    "3-bedroom": 3200000,
    "4-bedroom": 4200000,
    "5-bedroom": 5200000,
    "6-bedroom": 6200000,
    "7-bedroom": 7200000,
  },
};

// Fetch property data from the Next.js API
const fetchPropertyData = async (propertyType: string) => {
  try {
    const response = await fetch(
      `/api/propertyData?propertyType=${propertyType}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch property data");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching property data:", error);
    return (
      defaultPropertyPrices[
        propertyType as keyof typeof defaultPropertyPrices
      ] || defaultPropertyPrices.house
    );
  }
};

// Fetch detailed installment calculation
const fetchInstallmentCalculation = async (
  propertyType: string,
  propertyDetail: string,
  durationMonths: number
) => {
  try {
    const response = await fetch("/api/propertyData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyType,
        propertyDetail,
        durationMonths,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to calculate installment");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error calculating installment:", error);
    return null;
  }
};

const PropertyCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyDetail, setPropertyDetail] = useState<string>("");
  const [paymentDuration, setPaymentDuration] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [propertyPrices, setPropertyPrices] = useState<{
    [key: string]: { [key: string]: number };
  }>(defaultPropertyPrices);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [installmentDetails, setInstallmentDetails] = useState<any>(null);

  useEffect(() => {
    if (propertyType) {
      const getPropertyData = async () => {
        setLoading(true);
        setError("");
        try {
          const fetchedData = await fetchPropertyData(propertyType);
          setPropertyPrices((prevPrices) => ({
            ...prevPrices,
            [propertyType]: fetchedData,
          }));
          setUsingFallback(false);
        } catch (err) {
          setError("Failed to fetch property data. Using default prices.");
          setUsingFallback(true);
        } finally {
          setLoading(false);
        }
      };

      getPropertyData();
    }
  }, [propertyType]);

  const handleCalculate = async () => {
    if (!propertyType || !propertyDetail || !paymentDuration) return;

    setCalculating(true);
    setError("");

    try {
      const details = await fetchInstallmentCalculation(
        propertyType,
        propertyDetail,
        paymentDuration
      );

      if (details) {
        setInstallmentDetails(details);
        setMonthlyPayment(details.monthlyPayment);
        setUsingFallback(details.isFallback);
        setIsModalOpen(true);
      } else {
        // Fallback calculation
        const totalPrice = getCurrentPrice();
        if (totalPrice > 0 && paymentDuration > 0) {
          const monthly = Math.round(totalPrice / paymentDuration);
          setMonthlyPayment(monthly);
          setUsingFallback(true);
          setIsModalOpen(true);
        }
      }
    } catch (err) {
      setError("Failed to calculate installment plan. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const resetForm = () => {
    setPropertyType("");
    setPropertyDetail("");
    setPaymentDuration(null);
    setMonthlyPayment(null);
    setError("");
    setUsingFallback(false);
    setInstallmentDetails(null);
  };

  const isFormValid = propertyType && propertyDetail && paymentDuration;

  // Generate menu items based on property type
  const renderPropertyDetailOptions = () => {
    if (propertyType === "land") {
      return [
        <MenuItem key="quarter" value="quarter">
          Quarter Plot
        </MenuItem>,
        <MenuItem key="half" value="half">
          Half Plot
        </MenuItem>,
        <MenuItem key="full" value="full">
          Full Plot
        </MenuItem>,
      ];
    } else if (
      ["house", "farm", "commercial", "office", "shop"].includes(propertyType)
    ) {
      return [
        <MenuItem key="2-bedroom" value="2-bedroom">
          2 Bedroom
        </MenuItem>,
        <MenuItem key="3-bedroom" value="3-bedroom">
          3 Bedroom
        </MenuItem>,
        <MenuItem key="4-bedroom" value="4-bedroom">
          4 Bedroom
        </MenuItem>,
        <MenuItem key="5-bedroom" value="5-bedroom">
          5 Bedroom
        </MenuItem>,
        <MenuItem key="6-bedroom" value="6-bedroom">
          6 Bedroom
        </MenuItem>,
        <MenuItem key="7-bedroom" value="7-bedroom">
          7 Bedroom
        </MenuItem>,
      ];
    }
    return null;
  };

  const getCurrentPrice = () => {
    if (!propertyType || !propertyDetail || !propertyPrices[propertyType])
      return 0;
    return propertyPrices[propertyType][propertyDetail] || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            mb: 3,
          }}
        >
          Property Installment Calculator
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Calculate your monthly installment payments for AJIBEST properties
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={propertyType}
                  onChange={(e) => {
                    setPropertyType(e.target.value);
                    setPropertyDetail("");
                    setPaymentDuration(null);
                  }}
                  label="Property Type"
                >
                  <MenuItem value="">
                    <em>Select Property Type</em>
                  </MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="farm">Farm</MenuItem>
                  <MenuItem value="commercial">Commercial Property</MenuItem>
                  <MenuItem value="office">Office Space</MenuItem>
                  <MenuItem value="shop">Shop Space</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {propertyType && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>
                    {propertyType === "land"
                      ? "Plot Size"
                      : "Property Specification"}
                  </InputLabel>
                  <Select
                    value={propertyDetail}
                    onChange={(e) => setPropertyDetail(e.target.value)}
                    label={
                      propertyType === "land"
                        ? "Plot Size"
                        : "Property Specification"
                    }
                  >
                    <MenuItem value="">
                      <em>
                        Select{" "}
                        {propertyType === "land"
                          ? "Plot Size"
                          : "Property Specification"}
                      </em>
                    </MenuItem>
                    {renderPropertyDetailOptions()}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {propertyDetail && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Payment Duration</InputLabel>
                  <Select
                    value={paymentDuration || ""}
                    onChange={(e) => setPaymentDuration(Number(e.target.value))}
                    label="Payment Duration"
                  >
                    <MenuItem value="">
                      <em>Select Payment Duration</em>
                    </MenuItem>
                    <MenuItem value={6}>6 months</MenuItem>
                    <MenuItem value={12}>12 months</MenuItem>
                    <MenuItem value={18}>18 months</MenuItem>
                    <MenuItem value={24}>24 months</MenuItem>
                    <MenuItem value={36}>36 months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCalculate}
                disabled={!isFormValid || loading || calculating}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {calculating ? (
                  <CircularProgress size={24} />
                ) : (
                  "Calculate Installment Plan"
                )}
              </Button>
            </Grid>

            {propertyDetail && !loading && (
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ bgcolor: "background.default" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Property Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Price:{" "}
                      <strong>{formatCurrency(getCurrentPrice())}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Property Type:{" "}
                      <strong>
                        {propertyType.charAt(0).toUpperCase() +
                          propertyType.slice(1)}
                      </strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Specification:{" "}
                      <strong>
                        {propertyDetail.replace("-", " ").toUpperCase()}
                      </strong>
                    </Typography>
                    {usingFallback && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        * Estimated price based on market averages
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="div">
            Installment Payment Plan
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            {/* Summary Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Property Type:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {propertyType === "land"
                    ? "Land"
                    : propertyType.charAt(0).toUpperCase() +
                      propertyType.slice(1)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {propertyType === "land" ? "Plot Size" : "Specification"}:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {propertyDetail?.replace("-", " ").toUpperCase()}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Property Price:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(getCurrentPrice())}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Duration:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {paymentDuration} months
                </Typography>
              </Grid>
            </Grid>

            {/* Monthly Payment Highlight */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                bgcolor: "success.light",
                borderRadius: 2,
                textAlign: "center",
                border: `2px solid ${theme.palette.success.main}`,
              }}
            >
              <Typography variant="h6" color="success.dark" gutterBottom>
                Monthly Installment Payment
              </Typography>
              <Typography variant="h3" color="success.dark" fontWeight="bold">
                {formatCurrency(monthlyPayment || 0)}
              </Typography>
              <Typography variant="body2" color="success.dark" sx={{ mt: 1 }}>
                for {paymentDuration} months
              </Typography>
            </Box>

            {/* Payment Schedule */}
            {installmentDetails?.breakdown && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Schedule
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {installmentDetails.breakdown
                        .slice(0, 12)
                        .map((payment: any) => (
                          <TableRow key={payment.month}>
                            <TableCell>{payment.month}</TableCell>
                            <TableCell>{payment.dueDate}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="Pending"
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      {installmentDetails.breakdown.length > 12 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography variant="body2" color="text.secondary">
                              ... and {installmentDetails.breakdown.length - 12}{" "}
                              more payments
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {usingFallback && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  These are estimated installment prices based on market
                  averages. Actual prices may vary based on specific property
                  locations and features.
                </Typography>
              </Alert>
            )}

            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This installment plan helps you budget
                for your property purchase. Contact our sales team for exact
                pricing and to begin your purchase process.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={resetForm} variant="outlined" color="secondary">
            New Calculation
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyCalculator;

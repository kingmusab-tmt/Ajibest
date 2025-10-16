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
} from "@mui/material";

// Default property prices in case of fetch failure
const defaultPropertyPrices = {
  land: {
    quarter: 160000,
    half: 310000,
    full: 620000,
  },
  house: {
    "2-bedroom": 2100000,
    "3-bedroom": 3100000,
    "4-bedroom": 4100000,
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
    return await response.json();
  } catch (error) {
    return defaultPropertyPrices[
      propertyType as keyof typeof defaultPropertyPrices
    ];
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
  }>({
    land: defaultPropertyPrices.land,
    house: defaultPropertyPrices.house,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
        } catch (err) {
          setError("Failed to fetch property data. Using default prices.");
        } finally {
          setLoading(false);
        }
      };

      getPropertyData();
    }
  }, [propertyType]);

  const handleCalculate = () => {
    let totalPrice = 0;
    if (propertyType === "land" && propertyDetail in propertyPrices.land) {
      totalPrice = propertyPrices.land[propertyDetail];
    } else if (
      propertyType === "house" &&
      propertyDetail in propertyPrices.house
    ) {
      totalPrice = propertyPrices.house[propertyDetail];
    }

    if (paymentDuration && totalPrice > 0) {
      const monthlyPayment = totalPrice / paymentDuration;
      setMonthlyPayment(monthlyPayment);
      setIsModalOpen(true);
    }
  };

  const resetForm = () => {
    setPropertyType("");
    setPropertyDetail("");
    setPaymentDuration(null);
    setMonthlyPayment(null);
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
    } else if (propertyType === "house") {
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
      ];
    }
    return null;
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
          Property Calculator
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                </Select>
              </FormControl>
            </Grid>

            {propertyType && (
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>
                    {propertyType === "land"
                      ? "Plot Size"
                      : "House Specification"}
                  </InputLabel>
                  <Select
                    value={propertyDetail}
                    onChange={(e) => setPropertyDetail(e.target.value)}
                    label={
                      propertyType === "land"
                        ? "Plot Size"
                        : "House Specification"
                    }
                  >
                    <MenuItem value="">
                      <em>
                        Select{" "}
                        {propertyType === "land"
                          ? "Plot Size"
                          : "House Specification"}
                      </em>
                    </MenuItem>
                    {renderPropertyDetailOptions()}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {propertyDetail && (
              <Grid item xs={12}>
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
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCalculate}
                disabled={!isFormValid || loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Calculate Payment"}
              </Button>
            </Grid>

            {propertyDetail && !loading && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: "background.default" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Price Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Price:{" "}
                      <strong>
                        {(propertyType === "land"
                          ? propertyPrices.land[propertyDetail]
                          : propertyPrices.house[propertyDetail]
                        )?.toLocaleString()}{" "}
                        Naira
                      </strong>
                    </Typography>
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
        maxWidth="sm"
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
            Payment Calculation Result
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Property Type:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {propertyType === "land" ? "Land" : "House"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {propertyType === "land" ? "Plot Size" : "Specification"}:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {propertyDetail.replace("-", " ").toUpperCase()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Payment Duration:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {paymentDuration} months
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Price:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {(propertyType === "land"
                    ? propertyPrices.land[propertyDetail]
                    : propertyPrices.house[propertyDetail]
                  )?.toLocaleString()}{" "}
                  Naira
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "success.light",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" color="success.dark" gutterBottom>
                Monthly Payment
              </Typography>
              <Typography variant="h4" color="success.dark" fontWeight="bold">
                {monthlyPayment?.toLocaleString()} Naira
              </Typography>
            </Box>
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

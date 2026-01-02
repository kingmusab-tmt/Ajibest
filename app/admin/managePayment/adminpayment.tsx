"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Typography,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

const AdminPayment: React.FC = () => {
  const [email, setEmail] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [propertyType, setPropertyType] = useState("");

  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("payOnce");
  const [listingPurpose, setListingPurpose] = useState("");
  const [months, setMonths] = useState(0);
  const [instalmentAllowed, setInstalmentAllowed] = useState(true);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFirstPayment, setIsFirstPayment] = useState(true);

  useEffect(() => {
    const parsedPrice = Number(propertyPrice);
    if (paymentMethod === "installment" && months > 0 && !isNaN(parsedPrice)) {
      setAmount(parsedPrice / months);
    } else {
      setAmount(parsedPrice);
    }
  }, [paymentMethod, months, propertyPrice]);

  const handleSearchProperty = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.get(
        `/api/property/getsingleproperty?title=${propertyTitle}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        }
      );

      // console.log(response);
      if (response.data.success && response.data.data) {
        const property = response.data.data;
        setPropertyId(property._id);
        setPropertyPrice(property.price);
        setPropertyType(property.propertyType);
        setListingPurpose(property.listingPurpose);
        setInstalmentAllowed(property.instalmentAllowed);
        if (isFirstPayment) {
          setPropertyPrice(property.price);
        } else {
          setPropertyPrice(0);
        }
      } else {
        setError("Property not found");
      }
    } catch (error) {
      setError("Error fetching property details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const referenceId = `Admin${Date.now()}`;

    try {
      const baseData = {
        amount,
        email,
        reference: referenceId,
        propertyId,
      };

      let response;

      if (isFirstPayment) {
        // First payment - use verifyTransaction API
        const data = {
          ...baseData,
          propertyPrice,
          propertyType,
          paymentMethod,
          listingPurpose,
        };
        response = await axios.post("/api/verifyTransaction", data);
      } else {
        // Subsequent payment - use subsequent-payment API
        response = await axios.post(
          "/api/verifyTransaction/subsequent-payment",
          baseData
        );
      }

      if (response.data.success) {
        setSuccess(
          `Payment successful${
            response.data.isPaymentCompleted ? " - Property fully paid!" : ""
          }`
        );
        // Reset form on success
        if (response.data.isPaymentCompleted) {
          setPropertyTitle("");
          setPropertyId("");
          setPropertyPrice(0);
          setPropertyType("");
          setListingPurpose("");
          setAmount(0);
        }
      } else {
        setError(response.data.message || "Payment failed");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error in transaction");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return email && propertyTitle && propertyId && amount > 0;
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Admin Payment Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
          align="center"
        >
          Process property payments for users
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Type
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFirstPayment}
                  onChange={(e) => setIsFirstPayment(e.target.checked)}
                  color="primary"
                />
              }
              label={
                isFirstPayment
                  ? "First Payment (New Purchase)"
                  : "Subsequent Payment (Installment)"
              }
            />
            <Typography variant="body2" color="text.secondary">
              {isFirstPayment
                ? "This will create a new property purchase record"
                : "This will add payment to an existing installment plan"}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              type="email"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Property Title"
              value={propertyTitle}
              onChange={(e) => setPropertyTitle(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              onClick={handleSearchProperty}
              disabled={loading || !propertyTitle}
              fullWidth
              sx={{ height: "56px" }}
            >
              {loading ? <LoadingSpinner /> : "Search Property"}
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Property ID"
              value={propertyId}
              disabled
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Property Type"
              value={propertyType}
              disabled
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Listing Purpose"
              value={listingPurpose}
              disabled
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Reference ID"
              value={reference}
              disabled
              fullWidth
            />
          </Grid>

          {isFirstPayment && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Property Price"
                  type="number"
                  value={propertyPrice}
                  onChange={(e) =>
                    setPropertyPrice(parseFloat(e.target.value) || 0)
                  }
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="payOnce">Pay Once</MenuItem>
                    {instalmentAllowed && (
                      <MenuItem value="installment">Installment</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {paymentMethod === "installment" && (
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Installment Period</InputLabel>
                    <Select
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      label="Installment Period"
                    >
                      <MenuItem value={3}>3 Months</MenuItem>
                      <MenuItem value={6}>6 Months</MenuItem>
                      <MenuItem value={12}>12 Months</MenuItem>
                      <MenuItem value={18}>18 Months</MenuItem>
                      <MenuItem value={24}>24 Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </>
          )}

          {paymentMethod === "installment" && months > 0 && isFirstPayment && (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ bgcolor: "action.hover" }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Installment Details
                  </Typography>
                  <Typography>
                    Monthly Payment: <strong>₦{amount.toFixed(2)}</strong>
                  </Typography>
                  <Typography>
                    Total Amount: <strong>₦{propertyPrice.toFixed(2)}</strong>
                  </Typography>
                  <Typography>
                    Duration: <strong>{months} months</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {!isFirstPayment && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Payment Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              disabled={loading || !isFormValid()}
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <LoadingSpinner />
              ) : isFirstPayment ? (
                "Process New Purchase"
              ) : (
                "Process Installment Payment"
              )}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong>
            {isFirstPayment
              ? " First payments will create a new property purchase record and update user's property portfolio."
              : " Subsequent payments will be added to existing installment plans and update payment history."}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPayment;

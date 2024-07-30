"use client";
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const AdminPayment: React.FC = () => {
  const [email, setEmail] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [listingPurpose, setListingPurpose] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("payOnce");
  const [paymentPurpose, setPaymentPurpose] = useState("");
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

      console.log(response);
      if (response.data.success && response.data.data) {
        const property = response.data.data;
        setPropertyId(property._id);
        setPropertyPrice(property.price);
        setPropertyType(property.propertyType);
        setListingPurpose(property.listingPurpose);
        setPaymentPurpose(property.listingPurpose);
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
      const data = {
        amount,
        propertyPrice,
        email,
        reference: referenceId,
        propertyId,
        propertyType,
        paymentMethod,
        paymentPurpose,
      };
      const response = await axios.post("/api/verifyTransaction", data);

      if (response.data.success) {
        setSuccess("Payment successful");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error in transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Payment Form</h1>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <div className="grid gap-4 mb-4">
        <TextField
          label="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <div className="flex gap-4">
          <TextField
            label="Property Title"
            value={propertyTitle}
            onChange={(e) => setPropertyTitle(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchProperty}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Search Property"}
          </Button>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isFirstPayment}
              onChange={(e) => setIsFirstPayment(e.target.checked)}
              color="primary"
            />
          }
          label="First Payment"
        />
        <TextField label="Property ID" value={propertyId} disabled fullWidth />
        <TextField
          label="Property Price"
          type="number"
          value={propertyPrice}
          disabled={isFirstPayment}
          onChange={(e) => setPropertyPrice(parseFloat(e.target.value))}
          fullWidth
        />
        <TextField
          label="Property Type"
          value={propertyType}
          disabled
          fullWidth
        />
        <TextField
          label="Listing Purpose"
          value={listingPurpose}
          disabled
          fullWidth
        />
        <TextField label="Reference" value={reference} disabled fullWidth />
        <FormControl>
          <InputLabel>Payment Type</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="payOnce">Pay Once</MenuItem>
            {instalmentAllowed && (
              <MenuItem value="installment">Installment</MenuItem>
            )}
          </Select>
        </FormControl>
        {paymentMethod === "installment" && (
          <FormControl>
            <InputLabel>Months</InputLabel>
            <Select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              <MenuItem value={1}> </MenuItem>
              <MenuItem value={3}>3 Months</MenuItem>
              <MenuItem value={6}>6 Months</MenuItem>
              <MenuItem value={12}>12 Months</MenuItem>
              <MenuItem value={18}>18 Months</MenuItem>
              <MenuItem value={24}>24 Months</MenuItem>
            </Select>
          </FormControl>
        )}
        {paymentMethod === "installment" && months > 0 && (
          <Typography variant="h6" gutterBottom>
            Installment Amount: ₦{amount.toFixed(2)}
          </Typography>
        )}
        {!isFirstPayment && (
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            fullWidth
          />
        )}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : "Make Payment"}
      </Button>
    </div>
  );
};

export default AdminPayment;

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  Card,
  CardContent,
  SelectChangeEvent,
} from "@mui/material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface Property {
  _id: string;
  title: string;
  price: number;
  propertyType: "House" | "Farm" | "Land" | "Commercial" | "Office" | "Shop";
  listingPurpose: "For Renting" | "For Sale";
  location: string;
  city: string;
  status: "available" | "sold" | "rented";
}

interface PropertyAssignmentFormData {
  userId: string;
  propertyId: string;
  paymentMethod: "installment" | "payOnce";
  initialPayment: number;
  paymentCompleted: boolean;
  nextPaymentDate?: string;
}

const PropertyAssignmentForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<PropertyAssignmentFormData>({
    userId: "",
    propertyId: "",
    paymentMethod: "installment",
    initialPayment: 0,
    paymentCompleted: false,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Fetch users and properties
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, propertiesRes] = await Promise.all([
          fetch("/api/users/getUsers"),
          fetch("/api/property/getproperties"),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Handle the response structure - data is in usersData.data
          setUsers(usersData.data || usersData || []);
        } else {
          console.error("Failed to fetch users:", usersRes.status);
          setUsers([]);
        }

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          // Handle the response structure - data is in propertiesData.data
          setProperties(propertiesData.data || propertiesData || []);
        } else {
          console.error("Failed to fetch properties:", propertiesRes.status);
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: "error", text: "Failed to fetch data" });
        setUsers([]);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selected user and property when form data changes
  useEffect(() => {
    if (formData.userId) {
      const user = users.find((u) => u._id === formData.userId);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }

    if (formData.propertyId) {
      const property = properties.find((p) => p._id === formData.propertyId);
      setSelectedProperty(property || null);
    } else {
      setSelectedProperty(null);
    }
  }, [formData.userId, formData.propertyId, users, properties]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: checked,
    }));
  };

  const calculateRemainingBalance = () => {
    if (!selectedProperty) return 0;
    return selectedProperty.price - formData.initialPayment;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Validate form
      if (!formData.userId || !formData.propertyId) {
        setMessage({
          type: "error",
          text: "Please select both user and property",
        });
        return;
      }

      if (formData.initialPayment < 0) {
        setMessage({
          type: "error",
          text: "Initial payment cannot be negative",
        });
        return;
      }

      if (formData.initialPayment > (selectedProperty?.price || 0)) {
        setMessage({
          type: "error",
          text: "Initial payment cannot exceed property price",
        });
        return;
      }

      if (
        formData.paymentMethod === "installment" &&
        !formData.paymentCompleted &&
        !formData.nextPaymentDate
      ) {
        setMessage({
          type: "error",
          text: "Next payment date is required for installment payments",
        });
        return;
      }

      const assignmentData = {
        ...formData,
        remainingBalance: calculateRemainingBalance(),
        assignmentDate: new Date().toISOString(),
      };

      const response = await fetch("/api/aapi/assign-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Property assigned successfully!",
        });
        // Reset form
        setFormData({
          userId: "",
          propertyId: "",
          paymentMethod: "installment",
          initialPayment: 0,
          paymentCompleted: false,
        });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to assign property",
        });
      }
    } catch (error) {
      console.error("Error assigning property:", error);
      setMessage({ type: "error", text: "Failed to assign property" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ p: 4, maxWidth: 800, mx: "auto" }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Assign Property to User
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* User Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                name="userId"
                value={formData.userId}
                label="Select User"
                onChange={handleSelectChange}
                required
              >
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name} - {user.email} - {user.phoneNumber}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No users available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Property Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Property</InputLabel>
              <Select
                name="propertyId"
                value={formData.propertyId}
                label="Select Property"
                onChange={handleSelectChange}
                required
              >
                {Array.isArray(properties) && properties.length > 0 ? (
                  properties
                    .filter((property) => property.status === "available")
                    .map((property) => (
                      <MenuItem key={property._id} value={property._id}>
                        {property.title} - {property.propertyType} -{" "}
                        {property.listingPurpose} - ₦
                        {property.price.toLocaleString()}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem disabled>No properties available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Selected Property Details */}
          {selectedProperty && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Property Details
                  </Typography>
                  <Typography>
                    <strong>Title:</strong> {selectedProperty.title}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {selectedProperty.propertyType}
                  </Typography>
                  <Typography>
                    <strong>Purpose:</strong> {selectedProperty.listingPurpose}
                  </Typography>
                  <Typography>
                    <strong>Location:</strong> {selectedProperty.location},{" "}
                    {selectedProperty.city}
                  </Typography>
                  <Typography>
                    <strong>Price:</strong> ₦
                    {selectedProperty.price.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Payment Method */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                label="Payment Method"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="installment">Installment</MenuItem>
                <MenuItem value="payOnce">Pay Once</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Initial Payment */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Initial Payment"
              name="initialPayment"
              type="number"
              value={formData.initialPayment}
              onChange={handleInputChange}
              required
              inputProps={{
                min: 0,
                max: selectedProperty?.price,
                step: "0.01",
              }}
            />
          </Grid>

          {/* Next Payment Date (for installment) */}
          {formData.paymentMethod === "installment" &&
            !formData.paymentCompleted && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Next Payment Date"
                  name="nextPaymentDate"
                  type="date"
                  value={formData.nextPaymentDate || ""}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            )}

          {/* Payment Status */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="paymentCompleted"
                  checked={formData.paymentCompleted}
                  onChange={handleCheckboxChange}
                />
              }
              label="Payment Completed"
            />
          </Grid>

          {/* Summary */}
          {selectedProperty && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Summary
                  </Typography>
                  <Typography>
                    <strong>Property Price:</strong> ₦
                    {selectedProperty.price.toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Initial Payment:</strong> ₦
                    {formData.initialPayment.toLocaleString()}
                  </Typography>
                  <Typography
                    color={
                      calculateRemainingBalance() > 0 ? "error" : "success"
                    }
                  >
                    <strong>Remaining Balance:</strong> ₦
                    {calculateRemainingBalance().toLocaleString()}
                  </Typography>
                  {formData.paymentMethod === "installment" && (
                    <Typography variant="body2" color="text.secondary">
                      This property will be added to user&apos;s properties
                      under payment
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              fullWidth
            >
              {submitting ? <LoadingSpinner /> : "Assign Property"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PropertyAssignmentForm;

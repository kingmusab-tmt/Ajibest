"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle,
  HourglassEmpty,
  AttachMoney,
  Person,
  Email,
  Close,
  Save,
  Refresh,
} from "@mui/icons-material";

interface PaymentHistory {
  paymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
}

interface PropertyWithdrawn {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: string;
  propertyType: string;
  listingPurpose: string;
  paymentMethod: string;
  initialPayment: number;
  propertyPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  state: string;
  size?: string;
  instalmentAllowed: boolean;
  paymentHistory?: PaymentHistory[];
  paymentStatus?: "completed" | "in-progress";
  paymentDate?: Date;
  rentalDuration?: number;
}

interface OwnedProperty {
  _id: string;
  email: string;
  name: string;
  ownedProperties: PropertyWithdrawn[];
}

const OwnedPropertiesManagement: React.FC = () => {
  const [users, setUsers] = useState<OwnedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    userEmail: string;
    propertyId: string;
    property: PropertyWithdrawn;
  } | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Edit form state
  const [editedProperty, setEditedProperty] = useState<
    Partial<PropertyWithdrawn>
  >({});

  useEffect(() => {
    fetchOwnedProperties();
  }, []);

  const fetchOwnedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/admin/ownedProperties");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching owned properties:", err);
      setError(
        err.response?.data?.message || "Failed to load owned properties",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeClick = (
    userEmail: string,
    propertyId: string,
    property: PropertyWithdrawn,
  ) => {
    setSelectedProperty({ userEmail, propertyId, property });
    setRevokeDialogOpen(true);
  };

  const handleEditClick = (
    userEmail: string,
    propertyId: string,
    property: PropertyWithdrawn,
  ) => {
    setSelectedProperty({ userEmail, propertyId, property });
    setEditedProperty({
      title: property.title,
      description: property.description,
      propertyPrice: property.propertyPrice,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: property.amenities,
      utilities: property.utilities,
      size: property.size,
    });
    setEditDialogOpen(true);
  };

  const handleRevokePurchase = async () => {
    if (!selectedProperty || !revokeReason.trim()) {
      setError("Please provide a reason for revoking the purchase");
      return;
    }

    setRevoking(true);
    setError(null);

    try {
      const response = await axios.post("/api/admin/revokePurchase", {
        userEmail: selectedProperty.userEmail,
        propertyId: selectedProperty.propertyId,
        reason: revokeReason,
      });

      if (response.data.success) {
        setRevokeDialogOpen(false);
        setSelectedProperty(null);
        setRevokeReason("");
        fetchOwnedProperties();
      }
    } catch (err: any) {
      console.error("Error revoking purchase:", err);
      setError(err.response?.data?.message || "Failed to revoke purchase");
    } finally {
      setRevoking(false);
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedProperty) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await axios.patch("/api/admin/updateOwnedProperty", {
        userEmail: selectedProperty.userEmail,
        propertyId: selectedProperty.propertyId,
        updates: editedProperty,
      });

      if (response.data.success) {
        setEditDialogOpen(false);
        setSelectedProperty(null);
        setEditedProperty({});
        fetchOwnedProperties();
      }
    } catch (err: any) {
      console.error("Error updating property:", err);
      setError(err.response?.data?.message || "Failed to update property");
    } finally {
      setUpdating(false);
    }
  };

  const getPaymentStatus = (property: PropertyWithdrawn) => {
    if (
      property.paymentStatus === "completed" ||
      property.paymentMethod === "payOnce"
    ) {
      return {
        label: "Fully Paid",
        color: "success" as const,
        icon: <CheckCircle />,
      };
    }

    if (property.paymentStatus === "in-progress") {
      const lastPayment =
        property.paymentHistory && property.paymentHistory.length > 0
          ? property.paymentHistory[property.paymentHistory.length - 1]
          : null;

      if (lastPayment?.paymentCompleted) {
        return {
          label: "Completed",
          color: "success" as const,
          icon: <CheckCircle />,
        };
      }

      return {
        label: "In Progress",
        color: "warning" as const,
        icon: <HourglassEmpty />,
      };
    }

    return {
      label: "Unknown",
      color: "default" as const,
      icon: <HourglassEmpty />,
    };
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const allProperties = users.flatMap((user) =>
    user.ownedProperties.map((property) => ({
      user,
      property,
    })),
  );

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Total Properties: {allProperties.length}
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={fetchOwnedProperties}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {allProperties.length === 0 ? (
        <Alert severity="info">No owned properties found</Alert>
      ) : (
        <Grid container spacing={3}>
          {allProperties.map(({ user, property }, index) => {
            const status = getPaymentStatus(property);
            const lastPayment =
              property.paymentHistory && property.paymentHistory.length > 0
                ? property.paymentHistory[property.paymentHistory.length - 1]
                : null;

            return (
              <Grid
                size={{ xs: 12, md: 6, lg: 4 }}
                key={`${user.email}-${property.propertyId}-${index}`}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.image}
                    alt={property.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {property.title}
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={status.icon}
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                      <Chip
                        label={property.listingPurpose}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {user.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatter.format(property.propertyPrice)}
                        </Typography>
                      </Box>
                    </Stack>

                    {property.paymentMethod === "installment" &&
                      property.paymentHistory &&
                      property.paymentHistory.length > 0 &&
                      lastPayment && (
                        <Paper
                          elevation={0}
                          sx={{ mt: 2, p: 1.5, bgcolor: "grey.50" }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Payment Progress
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            Paid:{" "}
                            {formatter.format(lastPayment.totalPaymentMade)}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            Remaining:{" "}
                            {formatter.format(lastPayment.remainingBalance)}
                          </Typography>
                        </Paper>
                      )}
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() =>
                          handleEditClick(
                            user.email,
                            property.propertyId,
                            property,
                          )
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleRevokeClick(
                            user.email,
                            property.propertyId,
                            property,
                          )
                        }
                      >
                        Revoke
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Revoke Purchase Dialog */}
      <Dialog
        open={revokeDialogOpen}
        onClose={() => !revoking && setRevokeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Revoke Purchase
            <IconButton
              onClick={() => setRevokeDialogOpen(false)}
              disabled={revoking}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to revoke this purchase? This will remove the
            property from the user's account and make it available again.
          </Typography>

          {selectedProperty && (
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2">
                {selectedProperty.property.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Owner: {selectedProperty.userEmail}
              </Typography>
            </Paper>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Revocation"
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            required
            helperText="Provide a clear reason for revoking this purchase"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRevokeDialogOpen(false)}
            disabled={revoking}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRevokePurchase}
            color="error"
            variant="contained"
            disabled={revoking || !revokeReason.trim()}
          >
            {revoking ? "Revoking..." : "Revoke Purchase"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !updating && setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Edit Property Details
            <IconButton
              onClick={() => setEditDialogOpen(false)}
              disabled={updating}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Property Title"
                  value={editedProperty.title || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      title: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={editedProperty.description || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Property Price"
                  type="number"
                  value={editedProperty.propertyPrice || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      propertyPrice: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₦</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={editedProperty.size || ""}
                    onChange={(e) =>
                      setEditedProperty({
                        ...editedProperty,
                        size: e.target.value,
                      })
                    }
                    label="Size"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Quarter Plot">Quarter Plot</MenuItem>
                    <MenuItem value="Half Plot">Half Plot</MenuItem>
                    <MenuItem value="Full Plot">Full Plot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={editedProperty.bedrooms || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      bedrooms: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={editedProperty.bathrooms || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      bathrooms: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Amenities"
                  value={editedProperty.amenities || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      amenities: e.target.value,
                    })
                  }
                  helperText="Comma-separated list"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Utilities"
                  value={editedProperty.utilities || ""}
                  onChange={(e) =>
                    setEditedProperty({
                      ...editedProperty,
                      utilities: e.target.value,
                    })
                  }
                  helperText="Comma-separated list"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProperty}
            variant="contained"
            startIcon={<Save />}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Property"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnedPropertiesManagement;

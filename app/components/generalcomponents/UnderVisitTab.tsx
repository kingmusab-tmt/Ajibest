import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Modal,
} from "@mui/material";
import {
  Schedule,
  LocationOn,
  Payments,
  Info,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import PaymentPage from "@/app/components/userscomponent/payment";

interface VisitProperty {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    description?: string;
    location: string;
    state?: string;
    city?: string;
    image: string;
    price: number;
    listingPurpose: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: string;
    amenities?: string;
    utilities?: string;
    instalmentAllowed?: boolean;
  };
  visitDate: string;
  visitTime?: string;
  status: string;
  createdAt: string;
}

const UnderVisitTab: React.FC = () => {
  const [visits, setVisits] = useState<VisitProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [releasing, setReleasing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<VisitProperty | null>(null);

  useEffect(() => {
    fetchUnderVisitProperties();
  }, []);

  const fetchUnderVisitProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "/api/property/visitSchedule?status=scheduled",
      );
      if (response.data.success) {
        setVisits(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
      setError("Failed to load under visit properties");
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseClick = (visitId: string) => {
    setSelectedVisitId(visitId);
    setReleaseDialogOpen(true);
  };

  const handleBuyRentClick = (visit: VisitProperty) => {
    setSelectedProperty(visit);
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedProperty(null);
  };

  const handlePaymentSuccess = () => {
    if (selectedProperty) {
      // Remove the property from visits list after successful payment
      setVisits(visits.filter((v) => v._id !== selectedProperty._id));
    }
    handlePaymentClose();
  };

  const handleConfirmRelease = async () => {
    if (!selectedVisitId) return;

    setReleasing(true);
    try {
      const response = await axios.patch(
        `/api/property/visitSchedule/${selectedVisitId}`,
        { status: "released" },
      );

      if (response.data.success) {
        setVisits(visits.filter((v) => v._id !== selectedVisitId));
        setReleaseDialogOpen(false);
        setSelectedVisitId(null);
      }
    } catch (err) {
      console.error("Error releasing property:", err);
      setError("Failed to release property");
    } finally {
      setReleasing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (visits.length === 0) {
    return (
      <Alert severity="info">
        No properties scheduled for visit. Go to Property Listing to schedule
        visits.
      </Alert>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {visits.map((visit) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={visit._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={visit.propertyId.image}
                alt={visit.propertyId.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {visit.propertyId.title}
                </Typography>

                {visit.propertyId.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {visit.propertyId.description}
                  </Typography>
                )}

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {visit.propertyId.location}
                      {visit.propertyId.state && `, ${visit.propertyId.state}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Visit: {new Date(visit.visitDate).toLocaleDateString()}
                      {visit.visitTime ? ` at ${visit.visitTime}` : ""}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Payments fontSize="small" color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="primary"
                    >
                      ₦{visit.propertyId.price.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={visit.propertyId.listingPurpose}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {visit.propertyId.propertyType && (
                    <Chip
                      label={visit.propertyId.propertyType}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {visit.propertyId.bedrooms && (
                    <Chip
                      label={`${visit.propertyId.bedrooms} Beds`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {visit.propertyId.bathrooms && (
                    <Chip
                      label={`${visit.propertyId.bathrooms} Baths`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {visit.propertyId.size && (
                    <Chip
                      label={visit.propertyId.size}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between", pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Payments />}
                  onClick={() => handleBuyRentClick(visit)}
                >
                  Buy/Rent
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleReleaseClick(visit._id)}
                >
                  Release
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Release Confirmation Dialog */}
      <Dialog
        open={releaseDialogOpen}
        onClose={() => setReleaseDialogOpen(false)}
      >
        <DialogTitle>Release Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to release this property? It will be available
            for other users to schedule visits.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReleaseDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmRelease}
            color="error"
            variant="contained"
            disabled={releasing}
          >
            {releasing ? "Releasing..." : "Release"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Modal
        open={showPayment}
        onClose={handlePaymentClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
          }}
        >
          {selectedProperty && (
            <PaymentPage
              propertyId={selectedProperty.propertyId._id}
              type={selectedProperty.propertyId.propertyType || "Residential"}
              price={selectedProperty.propertyId.price}
              listingPurpose={selectedProperty.propertyId.listingPurpose}
              instalmentAllowed={
                selectedProperty.propertyId.instalmentAllowed ?? false
              }
              onClose={handlePaymentClose}
              onPaymentSuccess={handlePaymentSuccess}
              visitId={selectedProperty._id}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UnderVisitTab;

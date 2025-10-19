"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Chip,
  Grid,
  Alert,
  Divider,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  LocationOn,
  Hotel,
  Bathtub,
  SquareFoot,
  CheckCircle,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import LoadingSpinner from "../../components/generalcomponents/loadingSpinner";

interface PropertyDetailProps {
  open: boolean;
  handleClose: () => void;
  property: {
    propertyId: string;
  } | null;
}

interface Property {
  title: string;
  image: string;
  bathrooms: string;
  size: string;
  description: string;
  location: string;
  price?: number;
  listingPurpose: string;
  bedrooms: number;
  amenities: string[];
  purchased: boolean;
  rented: boolean;
  utilities: string[];
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({
  open,
  handleClose,
  property,
}) => {
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!property?.propertyId) {
      setPropertyData(null);
      return;
    }

    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      setImageError(false);

      try {
        const response = await fetch(
          `/api/property/getsingleproperty?id=${property.propertyId}`,
          {
            headers: {
              "Cache-Control": "no-cache, no-store",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setPropertyData(data.data);
        } else {
          throw new Error("Invalid property data");
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property?.propertyId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusChip = (purchased: boolean, rented: boolean) => {
    if (purchased) {
      return (
        <Chip icon={<CheckCircle />} label="Sold" color="error" size="small" />
      );
    }
    if (rented) {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Rented"
          color="warning"
          size="small"
        />
      );
    }
    return (
      <Chip
        icon={<CheckCircle />}
        label="Available"
        color="success"
        size="small"
      />
    );
  };

  if (!property) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 2,
        }}
      >
        <Typography variant="h6" component="h2" fontWeight="bold">
          Property Details
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Box p={3}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        ) : propertyData ? (
          <Card sx={{ boxShadow: "none" }}>
            {/* Property Image */}
            <Box position="relative">
              <CardMedia
                component="img"
                height={isMobile ? 200 : 300}
                image={
                  imageError
                    ? "/images/property-placeholder.jpg"
                    : `/uploads/${propertyData.image}`
                }
                alt={propertyData.title}
                onError={handleImageError}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                }}
              />
              <Box
                position="absolute"
                top={16}
                right={16}
                display="flex"
                gap={1}
              >
                {getStatusChip(propertyData.purchased, propertyData.rented)}
                <Chip
                  icon={<Visibility />}
                  label={propertyData.listingPurpose}
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Title and Price */}
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                {propertyData.title}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocationOn color="primary" fontSize="small" />
                <Typography variant="body1" color="text.secondary">
                  {propertyData.location}
                </Typography>
              </Box>

              <Typography
                variant="h4"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                {formatPrice(propertyData.price)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Key Features */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Stack alignItems="center" spacing={1}>
                    <Hotel color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {propertyData.bedrooms}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bedrooms
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack alignItems="center" spacing={1}>
                    <Bathtub color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {propertyData.bathrooms}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bathrooms
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack alignItems="center" spacing={1}>
                    <SquareFoot color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {propertyData.size}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Size
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack alignItems="center" spacing={1}>
                    <CheckCircle color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      {propertyData.listingPurpose}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              {/* Description */}
              <Typography variant="body1" paragraph>
                {propertyData.description}
              </Typography>

              {/* Amenities */}
              {propertyData.amenities && propertyData.amenities.length > 0 && (
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Amenities
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {propertyData.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Utilities */}
              {propertyData.utilities && propertyData.utilities.length > 0 && (
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Utilities
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {propertyData.utilities.map((utility, index) => (
                      <Chip
                        key={index}
                        label={utility}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Availability Status */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                  mt: 2,
                }}
              >
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Availability Status:
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {propertyData.purchased ? (
                    <>
                      <Cancel color="error" />
                      <Typography color="error" variant="body2">
                        This property has been sold
                      </Typography>
                    </>
                  ) : propertyData.rented ? (
                    <>
                      <Cancel color="warning" />
                      <Typography color="warning.main" variant="body2">
                        This property is currently rented
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircle color="success" />
                      <Typography color="success.main" variant="body2">
                        This property is available for{" "}
                        {propertyData.listingPurpose}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box p={3} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No property data available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100 }}>
          Close
        </Button>
        {propertyData && !propertyData.purchased && !propertyData.rented && (
          <Button
            variant="contained"
            sx={{ minWidth: 120 }}
            onClick={() => {
              // Add your inquiry/contact logic here
              // console.log("Contact about property:", propertyData.title);
            }}
          >
            Contact Agent
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDetail;

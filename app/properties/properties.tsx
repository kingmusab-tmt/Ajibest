// app/properties/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import {
  LocationOn,
  Home,
  AttachMoney,
  ArrowBack,
  Bed,
  Bathroom,
} from "@mui/icons-material";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  image: string;
  propertyType: string;
  price: number;
  listingPurpose: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  size: string;
  status: string;
}

const PropertiesPage = () => {
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // Get filter parameters from URL
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");
  const priceRange = searchParams.get("priceRange");
  const purpose = searchParams.get("purpose");
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        // Build query string from filters
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (propertyType) params.append("propertyType", propertyType);
        if (priceRange) params.append("priceRange", priceRange);
        if (purpose) params.append("purpose", purpose);
        params.append("page", page);

        const response = await fetch(`/api/properties?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        if (data.success) {
          setProperties(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Failed to fetch properties");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [city, propertyType, priceRange, purpose, page]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatLocation = (loc: string) => {
    return loc.charAt(0).toUpperCase() + loc.slice(1);
  };

  const formatType = (type: string) => {
    return type
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    window.location.search = params.toString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading properties...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={Link} href="/" startIcon={<ArrowBack />}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Available Properties
        </Typography>
      </Box>

      {/* Filter summary */}
      {(city || propertyType || priceRange || purpose) && (
        <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filters Applied:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {city && city !== "all" && (
              <Chip
                icon={<LocationOn />}
                label={`City: ${formatLocation(city)}`}
                variant="outlined"
              />
            )}
            {propertyType && propertyType !== "all" && (
              <Chip
                icon={<Home />}
                label={`Type: ${formatType(propertyType)}`}
                variant="outlined"
              />
            )}
            {purpose && purpose !== "all" && (
              <Chip
                label={`Purpose: ${
                  purpose === "sale" ? "For Sale" : "For Rent"
                }`}
                variant="outlined"
              />
            )}
            {priceRange && priceRange !== "all" && (
              <Chip
                icon={<AttachMoney />}
                label={`Price: ${priceRange.replace("-", " - ₦")}`}
                variant="outlined"
              />
            )}
          </Box>
        </Paper>
      )}

      {properties.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No properties found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or browse all properties
          </Typography>
          <Button component={Link} href="/" variant="contained">
            Back to Search
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Found {pagination.total} propert
            {pagination.total === 1 ? "y" : "ies"}
          </Typography>
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
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
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {property.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn
                        color="action"
                        sx={{ fontSize: 20, mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {property.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {property.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={formatType(property.propertyType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={property.size}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      {property.bedrooms && (
                        <Chip
                          icon={<Bed />}
                          label={property.bedrooms}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                      {property.bathrooms && (
                        <Chip
                          icon={<Bathroom />}
                          label={property.bathrooms}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      )}
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {formatPrice(property.price)}
                    </Typography>
                    <Button variant="contained" size="small">
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default PropertiesPage;

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
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  Pagination,
  Stack,
  alpha,
  CardActionArea,
  Rating,
  IconButton,
  Fab,
} from "@mui/material";
import {
  LocationOn,
  Home,
  AttachMoney,
  ArrowBack,
  Bed,
  Bathroom,
  SquareFoot,
  Favorite,
  FavoriteBorder,
  FilterList,
  ViewCarousel,
  GridView,
} from "@mui/icons-material";
import Link from "next/link";
import LoadingSpinner from "../components/generalcomponents/loadingSpinner";

interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  state?: string;
  image: string;
  propertyType: string;
  price: number;
  listingPurpose: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  size: string;
  status: string;
  rating?: number;
  reviews?: number;
  purchased?: boolean;
  rented?: boolean;
  utilities?: string;
  rentalDuration?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  success: boolean;
  data: Property[];
  pagination?: PaginationInfo;
  isFallback?: boolean;
  message?: string;
}

const PropertiesContent = () => {
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Get filter parameters from URL
  const state = searchParams.get("state");
  const propertyType = searchParams.get("propertyType");
  const priceRange = searchParams.get("priceRange");
  const purpose = searchParams.get("purpose");
  const pageParam = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string from filters
        const params = new URLSearchParams();
        if (state) params.append("state", state);
        if (propertyType) params.append("propertyType", propertyType);
        if (priceRange) params.append("priceRange", priceRange);
        if (purpose) params.append("purpose", purpose);
        params.append("page", pageParam);

        const response = await fetch(`/api/properties?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setProperties(data.data || []);
          setPagination(
            data.pagination || {
              page: parseInt(pageParam),
              limit: 12,
              total: data.data?.length || 0,
              pages: 1,
            }
          );
        } else {
          throw new Error(data.message || "Failed to fetch properties");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load properties. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [state, propertyType, priceRange, purpose, pageParam]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatLocation = (loc: string) => {
    if (!loc) return "";
    return loc.charAt(0).toUpperCase() + loc.slice(1);
  };

  const formatType = (type: string) => {
    if (!type) return "";
    return type
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const params = new URLSearchParams();

    // Preserve existing filters
    if (state) params.append("state", state);
    if (propertyType) params.append("propertyType", propertyType);
    if (priceRange) params.append("priceRange", priceRange);
    if (purpose) params.append("purpose", purpose);
    params.append("page", value.toString());

    // Update URL
    window.history.pushState({}, "", `/properties?${params.toString()}`);

    // Trigger data refetch
    const newUrl = new URL(window.location.href);
    newUrl.search = params.toString();
    window.location.href = newUrl.toString();
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const getFilterSummary = () => {
    const filters: string[] = [];
    if (state && state !== "all")
      filters.push(`State: ${formatLocation(state)}`);
    if (propertyType && propertyType !== "all") {
      filters.push(`Type: ${formatType(propertyType.replace(/\+/g, " "))}`);
    }
    if (purpose && purpose !== "all") {
      filters.push(`Purpose: ${purpose === "sale" ? "For Sale" : "For Rent"}`);
    }
    if (priceRange && priceRange !== "all") {
      filters.push(`Price: ₦${priceRange.replace("-", " - ₦")}`);
    }
    return filters;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/images/placeholder-property.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return imagePath;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 }, mt: 6 }}
    >
      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ minWidth: "auto" }}
            >
              {isMobile ? "" : "Back"}
            </Button>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.125rem" },
                fontWeight: "bold",
              }}
            >
              Available Properties
              {getFilterSummary().length > 0 && " (Filtered)"}
            </Typography>
          </Box>

          {/* View Mode Toggle */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              View:
            </Typography>
            <IconButton
              onClick={toggleViewMode}
              color={viewMode === "grid" ? "primary" : "default"}
              size={isMobile ? "small" : "medium"}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={toggleViewMode}
              color={viewMode === "list" ? "primary" : "default"}
              size={isMobile ? "small" : "medium"}
            >
              <ViewCarousel />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
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
      )}

      {/* Filter Summary */}
      {getFilterSummary().length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            background: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
          >
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {getFilterSummary().map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                variant="filled"
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{ mb: 1 }}
              />
            ))}
            <Button
              component={Link}
              href="/properties"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            >
              Clear All
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Results Count */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontSize: { xs: "1.1rem", md: "1.25rem" },
          color: "text.secondary",
        }}
      >
        Found {pagination.total} propert{pagination.total === 1 ? "y" : "ies"}
        {pagination.pages > 1 &&
          ` • Page ${pagination.page} of ${pagination.pages}`}
      </Typography>

      {properties.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            background: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 3,
          }}
        >
          <Home
            sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
          />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
          >
            No properties found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            {getFilterSummary().length > 0
              ? "Try adjusting your filters or browse all properties"
              : "No properties available at the moment"}
          </Typography>
          {getFilterSummary().length > 0 ? (
            <Button
              component={Link}
              href="/properties"
              variant="contained"
              size={isMobile ? "medium" : "large"}
              startIcon={<FilterList />}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              component={Link}
              href="/"
              variant="contained"
              size={isMobile ? "medium" : "large"}
              startIcon={<ArrowBack />}
            >
              Back to Home
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Properties Grid/List */}
          <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
            {properties.map((property) => (
              <Grid
                item
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "grid" ? 4 : 12}
                key={property._id}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection:
                      viewMode === "list" && !isMobile ? "row" : "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/login`}
                    sx={{
                      display: "flex",
                      flexDirection:
                        viewMode === "list" && !isMobile ? "row" : "column",
                      alignItems: "stretch",
                      flex: 1,
                    }}
                  >
                    {/* Property Image */}
                    <Box
                      sx={{
                        position: "relative",
                        width:
                          viewMode === "list" && !isMobile ? "40%" : "100%",
                        minHeight: viewMode === "list" && !isMobile ? 200 : 220,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getImageUrl(property.image)}
                        alt={property.title}
                        sx={{
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-property.jpg";
                        }}
                      />

                      {/* Overlay Badges */}
                      <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                        <Chip
                          label={
                            property.listingPurpose === "sale"
                              ? "For Sale"
                              : "For Rent"
                          }
                          color={
                            property.listingPurpose === "sale"
                              ? "success"
                              : "primary"
                          }
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                      </Box>

                      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(property._id);
                          }}
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            "&:hover": { backgroundColor: "white" },
                          }}
                        >
                          {favorites.has(property._id) ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Property Content */}
                    <CardContent
                      sx={{
                        flex: 1,
                        p: { xs: 2, md: 3 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        {/* Title and Rating */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              fontSize: { xs: "1.1rem", md: "1.25rem" },
                              fontWeight: "bold",
                              lineHeight: 1.2,
                            }}
                          >
                            {property.title}
                          </Typography>
                          {property.rating && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: 1,
                              }}
                            >
                              <Rating
                                value={property.rating}
                                size="small"
                                readOnly
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 0.5 }}
                              >
                                ({property.reviews})
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Location */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <LocationOn
                            color="action"
                            sx={{ fontSize: 20, mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {property.location}
                            {property.state && `, ${property.state}`}
                          </Typography>
                        </Box>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: { xs: "none", sm: "block" },
                            fontSize: { xs: "0.8rem", md: "0.875rem" },
                          }}
                        >
                          {truncateDescription(
                            property.description,
                            viewMode === "list" ? 120 : 80
                          )}
                        </Typography>

                        {/* Features */}
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mb: 2 }}
                        >
                          <Chip
                            label={formatType(property.propertyType)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          {property.size && (
                            <Chip
                              icon={<SquareFoot sx={{ fontSize: 16 }} />}
                              label={property.size}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          )}
                          {property.bedrooms && (
                            <Chip
                              icon={<Bed sx={{ fontSize: 16 }} />}
                              label={`${property.bedrooms} Bed`}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          )}
                          {property.bathrooms && (
                            <Chip
                              icon={<Bathroom sx={{ fontSize: 16 }} />}
                              label={`${property.bathrooms} Bath`}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Price and Action */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 1,
                          borderTop: `1px solid ${theme.palette.divider}`,
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
                          {formatPrice(property.price)}
                          {property.listingPurpose === "rent" && "/mo"}
                        </Typography>
                        <Button
                          variant="contained"
                          size={isMobile ? "small" : "medium"}
                          sx={{ borderRadius: 2 }}
                        >
                          Buy Now
                        </Button>
                      </Box>
                    </CardContent>
                  </CardActionArea>
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
                size={isSmallMobile ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && properties.length > 0 && (
        <Fab
          color="primary"
          aria-label="filter"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          component={Link}
          href="/filters"
        >
          <FilterList />
        </Fab>
      )}
    </Container>
  );
};

export default PropertiesContent;

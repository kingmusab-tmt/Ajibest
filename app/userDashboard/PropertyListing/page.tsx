"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Property } from "@/constants/interface";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  MenuItem,
  Select,
  Modal,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Container,
  Chip,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Rating,
  Fab,
  Pagination,
  Divider,
  CardActions,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  SquareFoot,
  Bed,
  Bathroom,
  Home,
  Landscape,
  Agriculture,
  FilterList,
  Sort,
  Share,
  Visibility,
  Payment,
  Shop,
  LocalPostOffice,
  BuildCircleOutlined,
} from "@mui/icons-material";
import PaymentPage from "@/app/components/userscomponent/payment";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "₦50K - ₦200K", min: 50000, max: 200000 },
  { label: "₦200K - ₦500K", min: 200000, max: 500000 },
  { label: "₦500K - ₦1M", min: 500000, max: 1000000 },
  { label: "₦1M - ₦3M", min: 1000000, max: 3000000 },
  { label: "₦3M - ₦10M", min: 3000000, max: 10000000 },
  { label: "₦10M+", min: 10000000, max: Infinity },
];

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [filters, setFilters] = useState({
    size: "",
    price: "",
    location: "",
    listingPurpose: "",
    propertyType: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/property/getproperties", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.data?.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
          setFilteredProperties(response.data.data);
        } else {
          console.error("API response is not as expected:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = properties;

      // Apply filters
      if (filters.size) {
        filtered = filtered.filter((property) =>
          property.size?.includes(filters.size)
        );
      }
      if (filters.price) {
        const selectedPriceRange = priceRanges.find(
          (range) => range.label === filters.price
        );
        if (selectedPriceRange) {
          filtered = filtered.filter(
            (property) =>
              property.price >= selectedPriceRange.min &&
              property.price <= selectedPriceRange.max
          );
        }
      }
      if (filters.location) {
        filtered = filtered.filter((property) =>
          property.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        );
      }
      if (filters.listingPurpose) {
        filtered = filtered.filter(
          (property) => property.listingPurpose === filters.listingPurpose
        );
      }
      if (filters.propertyType) {
        filtered = filtered.filter(
          (property) => property.propertyType === filters.propertyType
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
      }

      setFilteredProperties(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };
    applyFilters();
  }, [filters, properties, sortBy]);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name as string]: value as string,
    }));
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleRentNow = (property: Property) => {
    setSelectedProperty(property);
    setShowPayment(true);
  };

  const handleBuyNow = (property: Property) => {
    setSelectedProperty(property);
    setShowPayment(true);
  };

  const handleClose = () => {
    setShowPayment(false);
    setSelectedProperty(null);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavoriteProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return <Home />;
      case "land":
        return <Landscape />;
      case "farm":
        return <Agriculture />;
      case "commercial":
        return <BuildCircleOutlined />;
      case "office":
        return <LocalPostOffice />;
      case "shop":
        return <Shop />;
      default:
        return <Home />;
    }
  };

  const isUrl = (str: string) => {
    if (typeof str !== "string") return false;
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            fontWeight: "bold",
            mb: 1,
          }}
        >
          Find Your Dream Property
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {filteredProperties.length} properties available
        </Typography>
      </Box>

      {/* Filters and Sort Bar */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          {/* Filter Toggle for Mobile */}
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          )}

          {/* Filters - Always visible on desktop, conditional on mobile */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              display: { xs: showFilters ? "flex" : "none", sm: "flex" },
              width: { xs: "100%", sm: "auto" },
            }}
            flexWrap="wrap"
            useFlexGap
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
                <MenuItem value="Farm">Farm</MenuItem>
                <MenuItem value="Commercial">Commercial Property</MenuItem>
                <MenuItem value="Office">Office Space</MenuItem>
                <MenuItem value="Shop">Shop Space</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Purpose</InputLabel>
              <Select
                label="Purpose"
                name="listingPurpose"
                value={filters.listingPurpose}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="For Renting">For Rent</MenuItem>
                <MenuItem value="For Sale">For Sale</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Size</InputLabel>
              <Select
                label="Size"
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Sizes</MenuItem>
                <MenuItem value="Quarter Plot">Quarter</MenuItem>
                <MenuItem value="Half Plot">Half</MenuItem>
                <MenuItem value="Full Plot">Full</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Price Range</InputLabel>
              <Select
                label="Price Range"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
              >
                {priceRanges.map((range) => (
                  <MenuItem key={range.label} value={range.label}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() =>
                setFilters({
                  size: "",
                  price: "",
                  location: "",
                  listingPurpose: "",
                  propertyType: "",
                })
              }
              size="small"
            >
              Clear
            </Button>
          </Stack>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              value={sortBy}
              onChange={handleSortChange}
              startAdornment={<Sort sx={{ mr: 1, color: "action.active" }} />}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
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
          <Typography variant="h5" gutterBottom>
            No properties found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {properties.length === 0
              ? "No properties available at the moment."
              : "Try adjusting your filters to see more results."}
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              setFilters({
                size: "",
                price: "",
                location: "",
                listingPurpose: "",
                propertyType: "",
              })
            }
          >
            Clear All Filters
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={isMobile ? 2 : 3}>
            {currentProperties.map((property) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Property Image */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        isUrl(property.image)
                          ? property.image
                          : `/uploads/${property.image}`
                      }
                      alt={property.title}
                      sx={{ objectFit: "cover" }}
                    />

                    {/* Overlay Badges */}
                    <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                      <Chip
                        label={
                          property.listingPurpose === "For Sale"
                            ? "For Sale"
                            : "For Rent"
                        }
                        color={
                          property.listingPurpose === "For Sale"
                            ? "primary"
                            : "secondary"
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
                        onClick={() => toggleFavorite(property._id)}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          "&:hover": { backgroundColor: "white" },
                        }}
                      >
                        {favoriteProperties.includes(property._id) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    </Box>

                    {property.purchased || property.rented ? (
                      <Box sx={{ position: "absolute", bottom: 12, left: 12 }}>
                        <Chip
                          label="Sold Out"
                          color="error"
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                      </Box>
                    ) : null}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                    {/* Title and Type */}
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
                      <Tooltip title={property.propertyType}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {getPropertyIcon(property.propertyType)}
                        </Avatar>
                      </Tooltip>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOn
                        color="action"
                        sx={{ fontSize: 18, mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {property.location}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {property.description}
                    </Typography>

                    {/* Features */}
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        icon={<SquareFoot sx={{ fontSize: 16 }} />}
                        label={property.size}
                        size="small"
                        variant="outlined"
                      />
                      {property.bedrooms && (
                        <Chip
                          icon={<Bed sx={{ fontSize: 16 }} />}
                          label={`${property.bedrooms} Bed`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {property.bathrooms && (
                        <Chip
                          icon={<Bathroom sx={{ fontSize: 16 }} />}
                          label={`${property.bathrooms} Bath`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {/* Price */}
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {formatter.format(property.price)}
                      {property.listingPurpose === "For Renting" && "/mo"}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                    {property.purchased || property.rented ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                        size={isMobile ? "small" : "medium"}
                      >
                        Not Available
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={
                          property.listingPurpose === "For Renting"
                            ? () => handleRentNow(property)
                            : () => handleBuyNow(property)
                        }
                        startIcon={<Payment />}
                        size={isMobile ? "small" : "medium"}
                        sx={{ borderRadius: 2 }}
                      >
                        {property.listingPurpose === "For Renting"
                          ? "Rent Now"
                          : "Buy Now"}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
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

      {/* Payment Modal */}
      <Modal
        open={showPayment}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: theme.shadows[24],
            p: 0,
          }}
        >
          {selectedProperty && (
            <PaymentPage
              propertyId={selectedProperty._id}
              type={selectedProperty.propertyType}
              price={selectedProperty.price}
              listingPurpose={selectedProperty.listingPurpose}
              instalmentAllowed={selectedProperty.instalmentAllowed ?? false}
              onClose={handleClose}
            />
          )}
        </Box>
      </Modal>

      {/* Floating Action Button for Mobile Filters */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filter"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterList />
        </Fab>
      )}
    </Container>
  );
};

export default PropertyListing;

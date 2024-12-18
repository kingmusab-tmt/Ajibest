"use client";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
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
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PaymentPage from "./payment";

const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "N50,000 - N200,000", min: 50000, max: 200000 },
  { label: "N200,000 - N500,000", min: 200000, max: 500000 },
  { label: "N500,000 - N1,000,000", min: 500000, max: 1000000 },
  { label: "N1,000,000 - N3,000,000", min: 1000000, max: 3000000 },
  { label: "N3,000,000 - N10,000,000", min: 3000000, max: 10000000 },
  { label: "N10,000,000 - above", min: 10000000, max: Infinity },
];

const PropertyListing = () => {
  const { data: session } = useSession();
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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
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

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
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

  // useEffect(() => {
  //   const fetchFavoriteProperties = async () => {
  //     try {
  //       const response = await axios.get("/api/favourite");
  //       const favoriteProperties = response.data.data;
  //       if (Array.isArray(favoriteProperties)) {
  //         setFavoriteProperties(favoriteProperties);
  //       } else {
  //         console.error("API response is not as expected:", favoriteProperties);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch favorite properties:", error);
  //     }
  //   };
  //   fetchFavoriteProperties();
  // }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = properties;
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
          property.location.includes(filters.location)
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
      setFilteredProperties(filtered);
    };
    applyFilters();
  }, [filters, properties]);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name as string]: value as string,
    }));
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

  const itemsPerSlide = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isUrl = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="mt-5 justify-center items-center">
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            position: "fixed",
            top: 100,
            width: "90%",
            zIndex: 1,
            padding: 1,
            gap: 1,
          }}
        >
          <FormControl sx={{ width: 150 }}>
            <InputLabel className="dark:text-white">Property Type</InputLabel>
            <Select
              label="Property Type"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="dark:bg-dark dark:text-white dark:border-white"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Land">Land</MenuItem>
              <MenuItem value="Farm">Farm</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 100 }}>
            <InputLabel className="dark:text-white">Size</InputLabel>
            <Select
              label="Size"
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="dark:bg-dark dark:text-white dark:border-white"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Quarter Plot">Quarter Plot</MenuItem>
              <MenuItem value="Half Plot">Half Plot</MenuItem>
              <MenuItem value="Full Plot">Full Plot</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }}>
            <InputLabel className="dark:text-white">Listing Purpose</InputLabel>
            <Select
              label="Listing Purpose"
              name="listingPurpose"
              value={filters.listingPurpose}
              onChange={handleFilterChange}
              className="dark:bg-dark dark:text-white dark:border-white"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="For Renting">For Renting</MenuItem>
              <MenuItem value="For Sale">For Sale</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 100 }}>
            <InputLabel className="dark:text-white">Price</InputLabel>
            <Select
              label="Price"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="dark:bg-dark dark:text-white dark:border-white"
            >
              {priceRanges.map((range) => (
                <MenuItem key={range.label} value={range.label}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            marginTop: 10,
            overflowY: "scroll",
            scrollbarWidth: "none",
            maxHeight: "calc(100vh - 200px)",
            bgcolor:
              theme.palette.mode === "dark"
                ? "background.default"
                : "background.paper",
            color: theme.palette.text.primary,
            "@media (max-width: 600px)": {
              marginTop: 24,
            },
          }}
        >
          {filteredProperties.length === 0 ? (
            <Typography variant="h6">
              <p className="flex items-center justify-center">
                No properties available
              </p>
            </Typography>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {filteredProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                  <Card
                    sx={{
                      width: 300,
                      padding: 2,
                      height: "100%",
                    }}
                    className="dark:bg-slate-800 dark:shadow-white dark:shadow-xl"
                  >
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          isUrl(property.image)
                            ? property.image
                            : `/uploads/${property.image}`
                        }
                        alt={property.title}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          height: "200px",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ textAlign: "left" }}>
                      <Typography
                        variant="h6"
                        component="div"
                        className="dark:text-white"
                      >
                        Title: {property.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="dark:text-white"
                      >
                        Location: {property.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="dark:text-white"
                      >
                        Description: {property.description}
                      </Typography>
                      {property.bedrooms && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="dark:text-white"
                        >
                          Bedrooms: {property.bedrooms}
                        </Typography>
                      )}
                      {property.bathrooms && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="dark:text-white"
                        >
                          Bathrooms: {property.bathrooms}
                        </Typography>
                      )}
                      {property.amenities && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="dark:text-white"
                        >
                          Amenities: {property.amenities}
                        </Typography>
                      )}
                      {property.utilities && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="dark:text-white"
                        >
                          Utilities: {property.utilities}
                        </Typography>
                      )}
                      {property.size && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="dark:text-white"
                        >
                          Size: {property.size}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        color="text.primary"
                        className="dark:text-white"
                      >
                        Price: {formatter.format(property.price)}
                      </Typography>
                      {property.purchased || property.rented ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          className="dark:text-white"
                          disabled
                        >
                          Not Available
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={
                            property.listingPurpose === "For Renting"
                              ? () => handleRentNow(property)
                              : () => handleBuyNow(property)
                          }
                        >
                          {property.listingPurpose === "For Renting"
                            ? "Rent Now"
                            : "Buy Now"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <Modal open={showPayment} onClose={handleClose}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    </div>
  );
};

export default PropertyListing;

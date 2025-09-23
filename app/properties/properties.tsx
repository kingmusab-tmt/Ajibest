// // app/properties/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Box,
//   Chip,
//   Paper,
//   CircularProgress,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Pagination,
// } from "@mui/material";
// import {
//   LocationOn,
//   Home,
//   AttachMoney,
//   ArrowBack,
//   Bed,
//   Bathroom,
// } from "@mui/icons-material";
// import Link from "next/link";

// interface Property {
//   _id: string;
//   title: string;
//   description: string;
//   location: string;
//   city: string;
//   image: string;
//   propertyType: string;
//   price: number;
//   listingPurpose: string;
//   bedrooms?: number;
//   bathrooms?: number;
//   amenities?: string;
//   size: string;
//   status: string;
// }

// const PropertiesPage = () => {
//   const searchParams = useSearchParams();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 12,
//     total: 0,
//     pages: 1,
//   });

//   // Get filter parameters from URL
//   const city = searchParams.get("city");
//   const propertyType = searchParams.get("propertyType");
//   const priceRange = searchParams.get("priceRange");
//   const purpose = searchParams.get("purpose");
//   const page = searchParams.get("page") || "1";

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);

//         // Build query string from filters
//         const params = new URLSearchParams();
//         if (city) params.append("city", city);
//         if (propertyType) params.append("propertyType", propertyType);
//         if (priceRange) params.append("priceRange", priceRange);
//         if (purpose) params.append("purpose", purpose);
//         params.append("page", page);

//         const response = await fetch(`/api/properties?${params.toString()}`);

//         if (!response.ok) {
//           throw new Error("Failed to fetch properties");
//         }

//         const data = await response.json();

//         if (data.success) {
//           setProperties(data.data);
//           setPagination(data.pagination);
//         } else {
//           throw new Error(data.message || "Failed to fetch properties");
//         }
//       } catch (err) {
//         console.error("Error fetching properties:", err);
//         setError("Failed to load properties. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [city, propertyType, priceRange, purpose, page]);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const formatLocation = (loc: string) => {
//     return loc.charAt(0).toUpperCase() + loc.slice(1);
//   };

//   const formatType = (type: string) => {
//     return type
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     value: number
//   ) => {
//     // Update URL with new page parameter
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("page", value.toString());
//     window.location.search = params.toString();
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
//         <CircularProgress />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Loading properties...
//         </Typography>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//         <Button component={Link} href="/" startIcon={<ArrowBack />}>
//           Back to Home
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
//         <Button
//           component={Link}
//           href="/"
//           startIcon={<ArrowBack />}
//           sx={{ mr: 2 }}
//         >
//           Back
//         </Button>
//         <Typography variant="h4" component="h1">
//           Available Properties
//         </Typography>
//       </Box>

//       {/* Filter summary */}
//       {(city || propertyType || priceRange || purpose) && (
//         <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Filters Applied:
//           </Typography>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//             {city && city !== "all" && (
//               <Chip
//                 icon={<LocationOn />}
//                 label={`City: ${formatLocation(city)}`}
//                 variant="outlined"
//               />
//             )}
//             {propertyType && propertyType !== "all" && (
//               <Chip
//                 icon={<Home />}
//                 label={`Type: ${formatType(propertyType)}`}
//                 variant="outlined"
//               />
//             )}
//             {purpose && purpose !== "all" && (
//               <Chip
//                 label={`Purpose: ${
//                   purpose === "sale" ? "For Sale" : "For Rent"
//                 }`}
//                 variant="outlined"
//               />
//             )}
//             {priceRange && priceRange !== "all" && (
//               <Chip
//                 icon={<AttachMoney />}
//                 label={`Price: ${priceRange.replace("-", " - ₦")}`}
//                 variant="outlined"
//               />
//             )}
//           </Box>
//         </Paper>
//       )}

//       {properties.length === 0 ? (
//         <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="h6" gutterBottom>
//             No properties found matching your criteria
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//             Try adjusting your filters or browse all properties
//           </Typography>
//           <Button component={Link} href="/" variant="contained">
//             Back to Search
//           </Button>
//         </Paper>
//       ) : (
//         <>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Found {pagination.total} propert
//             {pagination.total === 1 ? "y" : "ies"}
//           </Typography>
//           <Grid container spacing={3}>
//             {properties.map((property) => (
//               <Grid item xs={12} sm={6} md={4} key={property._id}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={property.image}
//                     alt={property.title}
//                     sx={{ objectFit: "cover" }}
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography variant="h6" component="h2" gutterBottom>
//                       {property.title}
//                     </Typography>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <LocationOn
//                         color="action"
//                         sx={{ fontSize: 20, mr: 0.5 }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         {property.location}
//                       </Typography>
//                     </Box>
//                     <Typography variant="body2" paragraph>
//                       {property.description}
//                     </Typography>
//                     <Box sx={{ mb: 2 }}>
//                       <Chip
//                         label={formatType(property.propertyType)}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                         sx={{ mr: 1, mb: 1 }}
//                       />
//                       <Chip
//                         label={property.size}
//                         size="small"
//                         variant="outlined"
//                         sx={{ mr: 1, mb: 1 }}
//                       />
//                       {property.bedrooms && (
//                         <Chip
//                           icon={<Bed />}
//                           label={property.bedrooms}
//                           size="small"
//                           variant="outlined"
//                           sx={{ mr: 1, mb: 1 }}
//                         />
//                       )}
//                       {property.bathrooms && (
//                         <Chip
//                           icon={<Bathroom />}
//                           label={property.bathrooms}
//                           size="small"
//                           variant="outlined"
//                           sx={{ mr: 1, mb: 1 }}
//                         />
//                       )}
//                     </Box>
//                   </CardContent>
//                   <Box
//                     sx={{
//                       p: 2,
//                       pt: 0,
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typography variant="h6" color="primary">
//                       {formatPrice(property.price)}
//                     </Typography>
//                     <Button variant="contained" size="small">
//                       View Details
//                     </Button>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <Pagination
//                 count={pagination.pages}
//                 page={pagination.page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 size={isMobile ? "small" : "medium"}
//               />
//             </Box>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default PropertiesPage;
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
  Share,
  FilterList,
  ViewCarousel,
  GridView,
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
  rating?: number;
  reviews?: number;
}

const PropertiesPage = () => {
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    window.location.search = params.toString();
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

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
        >
          Discovering Amazing Properties...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          variant="contained"
          size={isMobile ? "medium" : "large"}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
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

      {/* Filter Summary */}
      {(city || propertyType || priceRange || purpose) && (
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
            {city && city !== "all" && (
              <Chip
                icon={<LocationOn sx={{ fontSize: 18 }} />}
                label={`City: ${formatLocation(city)}`}
                variant="filled"
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{ mb: 1 }}
              />
            )}
            {propertyType && propertyType !== "all" && (
              <Chip
                icon={<Home sx={{ fontSize: 18 }} />}
                label={`Type: ${formatType(propertyType)}`}
                variant="filled"
                color="secondary"
                size={isMobile ? "small" : "medium"}
                sx={{ mb: 1 }}
              />
            )}
            {purpose && purpose !== "all" && (
              <Chip
                label={`Purpose: ${
                  purpose === "sale" ? "For Sale" : "For Rent"
                }`}
                variant="filled"
                color="success"
                size={isMobile ? "small" : "medium"}
                sx={{ mb: 1 }}
              />
            )}
            {priceRange && priceRange !== "all" && (
              <Chip
                icon={<AttachMoney sx={{ fontSize: 18 }} />}
                label={`Price: ${priceRange.replace("-", " - ₦")}`}
                variant="filled"
                color="warning"
                size={isMobile ? "small" : "medium"}
                sx={{ mb: 1 }}
              />
            )}
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
            Try adjusting your filters or browse all properties
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            size={isMobile ? "medium" : "large"}
            startIcon={<FilterList />}
          >
            Adjust Filters
          </Button>
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
                    href={`/properties/${property._id}`}
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
                        image={property.image}
                        alt={property.title}
                        sx={{
                          height: "100%",
                          objectFit: "cover",
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
                            {property.location}, {property.city}
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
                          <Chip
                            icon={<SquareFoot sx={{ fontSize: 16 }} />}
                            label={property.size}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          {property.bedrooms && (
                            <Chip
                              icon={<Bed sx={{ fontSize: 16 }} />}
                              label={property.bedrooms}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          )}
                          {property.bathrooms && (
                            <Chip
                              icon={<Bathroom sx={{ fontSize: 16 }} />}
                              label={property.bathrooms}
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
                          View Details
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
          href="/"
        >
          <FilterList />
        </Fab>
      )}
    </Container>
  );
};

export default PropertiesPage;

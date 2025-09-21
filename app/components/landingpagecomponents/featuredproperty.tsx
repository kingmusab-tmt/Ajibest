"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Rating,
  IconButton,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
} from "@mui/material";
import {
  LocationOn,
  Hotel,
  Bathtub,
  SquareFoot,
  Visibility,
} from "@mui/icons-material";

interface IProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: "House" | "Farm" | "Land";
  price: number;
  listingPurpose: "For Renting" | "For Sale";
  bedrooms?: number;
  rentalDuration?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  purchased: boolean;
  rented: boolean;
  size?: string;
  rating?: number;
}

interface ApiResponse {
  success: boolean;
  data: IProperty[];
  isFallback?: boolean;
  message?: string;
}

const FeaturedProperties: React.FC = () => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const router = useRouter();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        "/api/property/getproperties"
      );

      if (response.data.success) {
        setProperties(response.data.data);
        // setIsFallback(response.data.isFallback || false);

        // if (response.data.isFallback) {
        //   setError(response.data.message || "Using demo properties");
        // }
      } else {
        throw new Error("Failed to fetch properties");
      }
    } catch (err) {
      // setError("Failed to load properties. Showing demo properties.");
      // setIsFallback(true);
      // Use fallback from component if API fails completely
      setProperties([
        {
          _id: "1",
          title: "Luxury Villa in Lekki",
          description: "Beautiful 5-bedroom villa with modern amenities",
          location: "Lekki, Lagos",
          image: "/images/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg",
          propertyType: "House",
          price: 85000000,
          listingPurpose: "For Sale",
          bedrooms: 5,
          bathrooms: 4,
          amenities: "Pool, Gym, Garden",
          purchased: false,
          rented: false,
          size: "4500 sq ft",
          rating: 4.8,
        },
        {
          _id: "2",
          title: "Commercial Farm Land",
          description: "Prime agricultural land for large-scale farming",
          location: "Ogun State",
          image: "/images/ajibest1cff1055-ae88-4327-b05f-37c14084e1f7.jpeg",
          propertyType: "Land",
          price: 25000000,
          listingPurpose: "For Sale",
          purchased: false,
          rented: false,
          size: "10 acres",
          rating: 4.5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemsPerSlide = () => {
    if (isLargeScreen) return 4;
    if (isMediumScreen) return 3;
    if (isSmallScreen) return 1;
    return 2;
  };

  const getSlides = (
    properties: IProperty[],
    itemsPerSlide: number
  ): IProperty[][] => {
    const slides: IProperty[][] = [];
    for (let i = 0; i < properties.length; i += itemsPerSlide) {
      slides.push(properties.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Featured Properties
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Discover our exclusive selection of premium properties
        </Typography>
      </Box>

      {/* {error && (
        <Alert severity="info" sx={{ mb: 4, mx: "auto", maxWidth: 600 }}>
          {error}
        </Alert>
      )} */}

      {properties.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No properties available at the moment
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: "relative" }}>
          <Carousel
            animation="slide"
            autoPlay
            interval={6000}
            indicators={true}
            navButtonsAlwaysVisible={isMediumScreen}
            cycleNavigation={true}
            fullHeightHover={false}
            sx={{
              "& .Carousel-indicators": {
                bottom: -40,
              },
            }}
          >
            {getSlides(properties, getItemsPerSlide()).map((slide, index) => (
              <Grid container spacing={3} key={index} justifyContent="center">
                {slide.map((property) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                    <PropertyCard
                      property={property}
                      onViewDetails={() => {
                        if (!session) {
                          router.push("/login");
                        } else {
                          router.push(`/properties/${property._id}`);
                        }
                      }}
                      session={session}
                      isUrl={isUrl}
                      formatPrice={formatPrice}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Carousel>
        </Box>
      )}
    </Container>
  );
};

interface PropertyCardProps {
  property: IProperty;
  onViewDetails: () => void;
  session: any;
  isUrl: (str: string) => boolean;
  formatPrice: (price: number) => string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  session,
  isUrl,
  formatPrice,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        position: "relative",
      }}
    >
      {/* Favorite Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)",
          },
        }}
      ></IconButton>

      {/* Property Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="240"
          image={
            isUrl(property.image)
              ? property.image
              : `/uploads/${property.image}`
          }
          alt={property.title}
          sx={{
            objectFit: "cover",
            height: 240,
          }}
        />

        {/* Property Type Badge */}
        <Chip
          label={property.propertyType}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: "bold",
          }}
        />

        {/* Listing Purpose Badge */}
        <Chip
          label={property.listingPurpose}
          color={property.listingPurpose === "For Sale" ? "success" : "info"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title and Rating */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: "bold",
              mb: 1,
              lineHeight: 1.3,
              height: "2.6em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {property.title}
          </Typography>

          {property.rating && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating value={property.rating} size="small" readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {property.rating}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LocationOn sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {property.location}
          </Typography>
        </Box>

        {/* Features */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {property.bedrooms && (
            <Grid item xs={4}>
              <Box sx={{ textAlign: "center" }}>
                <Hotel sx={{ fontSize: 20, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {property.bedrooms} Bed
                </Typography>
              </Box>
            </Grid>
          )}
          {property.bathrooms && (
            <Grid item xs={4}>
              <Box sx={{ textAlign: "center" }}>
                <Bathtub sx={{ fontSize: 20, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {property.bathrooms} Bath
                </Typography>
              </Box>
            </Grid>
          )}
          {property.size && (
            <Grid item xs={4}>
              <Box sx={{ textAlign: "center" }}>
                <SquareFoot sx={{ fontSize: 20, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {property.size}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Price */}
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
          }}
        >
          {formatPrice(property.price)}
          {property.listingPurpose === "For Renting" && "/month"}
        </Typography>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<Visibility />}
          onClick={onViewDetails}
          disabled={property.purchased || property.rented}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2,
          }}
        >
          {property.purchased || property.rented
            ? "Not Available"
            : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => {
  const items = Array.from({ length: 4 }, (_, i) => i);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Skeleton
          variant="text"
          width={300}
          height={60}
          sx={{ mx: "auto", mb: 2 }}
        />
        <Skeleton variant="text" width={400} height={30} sx={{ mx: "auto" }} />
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ height: "100%" }}>
              <Skeleton variant="rectangular" height={240} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="40%" />
                <Skeleton
                  variant="text"
                  height={30}
                  width="80%"
                  sx={{ mt: 2 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={40}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedProperties;

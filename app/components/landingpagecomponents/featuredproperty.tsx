"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Skeleton,
  useTheme,
  Container,
  alpha,
  Fade,
  Zoom,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  SquareFoot,
  Hotel,
  Bathtub,
  LocationOn,
} from "@mui/icons-material";

interface IProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: "House" | "Farm" | "Land" | "Commercial" | "Office" | "Shop";
  price: number;
  listingPurpose: "For Renting" | "For Sale";
  bedrooms?: number;
  rentalDuration?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  purchased: boolean;
  rented: boolean;
  status: string;
  size?: string;
  rating?: number;
  plotNumber?: string;
  instalmentAllowed?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: IProperty[];
  isFallback?: boolean;
  message?: string;
}

// Base64 placeholder image as fallback
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgODBDMTI1IDcyLjM4NjEgMTMxLjM4NiA2NiAxMzkgNjZDMTQ2LjYxNCA2NiAxNTMgNzIuMzg2MSAxNTMgODBDMTUzIDg3LjYxMzkgMTQ2LjYxNCA5NCAxMzkgOTRDMTMxLjM4NiA5NCAxMjUgODcuNjEzOSAxMjUgODBaIiBmaWxsPSIjOEU5MEEyIi8+CjxwYXRoIGQ9Ik0xMDAgMTM1SDE4MEMxODMuODYgMTM1IDE4NyAxMzEuODYgMTg3IDEyOFY5OEMxODcgOTQuMTM5OCAxODMuODYgOTEgMTgwIDkxSDEwMEM5Ni4xMzk4IDkxIDkzIDk0LjEzOTggOTMgOThWMTI4QzkzIDEzMS44NiA5Ni4xMzk4IDEzNSAxMDAgMTM1WiIgZmlsbD0iIzhFOTBBMiIvPgo8cmVjdCB4PSIxMzAiIHk9IjEwMSIgd2lkdGg9IjE4IiBoZWlnaHQ9IjI0IiByeD0iMiIgZmlsbD0iI0YzRjRGNiIvPgo8L3N2Zz4K";

const FeaturedProperties: React.FC = () => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        "/api/property/getproperties"
      );

      if (response.data.success && response.data.data) {
        // Filter to only show available properties and limit to 8 for gallery
        const availableProperties = response.data.data
          .filter((property) => property.status === "available")
          .slice(0, 8);
        setProperties(availableProperties);
      } else {
        throw new Error("Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      // Use fallback data
      setProperties([
        {
          _id: "1",
          title: "Modern Luxury Villa",
          description: "Beautiful 5-bedroom villa with modern amenities",
          location: "Lekki, Lagos",
          image: PLACEHOLDER_IMAGE,
          propertyType: "House",
          price: 85000000,
          listingPurpose: "For Sale",
          bedrooms: 5,
          bathrooms: 4,
          purchased: false,
          rented: false,
          status: "available",
          size: "4500 sq ft",
          instalmentAllowed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
        {
          _id: "2",
          title: "Premium Farm Land",
          description: "Prime agricultural land for large-scale farming",
          location: "Ogun State",
          image: PLACEHOLDER_IMAGE,
          propertyType: "Land",
          price: 25000000,
          listingPurpose: "For Sale",
          purchased: false,
          rented: false,
          status: "available",
          size: "10 acres",
          instalmentAllowed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(1)}K`;
    }
    return `₦${price}`;
  };

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return PLACEHOLDER_IMAGE;
  };

  if (loading) {
    return <GallerySkeleton />;
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl">
        {/* Gallery Header */}
        <Box
          sx={{ textAlign: "center", mb: 8, position: "relative", zIndex: 1 }}
        >
          <Fade in timeout={1000}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Featured Properties
            </Typography>
          </Fade>
          <Fade in timeout={1200}>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Discover our curated collection of premium properties
            </Typography>
          </Fade>
        </Box>

        {properties.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No properties available at the moment
            </Typography>
          </Box>
        ) : (
          <Zoom in timeout={800}>
            <Grid container spacing={3} justifyContent="center">
              {properties.map((property, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={3}
                  key={property._id}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <PropertyCard
                    property={property}
                    getImageUrl={getImageUrl}
                    formatPrice={formatPrice}
                    isHovered={hoveredCard === property._id}
                    onHover={(isHovering) =>
                      setHoveredCard(isHovering ? property._id : null)
                    }
                    animationDelay={index * 100}
                  />
                </Grid>
              ))}
            </Grid>
          </Zoom>
        )}
      </Container>
    </Box>
  );
};

interface PropertyCardProps {
  property: IProperty;
  getImageUrl: (imagePath: string) => string;
  formatPrice: (price: number) => string;
  isHovered: boolean;
  onHover: (isHovering: boolean) => void;
  animationDelay: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  getImageUrl,
  formatPrice,
  isHovered,
  onHover,
  animationDelay,
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  const isAvailable =
    property.status === "available" && !property.purchased && !property.rented;

  return (
    <Fade in timeout={800} style={{ transitionDelay: `${animationDelay}ms` }}>
      <Card
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: "white",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: isHovered ? theme.shadows[8] : theme.shadows[2],
          transform: isHovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            zIndex: 2,
          },
        }}
        onClick={() => {
          // router.push(`/properties/${property._id}`);
        }}
      >
        {/* Property Image with Overlay */}
        <Box sx={{ position: "relative", height: 240, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={imageError ? PLACEHOLDER_IMAGE : getImageUrl(property.image)}
            alt={property.title}
            sx={{
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease-in-out",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered
                ? `linear-gradient(to bottom, ${alpha(
                    theme.palette.common.black,
                    0.2
                  )} 0%, ${alpha(theme.palette.common.black, 0.6)} 100%)`
                : `linear-gradient(to bottom, transparent 0%, ${alpha(
                    theme.palette.common.black,
                    0.3
                  )} 100%)`,
              transition: "all 0.3s ease-in-out",
            }}
          />

          {/* Top Badges */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Chip
              label={property.propertyType}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            />
            <Chip
              icon={isAvailable ? <CheckCircle /> : <Cancel />}
              label={isAvailable ? "Available" : "Sold"}
              color={isAvailable ? "success" : "error"}
              size="small"
              sx={{
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            />
          </Box>

          {/* Bottom Info Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              color: "white",
              transform: isHovered ? "translateY(0)" : "translateY(8px)",
              opacity: isHovered ? 1 : 0.9,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 0.5,
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {property.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {property.location}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent
          sx={{
            flexGrow: 1,
            p: 2.5,
            background: `linear-gradient(135deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          }}
        >
          {/* Price - Featured */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                lineHeight: 1.2,
              }}
            >
              {formatPrice(property.price)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: "medium",
                fontSize: "0.8rem",
              }}
            >
              {property.listingPurpose}
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {property.bedrooms && (
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Hotel
                    sx={{ fontSize: 20, color: "primary.main", mb: 0.5 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {property.bedrooms} Bed
                  </Typography>
                </Box>
              </Grid>
            )}
            {property.bathrooms && (
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Bathtub
                    sx={{ fontSize: 20, color: "primary.main", mb: 0.5 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {property.bathrooms} Bath
                  </Typography>
                </Box>
              </Grid>
            )}
            {property.size && (
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <SquareFoot
                    sx={{ fontSize: 20, color: "primary.main", mb: 0.5 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {property.size}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Additional Badges */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {property.instalmentAllowed && (
              <Chip
                label="Installment Available"
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
              />
            )}
            {property.plotNumber && (
              <Chip
                label={`Plot ${property.plotNumber}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

const GallerySkeleton = () => {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Skeleton
            variant="text"
            width={300}
            height={80}
            sx={{ mx: "auto", mb: 2 }}
          />
          <Skeleton
            variant="text"
            width={400}
            height={40}
            sx={{ mx: "auto" }}
          />
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 2,
                }}
              >
                <Skeleton variant="rectangular" height={240} />
                <CardContent sx={{ p: 2.5 }}>
                  <Skeleton
                    variant="text"
                    height={40}
                    sx={{ mb: 2, mx: "auto", width: "80%" }}
                  />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="60%"
                    sx={{ mx: "auto", mb: 2 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                  <Skeleton
                    variant="text"
                    height={30}
                    width="80%"
                    sx={{ mx: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedProperties;

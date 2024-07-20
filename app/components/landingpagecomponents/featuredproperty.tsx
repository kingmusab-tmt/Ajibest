// components/FeaturedProperties.tsx
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
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
}

const FeaturedProperties: React.FC = () => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/property/getproperties");
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setProperties(response.data.data);
        } else {
          console.error("API response is not as expected:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      try {
        const response = await axios.get("/api/favourite");
        const favoriteProperties = response.data.data;
        if (Array.isArray(favoriteProperties)) {
          setFavoriteProperties(favoriteProperties);
        } else {
          console.error("API response is not as expected:", favoriteProperties);
        }
      } catch (error) {
        console.error("Failed to fetch favorite properties:", error);
      }
    };
    fetchFavoriteProperties();
  }, []);

  if (properties.length === 0) {
    return (
      <Typography variant="h6">
        <p className="flex items-center justify-center">
          No properties available
        </p>
      </Typography>
    );
  }

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

  const handleFavoriteClick = async (propertyId: string) => {
    if (!session) {
      router.push("/login");
    } else {
      try {
        const response = await axios.post("/api/favourite", { propertyId });
        // Uncomment and update favoriteProperties state if necessary
        // setFavoriteProperties((prevFavorites) => [
        //   ...prevFavorites,
        //   propertyId,
        // ]);
      } catch (error) {
        console.error("Failed to add favorite:", error);
      }
    }
  };

  const itemsPerSlide = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return (
    <div className="mt-5 p-4 justify-center items-center">
      <Box sx={{ textAlign: "center", padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Featured Properties
        </Typography>
        <Carousel
          animation="slide"
          autoPlay
          interval={3000}
          indicators={true}
          navButtonsAlwaysVisible={false}
        >
          {getSlides(properties, itemsPerSlide).map((slide, index) => (
            <Grid container spacing={2} key={index} justifyContent="center">
              {slide.map((property) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                  <Card>
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={`/uploads/${property.image}`}
                        alt={property.title}
                      />
                      <IconButton
                        color={
                          favoriteProperties.includes(property._id)
                            ? "primary"
                            : "error"
                        }
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => handleFavoriteClick(property._id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ textAlign: "left" }}>
                      <Typography variant="h5" component="div">
                        Title: {property.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {property.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description: {property.description}
                      </Typography>
                      {property.bedrooms && (
                        <Typography variant="body2" color="text.secondary">
                          Bedrooms: {property.bedrooms}
                        </Typography>
                      )}
                      {property.bathrooms && (
                        <Typography variant="body2" color="text.secondary">
                          Bathrooms: {property.bathrooms}
                        </Typography>
                      )}
                      {property.amenities && (
                        <Typography variant="body2" color="text.secondary">
                          Amenities: {property.amenities}
                        </Typography>
                      )}
                      {property.utilities && (
                        <Typography variant="body2" color="text.secondary">
                          Utilities: {property.utilities}
                        </Typography>
                      )}
                      {property.size && (
                        <Typography variant="body2" color="text.secondary">
                          Size: {property.size}
                        </Typography>
                      )}
                      <Typography variant="h6" color="text.primary">
                        Price: {formatter.format(property.price)}
                      </Typography>
                      <Button variant="contained" color="primary">
                        {property.listingPurpose === "For Renting"
                          ? "Rent Now"
                          : "Buy Now"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
        </Carousel>
      </Box>
    </div>
  );
};

export default FeaturedProperties;

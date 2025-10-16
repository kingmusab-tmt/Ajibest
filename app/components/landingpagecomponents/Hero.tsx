"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Herosearch from "../landingpagecomponents/Herosearch";

type HeroContent = {
  title: string;
  subtitle: string;
  buttonText: string;
  backgrounds: string[];
};

// Move fallbackContent outside the component to prevent recreation on every render
const fallbackContent: HeroContent = {
  title: "Fulfill Your Dream & Become a Property Owner with Ease",
  subtitle: "Explore a wide range of Property for Sale or Rent",
  buttonText: "Search Properties",
  backgrounds: [
    "/images/bgimage.webp",
    "/images/img2.webp",
    "/images/img3.webp",
    "/images/img4.webp",
    "/images/f.webp",
    "/images/b.jpeg",
    "/images/c.jpg",
    "/images/h.jpg",
    "/images/o.jpg",
  ],
};

interface HeroProps {
  data?: HeroContent | null;
}

const Hero = ({ data }: HeroProps) => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [heroContent, setHeroContent] = useState<HeroContent>(fallbackContent);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use the data passed from Home component or fallback
  useEffect(() => {
    if (data) {
      // Validate the data structure before using it
      if (data.title && data.backgrounds && Array.isArray(data.backgrounds)) {
        setHeroContent(data);
      } else {
        console.warn("Invalid data structure passed to Hero, using fallback");
        setHeroContent(fallbackContent);
      }
    } else {
      // If no data is passed, use fallback
      setHeroContent(fallbackContent);
    }
  }, [data]);

  // Background rotation effect
  useEffect(() => {
    if (!heroContent?.backgrounds?.length) return;

    const interval = setInterval(() => {
      setBackgroundIndex(
        (prevIndex) => (prevIndex + 1) % heroContent.backgrounds.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroContent?.backgrounds?.length]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: isMobile ? 2 : 8,
        pt: 14,
      }}
    >
      {/* Background images with fade transition */}
      {heroContent.backgrounds.map((bg, index) => (
        <Fade
          key={index}
          in={index === backgroundIndex}
          timeout={1000}
          unmountOnExit
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${bg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "contrast(0.6)",
              zIndex: 0,
            }}
            aria-hidden="true"
          />
        </Fade>
      ))}

      {/* Dark overlay for better text visibility */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          py: { xs: 8, sm: 12, md: 10 },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "3rem",
              md: "3.5rem",
              lg: "4rem",
            },
            fontWeight: "bold",
            mb: 3,
          }}
        >
          {heroContent.title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontSize: {
              xs: "1.1rem",
              sm: "1.3rem",
            },
          }}
        >
          {heroContent.subtitle}
        </Typography>

        <Box
          sx={{
            mt: { xs: 18, sm: 10 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "primary.main",
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              borderRadius: "4px 4px 0 0",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {heroContent.buttonText}
          </Button>

          <Container maxWidth="lg">
            <Herosearch />
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;

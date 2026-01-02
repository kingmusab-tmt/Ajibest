import React from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  alpha,
  Avatar,
} from "@mui/material";
import {
  Agriculture,
  Apartment,
  Home,
  LocationOn,
  Key,
  Assessment,
} from "@mui/icons-material";

interface Service {
  name: string;
  icon: React.ReactElement;
}

const services: Service[] = [
  {
    name: "Buying and Selling of Farm Lands",
    icon: <Agriculture sx={{ fontSize: 32 }} />,
  },
  {
    name: "Estate Management",
    icon: <Apartment sx={{ fontSize: 32 }} />,
  },
  {
    name: "Leasing/Renting out Property",
    icon: <Home sx={{ fontSize: 32 }} />,
  },
  {
    name: "Buying and Selling of Plots of Land",
    icon: <LocationOn sx={{ fontSize: 32 }} />,
  },
  {
    name: "Tenant Management",
    icon: <Key sx={{ fontSize: 32 }} />,
  },
  {
    name: "Property Valuation",
    icon: <Assessment sx={{ fontSize: 32 }} />,
  },
];

const Services: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      id="services"
      sx={{
        py: 8,
        px: { xs: 2, sm: 4 },
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Our Services
        </Typography>

        <Grid container spacing={4} alignItems="center">
          {/* Left side: Main Image */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  background: `linear-gradient(45deg, ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}, ${alpha(theme.palette.secondary.main, 0.3)})`,
                  borderRadius: 8,
                  zIndex: -1,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 400 },
                  position: "relative",
                }}
              >
                <Image
                  src="/images/services.png"
                  alt="A.A Ajibest Services"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
            </Paper>
          </Grid>

          {/* Right side: Services list */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={3}>
              {services.map((service, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      borderRadius: 3,
                      backgroundColor: "background.paper",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05
                        ),
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          mr: 3,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {service.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          lineHeight: 1.3,
                        }}
                      >
                        {service.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Additional Info Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            textAlign: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
            Comprehensive Real Estate Solutions
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto" }}
          >
            At A.A Ajibest Land Vendors Limited, we provide end-to-end real
            estate services tailored to meet your specific needs. Our
            experienced team ensures seamless transactions and maximum value for
            your investments.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Services;

"use client";

import React from "react";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import Link from "next/link";
import {
  Agriculture,
  Apartment,
  Home,
  LocationOn,
  Key,
  Assessment,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";

interface ServiceDetail {
  title: string;
  icon: React.ReactElement;
  description: string;
  benefits: string[];
}

const serviceDetails: ServiceDetail[] = [
  {
    title: "Buying and Selling of Farm Lands",
    icon: <Agriculture sx={{ fontSize: 40 }} />,
    description:
      "We facilitate the sale and purchase of premium farm lands across prime agricultural zones. Our team provides comprehensive market analysis, property valuations, and legal support to ensure you make informed investment decisions.",
    benefits: [
      "Access to verified farm land listings",
      "Professional property appraisal services",
      "Legal documentation support",
      "Competitive market pricing",
      "Post-sale support and guidance",
    ],
  },
  {
    title: "Estate Management",
    icon: <Apartment sx={{ fontSize: 40 }} />,
    description:
      "Comprehensive estate management services to maintain and maximize the value of your residential or commercial properties. We handle maintenance, repairs, tenant coordination, and ensure your property remains in optimal condition.",
    benefits: [
      "Regular property maintenance",
      "Repair and renovation coordination",
      "Property inspection services",
      "Vendor management",
      "Performance reporting",
    ],
  },
  {
    title: "Leasing/Renting out Property",
    icon: <Home sx={{ fontSize: 40 }} />,
    description:
      "We assist property owners in leasing their residential and commercial spaces to qualified tenants. From property marketing to lease negotiation and finalization, we streamline the entire rental process.",
    benefits: [
      "Property listing and marketing",
      "Tenant screening and vetting",
      "Lease agreement preparation",
      "Rent collection management",
      "Regular property inspections",
    ],
  },
  {
    title: "Buying and Selling of Plots of Land",
    icon: <LocationOn sx={{ fontSize: 40 }} />,
    description:
      "Specialized services for buying and selling land plots in strategic locations. Whether you're looking for investment opportunities or selling your land, we provide end-to-end solutions with transparency and professionalism.",
    benefits: [
      "Access to prime land locations",
      "Title verification and clearance",
      "Survey and documentation services",
      "Flexible payment terms negotiation",
      "Investment consultation",
    ],
  },
  {
    title: "Tenant Management",
    icon: <Key sx={{ fontSize: 40 }} />,
    description:
      "Professional tenant management to handle all aspects of landlord-tenant relationships. We manage communications, enforce lease agreements, and ensure smooth property operations on your behalf.",
    benefits: [
      "Tenant communication and coordination",
      "Lease enforcement",
      "Issue resolution and dispute mediation",
      "Rent payment collection",
      "Maintenance request management",
    ],
  },
  {
    title: "Property Valuation",
    icon: <Assessment sx={{ fontSize: 40 }} />,
    description:
      "Expert property valuation services using current market data and industry standards. Our certified valuators provide accurate assessments for investment decisions, financing, insurance, and taxation purposes.",
    benefits: [
      "Market-based property assessment",
      "Comparative analysis",
      "Professional valuation reports",
      "Transparent methodology",
      "Recognized industry standards",
    ],
  },
];

const ServicesPage = () => {
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1,
          )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 3,
            }}
          >
            Our Comprehensive Services
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              fontWeight: 500,
            }}
          >
            At A.A Ajibest Land Vendors Limited, we provide end-to-end real
            estate solutions tailored to meet your specific needs and goals.
          </Typography>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {serviceDetails.map((service, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[12],
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                {/* Service Header with Icon */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.08,
                    )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1,
                    )}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                    }}
                  >
                    {service.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.3,
                      pt: 1,
                    }}
                  >
                    {service.title}
                  </Typography>
                </Box>

                {/* Service Content */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                  }}
                >
                  {/* Description */}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{
                      mb: 2.5,
                      lineHeight: 1.7,
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Benefits List */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "primary.main",
                        textTransform: "uppercase",
                        fontSize: "0.85rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Key Benefits:
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {service.benefits.map((benefit, benefitIndex) => (
                        <ListItem
                          key={benefitIndex}
                          sx={{
                            p: 0.75,
                            pl: 0,
                            alignItems: "flex-start",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 32,
                              color: "success.main",
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 20, mt: 0.25 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={benefit}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "textSecondary",
                              sx: {
                                fontWeight: 500,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05,
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          mb: 8,
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
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Why Choose A.A Ajibest?
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                title: "Expert Team",
                description:
                  "Our experienced professionals have deep knowledge of the real estate market and provide trusted guidance.",
              },
              {
                title: "Transparent Process",
                description:
                  "We maintain complete transparency in all transactions, ensuring you understand every step.",
              },
              {
                title: "Client-Focused",
                description:
                  "Your satisfaction is our priority. We work tirelessly to achieve your real estate goals.",
              },
              {
                title: "Legal Compliance",
                description:
                  "All our services adhere to Nigerian real estate laws and regulations for your protection.",
              },
              {
                title: "Comprehensive Support",
                description:
                  "From initial consultation to post-transaction support, we're with you every step of the way.",
              },
              {
                title: "Competitive Pricing",
                description:
                  "We offer competitive rates without compromising on the quality of our services.",
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{
              mb: 4,
              fontWeight: 500,
            }}
          >
            Contact our team today to discuss your real estate needs and explore
            how we can help you achieve your goals.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Contact Us
            </Button>
            <Button
              component={Link}
              href="/properties"
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Browse Properties
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;

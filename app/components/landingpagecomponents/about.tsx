"use client";
import Image from "next/image";
import companyLogo from "../../../public/ajibestlogo.png";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  alpha,
} from "@mui/material";
import {
  Business,
  Assignment,
  Flag,
  Visibility,
  Star,
  TrackChanges,
  LocationOn,
  Security,
  People,
  Handshake,
} from "@mui/icons-material";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        pt: { xs: 8, md: 12 },
        pb: 8,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 2,
              mb: 4,
            }}
          >
            <Image
              src={companyLogo}
              alt="A.A AJibest Land Vendors Limited Logo"
              width={120}
              height={120}
            />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              color: "primary.main",
            }}
          >
            A.A AJibest Land Vendors Limited
          </Typography>

          <Chip
            icon={<Business />}
            label="Registered with CAC Nigeria"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 500 }}
          />

          <Typography variant="body1" color="text.secondary">
            Registration Number: RC7364094
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* About Us Section */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <Business />
                </Avatar>
                <Typography variant="h4" component="h2" fontWeight="600">
                  About Us
                </Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                A.A AJibest Land Vendors Limited is a reputable estate
                management company dedicated to providing exceptional land,
                farm, and house rental and sales services. Whether you are
                looking to buy, rent, or lease on an installment plan, we offer
                flexible options tailored to meet your needs.
              </Typography>
            </Paper>
          </Grid>

          {/* Mission and Vision Side by Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                    <Flag />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="600">
                    Our Mission
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Our mission is to deliver high-quality estate management
                  services that exceed our clients&apos; expectations by
                  offering reliable and sustainable solutions for land and
                  property acquisition and rental.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                    <Visibility />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight="600">
                    Our Vision
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Our vision is to be the leading estate management company in
                  Nigeria, recognized for our integrity, innovation, and
                  excellence in service delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Value Proposition */}
          <Grid size={{ xs: 12 }}>
            <Paper
              sx={{
                p: 4,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <Star />
                </Avatar>
                <Typography variant="h4" component="h2" fontWeight="600">
                  Value Proposition
                </Typography>
              </Box>

              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.8, mb: 3 }}
              >
                We offer a comprehensive range of estate management services,
                including land, farm, and house rentals and sales, with options
                for one-time payments or installment plans. Our commitment to
                transparency, customer satisfaction, and quality sets us apart
                in the industry.
              </Typography>

              <Grid container spacing={2}>
                {[
                  { icon: <Security />, text: "Secure Transactions" },
                  { icon: <People />, text: "Customer-Centric Approach" },
                  { icon: <Handshake />, text: "Flexible Payment Options" },
                  { icon: <LocationOn />, text: "Prime Property Locations" },
                ].map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ color: "primary.main", mr: 1 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body1">{item.text}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Business Objectives */}
          <Grid size={{ xs: 12 }}>
            <Paper
              sx={{
                p: 4,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <TrackChanges />
                </Avatar>
                <Typography variant="h4" component="h2" fontWeight="600">
                  Business Objectives
                </Typography>
              </Box>

              <List dense>
                {[
                  "To provide top-notch estate management services that cater to the diverse needs of our clients.",
                  "To foster long-term relationships with our clients through exceptional service and trust.",
                  "To continually innovate and improve our service offerings to meet evolving market demands.",
                  "To uphold the highest standards of professionalism, ethics, and integrity in all our dealings.",
                ].map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{ alignItems: "flex-start", py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, pt: 0.5 }}>
                      <Assignment color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Why Choose Us Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            textAlign: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
            Why Choose Us?
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ maxWidth: 800, mx: "auto", mb: 3 }}
          >
            With years of experience in the real estate industry, we have built
            a reputation for reliability, transparency, and exceptional customer
            service.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            {[
              "Trusted",
              "Reliable",
              "Transparent",
              "Professional",
              "Experienced",
              "Customer-Focused",
            ].map((item) => (
              <Chip
                key={item}
                label={item}
                variant="outlined"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.dark",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;

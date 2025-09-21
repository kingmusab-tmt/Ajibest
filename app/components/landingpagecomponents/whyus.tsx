import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { FaLock, FaHeadset, FaRegLightbulb, FaBuilding } from "react-icons/fa";

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    title: "Secure Transactions",
    description:
      "We prioritize secure transactions to protect your peace of mind.",
    icon: <FaLock style={{ fontSize: 50 }} color="error" />,
  },
  {
    title: "Excellent Customer Support",
    description: "Our dedicated team is always here to assist you.",
    icon: <FaHeadset style={{ fontSize: 50 }} color="primary" />,
  },
  {
    title: "Personalized Recommendations",
    description: "We match you with properties that meet your needs.",
    icon: <FaRegLightbulb style={{ fontSize: 50 }} color="success" />,
  },
  {
    title: "Extensive Property Listings",
    description: "Explore a wide range of properties to find your perfect fit.",
    icon: <FaBuilding style={{ fontSize: 50 }} color="warning" />,
  },
];

const WhyChooseUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="section"
      sx={{
        mt: 8,
        bgcolor: "primary.light",
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
            fontWeight: "bold",
            color: "white",
            fontSize: { xs: "2.5rem", md: "3rem" },
          }}
        >
          Why Choose Us?
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: "common.white",
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    elevation: 6,
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                  minHeight: 280,
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      transition: "transform 0.3s ease-in-out",
                    },
                    "&:hover svg": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {step.icon}
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "common.black",
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;

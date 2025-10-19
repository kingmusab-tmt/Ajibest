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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

interface Step {
  title: string;
  description?: string;
  icon: React.ReactElement;
}

const steps: Step[] = [
  {
    title: "Search Properties",
    description:
      "Browse our extensive property listings to find your perfect match",
    icon: <SearchIcon />,
  },
  {
    title: "Schedule Viewing",
    description: "Arrange a convenient time to visit and inspect the property",
    icon: <CalendarIcon />,
  },
  {
    title: "Accept Offer & Initial Payment",
    description: "Formalize your interest with an initial commitment",
    icon: <CheckIcon />,
  },
  {
    title: "Deposit Monthly",
    description: "Convenient monthly payment plans available",
    icon: <PaymentIcon />,
  },
  {
    title: "Complete Payment",
    description: "Finalize your investment with the remaining balance",
    icon: <CheckIcon />,
  },
  {
    title: "Collect Documents",
    description: "Receive all legal documentation and ownership papers",
    icon: <FolderIcon />,
  },
  {
    title: "Congratulations!!!",
    description: "Celebrate your new property acquisition",
    icon: <StarIcon />,
  },
  {
    title: "You Own a Land",
    description: "Enjoy the benefits of property ownership",
    icon: <HomeIcon />,
  },
];

const Diagram = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      id="howitworks"
      sx={{
        py: 8,
        px: { xs: 2, sm: 4 },
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
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
          How It Works
        </Typography>

        {/* Mobile View - Vertical Stepper */}
        {isMobile && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Stepper orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index} active={true}>
                  <StepLabel
                    optional={
                      step.description && (
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      )
                    }
                    icon={
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    }
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {step.title}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        )}

        {/* Desktop View - Grid Layout */}
        {!isMobile && (
          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    borderRadius: 3,
                    backgroundColor: "background.paper",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    <Chip
                      label={`Step ${index + 1}`}
                      color="primary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    />

                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      {step.icon}
                    </Avatar>

                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {step.title}
                    </Typography>

                    {step.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {step.description}
                      </Typography>
                    )}

                    {index < steps.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: -20,
                          transform: "translateY(-50%)",
                          color: "primary.main",
                          zIndex: 2,
                        }}
                      >
                        <ArrowForwardIcon fontSize="large" />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Process Completion */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
            Simple & Transparent Process
          </Typography>
          <Typography variant="body1">
            Our streamlined approach makes property acquisition straightforward
            and stress-free. From selection to ownership, we guide you through
            every step of the process.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Diagram;

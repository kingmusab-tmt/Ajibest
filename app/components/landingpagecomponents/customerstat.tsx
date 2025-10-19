"use client";
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  People as PeopleIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import {
  Typography,
  Box,
  Container,
  Icon,
  Paper,
  useTheme,
  Grid,
  Alert,
} from "@mui/material";
import { statsApi } from "@/lib/api/statsApi";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Home: HomeIcon,
  People: PeopleIcon,
  TrendingUp: TrendingUpIcon,
  CalendarMonth: CalendarMonthIcon,
};

const renderIcon = (
  iconName: string,
  color: string = "primary",
  size: number = 24
) => {
  const IconComponent = iconMap[iconName] || HomeIcon;
  return (
    <IconComponent
      color={color as any}
      sx={{ fontSize: size }} // <- sets the icon size
    />
  );
};

interface CustomerStatsProps {
  initialData?: any;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ initialData }) => {
  const theme = useTheme();
  const [content, setContent] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    // Only fetch when there's no initialData provided
    if (initialData) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await statsApi.getStats();

        if (response.success) {
          setContent(response.data);
        } else {
          throw new Error(response.error || "Failed to load stats");
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [initialData]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!content) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}
      >
        <Alert severity="error">No content available</Alert>
      </Container>
    );
  }

  const activeStats = content.stats?.filter((stat: any) => stat.isActive) || [];

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}
    >
      {/* Stats Section */}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          mb: { xs: 6, md: 8 },
          fontWeight: "bold",
          color: "primary.main",
          fontSize: { xs: "2rem", md: "2.75rem" },
        }}
      >
        Why Clients Trust Us
      </Typography>

      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        justifyContent="center"
        sx={{ mb: { xs: 8, md: 12 } }}
      >
        {activeStats.map((stat: any, index: number) => (
          <Grid item xs={12} sm={6} md={3} key={stat._id?.toString() || index}>
            <StatCard stat={stat} inView={inView} ref={ref} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const StatCard = React.forwardRef<
  HTMLDivElement,
  { stat: any; inView: boolean }
>(({ stat, inView }, ref) => (
  <Paper
    ref={ref}
    elevation={3}
    sx={{
      textAlign: "center",
      p: { xs: 3, md: 4 },
      borderRadius: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
    }}
  >
    <Icon
      color={stat.color as any}
      sx={{
        fontSize: { xs: 50, md: 60 },
        mb: 2,
      }}
    >
      {renderIcon(stat.icon, stat.color, 50)}
    </Icon>
    <Typography
      variant="h2"
      sx={{
        fontWeight: "bold",
        color: `${stat.color}.main`,
        mb: 1,
        fontSize: { xs: "2.25rem", md: "2.75rem" },
      }}
    >
      {inView && <CountUp start={0} end={stat.value} duration={3} />}
      {stat.suffix}
    </Typography>
    <Typography
      variant="h6"
      sx={{
        color: "text.secondary",
        fontWeight: "medium",
      }}
    >
      {stat.title}
    </Typography>
  </Paper>
));

StatCard.displayName = "StatCard";

const LoadingSkeleton = () => (
  <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}>
    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Paper
            sx={{
              height: 200,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">Loading...</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Box sx={{ width: "80%", mx: "auto", mt: 8 }}>
      <Paper
        sx={{
          height: 200,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">Loading testimonials...</Typography>
      </Paper>
    </Box>
  </Container>
);

export default CustomerStats;

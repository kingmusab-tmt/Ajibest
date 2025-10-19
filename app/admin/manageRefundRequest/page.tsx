"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  alpha,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Home as HomeIcon,
  Payments as PaymentsIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import RefundRequestsTable from "./RefundRequestsTable";
import RefundStats from "./RefundStats";
import UpcomingRefunds from "./UpcomingRefunds";

interface RefundRequest {
  _id: string;
  userEmail: string;
  userName: string;
  propertyTitle: string;
  totalRefundAmount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  refundSchedule: {
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidAt: string | null;
    paymentMethod: string;
  }[];
}

export default function RefundRequestsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Define functions inside useEffect to avoid dependency issues
    const fetchRefundRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/aapi/refund/refund-requests?status=${filter}`
        );
        const data = await response.json();

        if (response.ok) {
          setRefundRequests(data.refundRequests);
        } else {
          setError("Failed to fetch refund requests: " + data.error);
          console.error("Failed to fetch refund requests:", data.error);
        }
      } catch (error) {
        const errorMessage =
          "Error fetching refund requests. Please try again.";
        setError(errorMessage);
        console.error("Error fetching refund requests:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkReminders = async () => {
      try {
        await fetch("/api/aapi/refund/refundReminders");
        // Reminders are sent automatically via email/SMS/push
      } catch (error) {
        console.error("Error checking reminders:", error);
      }
    };

    if (status === "loading") return;

    if (!session || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }

    fetchRefundRequests();
    checkReminders();
  }, [session, status, filter, refreshTrigger, router]); // Now all dependencies are included

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading State
  if (status === "loading" || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Loading Refund Requests...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/admin"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Admin
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PaymentsIcon sx={{ mr: 0.5 }} fontSize="small" />
            Refund Requests
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Refund Requests
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              maxWidth: 600,
            }}
          >
            Manage and process property withdrawal refunds with comprehensive
            tracking
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Section */}
        <Box sx={{ mb: 4 }}>
          <RefundStats refundRequests={refundRequests} />
        </Box>

        {/* Upcoming Refunds */}
        <Box sx={{ mb: 4 }}>
          <UpcomingRefunds refundRequests={refundRequests} />
        </Box>

        {/* Filter and Table Section */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header with Filter */}
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    color: theme.palette.text.primary,
                  }}
                >
                  All Refund Requests
                </Typography>

                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 200 },
                    maxWidth: { xs: "100%", sm: 200 },
                  }}
                >
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filter}
                    label="Filter by Status"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Table */}
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              <RefundRequestsTable
                refundRequests={refundRequests}
                onUpdate={refreshData}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Refresh Indicator */}
        {refreshTrigger > 0 && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

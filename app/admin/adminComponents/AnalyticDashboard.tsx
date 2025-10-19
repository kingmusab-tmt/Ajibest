"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  Home as PropertyIcon,
  Receipt as TransactionIcon,
  TrendingUp,
  AccountBalance,
  CalendarToday,
  Refresh,
  Payment,
  CreditCard,
  ShoppingCart,
  House,
} from "@mui/icons-material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProperties: number;
    totalTransactions: number;
    totalRevenue: number;
    activeListings: number;
    pendingTransactions: number;
    soldProperties: number;
    rentedProperties: number;
    totalPaymentsMade: number;
    totalPaymentsToBeMade: number;
    purchasedUnderPayment: number;
    rentedUnderPayment: number;
  };
  recentTransactions: any[];
  propertyDistribution: any[];
  revenueData: any[];
  userGrowth: any[];
  timestamp: string;
  dataSource: string;
}

const AnalyticDashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/aapi/anlytics");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date().toLocaleTimeString());

      if (data.dataSource === "mock-fallback") {
        setError("Using mock data - real data unavailable");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    color,
    progress,
    subtitle,
    formatCurrency = false,
  }: any) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {loading
                ? "..."
                : formatCurrency
                ? `₦${value.toFixed(2)}`
                : value.toLocaleString()}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {progress && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}30`, color }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const MiniChart = ({ data, color }: any) => (
    <Box sx={{ width: "100%", height: 40 }}>
      <svg width="100%" height="40" viewBox="0 0 120 40">
        <path
          d={`M0,${40 - data[0]} ${data
            .map(
              (d: number, i: number) =>
                `L${i * (120 / (data.length - 1))},${40 - d}`
            )
            .join(" ")}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    </Box>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "canceled":
        return "default";
      default:
        return "default";
    }
  };

  if (loading && !dashboardData) {
    return <LoadingSpinner />;
  }

  const data = dashboardData || {
    stats: {
      totalUsers: 0,
      totalProperties: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      activeListings: 0,
      pendingTransactions: 0,
      soldProperties: 0,
      rentedProperties: 0,
      totalPaymentsMade: 0,
      totalPaymentsToBeMade: 0,
      purchasedUnderPayment: 0,
      rentedUnderPayment: 0,
    },
    recentTransactions: [],
    propertyDistribution: [],
    revenueData: [],
    userGrowth: [],
    timestamp: "",
    dataSource: "mock",
  };

  // Calculate payment completion percentage
  const paymentCompletionPercentage =
    data.stats.totalPaymentsToBeMade > 0
      ? (data.stats.totalPaymentsMade / data.stats.totalPaymentsToBeMade) * 100
      : 0;

  return (
    <Box
      sx={{ p: 3, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          {lastUpdated && (
            <Typography variant="body2" color="textSecondary">
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>
        <IconButton onClick={fetchDashboardData} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      {/* Data Source Alert */}
      {data.dataSource === "mock" && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={fetchDashboardData}
            >
              <Refresh />
            </IconButton>
          }
        >
          Using mock data. Real data is currently unavailable.
        </Alert>
      )}

      {/* Core Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={data.stats.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            progress={75}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Properties"
            value={data.stats.totalProperties}
            icon={<PropertyIcon />}
            color="#2e7d32"
            progress={60}
            subtitle={`${data.stats.activeListings} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Transactions"
            value={data.stats.totalTransactions}
            icon={<TransactionIcon />}
            color="#ed6c02"
            progress={85}
            subtitle={`${data.stats.pendingTransactions} pending`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={data.stats.totalRevenue}
            icon={<AccountBalance />}
            color="#9c27b0"
            progress={90}
            formatCurrency={true}
          />
        </Grid>
      </Grid>

      {/* Payment Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payments Made"
            value={data.stats.totalPaymentsMade}
            icon={<Payment />}
            color="#388e3c"
            progress={paymentCompletionPercentage}
            formatCurrency={true}
            subtitle={`${paymentCompletionPercentage.toFixed(1)}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payment to be Made"
            value={data.stats.totalPaymentsToBeMade}
            icon={<CreditCard />}
            color="#f57c00"
            progress={100 - paymentCompletionPercentage}
            formatCurrency={true}
            subtitle="Remaining balance"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Purchased Under Payment"
            value={data.stats.purchasedUnderPayment}
            icon={<ShoppingCart />}
            color="#7b1fa2"
            progress={65}
            subtitle="Installment purchases"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rented Under Payment"
            value={data.stats.rentedUnderPayment}
            icon={<House />}
            color="#0288d1"
            progress={45}
            subtitle="Installment rentals"
          />
        </Grid>
      </Grid>

      {/* Additional Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={data.stats.activeListings}
            icon={<TrendingUp />}
            color="#0288d1"
            progress={45}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sold Properties"
            value={data.stats.soldProperties}
            icon={<CalendarToday />}
            color="#d32f2f"
            progress={30}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rented Properties"
            value={data.stats.rentedProperties}
            icon={<PropertyIcon />}
            color="#7b1fa2"
            progress={25}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${(
              ((data.stats.totalTransactions - data.stats.pendingTransactions) /
                data.stats.totalTransactions) *
              100
            ).toFixed(1)}%`}
            icon={<TrendingUp />}
            color="#388e3c"
            progress={85}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">Revenue Overview</Typography>
                <Chip
                  label={
                    data.dataSource === "database" ? "Live Data" : "Mock Data"
                  }
                  size="small"
                  color={data.dataSource === "database" ? "success" : "warning"}
                />
              </Box>
              <Box sx={{ height: 200 }}>
                <MiniChart
                  data={data.revenueData.map((d: any) => d.revenue / 5000)}
                  color={theme.palette.primary.main}
                />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {data.revenueData.map((month: any) => (
                    <Grid item xs={2} key={month.month}>
                      <Box textAlign="center">
                        <Typography variant="body2" color="textSecondary">
                          {month.month}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ₦{month.revenue.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Property Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Property Types
              </Typography>
              <Box sx={{ mt: 2 }}>
                {data.propertyDistribution.map((item: any) => (
                  <Box key={item.type} sx={{ mb: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">{item.type}</Typography>
                      <Chip
                        label={item.count}
                        size="small"
                        sx={{ bgcolor: `${item.color}20`, color: item.color }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.count / data.stats.totalProperties) * 100}
                      sx={{
                        mt: 0.5,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${item.color}20`,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Property Type</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentTransactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{transaction.email}</TableCell>
                    <TableCell>{transaction.propertyType}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.paymentMethod}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {data.recentTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">
                        No transactions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticDashboard;

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccountCircle,
  Email,
  CalendarToday,
  Payment,
  AttachMoney,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

interface PaymentHistory {
  paymentDate: string;
  nextPaymentDate: string;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
  _id: string;
}

interface WithdrawalRequest {
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  location: string;
  image: string;
  propertyId: string;
  propertyType: string;
  listingPurpose: string;
  paymentMethod: string;
  initialPayment: number;
  price: number;
  amenities: string;
  utilities: string;
  plotNumber: string;
  state: string;
  instalmentAllowed: boolean;
  paymentHistory: PaymentHistory[];
  withdrawnDate: string;
  isWithdrawnApproved: boolean;
  withdrawalReason: string;
  isWithdrawn: boolean;
  approvedAt: string | null;
  approvedBy: string;
  _id: string;
}

const AdminWithdrawalsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await axios.get("/api/aapi/withdrawals");
      setWithdrawalRequests(response.data.withdrawalRequests);
    } catch (error) {
      setError("Error fetching withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setApproveDialogOpen(true);
  };

  const handleDeny = async (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setDenyDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      await axios.post("/api/aapi/withdrawals/approve", {
        userId: selectedRequest.userId,
        propertyId: selectedRequest.propertyId,
        approve: true,
      });

      setSuccess("Withdrawal approved successfully");
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      fetchWithdrawalRequests();
    } catch (error) {
      setError("Error approving withdrawal");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeny = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      await axios.post("/api/aapi/withdrawals/approve", {
        userId: selectedRequest.userId,
        propertyId: selectedRequest.propertyId,
        approve: false,
      });

      setSuccess("Withdrawal denied successfully");
      setDenyDialogOpen(false);
      setSelectedRequest(null);
      fetchWithdrawalRequests();
    } catch (error) {
      setError("Error denying withdrawal");
    } finally {
      setActionLoading(false);
    }
  };

  const getTotalPaid = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return 0;
    const lastPayment = paymentHistory[paymentHistory.length - 1];
    return lastPayment.totalPaymentMade || 0;
  };

  const getPropertyPrice = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return 0;
    return paymentHistory[0].propertyPrice || 0;
  };

  const getProgress = (paymentHistory: PaymentHistory[]) => {
    const totalPaid = getTotalPaid(paymentHistory);
    const propertyPrice = getPropertyPrice(paymentHistory);
    return propertyPrice > 0 ? (totalPaid / propertyPrice) * 100 : 0;
  };

  const getFirstPaymentDate = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return null;
    return paymentHistory[0].paymentDate;
  };

  const getLastPaymentDate = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return null;
    return paymentHistory[paymentHistory.length - 1].paymentDate;
  };

  const getNextPaymentDate = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return null;
    return paymentHistory[paymentHistory.length - 1].nextPaymentDate;
  };

  const getPaymentCount = (paymentHistory: PaymentHistory[]) => {
    return paymentHistory?.length || 0;
  };

  const getAveragePayment = (paymentHistory: PaymentHistory[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return 0;
    const totalPaid = getTotalPaid(paymentHistory);
    return totalPaid / paymentHistory.length;
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Withdrawal Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage property contract withdrawal requests from users
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {withdrawalRequests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Pending Withdrawals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All withdrawal requests have been processed.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {withdrawalRequests.map((request) => {
            const propertyPrice = getPropertyPrice(request.paymentHistory);
            const totalPaid = getTotalPaid(request.paymentHistory);
            const progress = getProgress(request.paymentHistory);
            const firstPaymentDate = getFirstPaymentDate(
              request.paymentHistory
            );
            const lastPaymentDate = getLastPaymentDate(request.paymentHistory);
            const nextPaymentDate = getNextPaymentDate(request.paymentHistory);
            const paymentCount = getPaymentCount(request.paymentHistory);
            const averagePayment = getAveragePayment(request.paymentHistory);

            return (
              <Grid size={{ xs: 12 }} key={request._id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {request.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {request.description}
                        </Typography>
                        <Stack
                          direction={isMobile ? "column" : "row"}
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Chip
                            label={request.propertyType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={request.listingPurpose}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                          <Chip
                            label={request.paymentMethod}
                            size="small"
                            variant="outlined"
                          />
                          {request.instalmentAllowed && (
                            <Chip
                              label="Installment Allowed"
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>
                      <Chip label="Pending" color="warning" />
                    </Box>

                    <Grid container spacing={3}>
                      {/* User Information */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          User Information
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <AccountCircle
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {request.userName}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Email sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {request.userEmail}
                          </Typography>
                        </Box>

                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Property Details
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Location: {request.location}
                          </Typography>
                        </Box>
                        {request.plotNumber && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Plot: {request.plotNumber}
                            </Typography>
                          </Box>
                        )}
                        {request.state && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              State: {request.state}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      {/* Payment Information */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Payment Summary
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Property Price:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {formatter.format(propertyPrice)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Initial Payment:
                            </Typography>
                            <Typography variant="body2">
                              {formatter.format(request.initialPayment)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">Total Paid:</Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary"
                            >
                              {formatter.format(totalPaid)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Remaining Balance:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="error"
                            >
                              {formatter.format(propertyPrice - totalPaid)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Payment Progress:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Grid>

                      {/* Payment History Details */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Payment History
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Total Payments:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {paymentCount}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Average Payment:
                            </Typography>
                            <Typography variant="body2">
                              {formatter.format(averagePayment)}
                            </Typography>
                          </Box>
                          {firstPaymentDate && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                First Payment:
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(firstPaymentDate)}
                              </Typography>
                            </Box>
                          )}
                          {lastPaymentDate && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                Last Payment:
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(lastPaymentDate)}
                              </Typography>
                            </Box>
                          )}
                          {nextPaymentDate && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                Next Payment Due:
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(nextPaymentDate)}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Withdrawal Details
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CalendarToday
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            Requested: {formatDate(request.withdrawnDate)}
                          </Typography>
                        </Box>
                        {request.withdrawalReason && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Reason: {request.withdrawalReason}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleDeny(request)}
                        disabled={actionLoading}
                      >
                        Deny
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(request)}
                        disabled={actionLoading}
                      >
                        Approve & Refund
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => !actionLoading && setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Withdrawal</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to approve the withdrawal for{" "}
            <strong>{selectedRequest?.title}</strong>?
          </Typography>
          {selectedRequest && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This will process a refund of{" "}
                <strong>
                  {formatter.format(
                    getTotalPaid(selectedRequest.paymentHistory)
                  )}
                </strong>{" "}
                to the user.
              </Typography>
              <Box
                sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "success.contrastText" }}
                >
                  <strong>Refund Details:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.contrastText" }}
                >
                  • Total amount paid:{" "}
                  {formatter.format(
                    getTotalPaid(selectedRequest.paymentHistory)
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.contrastText" }}
                >
                  • Number of payments:{" "}
                  {getPaymentCount(selectedRequest.paymentHistory)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.contrastText" }}
                >
                  • Property price:{" "}
                  {formatter.format(
                    getPropertyPrice(selectedRequest.paymentHistory)
                  )}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setApproveDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmApprove}
            color="success"
            variant="contained"
            disabled={actionLoading}
            startIcon={
              actionLoading ? <CircularProgress size={20} /> : <CheckCircle />
            }
          >
            {actionLoading ? "Processing..." : "Approve & Process Refund"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog
        open={denyDialogOpen}
        onClose={() => !actionLoading && setDenyDialogOpen(false)}
      >
        <DialogTitle>Deny Withdrawal</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to deny the withdrawal for{" "}
            <strong>{selectedRequest?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The property will be moved back to the user&apos;s &quot;In
            Progress&quot; tab and they can continue with their payment plan.
          </Typography>
          {selectedRequest && (
            <Box
              sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "warning.contrastText" }}
              >
                <strong>Current Status:</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "warning.contrastText" }}
              >
                • Progress:{" "}
                {getProgress(selectedRequest.paymentHistory).toFixed(0)}%
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "warning.contrastText" }}
              >
                • Remaining:{" "}
                {formatter.format(
                  getPropertyPrice(selectedRequest.paymentHistory) -
                    getTotalPaid(selectedRequest.paymentHistory)
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDenyDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeny}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={
              actionLoading ? <CircularProgress size={20} /> : <Cancel />
            }
          >
            {actionLoading ? "Processing..." : "Deny Withdrawal"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminWithdrawalsPage;

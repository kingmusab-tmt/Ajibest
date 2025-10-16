// app/admin/withdrawals/page.tsx
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
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccountCircle,
  Email,
  CalendarToday,
  Payment,
} from "@mui/icons-material";

interface WithdrawalRequest {
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  propertyId: string;
  propertyType: string;
  listingPurpose: string;
  paymentMethod: string;
  price: number;
  initialPayment: number;
  paymentHistory: any[];
  withdrawnDate: string;
  withdrawalReason?: string;
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
    }
  };

  const confirmDeny = async () => {
    if (!selectedRequest) return;

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
    }
  };

  const getTotalPaid = (paymentHistory: any[]) => {
    if (!paymentHistory || paymentHistory.length === 0) return 0;
    const lastPayment = paymentHistory[paymentHistory.length - 1];
    return lastPayment.totalPaymentMade || 0;
  };

  const getProgress = (paymentHistory: any[], price: number) => {
    const totalPaid = getTotalPaid(paymentHistory);
    return price > 0 ? (totalPaid / price) * 100 : 0;
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
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
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
          {withdrawalRequests.map((request) => (
            <Grid item xs={12} key={request._id}>
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
                      </Stack>
                    </Box>
                    <Chip label="Pending" color="warning" />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
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

                      <Typography variant="subtitle2" gutterBottom>
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
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Reason: {request.withdrawalReason}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Payment Information
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
                            {formatter.format(request.price)}
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
                            mb: 2,
                          }}
                        >
                          <Typography variant="body2">Total Paid:</Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary"
                          >
                            {formatter.format(
                              getTotalPaid(request.paymentHistory)
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 3 }}>
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
                            {getProgress(
                              request.paymentHistory,
                              request.price
                            ).toFixed(0)}
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getProgress(
                            request.paymentHistory,
                            request.price
                          )}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleDeny(request)}
                    >
                      Deny
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApprove(request)}
                    >
                      Approve & Refund
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Withdrawal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve the withdrawal for{" "}
            <strong>{selectedRequest?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will process a refund of{" "}
            {formatter.format(
              getTotalPaid(selectedRequest?.paymentHistory || [])
            )}{" "}
            to the user.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmApprove} color="success" variant="contained">
            Approve & Process Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={denyDialogOpen} onClose={() => setDenyDialogOpen(false)}>
        <DialogTitle>Deny Withdrawal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deny the withdrawal for{" "}
            <strong>{selectedRequest?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The property will be moved back to the user's "In Progress" tab.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenyDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeny} color="error" variant="contained">
            Deny Withdrawal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminWithdrawalsPage;

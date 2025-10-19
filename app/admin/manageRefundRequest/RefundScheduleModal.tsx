"use client";
import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface RefundScheduleItem {
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidAt: string | null;
  paymentMethod: string;
}

interface RefundRequest {
  _id: string;
  userEmail: string;
  userName: string;
  propertyTitle: string;
  totalRefundAmount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  refundSchedule: RefundScheduleItem[];
}

interface RefundScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  refundRequest: RefundRequest;
  onUpdate: () => void;
}

export default function RefundScheduleModal({
  isOpen,
  onClose,
  refundRequest,
  onUpdate,
}: RefundScheduleModalProps) {
  const [processing, setProcessing] = useState<number | null>(null);

  const handleMarkAsPaid = async (scheduleIndex: number) => {
    try {
      setProcessing(scheduleIndex);

      const response = await fetch("/api/aapi/refund/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refundRequestId: refundRequest._id,
          scheduleIndex: scheduleIndex,
        }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        const error = await response.json();
        alert(`Failed to mark as paid: ${error.error}`);
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Failed to mark as paid. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (item: RefundScheduleItem) => {
    if (item.isPaid) return "success";

    const daysUntilDue = getDaysUntilDue(item.dueDate);
    if (daysUntilDue < 0) return "error";
    if (daysUntilDue <= 2) return "warning";
    if (daysUntilDue <= 7) return "secondary";
    return "info";
  };

  const getStatusText = (item: RefundScheduleItem) => {
    if (item.isPaid) {
      return `Paid on ${new Date(item.paidAt!).toLocaleDateString()}`;
    }

    const daysUntilDue = getDaysUntilDue(item.dueDate);
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    return `Due in ${daysUntilDue} days`;
  };

  const getVariant = (item: RefundScheduleItem) => {
    if (item.isPaid) return "filled";
    return "outlined";
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "80%" },
          maxWidth: "1200px",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Refund Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {refundRequest.userName} - {refundRequest.propertyTitle}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: "calc(90vh - 140px)", overflow: "auto" }}>
          {/* Summary Cards */}
          <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Total Refund Amount
                  </Typography>
                  <Typography
                    variant="h4"
                    component="p"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ₦{refundRequest.totalRefundAmount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Installments
                  </Typography>
                  <Typography
                    variant="h4"
                    component="p"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {refundRequest.refundSchedule.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Completed
                  </Typography>
                  <Typography
                    variant="h4"
                    component="p"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {
                      refundRequest.refundSchedule.filter((s) => s.isPaid)
                        .length
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Schedule Table */}
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Installment
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Due Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", py: 2 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refundRequest.refundSchedule.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "medium" }}
                    >
                      #{index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      ₦{item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(item.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(item)}
                        color={getStatusColor(item)}
                        variant={getVariant(item)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!item.isPaid && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleMarkAsPaid(index)}
                          disabled={processing === index}
                          startIcon={
                            processing === index ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          sx={{
                            borderRadius: 8,
                            textTransform: "none",
                            minWidth: 120,
                          }}
                        >
                          {processing === index
                            ? "Processing..."
                            : "Mark as Paid"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "grey.50",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

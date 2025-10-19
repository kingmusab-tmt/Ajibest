"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventIcon from "@mui/icons-material/Event";

interface RefundRequest {
  _id: string;
  userEmail: string;
  userName: string;
  propertyTitle: string;
  totalRefundAmount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  refundSchedule: {
    amount: number;
    dueDate: string;
    isPaid: boolean;
    paidAt: string | null;
    paymentMethod: string;
  }[];
}

interface UpcomingRefundsProps {
  refundRequests: RefundRequest[];
}

interface UpcomingPayment {
  refundRequestId: string;
  userEmail: string;
  userName: string;
  propertyTitle: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
}

export default function UpcomingRefunds({
  refundRequests,
}: UpcomingRefundsProps) {
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(
    []
  );
  const theme = useTheme();

  useEffect(() => {
    const calculateUpcomingPayments = () => {
      const payments: UpcomingPayment[] = [];

      refundRequests.forEach((request) => {
        if (request.status === "pending" || request.status === "in-progress") {
          request.refundSchedule.forEach((schedule) => {
            if (!schedule.isPaid) {
              const dueDate = new Date(schedule.dueDate);
              const today = new Date();
              const daysUntilDue = Math.ceil(
                (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );

              if (daysUntilDue <= 10 && daysUntilDue >= 0) {
                payments.push({
                  refundRequestId: request._id,
                  userEmail: request.userEmail,
                  userName: request.userName,
                  propertyTitle: request.propertyTitle,
                  amount: schedule.amount,
                  dueDate: schedule.dueDate,
                  daysUntilDue,
                });
              }
            }
          });
        }
      });

      // Sort by due date (closest first)
      payments.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
      setUpcomingPayments(payments);
    };

    calculateUpcomingPayments();
  }, [refundRequests]);

  if (upcomingPayments.length === 0) {
    return null;
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return "error";
    if (days <= 5) return "warning";
    return "default";
  };

  const getUrgencyBackgroundColor = (days: number) => {
    if (days <= 2) return alpha(theme.palette.error.main, 0.1);
    if (days <= 5) return alpha(theme.palette.warning.main, 0.1);
    return alpha(theme.palette.info.main, 0.1);
  };

  const getUrgencyTextColor = (days: number) => {
    if (days <= 2) return theme.palette.error.dark;
    if (days <= 5) return theme.palette.warning.dark;
    return theme.palette.info.dark;
  };

  const getDisplayText = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
        backgroundColor: alpha(theme.palette.warning.main, 0.02),
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: "warning.main",
              width: 40,
              height: 40,
            }}
          >
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.warning.dark,
                fontWeight: 600,
              }}
            >
              Upcoming Refund Payments
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.warning.dark,
                mt: 0.5,
              }}
            >
              You have {upcomingPayments.length} refund payment(s) due in the
              next 10 days
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2}>
          {upcomingPayments.map((payment, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                backgroundColor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      icon={<ScheduleIcon />}
                      label={getDisplayText(payment.daysUntilDue)}
                      color={getUrgencyColor(payment.daysUntilDue)}
                      variant="filled"
                      size="small"
                      sx={{
                        backgroundColor: getUrgencyBackgroundColor(
                          payment.daysUntilDue
                        ),
                        color: getUrgencyTextColor(payment.daysUntilDue),
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: getUrgencyTextColor(payment.daysUntilDue),
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      ${payment.amount.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {payment.userName} ({payment.userEmail}) -{" "}
                    {payment.propertyTitle}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <EventIcon fontSize="small" />
                  <Typography variant="body2" noWrap>
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

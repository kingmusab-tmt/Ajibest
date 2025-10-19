// // components/admin/refund-requests/RefundStats.tsx
// interface RefundRequest {
//   _id: string;
//   totalRefundAmount: number;
//   status: "pending" | "in-progress" | "completed" | "cancelled";
// }

// interface RefundStatsProps {
//   refundRequests: RefundRequest[];
// }

// export default function RefundStats({ refundRequests }: RefundStatsProps) {
//   const stats = {
//     total: refundRequests.length,
//     pending: refundRequests.filter((r) => r.status === "pending").length,
//     inProgress: refundRequests.filter((r) => r.status === "in-progress").length,
//     completed: refundRequests.filter((r) => r.status === "completed").length,
//     totalAmount: refundRequests.reduce(
//       (sum, r) => sum + r.totalRefundAmount,
//       0
//     ),
//     pendingAmount: refundRequests
//       .filter((r) => r.status === "pending" || r.status === "in-progress")
//       .reduce((sum, r) => sum + r.totalRefundAmount, 0),
//   };

//   const statCards = [
//     {
//       name: "Total Requests",
//       value: stats.total,
//       color: "bg-blue-500",
//     },
//     {
//       name: "Pending Review",
//       value: stats.pending,
//       color: "bg-yellow-500",
//     },
//     {
//       name: "In Progress",
//       value: stats.inProgress,
//       color: "bg-orange-500",
//     },
//     {
//       name: "Completed",
//       value: stats.completed,
//       color: "bg-green-500",
//     },
//     {
//       name: "Total Amount",
//       value: `₦${stats.totalAmount.toLocaleString()}`,
//       color: "bg-purple-500",
//     },
//     {
//       name: "Pending Amount",
//       value: `₦${stats.pendingAmount.toLocaleString()}`,
//       color: "bg-red-500",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
//       {statCards.map((stat) => (
//         <div
//           key={stat.name}
//           className="bg-white overflow-hidden shadow rounded-lg"
//         >
//           <div className="px-4 py-5 sm:p-6">
//             <dt className="text-sm font-medium text-gray-500 truncate">
//               {stat.name}
//             </dt>
//             <dd className="mt-1 text-3xl font-semibold text-gray-900">
//               {stat.value}
//             </dd>
//           </div>
//           <div className={`${stat.color} h-1`}></div>
//         </div>
//       ))}
//     </div>
//   );
// }
// components/admin/refund-requests/RefundStats.tsx
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  Receipt,
  Schedule,
  CheckCircle,
  AttachMoney,
  Pending,
} from "@mui/icons-material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface RefundRequest {
  _id: string;
  totalRefundAmount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
}

interface RefundStatsProps {
  refundRequests: RefundRequest[];
}

export default function RefundStats({ refundRequests }: RefundStatsProps) {
  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter((r) => r.status === "pending").length,
    inProgress: refundRequests.filter((r) => r.status === "in-progress").length,
    completed: refundRequests.filter((r) => r.status === "completed").length,
    totalAmount: refundRequests.reduce(
      (sum, r) => sum + r.totalRefundAmount,
      0
    ),
    pendingAmount: refundRequests
      .filter((r) => r.status === "pending" || r.status === "in-progress")
      .reduce((sum, r) => sum + r.totalRefundAmount, 0),
  };

  const statCards = [
    {
      name: "Total Requests",
      value: stats.total,
      color: "primary.main",
      backgroundColor: "primary.light",
      icon: Receipt,
    },
    {
      name: "Pending Review",
      value: stats.pending,
      color: "warning.main",
      backgroundColor: "warning.light",
      icon: Schedule,
    },
    {
      name: "In Progress",
      value: stats.inProgress,
      color: "#ed6c02",
      backgroundColor: "rgba(237, 108, 2, 0.1)",
      icon: HourglassEmptyIcon,
    },
    {
      name: "Completed",
      value: stats.completed,
      color: "success.main",
      backgroundColor: "success.light",
      icon: CheckCircle,
    },
    {
      name: "Total Amount",
      value: `₦${stats.totalAmount.toLocaleString()}`,
      color: "secondary.main",
      backgroundColor: "secondary.light",
      icon: AttachMoney,
    },
    {
      name: "Pending Amount",
      value: `₦${stats.pendingAmount.toLocaleString()}`,
      color: "error.main",
      backgroundColor: "error.light",
      icon: Pending,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} lg={4} xl={2} key={stat.name}>
            <Card
              sx={{
                height: "100%",
                position: "relative",
                overflow: "visible",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                },
              }}
              elevation={2}
            >
              <CardContent sx={{ p: 3, position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    backgroundColor: stat.backgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent
                    sx={{
                      fontSize: 28,
                      color: stat.color,
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    pr: 6,
                  }}
                >
                  {stat.name}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.2,
                    mt: 1,
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: stat.color,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

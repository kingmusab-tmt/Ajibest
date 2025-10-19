// // components/admin/refund-requests/RefundRequestsTable.tsx
// import { useState } from "react";
// import RefundScheduleModal from "./RefundScheduleModal";

// interface RefundRequest {
//   _id: string;
//   userEmail: string;
//   userName: string;
//   propertyTitle: string;
//   totalRefundAmount: number;
//   status: "pending" | "in-progress" | "completed" | "cancelled";
//   createdAt: string;
//   refundSchedule: {
//     amount: number;
//     dueDate: string;
//     isPaid: boolean;
//     paidAt: string | null;
//     paymentMethod: string;
//   }[];
// }

// interface RefundRequestsTableProps {
//   refundRequests: RefundRequest[];
//   onUpdate: () => void;
// }

// export default function RefundRequestsTable({
//   refundRequests,
//   onUpdate,
// }: RefundRequestsTableProps) {
//   const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(
//     null
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "in-progress":
//         return "bg-blue-100 text-blue-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getProgress = (request: RefundRequest) => {
//     const total = request.refundSchedule.length;
//     const paid = request.refundSchedule.filter((s) => s.isPaid).length;
//     return { paid, total, percentage: Math.round((paid / total) * 100) };
//   };

//   const handleViewSchedule = (request: RefundRequest) => {
//     setSelectedRequest(request);
//     setIsModalOpen(true);
//   };

//   if (refundRequests.length === 0) {
//     return (
//       <div className="px-6 py-12 text-center">
//         <svg
//           className="mx-auto h-12 w-12 text-gray-400"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//         <h3 className="mt-2 text-sm font-medium text-gray-900">
//           No refund requests
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Get started by approving a property withdrawal request.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 User & Property
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Amount & Status
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Progress
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Created
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {refundRequests.map((request) => {
//               const progress = getProgress(request);

//               return (
//                 <tr key={request._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {request.userName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {request.userEmail}
//                       </div>
//                       <div className="text-sm text-gray-700 mt-1">
//                         {request.propertyTitle}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       ₦{request.totalRefundAmount.toLocaleString()}
//                     </div>
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
//                         request.status
//                       )}`}
//                     >
//                       {request.status.replace("-", " ")}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-blue-600 h-2.5 rounded-full"
//                           style={{ width: `${progress.percentage}%` }}
//                         ></div>
//                       </div>
//                       <span className="ml-2 text-sm font-medium text-gray-700">
//                         {progress.paid}/{progress.total}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {progress.percentage}% completed
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(request.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleViewSchedule(request)}
//                       className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
//                     >
//                       View Schedule
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {selectedRequest && (
//         <RefundScheduleModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           refundRequest={selectedRequest}
//           onUpdate={onUpdate}
//         />
//       )}
//     </>
//   );
// }
// components/admin/refund-requests/RefundRequestsTable.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Home as PropertyIcon,
  Payments as PaymentsIcon,
} from "@mui/icons-material";
import RefundScheduleModal from "./RefundScheduleModal";

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

interface RefundRequestsTableProps {
  refundRequests: RefundRequest[];
  onUpdate: () => void;
}

export default function RefundRequestsTable({
  refundRequests,
  onUpdate,
}: RefundRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in-progress":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getProgress = (request: RefundRequest) => {
    const total = request.refundSchedule.length;
    const paid = request.refundSchedule.filter((s) => s.isPaid).length;
    return { paid, total, percentage: Math.round((paid / total) * 100) };
  };

  const handleViewSchedule = (request: RefundRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mobile Card View
  const MobileRefundCard = ({ request }: { request: RefundRequest }) => {
    const progress = getProgress(request);

    return (
      <Card
        sx={{
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box>
              <Typography variant="h6" component="div" gutterBottom>
                {request.propertyTitle}
              </Typography>
              <Chip
                label={getStatusLabel(request.status)}
                color={getStatusColor(request.status)}
                size="small"
              />
            </Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(request.totalRefundAmount)}
            </Typography>
          </Stack>

          {/* User Info */}
          <Stack spacing={1} mb={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {request.userName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {request.userEmail}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(request.createdAt)}
              </Typography>
            </Box>
          </Stack>

          {/* Progress */}
          <Box mb={2}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2" fontWeight="medium">
                Refund Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.paid}/{progress.total} ({progress.percentage}%)
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress.percentage}
              color={progress.percentage === 100 ? "success" : "primary"}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            />
          </Box>

          {/* Action Button */}
          <Button
            variant="outlined"
            startIcon={<ViewIcon />}
            onClick={() => handleViewSchedule(request)}
            fullWidth
            size="small"
          >
            View Schedule
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Empty State Component
  const EmptyState = () => (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <Avatar
        sx={{
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2,
          backgroundColor: alpha(theme.palette.text.secondary, 0.1),
        }}
      >
        <PaymentsIcon fontSize="large" color="disabled" />
      </Avatar>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        color="text.secondary"
      >
        No refund requests
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 400, mx: "auto" }}
      >
        Get started by approving a property withdrawal request.
      </Typography>
    </Box>
  );

  if (refundRequests.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {isMobile ? (
        // Mobile Card View
        <Box>
          {refundRequests.map((request) => (
            <MobileRefundCard key={request._id} request={request} />
          ))}
        </Box>
      ) : (
        // Desktop Table View
        <TableContainer
          component={Paper}
          sx={{
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  User & Property
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Amount & Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Progress
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Created
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refundRequests.map((request) => {
                const progress = getProgress(request);

                return (
                  <TableRow
                    key={request._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="medium"
                          gutterBottom
                        >
                          {request.userName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {request.userEmail}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <PropertyIcon fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight="medium">
                            {request.propertyTitle}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {formatCurrency(request.totalRefundAmount)}
                      </Typography>
                      <Chip
                        label={getStatusLabel(request.status)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mr: 1 }}
                          >
                            {progress.paid}/{progress.total}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {progress.percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress.percentage}
                          color={
                            progress.percentage === 100 ? "success" : "primary"
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(request.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewSchedule(request)}
                        size="small"
                        sx={{
                          minWidth: 140,
                        }}
                      >
                        View Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedRequest && (
        <RefundScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refundRequest={selectedRequest}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

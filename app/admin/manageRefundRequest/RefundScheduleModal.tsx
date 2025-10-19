// // components/admin/refund-requests/RefundScheduleModal.tsx
// import { useState } from "react";

// interface RefundScheduleItem {
//   amount: number;
//   dueDate: string;
//   isPaid: boolean;
//   paidAt: string | null;
//   paymentMethod: string;
// }

// interface RefundRequest {
//   _id: string;
//   userEmail: string;
//   userName: string;
//   propertyTitle: string;
//   totalRefundAmount: number;
//   status: "pending" | "in-progress" | "completed" | "cancelled";
//   refundSchedule: RefundScheduleItem[];
// }

// interface RefundScheduleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   refundRequest: RefundRequest;
//   onUpdate: () => void;
// }

// export default function RefundScheduleModal({
//   isOpen,
//   onClose,
//   refundRequest,
//   onUpdate,
// }: RefundScheduleModalProps) {
//   const [processing, setProcessing] = useState<number | null>(null);

//   if (!isOpen) return null;

//   const handleMarkAsPaid = async (scheduleIndex: number) => {
//     try {
//       setProcessing(scheduleIndex);

//       const response = await fetch("/api/aapi/refund/mark-paid", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           refundRequestId: refundRequest._id,
//           scheduleIndex: scheduleIndex,
//         }),
//       });

//       if (response.ok) {
//         onUpdate();
//       } else {
//         const error = await response.json();
//         alert(`Failed to mark as paid: ${error.error}`);
//       }
//     } catch (error) {
//       console.error("Error marking as paid:", error);
//       alert("Failed to mark as paid. Please try again.");
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const getDaysUntilDue = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - today.getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const getStatusColor = (item: RefundScheduleItem) => {
//     if (item.isPaid) return "bg-green-100 text-green-800";

//     const daysUntilDue = getDaysUntilDue(item.dueDate);
//     if (daysUntilDue < 0) return "bg-red-100 text-red-800";
//     if (daysUntilDue <= 2) return "bg-orange-100 text-orange-800";
//     if (daysUntilDue <= 7) return "bg-yellow-100 text-yellow-800";
//     return "bg-blue-100 text-blue-800";
//   };

//   const getStatusText = (item: RefundScheduleItem) => {
//     if (item.isPaid) {
//       return `Paid on ${new Date(item.paidAt!).toLocaleDateString()}`;
//     }

//     const daysUntilDue = getDaysUntilDue(item.dueDate);
//     if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
//     if (daysUntilDue === 0) return "Due today";
//     if (daysUntilDue === 1) return "Due tomorrow";
//     return `Due in ${daysUntilDue} days`;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-medium text-gray-900">
//                 Refund Schedule
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 {refundRequest.userName} - {refundRequest.propertyTitle}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-500 transition-colors"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
//           {/* Summary */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Refund Amount
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₦{refundRequest.totalRefundAmount.toLocaleString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   Installments
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {refundRequest.refundSchedule.length}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {refundRequest.refundSchedule.filter((s) => s.isPaid).length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Schedule Table */}
//           <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Installment
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Amount
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Due Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Status
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {refundRequest.refundSchedule.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
//                       #{index + 1}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
//                       ₦{item.amount.toLocaleString()}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
//                       {new Date(item.dueDate).toLocaleDateString()}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
//                           item
//                         )}`}
//                       >
//                         {getStatusText(item)}
//                       </span>
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
//                       {!item.isPaid && (
//                         <button
//                           onClick={() => handleMarkAsPaid(index)}
//                           disabled={processing === index}
//                           className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {processing === index ? (
//                             <>
//                               <svg
//                                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               Processing...
//                             </>
//                           ) : (
//                             "Mark as Paid"
//                           )}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// components/admin/refund-requests/RefundScheduleModal.tsx
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

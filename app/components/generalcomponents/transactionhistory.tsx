// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import mongoose from "mongoose";

// interface Transaction {
//   _id: string;
//   transactionId: string;
//   referenceId?: string;
//   propertyPrice: number;
//   userId: mongoose.Types.ObjectId;
//   propertyId: mongoose.Types.ObjectId;
//   propertyType: "House" | "Land" | "Farm";
//   paymentMethod: "installment" | "payOnce";
//   paymentPurpose: "For Sale" | "For Renting";
//   amount: number;
//   status: "pending" | "successful" | "failed" | "canceled";
//   email: string;
//   createdAt: Date;
//   title?: string;
//   userName?: string;
// }

// const TransactionHistory: React.FC = () => {
//   const { data: session, status } = useSession();
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [sortField, setSortField] = useState<string>("date");
//   const [sortOrder, setSortOrder] = useState<string>("desc");
//   const [transactionType, setTransactionType] = useState<string>("");
//   const [transactionStatus, settransactionStatus] = useState<string>("");

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const body = {
//           sortField,
//           sortOrder,
//           transactionType,
//           transactionStatus,
//         };
//         const response = await axios.get("/api/transactions", {
//           params: body,
//           headers: {
//             "Cache-Control": "no-cache, no-store",
//           },
//         });

//         console.log(response.data.transactions);
//         const transactionsData = await Promise.all(
//           response.data.transactions.map(async (transaction: Transaction) => {
//             const propertyResponse = await axios.get(
//               `/api/property/getsingleproperty?id=${transaction.propertyId}`,
//               {
//                 headers: {
//                   "Cache-Control": "no-cache, no-store",
//                 },
//               }
//             );

//             console.log("this is the response", propertyResponse.data.data);
//             const userResponse =
//               session?.user.role === "admin"
//                 ? await axios.get(
//                     `/api/users/getSingleUser?id=${transaction.userId}`
//                   )
//                 : { data: { name: "" } };
//             return {
//               ...transaction,
//               title: propertyResponse.data.data.title,
//               userName: userResponse.data.name,
//             };
//           })
//         );

//         setTransactions(transactionsData);
//       } catch (error) {
//         setError("Failed to load transactions. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [
//     sortField,
//     sortOrder,
//     transactionType,
//     transactionStatus,
//     session?.user.role,
//     session?.user.email,
//     status,
//   ]);

//   const handleSortChange = (field: string) => {
//     const newSortOrder =
//       sortField === field && sortOrder === "desc" ? "asc" : "desc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//   };

//   return (
//     <div className="container p-4">
//       <h1 className="text-x1 sm:text-2xl font-bold mb-4">
//         Transaction History
//       </h1>

//       <div className="mb-4 flex space-x-3 sm:space-x-4">
//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionType}
//           onChange={(e) => setTransactionType(e.target.value)}
//         >
//           <option value="">All Transaction Types</option>
//           <option value="installment">Installment</option>
//           <option value="payOnce">Pay Once</option>
//         </select>

//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionStatus}
//           onChange={(e) => settransactionStatus(e.target.value)}
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="successful">Successful</option>
//           <option value="failed">Failed</option>
//           <option value="canceled">Canceled</option>
//         </select>
//       </div>

//       <div className="overflow-y-auto overflow-x-auto max-h-screen max-w-80 sm:max-w-full ">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("transactionId")}
//               >
//                 Reference
//               </th>
//               <th
//                 className="px-2 sm:px-4 border-b cursor-pointer"
//                 onClick={() => handleSortChange("paymentMethod")}
//               >
//                 Method
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("amount")}
//               >
//                 Amount
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("date")}
//               >
//                 Date
//               </th>
//               <th
//                 className="px-2 sm:px-4 py-2 border-b cursor-pointer"
//                 onClick={() => handleSortChange("status")}
//               >
//                 Status
//               </th>
//               {session?.user.role === "Admin" && (
//                 <>
//                   <th className="px-2 sm:px-4 py-2 border-b">User ID</th>
//                   <th className="px-2 sm:px-4 py-2 border-b">User Name</th>
//                 </>
//               )}
//               <th className="px-2 sm:px-4 py-2 border-b">Payment Purpose</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={8} className="px-2 sm:px-4 py-2 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td
//                   colSpan={8}
//                   className="px-2 sm:px-4 py-2 text-center text-red-500"
//                 >
//                   {error}
//                 </td>
//               </tr>
//             ) : transactions.length === 0 ? (
//               <tr>
//                 <td colSpan={8} className="px-2 sm:px-4 py-2 text-center">
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((transaction) => (
//                 <tr key={transaction._id} className="hover:bg-gray-100">
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.referenceId}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.paymentMethod}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.amount}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {new Date(transaction.createdAt).toLocaleString()}
//                   </td>
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.status}
//                   </td>
//                   {session?.user.role === "Admin" && (
//                     <>
//                       <td className="px-2 sm:px-4 py-2 border-b">
//                         {transaction.userId.toString()}
//                       </td>
//                       <td className="px-2 sm:px-4 py-2 border-b">
//                         {transaction.userName}
//                       </td>
//                     </>
//                   )}
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     {transaction.paymentPurpose}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
  Avatar,
  Pagination,
  Divider,
  Button,
} from "@mui/material";
import {
  Receipt,
  Payment,
  CalendarToday,
  AccountBalance,
  Person,
  Home,
  TrendingUp,
  FilterList,
  Refresh,
  Download,
  Visibility,
  CheckCircle,
  Pending,
  Error,
  Cancel,
  Sort,
} from "@mui/icons-material";

interface Transaction {
  _id: string;
  transactionId: string;
  referenceId?: string;
  propertyPrice: number;
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  paymentPurpose: "For Sale" | "For Renting";
  amount: number;
  status: "pending" | "successful" | "failed" | "canceled";
  email: string;
  createdAt: Date;
  title?: string;
  userName?: string;
}

const TransactionHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionType, setTransactionType] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchTransactions();
  }, [
    sortField,
    sortOrder,
    transactionType,
    transactionStatus,
    session?.user.role,
    status,
  ]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        sortField,
        sortOrder,
        transactionType,
        transactionStatus,
      };
      const response = await axios.get("/api/transactions", {
        params: body,
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });

      const transactionsData = await Promise.all(
        response.data.transactions.map(async (transaction: Transaction) => {
          try {
            const propertyResponse = await axios.get(
              `/api/property/getsingleproperty?id=${transaction.propertyId}`,
              {
                headers: {
                  "Cache-Control": "no-cache, no-store",
                },
              }
            );

            const userResponse =
              session?.user.role === "Admin"
                ? await axios.get(
                    `/api/users/getSingleUser?id=${transaction.userId}`
                  )
                : { data: { name: session?.user.name || "" } };

            return {
              ...transaction,
              title: propertyResponse.data.data?.title || "Property Not Found",
              userName: userResponse.data.name || "Unknown User",
            };
          } catch (error) {
            console.error("Error fetching additional data:", error);
            return {
              ...transaction,
              title: "Property Not Found",
              userName: "Unknown User",
            };
          }
        })
      );

      setTransactions(transactionsData);
    } catch (error) {
      setError("Failed to load transactions. Please try again later.");
      console.error("Transaction fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field: string) => {
    const newSortOrder =
      sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "successful":
        return <CheckCircle />;
      case "pending":
        return <Pending />;
      case "failed":
        return <Error />;
      case "canceled":
        return <Cancel />;
      default:
        return <Pending />;
    }
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "House":
        return <Home />;
      case "Land":
        return <AccountBalance />;
      case "Farm":
        return <TrendingUp />;
      default:
        return <Home />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography
          variant="h6"
          sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
        >
          Loading Transactions...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.125rem" },
                fontWeight: "bold",
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Receipt color="primary" /> Transaction History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {transactions.length} transactions found
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTransactions}
              size={isMobile ? "small" : "medium"}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              size={isMobile ? "small" : "medium"}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Filters */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterList /> Filters & Sorting
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                label="Transaction Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="installment">Installment</MenuItem>
                <MenuItem value="payOnce">Pay Once</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Status</InputLabel>
              <Select
                value={transactionStatus}
                onChange={(e) => setTransactionStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="successful">Successful</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => handleSortChange(e.target.value)}
                label="Sort By"
                startAdornment={<Sort sx={{ mr: 1, color: "action.active" }} />}
              >
                <MenuItem value="createdAt">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="paymentMethod">Payment Method</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setTransactionType("");
                setTransactionStatus("");
                setSortField("createdAt");
                setSortOrder("desc");
              }}
              fullWidth
              size={isMobile ? "small" : "medium"}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            background: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 3,
          }}
        >
          <Receipt
            sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            No transactions found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {transactionType || transactionStatus
              ? "Try adjusting your filters to see more results."
              : "You haven't made any transactions yet."}
          </Typography>
        </Paper>
      ) : isMobile ? (
        /* Mobile Card View */
        <Stack spacing={2}>
          {currentTransactions.map((transaction) => (
            <Card key={transaction._id} elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={2}>
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {transaction.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ref:{" "}
                        {transaction.referenceId || transaction.transactionId}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(transaction.status)}
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </Stack>

                  <Divider />

                  {/* Details */}
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Method
                      </Typography>
                      <Typography variant="body2">
                        {transaction.paymentMethod}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(transaction.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Type
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {getPropertyIcon(transaction.propertyType)}
                        <Typography variant="body2">
                          {transaction.propertyType}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {session?.user.role === "Admin" && (
                    <>
                      <Divider />
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{ width: 24, height: 24, fontSize: "0.8rem" }}
                        >
                          {transaction.userName?.charAt(0) || "U"}
                        </Avatar>
                        <Typography variant="body2">
                          {transaction.userName}
                        </Typography>
                      </Stack>
                    </>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        /* Desktop Table View */
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.primary.main + "08" }}
              >
                <TableCell>
                  <TableSortLabel
                    active={sortField === "referenceId"}
                    direction={sortField === "referenceId" ? sortOrder : "asc"}
                    onClick={() => handleSortChange("referenceId")}
                  >
                    Reference
                  </TableSortLabel>
                </TableCell>
                <TableCell>Property</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "paymentMethod"}
                    direction={
                      sortField === "paymentMethod" ? sortOrder : "asc"
                    }
                    onClick={() => handleSortChange("paymentMethod")}
                  >
                    Method
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "amount"}
                    direction={sortField === "amount" ? sortOrder : "asc"}
                    onClick={() => handleSortChange("amount")}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "createdAt"}
                    direction={sortField === "createdAt" ? sortOrder : "asc"}
                    onClick={() => handleSortChange("createdAt")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "status"}
                    direction={sortField === "status" ? sortOrder : "asc"}
                    onClick={() => handleSortChange("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                {session?.user.role === "Admin" && (
                  <>
                    <TableCell>User</TableCell>
                  </>
                )}
                <TableCell>Purpose</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {transaction.referenceId || transaction.transactionId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.light,
                        }}
                      >
                        {getPropertyIcon(transaction.propertyType)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {transaction.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.propertyType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.paymentMethod}
                      size="small"
                      variant="outlined"
                      color={
                        transaction.paymentMethod === "payOnce"
                          ? "primary"
                          : "secondary"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(transaction.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(transaction.status)}
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  {session?.user.role === "Admin" && (
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{ width: 32, height: 32, fontSize: "0.8rem" }}
                        >
                          {transaction.userName?.charAt(0) || "U"}
                        </Avatar>
                        <Typography variant="body2">
                          {transaction.userName}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.paymentPurpose}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {transactions.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isSmallMobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default TransactionHistory;

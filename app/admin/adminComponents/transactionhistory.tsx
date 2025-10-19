// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { Transaction } from "@/constants/interface";

// const TransactionHistory: React.FC = () => {
//   const { data: session, status } = useSession();
//   const userId = session?.user?.email;

//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);
//   const [total, setTotal] = useState<number>(0);
//   const [limit] = useState<number>(10); // Adjust the limit as needed
//   const [sortField, setSortField] = useState<string>("date");
//   const [sortOrder, setSortOrder] = useState<string>("desc");
//   const [transactionType, setTransactionType] = useState<string>("");
//   const [transactionStatus, setTransactionStatus] = useState<string>("");
//   const [filterUserName, setFilterUserName] = useState<string>("");

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get("/api/transactions", {
//           params: {
//             page,
//             limit,
//             sortField,
//             sortOrder,
//             transactionType,
//             transactionStatus,
//             userId,
//             filterUserName,
//           },
//           headers: {
//             "Cache-Control": "no-cache, no-store",
//           },
//         });
//         setTransactions(response.data.transactions);
//         setTotal(response.data.total);
//       } catch (error) {
//         setError("Failed to load transactions. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [
//     page,
//     limit,
//     sortField,
//     sortOrder,
//     transactionType,
//     transactionStatus,
//     userId,
//     filterUserName,
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   const handleSortChange = (field: string) => {
//     const newSortOrder =
//       sortField === field && sortOrder === "desc" ? "asc" : "desc";
//     setSortField(field);
//     setSortOrder(newSortOrder);
//   };

//   const handleUpdateStatus = async (transactionId: string, status: string) => {
//     setLoading(true);
//     try {
//       const data = {
//         transactionId,
//         status,
//       };
//       await axios.put("/api/transactions/updateTransaction", data);
//       setTransactions((prev) =>
//         prev.map((transaction) =>
//           transaction._id === transactionId
//             ? { ...transaction, status }
//             : transaction
//         )
//       );
//     } catch (error) {
//       setError("Failed to update transaction status. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="text-x1 sm:text-2xl font-bold mb-4">
//         General Transaction History
//       </h1>

//       <div className="mb-4 flex flex-col w-72 sm:w-full sm:flex-row space-x-3 sm:space-x-4 gap-2">
//         <input
//           type="text"
//           className="px-2 sm:px-4 py-2 border rounded"
//           placeholder="Filter by User Name"
//           value={filterUserName}
//           onChange={(e) => setFilterUserName(e.target.value)}
//         />
//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionType}
//           onChange={(e) => setTransactionType(e.target.value)}
//         >
//           <option value="">All Transaction Types</option>
//           <option value="installment">Installment</option>
//           <option value="payOnce">Full Payment</option>
//         </select>
//         <select
//           className="px-2 sm:px-4 py-2 border rounded"
//           value={transactionStatus}
//           onChange={(e) => setTransactionStatus(e.target.value)}
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="successful">Completed</option>
//           <option value="failed">Failed</option>
//           <option value="canceled">Canceled</option>
//         </select>
//       </div>

//       <div className="overflow-y-auto overflow-x-auto max-h-screen max-w-80 sm:max-w-full">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border-b">User Name</th>
//               <th className="px-4 py-2 border-b">Property Title</th>
//               <th
//                 className="px-2 sm:px-4 border-b cursor-pointer"
//                 onClick={() => handleSortChange("transactionType")}
//               >
//                 Type
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
//                 onClick={() => handleSortChange("transactionStatus")}
//               >
//                 Status
//               </th>
//               <th className="px-2 sm:px-4 py-2 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="px-2 sm:px-4 py-2 text-center text-red-500"
//                 >
//                   {error}
//                 </td>
//               </tr>
//             ) : transactions.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-2 sm:px-4 py-2 text-center">
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((transaction) => (
//                 <tr key={transaction._id} className="hover:bg-gray-100">
//                   <td className="px-4 py-2 border-b">{transaction.userName}</td>
//                   <td className="px-4 py-2 border-b">{transaction.title}</td>
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
//                   <td className="px-2 sm:px-4 py-2 border-b">
//                     <select
//                       className="px-2 py-1 border rounded"
//                       value={transaction.status}
//                       onChange={(e) =>
//                         handleUpdateStatus(transaction._id, e.target.value)
//                       }
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="successful">Successful</option>
//                       <option value="failed">Failed</option>
//                       <option value="canceled">Canceled</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 2))}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//           disabled={page === 1 || loading}
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//           disabled={page === totalPages || loading}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Transaction } from "@/constants/interface";
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
  TablePagination,
  TableSortLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const TransactionHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.email;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionType, setTransactionType] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [filterUserName, setFilterUserName] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/transactions", {
          params: {
            page: page + 1, // Material UI pagination starts at 0, API at 1
            limit: rowsPerPage,
            sortField,
            sortOrder,
            transactionType,
            transactionStatus,
            userId,
            filterUserName,
          },
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
      } catch (error) {
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    page,
    rowsPerPage,
    sortField,
    sortOrder,
    transactionType,
    transactionStatus,
    userId,
    filterUserName,
  ]);

  const handleSortChange = (field: string) => {
    const newSortOrder =
      sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleUpdateStatus = async (transactionId: string, status: string) => {
    setLoading(true);
    try {
      const data = {
        transactionId,
        status,
      };
      await axios.put("/api/transactions/updateTransaction", data);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status }
            : transaction
        )
      );
    } catch (error) {
      setError("Failed to update transaction status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mobile card view for transactions
  const MobileTransactionCard = ({
    transaction,
  }: {
    transaction: Transaction;
  }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" component="div" noWrap>
            {transaction.title}
          </Typography>
          <Chip
            label={transaction.status}
            color={getStatusColor(transaction.status)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          User: {transaction.userName}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Type: {transaction.paymentMethod}
        </Typography>

        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Amount: {formatCurrency(transaction.amount)}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Date: {formatDate(transaction.createdAt)}
        </Typography>

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={transaction.status}
            label="Status"
            onChange={(e) =>
              handleUpdateStatus(transaction._id, e.target.value)
            }
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="successful">Successful</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: theme.palette.text.primary,
          }}
        >
          Transaction History
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => window.location.reload()}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {isMobile && (
            <Tooltip title="Filters">
              <IconButton
                onClick={() => setFiltersOpen(!filtersOpen)}
                color="primary"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <TextField
              label="Filter by User Name"
              value={filterUserName}
              onChange={(e) => setFilterUserName(e.target.value)}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                label="Transaction Type"
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="installment">Installment</MenuItem>
                <MenuItem value="payOnce">Full Payment</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={transactionStatus}
                label="Status"
                onChange={(e) => setTransactionStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="successful">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Transactions Table/Cards */}
      {!loading && (
        <>
          {isMobile ? (
            // Mobile Card View
            <Box>
              {transactions.length === 0 ? (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{ py: 4 }}
                >
                  No transactions found.
                </Typography>
              ) : (
                transactions.map((transaction) => (
                  <MobileTransactionCard
                    key={transaction._id}
                    transaction={transaction}
                  />
                ))
              )}
            </Box>
          ) : (
            // Desktop Table View
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "70vh",
                background: theme.palette.background.paper,
              }}
            >
              <Table
                stickyHeader
                sx={{ minWidth: 650 }}
                size={isTablet ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "userName"}
                        direction={sortField === "userName" ? sortOrder : "asc"}
                        onClick={() => handleSortChange("userName")}
                      >
                        User Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Property Title</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "transactionType"}
                        direction={
                          sortField === "transactionType" ? sortOrder : "asc"
                        }
                        onClick={() => handleSortChange("transactionType")}
                      >
                        Type
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
                        active={sortField === "date"}
                        direction={sortField === "date" ? sortOrder : "asc"}
                        onClick={() => handleSortChange("date")}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === "transactionStatus"}
                        direction={
                          sortField === "transactionStatus" ? sortOrder : "asc"
                        }
                        onClick={() => handleSortChange("transactionStatus")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No transactions found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell>{transaction.userName}</TableCell>
                        <TableCell>{transaction.title}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status}
                            color={getStatusColor(transaction.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={transaction.status}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  transaction._id,
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="successful">Successful</MenuItem>
                              <MenuItem value="failed">Failed</MenuItem>
                              <MenuItem value="canceled">Canceled</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                mt: 2,
                "& .MuiTablePagination-toolbar": {
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 0 },
                },
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default TransactionHistory;

"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";

interface AuditLog {
  _id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  action: string;
  category: "AUTH" | "ADMIN" | "USER" | "TRANSACTION" | "PROPERTY" | "SECURITY";
  status: "SUCCESS" | "FAILURE" | "WARNING";
  ipAddress?: string;
  userAgent?: string;
  targetUserEmail?: string;
  resourceId?: string;
  resourceType?: string;
  errorMessage?: string;
  details?: any;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const AuditLogsPage = () => {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Filters
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [action, setAction] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    console.log("📊 [AUDIT UI] Fetching audit logs with filters...");
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
      });

      if (category && category !== "all") params.append("category", category);
      if (status && status !== "all") params.append("status", status);
      if (action) params.append("action", action);
      if (userEmail) params.append("userEmail", userEmail);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      console.log(
        "🔗 [AUDIT UI] Requesting URL:",
        `/api/admin/audit-logs?${params}`
      );
      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      console.log("📥 [AUDIT UI] Response received:", {
        success: data.success,
        logsCount: data.data?.logs?.length,
        pagination: data.data?.pagination,
      });

      if (data.success) {
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
        console.log(
          "✅ [AUDIT UI] Logs loaded successfully:",
          data.data.logs.length,
          "logs"
        );
      } else {
        setError(data.message || "Failed to fetch logs");
        console.error("❌ [AUDIT UI] API error:", data.message);
      }
    } catch (err) {
      setError("Error fetching audit logs");
      console.error("❌ [AUDIT UI] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📍 [AUDIT UI] useEffect triggered - fetching logs");
    fetchLogs();
  }, [page, rowsPerPage, category, status]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setCategory("all");
    setStatus("all");
    setAction("");
    setUserEmail("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  const handleDeleteOldLogs = async () => {
    if (
      !confirm(
        "Are you sure you want to delete logs older than 90 days? This cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/audit-logs?daysOld=90", {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchLogs();
      } else {
        setError(data.message || "Failed to delete logs");
      }
    } catch (err) {
      setError("Error deleting logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILURE":
        return "error";
      case "WARNING":
        return "warning";
      default:
        return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AUTH":
        return "primary";
      case "ADMIN":
        return "secondary";
      case "SECURITY":
        return "error";
      case "TRANSACTION":
        return "info";
      case "PROPERTY":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Audit Logs
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Logs
              </Typography>
              <Typography variant="h4">
                {pagination?.totalCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Page
              </Typography>
              <Typography variant="h4">
                {pagination?.currentPage || 0} / {pagination?.totalPages || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="AUTH">Authentication</MenuItem>
                <MenuItem value="ADMIN">Admin Actions</MenuItem>
                <MenuItem value="SECURITY">Security</MenuItem>
                <MenuItem value="TRANSACTION">Transactions</MenuItem>
                <MenuItem value="PROPERTY">Property</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="SUCCESS">Success</MenuItem>
                <MenuItem value="FAILURE">Failure</MenuItem>
                <MenuItem value="WARNING">Warning</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., LOGIN_FAILED"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="User Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
            >
              Apply Filters
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Actions */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchLogs}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteOldLogs}
          disabled={loading}
        >
          Delete Old Logs (90+ days)
        </Button>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.category}
                        color={getCategoryColor(log.category) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        color={getStatusColor(log.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.userEmail || "N/A"}
                      </Typography>
                      {log.userName && (
                        <Typography variant="caption" color="textSecondary">
                          {log.userName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.ipAddress || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          <pre style={{ margin: 0 }}>
                            {JSON.stringify(
                              {
                                targetUser: log.targetUserEmail,
                                resource: log.resourceType,
                                resourceId: log.resourceId,
                                error: log.errorMessage,
                                details: log.details,
                              },
                              null,
                              2
                            )}
                          </pre>
                        }
                      >
                        <IconButton size="small">
                          <FilterIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={pagination?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AuditLogsPage;

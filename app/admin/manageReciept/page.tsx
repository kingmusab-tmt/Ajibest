"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface IReceipt {
  receiptId: string;
  status: "ACTIVE" | "INACTIVE" | "VOIDED";
  details: {
    receivedFrom?: string;
    amount?: number;
    date?: string;
  };
  createdAt: string;
}

export default function ManageReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate batch dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await fetch("/api/receipt");
      const data = await response.json();
      setReceipts(data.data || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (receiptId: string) => {
    window.open(`/admin/manageReciept/${receiptId}`, "_blank");
  };

  const handleGenerateBatch = async () => {
    if (generateCount < 1 || generateCount > 1000) {
      setGenerateError("Please enter a number between 1 and 1000");
      return;
    }

    setGenerating(true);
    setGenerateError("");
    setGenerateSuccess(false);
    setGeneratedUrls([]);

    try {
      const response = await fetch("/api/receipt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: generateCount }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedUrls(data.urls);
        setGenerateSuccess(true);
        // Refresh the receipts list
        fetchReceipts();
      } else {
        setGenerateError(data.message || "Failed to generate receipts");
      }
    } catch (err) {
      console.error("Error generating batch:", err);
      setGenerateError("Failed to generate receipt batch");
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setGenerateSuccess(false);
    setGenerateError("");
    setGeneratedUrls([]);
    setGenerateCount(10);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllUrls = () => {
    navigator.clipboard.writeText(generatedUrls.join("\n"));
  };

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.details?.receivedFrom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (
    status: string,
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "warning";
      case "VOIDED":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" color="primary">
            Manage Receipts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Generate Batch
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search by Receipt ID or Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Receipt ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      No receipts found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.receiptId}>
                    <TableCell>
                      {receipt.receiptId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={receipt.status}
                        color={getStatusColor(receipt.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {receipt.details?.receivedFrom || "N/A"}
                    </TableCell>
                    <TableCell>
                      ₦{receipt.details?.amount?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell>
                      {receipt.details?.date ||
                        new Date(receipt.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          receipt.status === "INACTIVE" ? (
                            <PrintIcon />
                          ) : (
                            <VisibilityIcon />
                          )
                        }
                        onClick={() => handleViewReceipt(receipt.receiptId)}
                      >
                        {receipt.status === "INACTIVE" ? "Activate" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Generate Batch Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Receipt Batch</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Generate multiple blank receipts for printing. Each receipt will
            have a unique ID and QR code.
          </Typography>

          {!generateSuccess && (
            <TextField
              fullWidth
              type="number"
              label="Number of Receipts"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1, max: 1000 }}
              disabled={generating}
              helperText="Enter a number between 1 and 1000"
              sx={{ mt: 2 }}
            />
          )}

          {generateError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {generateError}
            </Alert>
          )}

          {generateSuccess && (
            <>
              <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                Successfully generated {generatedUrls.length} receipts!
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle1">
                    Generated Receipt URLs
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={copyAllUrls}
                  >
                    Copy All URLs
                  </Button>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 300, overflow: "auto" }}
                >
                  <List dense>
                    {generatedUrls.map((url, index) => {
                      const receiptId = url.split("/").pop() || "";
                      return (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <Box display="flex" gap={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  window.open(
                                    `/admin/manageReciept/${receiptId}`,
                                    "_blank",
                                  );
                                }}
                              >
                                Open
                              </Button>
                              <Button
                                size="small"
                                onClick={() => copyToClipboard(url)}
                              >
                                Copy
                              </Button>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={`Receipt ${index + 1}`}
                            secondary={receiptId.substring(0, 8)}
                            secondaryTypographyProps={{
                              sx: {
                                fontSize: "0.75rem",
                                wordBreak: "break-all",
                              },
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {generateSuccess ? "Close" : "Cancel"}
          </Button>
          {!generateSuccess && (
            <Button
              variant="contained"
              onClick={handleGenerateBatch}
              disabled={generating}
            >
              {generating ? <CircularProgress size={24} /> : "Generate"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

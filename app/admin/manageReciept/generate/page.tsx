"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function GenerateBatchPage() {
  const router = useRouter();
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (count < 1 || count > 1000) {
      setError("Please enter a number between 1 and 1000");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setGeneratedUrls([]);

    try {
      const response = await fetch("/api/receipt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedUrls(data.urls);
        setSuccess(true);
      } else {
        setError(data.message || "Failed to generate receipts");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Failed to generate receipt batch");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllUrls = () => {
    navigator.clipboard.writeText(generatedUrls.join("\n"));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Generate Receipt Batch
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Generate multiple blank receipts for printing. Each receipt will have
          a unique ID and QR code.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Number of Receipts"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
            inputProps={{ min: 1, max: 1000 }}
            disabled={loading}
            helperText="Enter a number between 1 and 1000"
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleGenerate}
          disabled={loading}
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Receipts"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Successfully generated {generatedUrls.length} receipts!
            </Alert>

            <Box sx={{ mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">Generated Receipt URLs</Typography>
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
                sx={{ maxHeight: 400, overflow: "auto" }}
              >
                <List dense>
                  {generatedUrls.map((url, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Button
                          size="small"
                          onClick={() => copyToClipboard(url)}
                        >
                          Copy
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={`Receipt ${index + 1}`}
                        secondary={url}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: "0.75rem",
                            wordBreak: "break-all",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push("/admin/manageReciept")}
              >
                Back to Receipts
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setSuccess(false);
                  setGeneratedUrls([]);
                  setCount(10);
                }}
              >
                Generate Another Batch
              </Button>
            </Box>
          </>
        )}

        {!success && !loading && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push("/admin/manageReciept")}
          >
            Cancel
          </Button>
        )}
      </Paper>
    </Container>
  );
}

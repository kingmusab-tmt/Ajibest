import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";

interface TermsAndConditionsModalProps {
  open: boolean;
  title: string;
  content: string;
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  open,
  title,
  content,
  onAccept,
  onReject,
  loading = false,
}) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    setScrolledToBottom(isAtBottom);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: "flex", gap: 1 }}>
        <CheckCircle color="primary" />
        {title}
      </DialogTitle>

      <DialogContent>
        <Paper
          onScroll={handleScroll}
          sx={{
            p: 2,
            maxHeight: 400,
            overflow: "auto",
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            mb: 2,
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
          >
            {content}
          </Typography>
        </Paper>

        <Alert severity="info" sx={{ mb: 2 }}>
          Please scroll through the entire document before accepting.
        </Alert>

        {!scrolledToBottom && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              ↓ Scroll to read full terms ↓
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onReject}
          variant="outlined"
          color="error"
          startIcon={<Close />}
          disabled={loading}
          fullWidth
        >
          Reject
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          disabled={!scrolledToBottom || loading}
          fullWidth
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Processing..." : "Accept & Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsModal;

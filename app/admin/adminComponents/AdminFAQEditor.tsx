// components/AdminFAQEditor.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Grid,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

const AdminFAQEditor = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [newFaq, setNewFaq] = useState<Omit<FAQ, "_id">>({
    question: "",
    answer: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch("/api/faqs");
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        setMessage({ type: "error", text: "Failed to fetch FAQs" });
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setMessage({ type: "error", text: "Error fetching FAQs" });
    }
  };

  const handleCreateFaq = async () => {
    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newFaq, order: faqs.length }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "FAQ created successfully!" });
        setIsNewDialogOpen(false);
        setNewFaq({
          question: "",
          answer: "",
          order: 0,
          isActive: true,
        });
        fetchFaqs();
      } else {
        setMessage({ type: "error", text: "Failed to create FAQ" });
      }
    } catch (error) {
      console.error("Error creating FAQ:", error);
      setMessage({ type: "error", text: "Error creating FAQ" });
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq || !editingFaq._id) return;

    try {
      const response = await fetch("/api/faqs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([editingFaq]),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "FAQ updated successfully!" });
        setIsEditDialogOpen(false);
        setEditingFaq(null);
        fetchFaqs();
      } else {
        setMessage({ type: "error", text: "Failed to update FAQ" });
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setMessage({ type: "error", text: "Error updating FAQ" });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const response = await fetch(`/api/faqs?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "FAQ deleted successfully!" });
        fetchFaqs();
      } else {
        setMessage({ type: "error", text: "Failed to delete FAQ" });
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setMessage({ type: "error", text: "Error deleting FAQ" });
    }
  };

  const handleToggleStatus = async (faq: FAQ) => {
    try {
      const updatedFaq = { ...faq, isActive: !faq.isActive };
      const response = await fetch("/api/faqs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([updatedFaq]),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "FAQ status updated!" });
        fetchFaqs();
      } else {
        setMessage({ type: "error", text: "Failed to update FAQ status" });
      }
    } catch (error) {
      console.error("Error updating FAQ status:", error);
      setMessage({ type: "error", text: "Error updating FAQ status" });
    }
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsEditDialogOpen(true);
  };

  const openNewDialog = () => {
    setIsNewDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          FAQ Management
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">
            Manage Frequently Asked Questions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNewDialog}
          >
            Add New FAQ
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {faqs.map((faq, index) => (
            <Grid item xs={12} key={faq._id}>
              <Paper elevation={2} sx={{ p: 3, position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <DragIndicatorIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Chip
                    label={`Order: ${faq.order}`}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={faq.isActive}
                        onChange={() => handleToggleStatus(faq)}
                        color="primary"
                      />
                    }
                    label={faq.isActive ? "Active" : "Inactive"}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    color="primary"
                    onClick={() => openEditDialog(faq)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => faq._id && handleDeleteFaq(faq._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Edit FAQ Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit FAQ</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Question"
              value={editingFaq?.question || ""}
              onChange={(e) =>
                setEditingFaq((prev) =>
                  prev ? { ...prev, question: e.target.value } : null
                )
              }
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Answer"
              value={editingFaq?.answer || ""}
              onChange={(e) =>
                setEditingFaq((prev) =>
                  prev ? { ...prev, answer: e.target.value } : null
                )
              }
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                label="Order"
                type="number"
                value={editingFaq?.order || 0}
                onChange={(e) =>
                  setEditingFaq((prev) =>
                    prev ? { ...prev, order: parseInt(e.target.value) } : null
                  )
                }
                sx={{ mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingFaq?.isActive || false}
                    onChange={(e) =>
                      setEditingFaq((prev) =>
                        prev ? { ...prev, isActive: e.target.checked } : null
                      )
                    }
                    color="primary"
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateFaq} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* New FAQ Dialog */}
        <Dialog
          open={isNewDialogOpen}
          onClose={() => setIsNewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New FAQ</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Question"
              value={newFaq.question}
              onChange={(e) =>
                setNewFaq({ ...newFaq, question: e.target.value })
              }
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Answer"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                label="Order"
                type="number"
                value={newFaq.order}
                onChange={(e) =>
                  setNewFaq({ ...newFaq, order: parseInt(e.target.value) })
                }
                sx={{ mr: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newFaq.isActive}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, isActive: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFaq} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminFAQEditor;

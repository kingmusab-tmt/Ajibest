import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import { Add, Save, Cancel, Refresh } from "@mui/icons-material";
import { statsApi } from "@/lib/api/statsApi";
import TestimonialCard, {
  Testimonial,
} from "@/app/components/landingpagecomponents/TestimonialCard";

const iconOptions = ["Home", "People", "TrendingUp", "CalendarMonth", "Star"];
const colorOptions = [
  "primary",
  "secondary",
  "success",
  "warning",
  "info",
  "error",
];

const StatsAdminPanel = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [editingStat, setEditingStat] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"testimonial" | "stat">(
    "testimonial"
  );
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await statsApi.getStats();

      if (response.success) {
        setContent(response.data);
        setIsFallback(response.isFallback || false);

        if (response.isFallback) {
          setError(
            response.message ||
              "Using fallback content. Changes will create new database entry."
          );
        }
      } else {
        throw new Error(response.error || "Failed to load content");
      }
    } catch (err) {
      setError("Failed to load content");
      console.error("Error loading content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!content) return;

      setSaving(true);
      const response = await statsApi.updateStats(content);

      if (response.success) {
        setContent(response.data);
        setIsFallback(false);
        setSuccess("Content updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(response.error || "Failed to save content");
      }
    } catch (err) {
      setError("Failed to save content");
      console.error("Error saving content:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = async (newTestimonial: Testimonial) => {
    try {
      const response = await statsApi.addTestimonial(newTestimonial);

      if (response.success) {
        setContent(response.data);
        setIsFallback(false);
        setDialogOpen(false);
        setSuccess("Testimonial added successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(response.error || "Failed to add testimonial");
      }
    } catch (err) {
      setError("Failed to add testimonial");
      console.error("Error adding testimonial:", err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const response = await statsApi.deleteTestimonial(id);

      if (response.success) {
        setContent(response.data);
        setSuccess("Testimonial deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(response.error || "Failed to delete testimonial");
      }
    } catch (err) {
      setError("Failed to delete testimonial");
      console.error("Error deleting testimonial:", err);
    }
  };

  const handleToggleTestimonialActive = (id: string) => {
    if (!content) return;

    const updatedContent = { ...content };
    updatedContent.testimonials = updatedContent.testimonials.map((t: any) =>
      t._id?.toString() === id ? { ...t, isActive: !t.isActive } : t
    );

    setContent(updatedContent);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setDialogType("testimonial");
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const openAddDialog = (type: "testimonial" | "stat") => {
    setDialogType(type);
    setDialogMode("add");

    if (type === "testimonial") {
      setEditingTestimonial({
        name: "",
        comment: "",
        rating: 5,
        isActive: true,
      });
    } else {
      setEditingStat({
        title: "",
        value: 0,
        icon: "Home",
        color: "primary",
        suffix: "+",
        isActive: true,
      });
    }

    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading content...</Typography>
      </Box>
    );
  }

  if (!content) {
    return (
      <Box>
        <Alert severity="error">Failed to load content</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Stats & Testimonials Management</Typography>
          {isFallback && (
            <Typography variant="body2" color="warning.main">
              Using fallback content. Save to create database entry.
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={loadContent}
            disabled={saving}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Testimonials Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">
                Testimonials ({content.testimonials?.length || 0})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => openAddDialog("testimonial")}
              >
                Add Testimonial
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {content.testimonials?.map((testimonial: any) => (
              <TestimonialCard
                key={testimonial._id?.toString()}
                testimonial={testimonial}
                onEdit={handleEditTestimonial}
                onDelete={handleDeleteTestimonial}
                onToggleActive={handleToggleTestimonialActive}
                isAdmin={true}
              />
            ))}

            {(!content.testimonials || content.testimonials.length === 0) && (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No testimonials added yet.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Stats Management (simplified for this example) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Statistics Management
            </Typography>
            <Typography color="text.secondary">
              Statistics management UI would go here...
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add" : "Edit"} Testimonial
        </DialogTitle>
        <DialogContent>
          <TestimonialForm
            testimonial={editingTestimonial}
            onChange={setEditingTestimonial}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAddTestimonial(editingTestimonial)}
            startIcon={dialogMode === "add" ? <Add /> : <Save />}
            disabled={saving}
          >
            {saving ? "Saving..." : dialogMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const TestimonialForm = ({
  testimonial,
  onChange,
}: {
  testimonial: any;
  onChange: (value: any) => void;
}) => (
  <Box sx={{ pt: 2 }}>
    <TextField
      fullWidth
      label="Name"
      value={testimonial?.name || ""}
      onChange={(e) => onChange({ ...testimonial, name: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      multiline
      rows={3}
      label="Comment"
      value={testimonial?.comment || ""}
      onChange={(e) => onChange({ ...testimonial, comment: e.target.value })}
      sx={{ mb: 2 }}
    />
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Rating
      </Typography>
      <Box>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Chip
            key={rating}
            label={rating}
            onClick={() => onChange({ ...testimonial, rating })}
            color={testimonial?.rating === rating ? "primary" : "default"}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default StatsAdminPanel;

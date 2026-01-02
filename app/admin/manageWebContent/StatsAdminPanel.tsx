"use client";
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
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  Save,
  Cancel,
  Refresh,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { statsApi } from "@/lib/api/statsApi";

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

  // Testimonial states
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [testimonialDialogMode, setTestimonialDialogMode] = useState<
    "add" | "edit"
  >("add");

  // Stat states
  const [editingStat, setEditingStat] = useState<any>(null);
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [statDialogMode, setStatDialogMode] = useState<"add" | "edit">("add");

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

  // Testimonial Functions
  const openAddTestimonialDialog = () => {
    setEditingTestimonial({
      name: "",
      comment: "",
      rating: 5,
      isActive: true,
    });
    setTestimonialDialogMode("add");
    setTestimonialDialogOpen(true);
  };

  const openEditTestimonialDialog = (testimonial: any) => {
    setEditingTestimonial({ ...testimonial });
    setTestimonialDialogMode("edit");
    setTestimonialDialogOpen(true);
  };

  const handleSaveTestimonial = () => {
    if (!content) return;

    const updatedContent = { ...content };

    if (testimonialDialogMode === "add") {
      // Add new testimonial with temporary ID
      updatedContent.testimonials.push({
        ...editingTestimonial,
        _id: `temp-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing testimonial
      updatedContent.testimonials = updatedContent.testimonials.map((t: any) =>
        t._id === editingTestimonial._id
          ? { ...editingTestimonial, updatedAt: new Date() }
          : t
      );
    }

    setContent(updatedContent);
    setTestimonialDialogOpen(false);
    setSuccess(
      `Testimonial ${
        testimonialDialogMode === "add" ? "added" : "updated"
      } successfully`
    );
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!content) return;

    const updatedContent = {
      ...content,
      testimonials: content.testimonials.filter((t: any) => t._id !== id),
    };

    setContent(updatedContent);
    setSuccess("Testimonial deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleToggleTestimonialActive = (id: string) => {
    if (!content) return;

    const updatedContent = { ...content };
    updatedContent.testimonials = updatedContent.testimonials.map((t: any) =>
      t._id === id ? { ...t, isActive: !t.isActive, updatedAt: new Date() } : t
    );

    setContent(updatedContent);
  };

  // Stat Functions
  const openAddStatDialog = () => {
    setEditingStat({
      title: "",
      value: 0,
      icon: "Home",
      color: "primary",
      suffix: "+",
      isActive: true,
    });
    setStatDialogMode("add");
    setStatDialogOpen(true);
  };

  const openEditStatDialog = (stat: any) => {
    setEditingStat({ ...stat });
    setStatDialogMode("edit");
    setStatDialogOpen(true);
  };

  const handleSaveStat = () => {
    if (!content) return;

    const updatedContent = { ...content };

    if (statDialogMode === "add") {
      // Add new stat with temporary ID
      updatedContent.stats.push({
        ...editingStat,
        _id: `temp-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing stat
      updatedContent.stats = updatedContent.stats.map((s: any) =>
        s._id === editingStat._id
          ? { ...editingStat, updatedAt: new Date() }
          : s
      );
    }

    setContent(updatedContent);
    setStatDialogOpen(false);
    setSuccess(
      `Stat ${statDialogMode === "add" ? "added" : "updated"} successfully`
    );
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteStat = (id: string) => {
    if (!content) return;

    const updatedContent = {
      ...content,
      stats: content.stats.filter((s: any) => s._id !== id),
    };

    setContent(updatedContent);
    setSuccess("Stat deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleToggleStatActive = (id: string) => {
    if (!content) return;

    const updatedContent = { ...content };
    updatedContent.stats = updatedContent.stats.map((s: any) =>
      s._id === id ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s
    );

    setContent(updatedContent);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography variant="h6">Loading content...</Typography>
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Testimonials</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openAddTestimonialDialog}
              >
                Add Testimonial
              </Button>
            </Box>

            <Grid container spacing={2}>
              {content.testimonials.map((testimonial: any) => (
                <Grid size={{ xs: 12 }} key={testimonial._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={testimonial.isActive ? "Active" : "Inactive"}
                            color={testimonial.isActive ? "success" : "default"}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleToggleTestimonialActive(testimonial._id)
                            }
                          >
                            {testimonial.isActive ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              openEditTestimonialDialog(testimonial)
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteTestimonial(testimonial._id)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Typography
                            key={star}
                            color={
                              star <= testimonial.rating ? "gold" : "grey.400"
                            }
                          >
                            ★
                          </Typography>
                        ))}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({testimonial.rating}/5)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.comment}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {content.testimonials.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="text.secondary" textAlign="center">
                    No testimonials yet. Add your first testimonial!
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Stats Management */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Statistics</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openAddStatDialog}
              >
                Add Stat
              </Button>
            </Box>

            <Grid container spacing={2}>
              {content.stats.map((stat: any) => (
                <Grid size={{ xs: 12 }} key={stat._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {stat.icon} • {stat.title}
                          </Typography>
                          <Typography variant="h4" color={stat.color}>
                            {stat.value}
                            {stat.suffix}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={stat.isActive ? "Active" : "Inactive"}
                            color={stat.isActive ? "success" : "default"}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatActive(stat._id)}
                          >
                            {stat.isActive ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openEditStatDialog(stat)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteStat(stat._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {content.stats.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="text.secondary" textAlign="center">
                    No stats yet. Add your first stat!
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Testimonial Dialog */}
      <Dialog
        open={testimonialDialogOpen}
        onClose={() => setTestimonialDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {testimonialDialogMode === "add" ? "Add" : "Edit"} Testimonial
        </DialogTitle>
        <DialogContent>
          <TestimonialForm
            testimonial={editingTestimonial}
            onChange={setEditingTestimonial}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTestimonialDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTestimonial}
            startIcon={testimonialDialogMode === "add" ? <Add /> : <Save />}
          >
            {testimonialDialogMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stat Dialog */}
      <Dialog
        open={statDialogOpen}
        onClose={() => setStatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {statDialogMode === "add" ? "Add" : "Edit"} Stat
        </DialogTitle>
        <DialogContent>
          <StatForm stat={editingStat} onChange={setEditingStat} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStatDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStat}
            startIcon={statDialogMode === "add" ? <Add /> : <Save />}
          >
            {statDialogMode === "add" ? "Add" : "Update"}
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
    <FormControlLabel
      control={
        <Switch
          checked={testimonial?.isActive || false}
          onChange={(e) =>
            onChange({ ...testimonial, isActive: e.target.checked })
          }
        />
      }
      label="Active"
    />
  </Box>
);

const StatForm = ({
  stat,
  onChange,
}: {
  stat: any;
  onChange: (value: any) => void;
}) => (
  <Box sx={{ pt: 2 }}>
    <TextField
      fullWidth
      label="Title"
      value={stat?.title || ""}
      onChange={(e) => onChange({ ...stat, title: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      type="number"
      label="Value"
      value={stat?.value || 0}
      onChange={(e) =>
        onChange({ ...stat, value: parseInt(e.target.value) || 0 })
      }
      sx={{ mb: 2 }}
    />
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Icon</InputLabel>
      <Select
        value={stat?.icon || "Home"}
        label="Icon"
        onChange={(e) => onChange({ ...stat, icon: e.target.value })}
      >
        {iconOptions.map((icon) => (
          <MenuItem key={icon} value={icon}>
            {icon}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Color</InputLabel>
      <Select
        value={stat?.color || "primary"}
        label="Color"
        onChange={(e) => onChange({ ...stat, color: e.target.value })}
      >
        {colorOptions.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      fullWidth
      label="Suffix"
      value={stat?.suffix || "+"}
      onChange={(e) => onChange({ ...stat, suffix: e.target.value })}
      sx={{ mb: 2 }}
      helperText="e.g., +, %, k, etc."
    />
    <FormControlLabel
      control={
        <Switch
          checked={stat?.isActive || false}
          onChange={(e) => onChange({ ...stat, isActive: e.target.checked })}
        />
      }
      label="Active"
    />
  </Box>
);

export default StatsAdminPanel;

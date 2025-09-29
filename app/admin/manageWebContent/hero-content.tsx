"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Add, CloudUpload } from "@mui/icons-material";

interface HeroContent {
  _id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  backgrounds: string[];
}

const AdminHeroEditor: React.FC = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    buttonText: "",
    backgrounds: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Fetch current hero content
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch("/api/aapi/hero-content");
        if (response.ok) {
          const data = await response.json();
          setHeroContent(data);
        } else {
          setMessage({ type: "error", text: "Failed to fetch hero content" });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
        setMessage({ type: "error", text: "Error fetching hero content" });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  const handleInputChange =
    (field: keyof HeroContent) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHeroContent((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setHeroContent((prev) => ({
        ...prev,
        backgrounds: [...prev.backgrounds, newImageUrl.trim()],
      }));
      setNewImageUrl("");
      setImageDialogOpen(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setHeroContent((prev) => ({
      ...prev,
      backgrounds: prev.backgrounds.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/aapi/hero-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroContent),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Hero content updated successfully!",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to update hero content",
        });
      }
    } catch (error) {
      console.error("Error updating hero content:", error);
      setMessage({ type: "error", text: "Error updating hero content" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Hero Content
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={heroContent.title}
                onChange={handleInputChange("title")}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subtitle"
                value={heroContent.subtitle}
                onChange={handleInputChange("subtitle")}
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Button Text"
                value={heroContent.buttonText}
                onChange={handleInputChange("buttonText")}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Background Images</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setImageDialogOpen(true)}
                >
                  Add Image
                </Button>
              </Box>

              <Grid container spacing={2}>
                {heroContent.backgrounds.map((url, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={url}
                        alt={`Background ${index + 1}`}
                        sx={{ objectFit: "cover" }}
                      />
                      <Box display="flex" justifyContent="flex-end" p={1}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={saving}
                  startIcon={
                    saving ? <CircularProgress size={20} /> : <CloudUpload />
                  }
                >
                  {saving ? "Saving..." : "Update Content"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Dialog for adding new image */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Add New Background Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddImage} variant="contained">
            Add Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminHeroEditor;

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Save as SaveIcon, Person as PersonIcon } from "@mui/icons-material";
import EditableImage from "@/app/components/generalcomponents/Image";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

const PersonalInformation = () => {
  const { data: session, status, update } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [image, setImage] = useState(session?.user?.image || "");
  const [imageChanged, setImageChanged] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    bvnOrNin: "",
    country: "",
    state: "",
    lga: "",
    address: "",
    image: "",
  });
  const [changedFields, setChangedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetch("/api/users/getSingleUser", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProfile(data.data);
          setImage(data.data.image);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          showSnackbar("Error fetching profile data", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedProfile: any = {};

    for (const key in profile) {
      if (changedFields[key as keyof typeof changedFields]) {
        updatedProfile[key] = profile[key as keyof typeof profile];
      }
    }

    if (imageChanged) {
      updatedProfile["image"] = image;
    }

    try {
      const response = await fetch("/api/users/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar("Profile updated successfully", "success");
        setChangedFields({});
        setImageChanged(false);
        await update();
      } else {
        showSnackbar(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      showSnackbar("Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = image && isUrl(image) ? image : `/uploads/${image}`;
  const hasChanges = Object.keys(changedFields).length > 0 || imageChanged;

  if (loading && !profile.name) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                <PersonIcon />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                fontSize={isMobile ? "1.5rem" : "2rem"}
              >
                Personal Information
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Profile Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Box sx={{ position: "relative", maxWidth: 150 }}>
                <EditableImage link={imageSrc} setLink={handleImageChange} />
              </Box>
            </Box>

            {/* Form Fields */}
            <Grid container spacing={3}>
              {/* Row 1 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>

              {/* Row 2 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  disabled
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: theme.palette.text.primary,
                    },
                  }}
                />
              </Grid>

              {/* Row 3 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="BVN/NIN"
                  name="bvnOrNin"
                  value={profile.bvnOrNin}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>

              {/* Row 4 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Local Government Area"
                  name="lga"
                  value={profile.lga}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Grid>

              {/* Row 5 - Full Width */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={!hasChanges || loading}
                startIcon={loading ? <LoadingSpinner /> : <SaveIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  minWidth: 120,
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PersonalInformation;

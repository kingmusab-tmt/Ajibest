"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import EditableImage from "../../components/generalcomponents/Image";

const NextOfKinDetail: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session, status } = useSession();
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [profile, setProfile] = useState({
    nextOfKin: {
      name: "",
      phoneNumber: "",
      address: "",
      email: "",
      userAccountNumber: "",
      userBankName: "",
      image: "",
    },
  });
  const [changedFields, setChangedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/getNextofKinDetail", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setProfile({ nextOfKin: data.data });
            setImage(data.data.image);
          }
        });
    }
  }, [session, status]);
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    // Normalize event target shape for both input and MUI Select events
    const target = e.target as unknown as { name?: string; value: unknown };
    const { name, value } = target;
    if (name) {
      setProfile((prevProfile) => ({
        nextOfKin: { ...prevProfile.nextOfKin, [name]: value },
      }));
      setChangedFields((prevChangedFields) => ({
        ...prevChangedFields,
        [name]: true,
      }));
    }
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSave = async () => {
    const updatedProfile: { [key: string]: any } = {};
    for (const key in profile.nextOfKin) {
      if (changedFields[key]) {
        updatedProfile[`nextOfKin.${key}`] =
          profile.nextOfKin[key as keyof typeof profile.nextOfKin];
      }
    }

    if (imageChanged) {
      updatedProfile["nextOfKin.image"] = image;
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
        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
        setChangedFields({});
        setImageChanged(false);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update profile",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Network error. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isUrl = (str: string) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(image) ? image : `/uploads/${image}`;

  const banks = [
    "Access Bank",
    "Citibank",
    "Diamond Bank",
    "Ecobank Nigeria",
    "Fidelity Bank Nigeria",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank Plc",
    "Jaiz Bank Plc",
    "Keystone Bank Limited",
    "Providus Bank Plc",
    "Polaris Bank",
    "Stanbic IBTC Bank Nigeria Limited",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Suntrust Bank Nigeria Limited",
    "Taj Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank Plc",
    "Wema Bank",
    "Zenith Bank",
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Card
        elevation={1}
        sx={{
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "text.primary",
            }}
          >
            Next of Kin Details
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              maxWidth: 800,
              mx: "auto",
              bgcolor: "background.default",
              borderRadius: 3,
            }}
          >
            {/* Image Upload Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  position: "relative",
                  maxWidth: 200,
                }}
              >
                <EditableImage link={imageSrc} setLink={handleImageChange} />
              </Box>
            </Box>

            {/* Form Fields */}
            <Grid container spacing={3}>
              {/* Name and Address */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.nextOfKin.name}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.nextOfKin.address}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Phone and Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profile.nextOfKin.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.nextOfKin.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Account Number and Bank */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="userAccountNumber"
                  value={profile.nextOfKin.userAccountNumber}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="bank-select-label">Bank Name</InputLabel>
                  <Select
                    labelId="bank-select-label"
                    name="userBankName"
                    value={profile.nextOfKin.userBankName}
                    onChange={handleChange}
                    label="Bank Name"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Bank</em>
                    </MenuItem>
                    {banks.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  minWidth: 200,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        </CardContent>
      </Card>

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
          variant="filled"
          sx={{
            borderRadius: 2,
            fontSize: "0.9rem",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NextOfKinDetail;

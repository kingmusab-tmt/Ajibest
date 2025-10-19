"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const ChangePassword: React.FC = () => {
  const { data: session } = useSession();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });

  const validatePassword = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handlePasswordChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "newPassword") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return theme.palette.error.main;
      case 1:
        return theme.palette.error.main;
      case 2:
        return theme.palette.warning.main;
      case 3:
        return theme.palette.warning.main;
      case 4:
        return theme.palette.success.main;
      case 5:
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setSnackbar({
        open: true,
        message: "Password is too weak. Please follow the security guidelines.",
        severity: "warning",
      });
      setLoading(false);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setSnackbar({
        open: true,
        message: "New password must be different from old password",
        severity: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put("/api/changePassword", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Password updated successfully!",
          severity: "success",
        });
        // Reset form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength({ score: 0, feedback: [] });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to update password",
          severity: "error",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating password";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isFormValid =
    formData.oldPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword &&
    passwordStrength.score >= 3;

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 2,
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: theme.shadows[8],
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.9
          )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LockIcon
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1,
              }}
            >
              Change Password
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400, mx: "auto" }}
            >
              Update your password to keep your account secure
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Old Password */}
              <TextField
                label="Current Password"
                type={showPasswords.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) =>
                  handlePasswordChange("oldPassword", e.target.value)
                }
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("old")}
                        edge="end"
                      >
                        {showPasswords.old ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* New Password */}
              <Box>
                <TextField
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("new")}
                          edge="end"
                        >
                          {showPasswords.new ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Password Strength
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: getStrengthColor(passwordStrength.score),
                        }}
                      >
                        {getStrengthLabel(passwordStrength.score)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength.score / 5) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.grey[500], 0.2),
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getStrengthColor(
                            passwordStrength.score
                          ),
                          borderRadius: 3,
                        },
                      }}
                    />

                    {/* Password Requirements */}
                    {passwordStrength.feedback.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: "block" }}
                        >
                          Requirements:
                        </Typography>
                        {passwordStrength.feedback.map((req, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            sx={{
                              display: "block",
                              color: theme.palette.text.secondary,
                              fontSize: "0.75rem",
                            }}
                          >
                            • {req}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {/* Confirm Password */}
              <TextField
                label="Confirm New Password"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                required
                fullWidth
                error={
                  formData.confirmPassword !== "" &&
                  formData.newPassword !== formData.confirmPassword
                }
                helperText={
                  formData.confirmPassword !== "" &&
                  formData.newPassword !== formData.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("confirm")}
                        edge="end"
                      >
                        {showPasswords.confirm ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Security Notice */}
              <Alert
                severity="info"
                icon={<SecurityIcon />}
                sx={{
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                }}
              >
                <Typography variant="body2">
                  <strong>Security Tip:</strong> Use a strong, unique password
                  that you don&apos;t use elsewhere.
                </Typography>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  position: "relative",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{
                        color: theme.palette.primary.contrastText,
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-12px",
                      }}
                    />
                    <span>Change Password</span>
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </Box>
          </form>
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
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;

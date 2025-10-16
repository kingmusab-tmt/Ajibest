"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Mail } from "@mui/icons-material";
import LoadingSpinner from "../components/generalcomponents/loadingSpinner";

export default function ForgotResetPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Auto-populate OTP from token
  useEffect(() => {
    if (token) {
      // Extract OTP from token or make API call to get OTP associated with token
      // For now, we'll use a mock function - you might want to create an API to get OTP from token
      setFormData((prev) => ({ ...prev, otp: "" })); // Clear initially
      setStep(1); // Move to password step if token is present
    }
  }, [token]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const getPasswordError = (password: string): string => {
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!token && !formData.otp) {
      setError("OTP is required");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordError = getPasswordError(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token || null,
          otp: formData.otp || null,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setStep(2);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred while resetting your password");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Enter OTP", "Set New Password", "Complete"];

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary.main"
          >
            Reset Your Password
          </Typography>
        </Box>

        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {token && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Token detected. Please set your new password below.
            </Typography>
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* OTP Step */}
          {step < 2 && (
            <>
              {!token && (
                <TextField
                  fullWidth
                  label="OTP Code"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Enter the 6-digit OTP sent to your email"
                  sx={{ mb: 3 }}
                />
              )}

              {/* Password Fields */}
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  !!formData.newPassword &&
                  !validatePassword(formData.newPassword)
                }
                helperText={
                  formData.newPassword &&
                  !validatePassword(formData.newPassword)
                    ? getPasswordError(formData.newPassword)
                    : "Must contain uppercase, lowercase, number, and special character"
                }
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  !!formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword
                }
                helperText={
                  formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                sx={{ mb: 3 }}
              />
            </>
          )}

          {/* Success Step */}
          {step === 2 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="bold">
                Password Reset Successful!
              </Typography>
              <Typography variant="body2">
                Your password has been reset successfully. You will be
                redirected to the login page shortly.
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {step < 2 && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {loading ? <LoadingSpinner /> : "Reset Password"}
            </Button>
          )}

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Button
              onClick={() => router.push("/login")}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

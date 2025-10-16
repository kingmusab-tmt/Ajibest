"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  LocationOn,
  Security,
} from "@mui/icons-material";
import MessageModal from "../generalcomponents/messageModal";
import LoadingSpinner from "../generalcomponents/loadingSpinner";

interface FormData {
  name: string;
  username: string;
  email: string;
  confirmEmail: string;
  bvnOrNin: string;
  phoneNumber: string;
  country: string;
  state: string;
  lga: string;
  password: string;
  confirmPassword: string;
  address: string;
}

interface StepProps {
  step: number;
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
}

const useErrorHandling = () => {
  const [error, setError] = useState("");

  const setErrorWithTimeout = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  return { error, setErrorWithTimeout };
};

const StepOne: React.FC<StepProps> = ({
  step,
  setStep,
  formData,
  setFormData,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const checkIfExists = async (field: string, value: string) => {
      if (!value) return;

      try {
        const response = await fetch(
          `/api/users/checkexituser?${field}=${encodeURIComponent(value)}`,
          {
            headers: { "Cache-Control": "no-cache, no-store" },
          }
        );

        if (response.ok) {
          const { success } = await response.json();
          if (success) {
            setErrorWithTimeout(`${field} already exists`);
          }
        }
      } catch (error) {
        console.error("Error checking existence:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.username) {
        checkIfExists("username", formData.username);
      }
      if (formData.email) {
        checkIfExists("email", formData.email);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.email, formData.username, setErrorWithTimeout]);

  const handleNext = () => {
    let valid = true;

    if (!formData.name.trim()) {
      setErrorWithTimeout("Full name is required");
      valid = false;
    }

    if (!formData.username.trim()) {
      setErrorWithTimeout("Username is required");
      valid = false;
    } else if (formData.username.length < 3) {
      setErrorWithTimeout("Username must be at least 3 characters");
      valid = false;
    }

    if (!formData.email) {
      setErrorWithTimeout("Email is required");
      valid = false;
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/;
      if (!emailRegex.test(formData.email)) {
        setErrorWithTimeout(
          "Please use a valid Gmail, Yahoo, Hotmail, or Outlook address"
        );
        valid = false;
      }
    }

    if (!formData.confirmEmail) {
      setErrorWithTimeout("Confirm email is required");
      valid = false;
    } else if (formData.email !== formData.confirmEmail) {
      setErrorWithTimeout("Emails do not match");
      valid = false;
    }

    if (valid) {
      setStep(2);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/userprofile" });
  };

  if (step !== 1) return null;

  return (
    <Box sx={{ width: "100%", spaceY: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ username: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Confirm Email"
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => setFormData({ confirmEmail: e.target.value })}
          />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleNext}
        sx={{ mt: 3, py: 1.5 }}
      >
        Continue to Verification
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        size="large"
        onClick={handleGoogleSignIn}
        startIcon={
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        }
      >
        Sign up with Google
      </Button>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

const StepTwo: React.FC<StepProps> = ({
  step,
  setStep,
  formData,
  setFormData,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();

  useEffect(() => {
    const checkIfExists = async (value: string) => {
      if (!value || value.length !== 11) return;

      try {
        const response = await fetch(
          `/api/users/checkexituser?bvnOrNin=${encodeURIComponent(value)}`,
          {
            headers: { "Cache-Control": "no-cache, no-store" },
          }
        );

        if (response.ok) {
          const { success } = await response.json();
          if (success) {
            setErrorWithTimeout("BVN or NIN already exists");
          }
        }
      } catch (error) {
        console.error("Error checking BVN/NIN:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.bvnOrNin) {
        checkIfExists(formData.bvnOrNin);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.bvnOrNin, setErrorWithTimeout]);

  const handleVerify = () => {
    if (!formData.bvnOrNin.trim()) {
      setErrorWithTimeout("BVN or NIN is required");
      return;
    } else if (
      formData.bvnOrNin.length !== 11 ||
      !/^\d+$/.test(formData.bvnOrNin)
    ) {
      setErrorWithTimeout("BVN or NIN must be exactly 11 digits");
      return;
    }

    setStep(3);
  };

  if (step !== 2) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Identity Verification
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        For security purposes, please provide your BVN or NIN
      </Typography>

      <TextField
        fullWidth
        label="BVN or NIN (11 digits)"
        value={formData.bvnOrNin}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 11);
          setFormData({ bvnOrNin: value });
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Security color="primary" />
            </InputAdornment>
          ),
        }}
        helperText="Enter your 11-digit BVN or NIN number"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="outlined" fullWidth onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleVerify}
          disabled={formData.bvnOrNin.length !== 11}
        >
          Verify & Continue
        </Button>
      </Box>
    </Box>
  );
};

const StepThree: React.FC<
  StepProps & {
    setIsLoading: (isLoading: boolean) => void;
    handleSuccess: (title: string, message: string) => void;
    handleError: (title: string, message: string) => void;
  }
> = ({
  step,
  setStep,
  formData,
  setFormData,
  setIsLoading,
  handleSuccess,
  handleError,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkIfExists = async (value: string) => {
      if (!value) return;

      try {
        const response = await fetch(
          `/api/users/checkexituser?phoneNumber=${encodeURIComponent(value)}`,
          {
            headers: { "Cache-Control": "no-cache, no-store" },
          }
        );

        if (response.ok) {
          const { success } = await response.json();
          if (success) {
            setErrorWithTimeout("Phone number already exists");
          }
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.phoneNumber) {
        checkIfExists(formData.phoneNumber);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.phoneNumber, setErrorWithTimeout]);

  const handleSubmit = async () => {
    let valid = true;

    if (!formData.phoneNumber.trim()) {
      setErrorWithTimeout("Phone number is required");
      valid = false;
    }

    if (!formData.country.trim()) {
      setErrorWithTimeout("Country is required");
      valid = false;
    }

    if (!formData.state.trim()) {
      setErrorWithTimeout("State is required");
      valid = false;
    }

    if (!formData.lga.trim()) {
      setErrorWithTimeout("LGA is required");
      valid = false;
    }

    if (!formData.password) {
      setErrorWithTimeout("Password is required");
      valid = false;
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setErrorWithTimeout(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
        valid = false;
      }
    }

    if (!formData.confirmPassword) {
      setErrorWithTimeout("Confirm password is required");
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setErrorWithTimeout("Passwords do not match");
      valid = false;
    }

    if (valid) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/createNewUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            username: formData.username.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
            bvnOrNin: formData.bvnOrNin,
            country: formData.country.trim(),
            state: formData.state.trim(),
            lga: formData.lga.trim(),
            address: formData.address.trim(),
          }),
        });

        if (response.ok) {
          handleSuccess(
            "Registration Successful",
            "Your registration was successful! Please check your email for confirmation."
          );
          setTimeout(() => router.push("/login"), 2000);
        } else {
          const errorData = await response.json();
          handleError(
            "Registration Failed",
            errorData.message || "Submission failed"
          );
        }
      } catch (error) {
        handleError("Registration Failed", "Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (step !== 3) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Contact & Security
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ phoneNumber: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({ country: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ address: e.target.value })}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ state: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="LGA"
            value={formData.lga}
            onChange={(e) => setFormData({ lga: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="8+ characters with uppercase, lowercase, number, and special character"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ confirmPassword: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="outlined" fullWidth onClick={() => setStep(2)}>
          Back
        </Button>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Complete Registration
        </Button>
      </Box>
    </Box>
  );
};

const SignupForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    confirmEmail: "",
    bvnOrNin: "",
    phoneNumber: "",
    country: "",
    state: "",
    lga: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSuccess = (title: string, message: string) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleError = (title: string, message: string) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const steps = ["Personal Info", "Verification", "Contact & Security"];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Card elevation={8} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              fontWeight="bold"
              color="primary"
            >
              Create Your Account
            </Typography>

            <Stepper activeStep={step - 1} sx={{ mb: 6, mt: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{!isMobile && label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <StepOne
                  step={step}
                  setStep={setStep}
                  formData={formData}
                  setFormData={updateFormData}
                />
                <StepTwo
                  step={step}
                  setStep={setStep}
                  formData={formData}
                  setFormData={updateFormData}
                />
                <StepThree
                  step={step}
                  setStep={setStep}
                  formData={formData}
                  setFormData={updateFormData}
                  setIsLoading={setIsLoading}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </Container>
  );
};

export default SignupForm;

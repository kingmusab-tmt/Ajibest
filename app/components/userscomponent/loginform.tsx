"use client";

import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import logo from "@/public/ajibestlogo.png";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingSpinner from "../generalcomponents/loadingSpinner";

function Login() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { data: session } = useSession();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Session redirection effect
  useEffect(() => {
    if (session) {
      if (session.user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/userprofile");
      }
    }
  }, [session, router]);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!user.email || !user.password) {
        setError("Please fill all the fields");
        setLoading(false);
        return;
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(user.email)) {
        setError("Invalid email address");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        setUser({ email: "", password: "" });
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/userprofile" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordStep(0);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordStep(0);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage("Please enter your email address");
      return;
    }

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setForgotPasswordMessage("Please enter a valid email address");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setForgotPasswordStep(1);
        setForgotPasswordMessage("");
      } else {
        const data = await response.json();
        setForgotPasswordMessage(data.message || "Failed to process request");
      }
    } catch (error) {
      setForgotPasswordMessage(
        "An error occurred while processing your request"
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Dont render if session exists (will redirect)
  if (session) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <>
      <Container
        maxWidth="lg"
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
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            maxWidth: 1000,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "WhiteSmoke",
              color: "blue",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              gap: 3,
            }}
          >
            <Image
              src={logo}
              alt="Company Logo"
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Welcome Back!
            </Typography>
            <Typography variant="body1" textAlign="center">
              Sign in to access your account and continue your journey with us.
            </Typography>
          </Box>

          {/* Right Side - Login Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Image
                src={logo}
                alt="Company Logo"
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary.main"
              textAlign={{ xs: "center", md: "left" }}
            >
              Sign In
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
              textAlign={{ xs: "center", md: "left" }}
            >
              Enter your credentials to access your account
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail color={theme.palette.primary.main} size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={handleInputChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={theme.palette.primary.main} size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Button
                  onClick={handleForgotPasswordOpen}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.875rem",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {loading ? <LoadingSpinner /> : "Sign In"}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                startIcon={
                  googleLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                      style={{ display: "block" }}
                    >
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
                  )
                }
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: "1rem",
                }}
              >
                Sign in with Google
              </Button>

              <Box textAlign="center">
                <Typography variant="body1">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box>
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
              gutterBottom
            >
              Reset Your Password
            </Typography>
            <Stepper activeStep={forgotPasswordStep} sx={{ mt: 2 }}>
              <Step>
                <StepLabel>Enter Email</StepLabel>
              </Step>
              <Step>
                <StepLabel>Check Email</StepLabel>
              </Step>
            </Stepper>
          </Box>
        </DialogTitle>

        <DialogContent>
          {forgotPasswordStep === 0 && (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Enter your email address and we&apos;ll send you a One-Time
                Password (OTP) to reset your password.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                margin="normal"
                required
              />
              {forgotPasswordMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {forgotPasswordMessage}
                </Alert>
              )}
            </>
          )}

          {forgotPasswordStep === 1 && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                  Check Your Email
                </Typography>
                <Typography variant="body2">
                  If an account with the email{" "}
                  <strong>{forgotPasswordEmail}</strong> exists, we&apos;ve sent
                  a One-Time Password (OTP) to it. Please check your inbox and
                  follow the instructions to reset your password.
                </Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Didn&apos;t receive the email? Check your spam folder or try
                again in a few minutes.
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          {forgotPasswordStep === 0 ? (
            <>
              <Button onClick={handleForgotPasswordClose}>Cancel</Button>
              <Button
                onClick={handleForgotPasswordSubmit}
                variant="contained"
                disabled={forgotPasswordLoading}
                startIcon={forgotPasswordLoading ? <LoadingSpinner /> : null}
              >
                {forgotPasswordLoading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleForgotPasswordClose}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleForgotPasswordClose();
                  router.push("/forgotResetPassword");
                }}
              >
                Go to Reset Password
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Login;

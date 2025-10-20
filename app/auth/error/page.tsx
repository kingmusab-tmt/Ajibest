"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Link from "next/link";

// Inner component that uses useSearchParams
const AuthErrorContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Auto-redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthSignin":
        return "There was an error during OAuth sign in. Please try again.";
      case "OAuthCallback":
        return "There was an error during OAuth callback. Please try again.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in with your original provider.";
      case "CredentialsSignin":
        return "Sign in failed. Check your credentials.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Authentication Error
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body1">Redirecting to login page...</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Error: {error}
            </Typography>
            {getErrorMessage(error)}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You will be automatically redirected to the login page in a few
            seconds.
          </Typography>

          <Box
            sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              onClick={() => router.push("/auth/signin")}
            >
              Go to Login Now
            </Button>
            <Button variant="outlined" component={Link} href="/">
              Go Home
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

// Main component with Suspense boundary
const AuthErrorPage = () => {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          </Box>
        </Container>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
};

export default AuthErrorPage;

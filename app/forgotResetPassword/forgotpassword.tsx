"use client";

import { Suspense } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ForgotResetPassword() {
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

        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={4}
            >
              <CircularProgress />
            </Box>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </Paper>
    </Container>
  );
}

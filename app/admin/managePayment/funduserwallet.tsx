"use client";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AttachMoney from "@mui/icons-material/AttachMoney";

const FundUserWallet = () => {
  const [amount, setAmount] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/searchbyemail", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data._id;

        const response1 = await axios.post("/api/fund-wallet", {
          userId,
          amount,
        });

        const response2 = await axios.put("/api/users/" + userId, {
          remainingBalance: amount,
        });

        if (response1.data.success && response2.data.success) {
          setError(null);
          setAmount(0);
          setEmail("");
        } else {
          setError(response1.data.error || response2.data.error);
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      setError("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        mt: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "primary.main",
        }}
      >
        Fund User Wallet
      </Typography>

      <Box component="form" onSubmit={handleFundWallet} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          required
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney color="action" />
              </InputAdornment>
            ),
            inputProps: { min: 0 },
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            backgroundColor: "orange",
            "&:hover": {
              backgroundColor: "darkorange",
            },
          }}
        >
          {loading ? "Processing..." : "Fund Wallet"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default FundUserWallet;

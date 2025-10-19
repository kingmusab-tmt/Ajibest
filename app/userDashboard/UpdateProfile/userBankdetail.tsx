"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
  Divider,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
} from "@mui/material";
import {
  AccountBalance,
  AccountBalanceWallet,
  Person,
  Save,
  CheckCircle,
  Security,
} from "@mui/icons-material";
import LoadingSpinner from "../../components/generalcomponents/loadingSpinner";

interface BankAccount {
  userAccountNumber: string;
  userBankName: string;
  userAccountName: string;
}

const BankAccountDetail: React.FC = () => {
  const { data: session, status } = useSession();
  const [account, setAccount] = useState<BankAccount>({
    userAccountNumber: "",
    userBankName: "",
    userAccountName: "",
  });
  const [changedFields, setChangedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  const fetchAccountDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/getBankDetail", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch account details");
      }

      const data = await response.json();
      if (data.data) {
        setAccount(data.data);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      showSnackbar("Failed to load account details", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAccountDetails();
    }
  }, [session, status, fetchAccountDetails]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (field: keyof BankAccount, value: string) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
    setChangedFields((prev) => ({ ...prev, [field]: true }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate field in real-time
    validateField(field, value);
  };

  const validateField = (field: keyof BankAccount, value: string) => {
    let error = "";

    switch (field) {
      case "userAccountName":
        if (!value.trim()) {
          error = "Account name is required";
        } else if (value.trim().length < 2) {
          error = "Account name must be at least 2 characters";
        }
        break;

      case "userAccountNumber":
        if (!value) {
          error = "Account number is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Account number must contain only digits";
        } else if (value.length !== 10) {
          error = "Account number must be 10 digits";
        }
        break;

      case "userBankName":
        if (!value) {
          error = "Bank name is required";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!account.userAccountName.trim()) {
      newErrors.userAccountName = "Account name is required";
    }

    if (!account.userAccountNumber) {
      newErrors.userAccountNumber = "Account number is required";
    } else if (!/^\d{10}$/.test(account.userAccountNumber)) {
      newErrors.userAccountNumber = "Account number must be 10 digits";
    }

    if (!account.userBankName) {
      newErrors.userBankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = Object.values(changedFields).some(Boolean);
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async () => {
    if (!validateForm()) {
      showSnackbar("Please fix the errors before saving", "error");
      return;
    }

    setSaveLoading(true);
    try {
      const updatedAccount: Partial<BankAccount> = {};
      for (const key in changedFields) {
        if (changedFields[key]) {
          updatedAccount[key as keyof BankAccount] =
            account[key as keyof BankAccount];
        }
      }

      const response = await fetch("/api/users/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAccount),
      });

      if (response.ok) {
        showSnackbar("Account details updated successfully!", "success");
        setChangedFields({});
        // Refetch to get any server-side updates
        await fetchAccountDetails();
      } else {
        throw new Error("Failed to update account");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      showSnackbar("Failed to update account details", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            <AccountBalance sx={{ mr: 1, verticalAlign: "bottom" }} />
            Bank Account Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Manage your bank account information for transactions and payments
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Account Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Name"
                name="userAccountName"
                value={account.userAccountName}
                onChange={(e) =>
                  handleChange("userAccountName", e.target.value)
                }
                error={!!errors.userAccountName}
                helperText={errors.userAccountName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter account holder name"
              />
            </Grid>

            {/* Account Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="userAccountNumber"
                value={account.userAccountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  handleChange("userAccountNumber", value);
                }}
                error={!!errors.userAccountNumber}
                helperText={
                  errors.userAccountNumber || "10-digit account number"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceWallet color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="0000000000"
              />
            </Grid>

            {/* Bank Name */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.userBankName}>
                <InputLabel>Bank Name</InputLabel>
                <Select
                  name="userBankName"
                  value={account.userBankName}
                  onChange={(e) => handleChange("userBankName", e.target.value)}
                  label="Bank Name"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountBalance color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select your bank</em>
                  </MenuItem>
                  {banks.map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
                {errors.userBankName && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {errors.userBankName}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Change Indicator */}
          {hasChanges && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mt: 3,
                backgroundColor: theme.palette.info.light,
                border: `1px solid ${theme.palette.info.main}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Security color="info" />
                <Typography variant="body2" color="info.dark">
                  You have unsaved changes. Please save to update your account
                  details.
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* Security Note */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <Security
                sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }}
              />
              Your bank details are secured with encryption and used only for
              transaction purposes.
            </Typography>
          </Paper>

          {/* Save Button */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={!hasChanges || hasErrors || saveLoading}
              startIcon={saveLoading ? <LoadingSpinner /> : <Save />}
              sx={{
                minWidth: 120,
                px: 4,
                py: 1.5,
              }}
            >
              {saveLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success/Error Snackbar */}
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
          icon={snackbar.severity === "success" ? <CheckCircle /> : undefined}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BankAccountDetail;

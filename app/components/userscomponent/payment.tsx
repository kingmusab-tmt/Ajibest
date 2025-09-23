// // "use client";
// // import { useEffect, useState } from "react";
// // import { useSession } from "next-auth/react";
// // import {
// //   Box,
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   Typography,
// //   Button,
// // } from "@mui/material";
// // import { PaystackButton } from "react-paystack";
// // import axios from "axios";
// // import { useRouter } from "next/navigation";

// // const PaymentPage = ({ propertyId, type, price, listingPurpose, instalmentAllowed, onClose }) => {
// //   const [months, setMonths] = useState(0);
// //   const [paymentMethod, setPaymentMethod] = useState("");
// //   const [amount, setAmount] = useState(0);
// //   const [phone, setPhone] = useState("");
// //   const { data: session, status } = useSession();
// //   const publicKey = "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73";
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (!session) {
// //       alert("You need to be signed in to view this page");
// //       onClose();
// //     } else {
// //       fetch("/api/users/searchbyemail")
// //         .then((response) => response.json())
// //         .then((data) => {
// //           setPhone(data.user.phoneNumber);
// //         })
// //         .catch((error) => console.error("Error fetching user details:", error));
// //     }
// //   }, [session, onClose]);

// //   useEffect(() => {
// //     const parsedPrice = Number(price);
// //     if (paymentMethod === "installment" && months > 0 && !isNaN(parsedPrice)) {
// //       setAmount(parsedPrice / months);
// //     } else {
// //       setAmount(parsedPrice);
// //     }
// //   }, [paymentMethod, months, price]);

// //   if (status === "loading") {
// //     return <p>Loading...</p>;
// //   }
// //   if (session) {
// //     console.log(amount);
// //   }
// //   if (!session) {
// //     return <p>You need to be signed in to view this page</p>;
// //   }
// //   const email = session?.user?.email || "";
// //   const name = session?.user?.name || "";

// //   const handleSuccess = async (reference) => {
// //     onClose();
// //     try {
// //       const data = {
// //         amount: Number(amount.toFixed(0)),
// //         propertyPrice: price,
// //         email,
// //         reference,
// //         propertyId,
// //         propertyType: type,
// //         paymentMethod,
// //         paymentPurpose: listingPurpose,
// //       };
// //       const response = await axios.post("/api/verifyTransaction", data);
// //       if (response.status === 200) {
// //         router.push("/userprofile");
// //       } else {
// //         alert("Transaction Failed. Please try again.");
// //       }
// //     } catch (error) {
// //       alert("Transaction failed. Please try again.");
// //     }
// //   };

// //   const config = {
// //     email,
// //     amount: (amount * 100).toFixed(0) as unknown as number,
// //     publicKey,
// //   };
// //   const paystackProps = {
// //     ...config,
// //     metadata: {
// //       custom_fields: [
// //         {
// //           display_name: "Name",
// //           variable_name: "name",
// //           value: name,
// //         },
// //         {
// //           display_name: "Phone",
// //           variable_name: "phone",
// //           value: phone,
// //         },
// //       ],
// //     },
// //     text: "Pay Now",
// //     onSuccess: ({ reference }) => handleSuccess(reference),
// //     onClose: () => alert("Wait! You need this oil, don't go!!!!"),
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         textAlign: "center",
// //         padding: 2,
// //         backgroundColor: "white",
// //         borderRadius: 1,
// //         minWidth: 300,
// //       }}
// //     >
// //       <Typography variant="h4" gutterBottom>
// //         Payment Page
// //       </Typography>
// //       <FormControl sx={{ width: 200, marginBottom: 2 }}>
// //         <InputLabel>Payment Type</InputLabel>
// //         <Select
// //           value={paymentMethod}
// //           onChange={(e) => setPaymentMethod(e.target.value)}
// //         >
// //           <MenuItem value="payOnce">Pay Once</MenuItem>
// //           <MenuItem value="installment">Installment</MenuItem>
// //         </Select>
// //       </FormControl>
// // {paymentMethod === "installment" && (
// //   <FormControl sx={{ width: 200, marginBottom: 2 }}>
// //     <InputLabel>Months</InputLabel>
// //     <Select
// //       value={months}
// //       onChange={(e) => setMonths(Number(e.target.value))}
// //     >
// //       <MenuItem value={1}>Pay Once</MenuItem>
// //       <MenuItem value={3}>3 Months</MenuItem>
// //       <MenuItem value={6}>6 Months</MenuItem>
// //       <MenuItem value={12}>12 Months</MenuItem>
// //       <MenuItem value={18}>18 Months</MenuItem>
// //       <MenuItem value={24}>24 Months</MenuItem>
// //     </Select>
// //   </FormControl>
// // )}
// // {paymentMethod === "installment" && months > 0 && (
// //   <Typography variant="h6" gutterBottom>
// //     Installment Amount: ₦{amount.toFixed(2)}
// //   </Typography>
// // )}
// //       <PaystackButton {...paystackProps} />
// //       <Button
// //         variant="contained"
// //         color="secondary"
// //         onClick={onClose}
// //         sx={{ marginTop: 2, marginRight: 2 }}
// //       >
// //         Cancel
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default PaymentPage;
// "use client";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   Button,
// } from "@mui/material";
// import { PaystackButton } from "react-paystack";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const PaymentPage = ({
//   propertyId,
//   type,
//   price,
//   listingPurpose,
//   instalmentAllowed,
//   onClose,
// }) => {
//   const [months, setMonths] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [phone, setPhone] = useState("");
//   const { data: session, status } = useSession();
//   const publicKey = "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73";
//   const router = useRouter();

//   useEffect(() => {
//     if (!session) {
//       alert("You need to be signed in to view this page");
//       onClose();
//     } else {
//       fetch("/api/users/searchbyemail", {
//         headers: {
//           "Cache-Control": "no-cache, no-store",
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setPhone(data.user.phoneNumber);
//         })
//         .catch((error) => console.error("Error fetching user details:", error));
//     }
//   }, [session, onClose]);

//   useEffect(() => {
//     const parsedPrice = Number(price);
//     if (paymentMethod === "installment" && months > 0 && !isNaN(parsedPrice)) {
//       setAmount(parsedPrice / months);
//     } else {
//       setAmount(parsedPrice);
//     }
//   }, [paymentMethod, months, price]);

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }
//   if (session) {
//     console.log(amount);
//   }
//   if (!session) {
//     return <p>You need to be signed in to view this page</p>;
//   }
//   const email = session?.user?.email || "";
//   const name = session?.user?.name || "";

//   const handleSuccess = async (reference) => {
//     onClose();
//     try {
//       const data = {
//         amount: Number(amount.toFixed(0)),
//         propertyPrice: price,
//         email,
//         reference,
//         propertyId,
//         propertyType: type,
//         paymentMethod,
//         paymentPurpose: listingPurpose,
//       };
//       const response = await axios.post("/api/verifyTransaction", data);
//       if (response.status === 200) {
//         router.push("/userprofile");
//       } else {
//         alert("Transaction Failed. Please try again.");
//       }
//     } catch (error) {
//       alert("Transaction failed. Please try again.");
//     }
//   };

//   const config = {
//     email,
//     amount: (amount * 100).toFixed(0) as unknown as number,
//     publicKey,
//   };
//   const paystackProps = {
//     ...config,
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Name",
//           variable_name: "name",
//           value: name,
//         },
//         {
//           display_name: "Phone",
//           variable_name: "phone",
//           value: phone,
//         },
//       ],
//     },
//     text: "Pay Now",
//     onSuccess: ({ reference }) => handleSuccess(reference),
//     onClose: () => alert("Wait! You need this oil, don't go!!!!"),
//   };

//   return (
//     <Box
//       sx={{
//         textAlign: "center",
//         padding: 2,
//         backgroundColor: "white",
//         borderRadius: 1,
//         minWidth: 300,
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         Payment Page
//       </Typography>
//       <FormControl sx={{ width: 200, marginBottom: 2 }}>
//         <InputLabel>Payment Type</InputLabel>
//         <Select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//         >
//           <MenuItem value="payOnce">Pay Once</MenuItem>
//           {instalmentAllowed !== false && (
//             <MenuItem value="installment">Installment</MenuItem>
//           )}
//         </Select>
//       </FormControl>
//       {paymentMethod === "installment" && (
//         <FormControl sx={{ width: 200, marginBottom: 2 }}>
//           <InputLabel>Months</InputLabel>
//           <Select
//             value={months}
//             onChange={(e) => setMonths(Number(e.target.value))}
//           >
//             <MenuItem value={1}>Pay Once</MenuItem>
//             <MenuItem value={3}>3 Months</MenuItem>
//             <MenuItem value={6}>6 Months</MenuItem>
//             <MenuItem value={12}>12 Months</MenuItem>
//             <MenuItem value={18}>18 Months</MenuItem>
//             <MenuItem value={24}>24 Months</MenuItem>
//           </Select>
//         </FormControl>
//       )}
//       {paymentMethod === "installment" && months > 0 && (
//         <Typography variant="h6" gutterBottom>
//           Installment Amount: ₦{amount.toFixed(2)}
//         </Typography>
//       )}
//       <PaystackButton {...paystackProps} />
//       <Button
//         variant="contained"
//         color="secondary"
//         onClick={onClose}
//         sx={{ marginTop: 2, marginRight: 2 }}
//       >
//         Cancel
//       </Button>
//     </Box>
//   );
// };

// export default PaymentPage;
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { PaystackButton } from "react-paystack";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Payment as PaymentIcon,
  Close,
  CheckCircle,
  AccountBalance,
  CalendarToday,
  Phone,
  Email,
  Person,
  Security,
} from "@mui/icons-material";

interface PaymentPageProps {
  propertyId: string;
  type: string;
  price: number;
  listingPurpose: string;
  instalmentAllowed: boolean;
  onClose: () => void;
}

const PaymentPage = ({
  propertyId,
  type,
  price,
  listingPurpose,
  instalmentAllowed,
  onClose,
}: PaymentPageProps) => {
  const [months, setMonths] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: session, status } = useSession();
  const publicKey = "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73";
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = ["Payment Method", "Payment Details", "Confirmation"];

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setError("You need to be signed in to make a payment");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/searchbyemail", {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          setPhone(data.user.phoneNumber || "");
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status]);

  useEffect(() => {
    const parsedPrice = Number(price);
    if (paymentMethod === "installment" && months > 0 && !isNaN(parsedPrice)) {
      setAmount(parsedPrice / months);
    } else {
      setAmount(parsedPrice);
    }
  }, [paymentMethod, months, price]);

  const handleNext = () => {
    if (activeStep === 0 && !paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    if (activeStep === 1 && paymentMethod === "installment" && months === 0) {
      setError("Please select installment duration");
      return;
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSuccess = async (reference: string) => {
    try {
      setLoading(true);
      const data = {
        amount: Number(amount.toFixed(0)),
        propertyPrice: price,
        email: session?.user?.email || "",
        reference,
        propertyId,
        propertyType: type,
        paymentMethod,
        paymentPurpose: listingPurpose,
      };

      const response = await axios.post("/api/verifyTransaction", data);
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          router.push("/userprofile");
        }, 2000);
      } else {
        throw new Error("Transaction verification failed");
      }
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    email: session?.user?.email || "",
    amount: Math.round(amount * 100),
    publicKey,
  };

  const paystackProps = {
    ...config,
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: session?.user?.name || "",
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: phone,
        },
        {
          display_name: "Property Type",
          variable_name: "property_type",
          value: type,
        },
        {
          display_name: "Property ID",
          variable_name: "property_id",
          value: propertyId,
        },
      ],
    },
    text: "Proceed to Payment",
    onSuccess: ({ reference }: { reference: string }) =>
      handleSuccess(reference),
    onClose: () => setError("Payment was cancelled"),
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  if (status === "loading" || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading payment details...
        </Typography>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You need to be signed in to make a payment
        </Alert>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CheckCircle
          sx={{ fontSize: 64, color: theme.palette.success.main, mb: 2 }}
        />
        <Typography variant="h5" gutterBottom color="success.main">
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Redirecting to your profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          p: { xs: 2, md: 3 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <PaymentIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Complete Your Payment
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {listingPurpose} • {type}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {/* Payment Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AccountBalance /> Payment Summary
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Amount:
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatter.format(price)}
              </Typography>
            </Grid>

            {paymentMethod === "installment" && months > 0 && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Installment Plan:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2">{months} months</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography
                    variant="h6"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {formatter.format(amount)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ mb: 3 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Payment Method */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Payment Method
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Type</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Type"
              >
                <MenuItem value="payOnce">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="primary" />
                    <Box>
                      <Typography variant="body1">Pay in Full</Typography>
                      <Typography variant="caption" color="text.secondary">
                        One-time payment
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
                {instalmentAllowed && (
                  <MenuItem value="installment">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="body1">
                          Installment Plan
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pay over time
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            {!instalmentAllowed && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Installment payments are not available for this property
              </Alert>
            )}
          </Box>
        )}

        {/* Step 2: Payment Details */}
        {activeStep === 1 && paymentMethod === "installment" && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Installment Plan
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Installment Duration</InputLabel>
              <Select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                label="Installment Duration"
              >
                <MenuItem value={3}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>3 Months</Typography>
                    <Chip
                      label={formatter.format(price / 3)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </MenuItem>
                <MenuItem value={6}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>6 Months</Typography>
                    <Chip
                      label={formatter.format(price / 6)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </MenuItem>
                <MenuItem value={12}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>12 Months</Typography>
                    <Chip
                      label={formatter.format(price / 12)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </MenuItem>
                <MenuItem value={18}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>18 Months</Typography>
                    <Chip
                      label={formatter.format(price / 18)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </MenuItem>
                <MenuItem value={24}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>24 Months</Typography>
                    <Chip
                      label={formatter.format(price / 24)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Step 3: Confirmation */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Payment Details
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                mb: 2,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Property Type:
                  </Typography>
                  <Typography variant="body2">{type}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                  <Typography variant="body2">
                    {paymentMethod === "payOnce"
                      ? "Full Payment"
                      : `${months} Month Installment`}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Amount to Pay:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatter.format(amount)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <Alert severity="info" icon={<Security />}>
              You will be redirected to Paystack for secure payment processing
            </Alert>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mt: 3 }}
          justifyContent="space-between"
        >
          <Button
            onClick={activeStep === 0 ? onClose : handleBack}
            variant="outlined"
            disabled={loading}
            fullWidth={isMobile}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={loading}
              fullWidth={isMobile}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => setConfirmOpen(true)}
              variant="contained"
              disabled={loading}
              startIcon={<PaymentIcon />}
              fullWidth={isMobile}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                },
              }}
            >
              Proceed to Payment
            </Button>
          )}
        </Stack>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Security color="primary" />
          Confirm Payment
        </DialogTitle>
        <DialogContent>
          <Typography>
            You are about to proceed with a payment of{" "}
            <strong>{formatter.format(amount)}</strong>. This action will
            redirect you to our secure payment gateway.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Box className="paystack-button">
            <PaystackButton {...paystackProps} />
          </Box>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaymentPage;

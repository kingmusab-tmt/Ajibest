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
} from "@mui/material";
import { PaystackButton } from "react-paystack";
import axios from "axios";
import { useRouter } from "next/navigation";

const PaymentPage = ({ propertyId, type, price, listingPurpose, onClose }) => {
  const [months, setMonths] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [phone, setPhone] = useState("");
  const { data: session, status } = useSession();
  const publicKey = "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73";
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      alert("You need to be signed in to view this page");
      onClose();
    } else {
      fetch("/api/users/searchbyemail")
        .then((response) => response.json())
        .then((data) => {
          setPhone(data.user.phoneNumber);
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [session, onClose]);

  useEffect(() => {
    const parsedPrice = Number(price);
    if (paymentMethod === "installment" && months > 0 && !isNaN(parsedPrice)) {
      setAmount(parsedPrice / months);
    } else {
      setAmount(parsedPrice);
    }
  }, [paymentMethod, months, price]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (session) {
    console.log(amount);
  }
  if (!session) {
    return <p>You need to be signed in to view this page</p>;
  }
  const email = session?.user?.email || "";
  const name = session?.user?.name || "";

  const handleSuccess = async (reference) => {
    onClose();
    try {
      const data = {
        amount: Number(amount.toFixed(0)),
        propertyPrice: price,
        email,
        reference,
        propertyId,
        propertyType: type,
        paymentMethod,
        paymentPurpose: listingPurpose,
      };
      const response = await axios.post("/api/verifyTransaction", data);
      if (response.status === 200) {
        router.push("/userprofile");
      } else {
        alert("Transaction Failed. Please try again.");
      }
    } catch (error) {
      alert("Transaction failed. Please try again.");
    }
  };

  const config = {
    email,
    amount: (amount * 100).toFixed(0),
    publicKey,
  };
  const paystackProps = {
    ...config,
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: phone,
        },
      ],
    },
    text: "Pay Now",
    onSuccess: ({ reference }) => handleSuccess(reference),
    onClose: () => alert("Wait! You need this oil, don't go!!!!"),
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 2,
        backgroundColor: "white",
        borderRadius: 1,
        minWidth: 300,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Payment Page
      </Typography>
      <FormControl sx={{ width: 200, marginBottom: 2 }}>
        <InputLabel>Payment Type</InputLabel>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="payOnce">Pay Once</MenuItem>
          <MenuItem value="installment">Installment</MenuItem>
        </Select>
      </FormControl>
      {paymentMethod === "installment" && (
        <FormControl sx={{ width: 200, marginBottom: 2 }}>
          <InputLabel>Months</InputLabel>
          <Select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          >
            <MenuItem value={1}>Pay Once</MenuItem>
            <MenuItem value={3}>3 Months</MenuItem>
            <MenuItem value={6}>6 Months</MenuItem>
            <MenuItem value={12}>12 Months</MenuItem>
            <MenuItem value={18}>18 Months</MenuItem>
            <MenuItem value={24}>24 Months</MenuItem>
          </Select>
        </FormControl>
      )}
      {paymentMethod === "installment" && months > 0 && (
        <Typography variant="h6" gutterBottom>
          Installment Amount: ₦{amount.toFixed(2)}
        </Typography>
      )}
      <PaystackButton {...paystackProps} />
      <Button
        variant="contained"
        color="secondary"
        onClick={onClose}
        sx={{ marginTop: 2, marginRight: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default PaymentPage;

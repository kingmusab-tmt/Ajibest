"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { PaystackButton } from "react-paystack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PropertyDetail from "./propertydetail";

interface PaymentHisotry {
  paymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
}

interface Property {
  title: string;
  propertyId: string;
  paymentDate?: Date;
  propertyPrice: number;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  paymentPurpose: "For Sale" | "For Renting";
  paymentHisotry?: PaymentHisotry[];
  description: string;
  location: string;
  listingPurpose: string;
  bedrooms: number;
  amenities: string[];
  purchased: boolean;
  rented: boolean;
  utilities: string[];
}

interface UserProperties {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
}

interface User {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
}

const MyProperty = () => {
  const router = useRouter();
  const [userProperties, setUserProperties] = useState<UserProperties | null>(
    null
  );
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await axios.get("/api/users/searchbyemail");
        setUserData(response.data.user);
      } catch (error) {
        setError("Error fetching user properties");
        console.error("Error fetching user properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserProperties({
        propertyPurOrRented: userData.propertyPurOrRented,
        propertyUnderPayment: userData.propertyUnderPayment,
      });
    }
  }, [userData]);

  const handleSuccess = async (reference: any, property: Property) => {
    try {
      const data = {
        reference,
        propertyId: property.propertyId,
        amount: Number(amount?.toFixed(0)),
        email: session?.user.email,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        paymentPurpose: property.paymentPurpose,
      };
      const response = await axios.post("/api/verifyTransaction", data);
      if (response.status === 200) {
        router.push("/userprofile");
      } else {
        alert("Transaction Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const config = (property: Property, amount: number) => ({
    email: session?.user.email,
    amount: amount * 100,
    publicKey: "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73",
  });

  const componentProps = (property: Property, amount: number) => ({
    ...config(property, amount),
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: session?.user.name,
        },
      ],
    },
    text: "Pay Now",
    onSuccess: ({ reference }) => handleSuccess(reference, property),
    onClose: () => console.log("Payment closed"),
  });

  const handleClickOpen = (property: Property) => {
    setSelectedProperty(property);
    if (property.paymentHisotry && property.paymentHisotry.length > 0) {
      setAmount(
        property.paymentHisotry[property.paymentHisotry.length - 1].amount || 0
      );
    } else {
      setAmount(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProperty(null);
    setAmount(null);
  };

  const handleDetailOpen = (property: Property) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailProperty(null);
  };

  if (loading) {
    return (
      <Container className="flex flex-col justify-center items-center h-screen">
        <div className="mb-4">
          <Image src="/logo.png" alt="Company Logo" width={100} height={100} />
        </div>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  return (
    // <Container>
    <div className="pt-4 pr-4 pl-2 w-96 sm:w-full ">
      <Typography variant="h4" gutterBottom>
        My Properties
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", paddingRight: 2, marginLeft: 1 }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Next Payment Date</TableCell>
              <TableCell>Property Type</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Property Price</TableCell>
              <TableCell>Remaining Balance</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProperties?.propertyPurOrRented.map((property) => (
              <TableRow key={property.propertyId}>
                <TableCell>
                  <Button onClick={() => handleDetailOpen(property)}>
                    {String(property.propertyId).substring(0, 3) + "..."}
                  </Button>
                </TableCell>
                <TableCell>
                  {property.paymentDate
                    ? new Date(property.paymentDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell>{property.paymentMethod}</TableCell>
                <TableCell>
                  {formatter.format(property.propertyPrice)}
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            ))}
            {userProperties?.propertyUnderPayment.map((property) => (
              <TableRow key={property.propertyId}>
                <TableCell>
                  <Button onClick={() => handleDetailOpen(property)}>
                    {property.propertyId}
                  </Button>
                </TableCell>
                {property.paymentHisotry?.slice(-1).map((history, index) => (
                  <React.Fragment key={index}>
                    <TableCell>
                      {new Date(history.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(history.nextPaymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.paymentMethod}</TableCell>
                    <TableCell>
                      {formatter.format(history.propertyPrice)}
                    </TableCell>
                    <TableCell>
                      {formatter.format(history.remainingBalance)}
                    </TableCell>
                    <TableCell>{formatter.format(history.amount)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(property)}
                      >
                        Pay Now
                      </Button>
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!userProperties && (
        <Typography variant="h6" className="my-4">
          No properties found.
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Pay Now</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the amount you want to pay or use the default amount.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <PaystackButton
            className="bg-blue-700 p-2 text-white rounded hover:bg-red-600"
            {...componentProps(selectedProperty!, amount!)}
          />
        </DialogActions>
      </Dialog>

      <PropertyDetail
        open={detailOpen}
        handleClose={handleDetailClose}
        property={detailProperty}
      />
    </div>
  );
};

export default MyProperty;

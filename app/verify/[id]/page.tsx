"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useParams } from "next/navigation";
import ReceiptView from "@/app/components/ReceiptView";
import { IReceipt } from "@/models/Receipt";

export default function PublicVerificationPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<IReceipt | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) verifyReceipt();
  }, [id]);

  const verifyReceipt = async () => {
    try {
      const res = await axios.get<{ success: boolean; data: IReceipt }>(
        `/api/receipt/${id}`,
      );
      setReceipt(res.data.data);
    } catch (err) {
      setError("Receipt not found or system error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  // CASE 1: Receipt Exists but is INACTIVE (Fraud or Mistake)
  if (receipt?.status === "INACTIVE") {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: "100%", fontSize: "1.2rem" }}
        >
          ⚠️ WARNING: UNISSUED RECEIPT
        </Alert>
        <Typography mt={2}>
          This receipt ID exists in our system but has{" "}
          <strong>not been activated</strong> by A.A Ajibest Land Vendors Ltd.
          The content of the physical paper may be forged.
        </Typography>
      </Container>
    );
  }

  // CASE 2: Receipt is VOIDED
  if (receipt?.status === "VOIDED") {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Alert severity="error" variant="filled">
          ❌ THIS RECEIPT IS VOID
        </Alert>
      </Container>
    );
  }

  // CASE 3: Receipt is Valid
  if (receipt && receipt.status === "ACTIVE") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <ReceiptView
          data={receipt.details}
          id={receipt.receiptId}
          isPublic={true}
        />
      </Container>
    );
  }

  return (
    <Typography align="center" mt={5}>
      Invalid Verification Link
    </Typography>
  );
}

"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const SendBulkSMS: React.FC = () => {
  const [sender, setSender] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const responseMessages: { [key: string]: string } = {
    TG00: "MESSAGE PROCESSED",
    TG11: "Invalid Authentication Credentials",
    TG12: "Empty Username",
    TG13: "Empty Password",
    TG14: "Empty Recipients",
    TG15: "Empty Message",
    TG16: "Empty SenderID",
    TG17: "Not Enough Units Balance",
    TG18: "Blocked Words Found in Sender ID",
    TG19: "Blocked Words Found in Message Body",
    TG20: "Recipients above the maximum target",
    "0000": "MESSAGE SENT TO PROVIDER",
    "1111": "MESSAGE DELIVERED TO HANDSET",
    "2222": "MESSAGE REJECTED",
    "0014": "MESSAGE SENT THROUGH COOPERATE",
    "3333": "DND_REJECTED_NUMBER",
  };

  const validateRecipients = (recipient: string): boolean => {
    const recipientArray = recipient.split(/[\s,]+/);
    for (let recipient of recipientArray) {
      recipient = recipient.trim();
      if (
        !(recipient.startsWith("234") && recipient.length === 13) &&
        !(recipient.startsWith("0") && recipient.length === 11)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRecipients(recipient)) {
      setError("Invalid recipient number(s). Please check the format.");
      return;
    }

    const formattedRecipients = recipient
      .split(/[\s,]+/)
      .map((recipient) => recipient.trim())
      .join(",");

    const params = {
      sender,
      recipient: formattedRecipients,
      message: message,
      responsetype: "json",
    };

    const headers = {
      "X-Token": process.env.NEXT_PUBLIC_VT_TOKEN as string,
      "X-Secret": process.env.NEXT_PUBLIC_VT_SECRET as string,
    };

    try {
      const response = await axios.get(
        "https://messaging.vtpass.com/api/sms/sendsms",
        {
          params,
          headers: {
            ...headers,
            "Cache-Control": "no-cache, no-store",
          },
        }
      );

      const responseCode = response.data?.code;
      const responseMessage =
        responseMessages[responseCode] || "Unknown response code";

      if (responseCode && responseMessage) {
        if (responseCode.startsWith("TG") || responseCode === "0000") {
          setSuccess(responseMessage);
        } else {
          setError(responseMessage);
        }
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      setError("Error sending SMS. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Send Bulk SMS
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Sender Name"
            fullWidth
            margin="normal"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
          />
          <TextField
            label="Recipient Phone Numbers"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            placeholder="Type or paste phone numbers, separated by commas or newlines"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            error={!!error}
            helperText={error ? "Invalid recipient format" : ""}
          />
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Send SMS
          </Button>
        </form>
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
        >
          <Alert onClose={() => setSuccess("")} severity="success">
            {success}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SendBulkSMS;

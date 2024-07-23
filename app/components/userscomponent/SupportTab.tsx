import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const SupportTab: React.FC = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    if (!session) {
      setError("You must be logged in to send a message.");
      return;
    }
    if (!message || !subject) {
      setError("Subject and message are required.");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/sendSupportEmail", {
        email: session.user?.email,
        name: session.user?.name,
        subject,
        message,
      });
      setSuccess("Your message has been sent successfully.");
      setMessage("");
      setSubject("");
    } catch (error) {
      setError("Failed to send the message. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <Typography variant="h4" gutterBottom className="text-center">
        Support
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <FormControl fullWidth variant="outlined" className="mb-4">
        <InputLabel htmlFor="subject">Subject</InputLabel>
        <OutlinedInput
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          label="Subject"
        />
      </FormControl>
      <TextField
        label="Message"
        multiline
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
        fullWidth
        className="mb-4"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        disabled={sending}
        className="w-full"
      >
        {sending ? "Sending..." : "Send Message"}
      </Button>
    </Box>
  );
};

export default SupportTab;

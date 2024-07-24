"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import axios from "axios";
import logo from "../../../public/ajibestlogo.png"; // Adjust the path according to your project structure

const Contactus = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    if (!name || !email || !phone || !subject || !message) {
      setError("All fields are required.");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/sendSupportEmail", {
        name,
        email,
        phone,
        subject,
        message,
      });
      setSuccess("Your message has been sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setError("Failed to send the message. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box className="pt-20 mb-10 container mx-auto p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md flex flex-col lg:flex-row">
      <Box className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
        <Box className="text-center lg:text-left mb-4">
          <Typography
            variant="h4"
            gutterBottom
            className="font-bold mt-10 text-center text-blue-700"
          >
            A.A AJIBEST LAND VENDORS LIMITED
          </Typography>
          <Typography variant="body1" className="mt-2">
            No. 12A Golden Plaza, Opp. El-Kanemi College of Islamic Theology,
            Maiduguri, Borno State.
          </Typography>
          <Typography variant="body1">
            Phone:{" "}
            <a
              href="tel:+1234567890"
              className="text-blue-700 dark:text-blue-300"
            >
              +123 456 7890
            </a>
          </Typography>
          <Typography variant="body1">
            Email:{" "}
            <a
              href="mailto:emailaddress@gmail.com"
              className="text-blue-700 dark:text-blue-300"
            >
              emailaddress@gmail.com
            </a>
          </Typography>
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="A.A AJIBEST LAND VENDORS LIMITED Logo"
              width={300}
              height={300}
            />
          </div>
        </Box>
      </Box>
      <Box className="w-full lg:w-1/2 lg:pl-8">
        <Typography
          variant="h4"
          gutterBottom
          className="text-center lg:text-left"
        >
          Support
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel htmlFor="phone">Phone</InputLabel>
          <OutlinedInput
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            label="Phone"
          />
        </FormControl>
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
    </Box>
  );
};

export default Contactus;

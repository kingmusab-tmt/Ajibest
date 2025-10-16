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
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Image from "next/image";
import axios from "axios";
import logo from "../../../public/ajibestlogo.png";
import {
  Send,
  Phone,
  Email,
  LocationOn,
  Business,
  Person,
  ContactMail,
  CheckCircle,
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
  Schedule,
  Security,
} from "@mui/icons-material";
import LoadingSpinner from "./loadingSpinner";

const Contactus = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = ["Personal Info", "Message Details", "Review & Send"];

  const contactInfo = [
    {
      icon: <LocationOn color="primary" />,
      title: "Office Address",
      content:
        "No. 12A Golden Plaza, Opp. El-Kanemi College of Islamic Theology, Maiduguri, Borno State.",
    },
    {
      icon: <Phone color="primary" />,
      title: "Phone Number",
      content: "+123 456 7890",
      link: "tel:+1234567890",
    },
    {
      icon: <Email color="primary" />,
      title: "Email Address",
      content: "emailaddress@gmail.com",
      link: "mailto:emailaddress@gmail.com",
    },
    {
      icon: <Business color="primary" />,
      title: "Business Hours",
      content: "Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM",
    },
    {
      icon: <Schedule color="primary" />,
      title: "Response Time",
      content: "Typically within 1-2 business hours",
    },
    {
      icon: <Security color="primary" />,
      title: "Privacy Guaranteed",
      content: "Your information is safe with us",
    },
  ];

  const socialLinks = [
    { icon: <WhatsApp />, label: "WhatsApp", color: "#25D366" },
    { icon: <Facebook />, label: "Facebook", color: "#1877F2" },
    { icon: <Twitter />, label: "Twitter", color: "#1DA1F2" },
    { icon: <LinkedIn />, label: "LinkedIn", color: "#0077B5" },
  ];

  const handleSend = async () => {
    if (!name || !email || !phone || !subject || !message) {
      setError("All fields are required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
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
      setSuccess(
        "Your message has been sent successfully! We'll get back to you within 24 hours."
      );
      setActiveStep(3); // Success step
      // Reset form after success
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setActiveStep(0);
      }, 5000);
    } catch (error) {
      setError("Failed to send the message. Please try again later.");
      console.error("Contact form error:", error);
    } finally {
      setSending(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && (!name || !email || !phone)) {
      setError("Please fill in all personal information fields.");
      return;
    }
    if (activeStep === 1 && (!subject || !message)) {
      setError("Please fill in subject and message.");
      return;
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return name && email && phone;
      case 1:
        return subject && message;
      default:
        return true;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 }, mt: 6 }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: "bold",
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Get In Touch With Us
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Have questions about our properties or services? We&apos;re here to
          help and guide you through your real estate journey.
        </Typography>
      </Box>

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Contact Information Section */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              borderRadius: 3,
              height: "100%",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            {/* Company Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Image
                  src={logo}
                  alt="A.A AJIBEST LAND VENDORS LIMITED Logo"
                  width={140}
                  height={140}
                  style={{ borderRadius: "12px", boxShadow: theme.shadows[4] }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                A.A AJIBEST LAND VENDORS LIMITED
              </Typography>
              <Chip
                label="Trusted Land Vendors Since 2010"
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Your trusted partner in real estate and land acquisition
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Contact Information Grid */}
            <Grid container spacing={2}>
              {contactInfo.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        width: 40,
                        height: 40,
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color="primary.main"
                        gutterBottom
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.4,
                          ...(item.link && {
                            color: "primary.main",
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }),
                        }}
                        component={item.link ? "a" : "div"}
                        href={item.link}
                      >
                        {item.content}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Social Links */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                gutterBottom
                color="primary.main"
              >
                Follow Us On Social Media
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: alpha(social.color, 0.1),
                      color: social.color,
                      "&:hover": {
                        bgcolor: alpha(social.color, 0.2),
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form Section */}
        <Grid item xs={12} lg={7}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              background: "white",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 50,
                    height: 50,
                  }}
                >
                  <ContactMail />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Contact Form
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete the form below and we&apos;ll respond promptly
                  </Typography>
                </Box>
              </Box>

              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Alerts */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              {success && activeStep === 3 && (
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {success}
                </Alert>
              )}

              {/* Step 1: Personal Information */}
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="name">Full Name *</InputLabel>
                        <OutlinedInput
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          label="Full Name *"
                          startAdornment={
                            <Person color="action" sx={{ mr: 1 }} />
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="email">Email Address *</InputLabel>
                        <OutlinedInput
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          label="Email Address *"
                          startAdornment={
                            <Email color="action" sx={{ mr: 1 }} />
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="phone">Phone Number *</InputLabel>
                        <OutlinedInput
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          label="Phone Number *"
                          startAdornment={
                            <Phone color="action" sx={{ mr: 1 }} />
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Stack>
              )}

              {/* Step 2: Message Details */}
              {activeStep === 1 && (
                <Stack spacing={3}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    Message Details
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="subject">Subject *</InputLabel>
                    <OutlinedInput
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      label="Subject *"
                      placeholder="What is this regarding?"
                    />
                  </FormControl>
                  <TextField
                    label="Message *"
                    multiline
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="Please describe your inquiry in detail..."
                    helperText={`${message.length}/1000 characters`}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Stack>
              )}

              {/* Step 3: Review & Send */}
              {activeStep === 2 && (
                <Stack spacing={3}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    Review Your Information
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Subject
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {subject}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Message Preview
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {message.length > 150
                            ? `${message.substring(0, 150)}...`
                            : message}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              )}

              {/* Step 4: Success */}
              {activeStep === 3 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircle
                    sx={{
                      fontSize: 64,
                      color: theme.palette.success.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" gutterBottom color="success.main">
                    Message Sent Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Thank you for contacting us. We&apos;ll get back to you
                    within 24 hours.
                  </Typography>
                </Box>
              )}

              {/* Navigation Buttons */}
              {activeStep < 3 && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 4 }}
                >
                  <Button
                    onClick={
                      activeStep === 0
                        ? () => window.history.back()
                        : handleBack
                    }
                    variant="outlined"
                    disabled={sending}
                    fullWidth={isMobile}
                  >
                    {activeStep === 0 ? "Cancel" : "Back"}
                  </Button>

                  {activeStep < 2 ? (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={!isStepValid(activeStep)}
                      fullWidth={isMobile}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSend}
                      variant="contained"
                      disabled={sending}
                      startIcon={sending ? <LoadingSpinner /> : <Send />}
                      fullWidth={isMobile}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                        },
                      }}
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                  )}
                </Stack>
              )}

              {activeStep === 3 && (
                <Button
                  onClick={() => setActiveStep(0)}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Send Another Message
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Contact Footer */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: { xs: 3, md: 4 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          color="primary.main"
        >
          Prefer Direct Contact?
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            variant="contained"
            startIcon={<Phone />}
            href="tel:+1234567890"
            sx={{ borderRadius: 2 }}
          >
            Call Now
          </Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            href="mailto:emailaddress@gmail.com"
            sx={{ borderRadius: 2 }}
          >
            Email Directly
          </Button>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            href="https://wa.me/+2348162552901"
            sx={{
              borderRadius: 2,
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#1da851" },
            }}
          >
            WhatsApp
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Contactus;

"use client";
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
  IconButton,
  Chip,
} from "@mui/material";
import Image from "next/image";
import logo from "../../../public/ajibestlogo.png";
import axios from "axios";
import {
  Send,
  Phone,
  Email,
  LocationOn,
  Business,
  SupportAgent,
  CheckCircle,
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import LoadingSpinner from "../../components/generalcomponents/loadingSpinner";

const SupportTab: React.FC = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      setSuccess(
        "Your message has been sent successfully. We'll get back to you within 24 hours."
      );
      setMessage("");
      setSubject("");
    } catch (error) {
      setError("Failed to send the message. Please try again later.");
      console.error("Support message error:", error);
    } finally {
      setSending(false);
    }
  };

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
  ];

  const socialLinks = [
    { icon: <WhatsApp />, label: "WhatsApp", color: "#25D366" },
    { icon: <Facebook />, label: "Facebook", color: "#1877F2" },
    { icon: <Twitter />, label: "Twitter", color: "#1DA1F2" },
    { icon: <LinkedIn />, label: "LinkedIn", color: "#0077B5" },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            fontWeight: "bold",
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <SupportAgent color="primary" /> Customer Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We&apos;re here to help! Get in touch with our support team
        </Typography>
      </Box>

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Contact Information Section */}
        <Grid size={{ xs: 12, lg: 5 }}>
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
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Company Header */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={logo}
                  alt="A.A AJIBEST LAND VENDORS LIMITED Logo"
                  width={120}
                  height={120}
                  style={{ borderRadius: "8px" }}
                />
              </Box>
              <Typography
                variant="h6"
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
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Contact Information */}
            <Stack spacing={3}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-line",
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
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Social Links */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: alpha(social.color, 0.1),
                      color: social.color,
                      "&:hover": { bgcolor: alpha(social.color, 0.2) },
                    }}
                    size="small"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>

            {/* Support Stats */}
            <Box sx={{ mt: "auto", pt: 3 }}>
              <Grid container spacing={2} textAlign="center">
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    24/7
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Support
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    1h
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg Response
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    99%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Satisfaction
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form Section */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              height: "100%",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Send color="primary" /> Send us a Message
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill out the form below and our team will get back to you as
                soon as possible.
              </Typography>

              {/* User Info Display */}
              {session && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {session.user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.user?.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}

              {/* Alerts */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {success}
                </Alert>
              )}

              {/* Contact Form */}
              <Stack spacing={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="subject">Subject *</InputLabel>
                  <OutlinedInput
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    label="Subject *"
                    placeholder="Brief description of your issue"
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
                  placeholder="Please describe your issue or question in detail..."
                  helperText={`${message.length}/1000 characters`}
                  inputProps={{ maxLength: 1000 }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSend}
                  disabled={sending || !subject || !message}
                  startIcon={sending ? <LoadingSpinner /> : <Send />}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    },
                  }}
                >
                  {sending ? "Sending Message..." : "Send Message"}
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                >
                  By submitting this form, you agree to our privacy policy. We
                  typically respond within 1-2 business hours.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions Footer */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          background: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Need Immediate Assistance?
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            startIcon={<Phone />}
            href="tel:+1234567890"
            sx={{ borderRadius: 2 }}
          >
            Call Now
          </Button>
          <Button
            variant="outlined"
            startIcon={<Email />}
            href="mailto:emailaddress@gmail.com"
            sx={{ borderRadius: 2 }}
          >
            Email Directly
          </Button>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            sx={{
              borderRadius: 2,
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#1da851" },
            }}
          >
            WhatsApp Chat
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SupportTab;

// pages/privacy.tsx
"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth="lg"
      sx={{
        pt: { xs: 16, md: 20 },
        pb: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "2.5rem", md: "3rem" },
              mb: 2,
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            At [Your Company], we are committed to protecting your personal
            information and your right to privacy.
          </Typography>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Content Sections */}
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {/* Section 1 */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              1. Information We Collect
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              We collect personal information that you voluntarily provide to us
              when you register on the website, express an interest in obtaining
              information about us or our products and services, when you
              participate in activities on the website, or otherwise contact us.
            </Typography>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 2 */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              2. How We Use Your Information
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              We use personal information collected via our website for a
              variety of business purposes described below. We process your
              personal information for these purposes in reliance on our
              legitimate business interests.
            </Typography>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Section 3 */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              3. Sharing Your Information
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              We may process or share your data that we hold based on the
              following legal basis: consent, legitimate interests, performance
              of a contract, legal obligations, and vital interests.
            </Typography>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Additional Sections - Add more as needed */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              4. Data Security
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process. However, please also remember that we
              cannot guarantee that the internet itself is 100% secure.
            </Typography>
          </Box>

          <Divider sx={{ mb: 6 }} />

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              5. Your Rights
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              You have the right to access, update, or delete your personal
              information. You also have the right to withdraw your consent at
              any time where we relied on your consent to process your personal
              information.
            </Typography>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Contact Information */}
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "medium",
                color: "text.primary",
                mb: 3,
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              If you have any questions about this Privacy Policy, please
              contact us at [Your Contact Information].
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: "medium",
                }}
              >
                Email: privacy@yourcompany.com
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: "medium",
                  mt: 1,
                }}
              >
                Phone: +1 (555) 123-4567
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Last Updated */}
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            pt: 4,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
            }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;

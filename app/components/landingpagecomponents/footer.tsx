"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaShieldAlt,
} from "react-icons/fa";
import { SiAppstore, SiGoogleplay } from "react-icons/si";
import logo from "../../../public/ajibestlogo.png";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
} from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <MuiLink component={Link} href="/">
                <Image
                  src={logo}
                  width={100}
                  height={100}
                  alt="Company Logo"
                  style={{ marginBottom: theme.spacing(1) }}
                />
              </MuiLink>

              <Typography variant="body2" gutterBottom>
                No. 12 Golden Plaza,
                <br />
                Opp. El-Kanemi College
                <br />
                Maiduguri, Borno State
              </Typography>

              <MuiLink
                href="mailto:support@ajibestlandvendors.com.ng"
                sx={{
                  color: "primary.main",
                  "&:hover": { textDecoration: "underline" },
                  mb: 1,
                }}
              >
                support@ajibestlandvendors.com.ng
              </MuiLink>

              <MuiLink
                href="tel:+2348012345678"
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                +234 801 234 5678
              </MuiLink>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SiAppstore />}
                  sx={{ fontSize: "0.7rem" }}
                >
                  App Store
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SiGoogleplay />}
                  sx={{ fontSize: "0.7rem" }}
                >
                  Google Play
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {["Contact Us", "FAQs", "Help Center", "Live Chat"].map(
                (item) => (
                  <li key={item}>
                    <MuiLink
                      component={Link}
                      href={
                        item === "Contact Us"
                          ? "/contact"
                          : item === "FAQs"
                            ? "/#faq"
                            : item === "Help Center"
                              ? "/help"
                              : "#"
                      }
                      sx={{
                        display: "block",
                        py: 0.5,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </MuiLink>
                  </li>
                ),
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                System Status
              </Typography>
              <Chip
                icon={<FaShieldAlt />}
                label="All Systems Operational"
                color="success"
                size="small"
              />
            </Box>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {["About Us", "How It Works", "Testimonials", "Careers"].map(
                (item) => (
                  <li key={item}>
                    <MuiLink
                      component={Link}
                      href={
                        item === "About Us"
                          ? "/about"
                          : item === "How It Works"
                            ? "/#howitworks"
                            : item === "Testimonials"
                              ? "/#testimonials"
                              : "/careers"
                      }
                      sx={{
                        display: "block",
                        py: 0.5,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </MuiLink>
                  </li>
                ),
              )}
            </Box>
          </Grid>

          {/* Legal & Compliance */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Legal & Compliance
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {[
                "Privacy Policy",
                "Terms of Service",
                "Legal Disclaimers",
                "Accessibility Statement",
              ].map((item) => (
                <li key={item}>
                  <MuiLink
                    component={Link}
                    href={
                      item === "Privacy Policy"
                        ? "/privacy"
                        : item === "Terms of Service"
                          ? "/terms"
                          : item === "Legal Disclaimers"
                            ? "/disclaimers"
                            : "/accessibility"
                    }
                    sx={{
                      display: "block",
                      py: 0.5,
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item}
                  </MuiLink>
                </li>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Trust Badge and Socials */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Stay Secure
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
              ].map((social, index) => (
                <MuiLink
                  key={index}
                  href={social.href}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {social.icon}
                </MuiLink>
              ))}
            </Box>

            <Box
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
              }}
            >
              <FaShieldAlt
                style={{ marginRight: 8, color: theme.palette.success.main }}
              />
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Secured by Advanced Encryption
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Compliance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A.A. Ajibest Land Vendors Ltd. is a registered real estate
              company. All transactions are protected by our comprehensive
              security protocols.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright and Developer Credit */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mb: isMobile ? 2 : 0 }}
          >
            © {currentYear} A.A. Ajibest Land Vendors Ltd. All rights reserved.
          </Typography>

          <Typography
            variant="caption"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            Designed and developed by{" "}
            <MuiLink
              href="https://triplemultipurposetechnology.com.ng"
              target="_blank"
              rel="noopener"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Triple Multipurpose Technology
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

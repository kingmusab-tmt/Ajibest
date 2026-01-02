// components/FAQPage.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import customerCare from "@/public/images/customer care.png";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/aapi/faqs");

        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }

        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  if (loading) {
    return (
      <Box
        id="faq"
        sx={{
          py: 8,
          px: { xs: 2, sm: 4 },
          backgroundColor: "primary.light",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        id="faq"
        sx={{
          py: 8,
          px: { xs: 2, sm: 4 },
          backgroundColor: "primary.light",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      id="faq"
      sx={{
        py: 8,
        px: { xs: 2, sm: 4 },
        backgroundColor: "primary.light",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "white",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 6 }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={faq._id}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius:
                      expanded === `panel${index}` ? "8px 8px 0 0" : "8px",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "grey.50" }}>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
                backgroundColor: "background.paper",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 300,
                  mb: 3,
                }}
              >
                <Image
                  src={customerCare}
                  alt="Customer Care"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                align="center"
              >
                Need More Help?
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Our customer care team is ready to assist you with any questions
                you may have about our properties and services.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQPage;

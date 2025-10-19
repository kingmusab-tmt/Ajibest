"use client";
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Gavel,
  Article,
  Description,
  ContactMail,
  Warning,
} from "@mui/icons-material";

const TermCondition: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Gavel sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h3" component="h1" fontWeight="bold">
            Terms and Conditions
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opastate: 0.9 }}>
          Welcome to{" "}
          <Box component="span" fontWeight="bold">
            A.A. Ajibest Land Vendors Ltd!
          </Box>{" "}
          These terms and conditions outline the rules and regulations for the
          use of our website and Services.
        </Typography>
      </Paper>

      {/* Introduction Section */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Article color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h2" fontWeight="600">
            1. Introduction
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use{" "}
          <Box component="span" fontWeight="bold" color="primary.main">
            A.A. Ajibest Land Vendors Ltd!
          </Box>{" "}
          if you do not agree to all of the terms and conditions stated on this
          page.
        </Typography>
      </Paper>

      {/* License Section */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Description color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h2" fontWeight="600">
            2. License
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Unless otherwise stated,{" "}
          <Box component="span" fontWeight="bold" color="primary.main">
            A.A. Ajibest Land Vendors Ltd!
          </Box>{" "}
          and/or its licensors own the intellectual property rights for all
          material on{" "}
          <Box component="span" fontWeight="bold" color="primary.main">
            A.A. Ajibest Land Vendors Ltd!
          </Box>
          . All intellectual property rights are reserved.
        </Typography>
      </Paper>

      {/* Farm/Plot Purchase Terms */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Warning color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h2" fontWeight="600">
            3. Farm/Plot of Lands Purchase Terms and Conditions
          </Typography>
        </Box>

        <List sx={{ width: "100%" }}>
          {[
            "The PARTIES agreed that at the beginning of the Contract, the PURCHASER shall inspect the PLOT(S) subject of transaction physically.",
            "The PARTIES further agreed that mode of payment is subject to negotiation by the PARTIES, but SHALL be put in writing.",
            "The PURCHASER shall contact the VENDOR/COMPANY in the event where he may fail to make the monthly payment of the PLOT(S) earlier before the end of every month.",
            "That where the PURCHASER on HIS own volition failed to informed/contact and give reasonable account of his failure to make payment of the PLOT(S) for a period of 2 month, the VENDOR/COMPANY is at liberty to terminate the contract and refund the PURCHASER the amount paid on the PLOT(S) in the manner which the PURCHASER made the payment of the PLOT(S) and the PURCHASER would FORFIET 10% of the total amount as administrative charges.",
            "The VENDOR/COMPANY shall issue the PURCHASER receipt acknowledging the monthly installmental payments, upon receipt of such payment at the end of every month until the whole consideration herein is liquidated.",
            "The PARTIES agreed that the VENDOR/COMPANY HEREBY sells, transfer and assigns all its TITLE, RIGHTS and INTEREST in and over the PLOT(S) only upon terms and conditions that may be imposed from time to time by the appropriate authorities to the BUYER and to hold same unto the BUYER.",
            "After successful Transaction the BUYER shall bring back all Installmental payment receipt and would be issue a single purchase Receipt as well as All the documents related to the Plot of Land by the VENDOR/COMPANY.",
            "That this TERMS and CONDITIONS is being read and translated to the PARTIES and their witnesses from English language to Hausa/Kanuri/Buyer's Language and vice visa which they understand same before affixing their signatures/thumb prints.",
            "I_________________________ have read and understdood the Terms and conditions stipulated above before signing this loan contract.",
          ].map((item, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ py: 1.5 }}>
              <Chip
                label={index + 1}
                color="primary"
                size="small"
                sx={{ mr: 2, mt: 0.5 }}
              />
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Contact Section */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <ContactMail color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="600">
            Questions?
          </Typography>
        </Box>
        <Typography variant="body1">
          If you have any questions about our Terms and Conditions, please
          contact us for more information.
        </Typography>
      </Paper>

      {/* Last Updated */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>
    </Container>
  );
};

export default TermCondition;

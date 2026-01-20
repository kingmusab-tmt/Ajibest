"use client";

import { Box, Typography, Button } from "@mui/material";
import QRCode from "react-qr-code";
import Image from "next/image";
import { IReceiptDetails } from "@/models/Receipt";

interface ReceiptViewProps {
  data: Omit<IReceiptDetails, "managerSignature">;
  id: string;
  isPublic?: boolean; // New prop to hide Print button if needed, or show specific badges
}

export default function ReceiptView({
  data,
  id,
  isPublic = false,
}: ReceiptViewProps) {
  // ... [PASTE THE ENTIRE RECEIPT VIEW CODE HERE FROM THE PREVIOUS RESPONSE] ...
  // Parsing Sale Agreement Date (Helper logic)
  const saDate = new Date(data.saleAgreementDate || new Date());
  const saDay = saDate.getDate();
  const saMonth = saDate.toLocaleString("default", { month: "long" });
  const saYear = saDate.getFullYear();
  // Update the return statement slightly to handle the "Verified" Badge if public

  // Styles...
  const styles = {
    // ... same styles ...
    container: {
      border: "4px solid #0033cc",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
      color: "#0033cc",
      fontFamily: "Times New Roman, serif",
      position: "relative" as const,
      // backgroundImage: "url(/ajibestlogo.png)",
      // backgroundPosition: "center center",
      // backgroundRepeat: "no-repeat",
      // backgroundSize: "60%",
      // opacity: 1,
    },
    headerBlue: {
      color: "#0033cc",
      fontWeight: "900",
      textAlign: "center" as const,
      textTransform: "uppercase" as const,
    },
    label: {
      color: "#0033cc",
      fontWeight: "bold",
      marginRight: "5px",
      whiteSpace: "nowrap" as const,
    },
    line: {
      borderBottom: "1px solid #0033cc",
      flexGrow: 1,
      paddingLeft: "10px",
      color: "#000",
      fontWeight: "700",
      fontSize: "1.1rem",
    },
    row: { display: "flex", alignItems: "flex-end", marginBottom: "8px" },
    checkbox: {
      display: "inline-flex",
      alignItems: "center",
      marginRight: "15px",
    },
  };

  const VerificationURL = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify/${id}`;

  return (
    <Box>
      {/* PUBLIC VERIFICATION BADGE */}
      {isPublic && (
        <Box
          sx={{
            textAlign: "center",
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: "1px solid #2e7d32",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          GENUINE VERIFIED RECEIPT
        </Box>
      )}

      <Box
        sx={{
          ...styles.container,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url(/ajibestlogo.png)",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "60%",
            opacity: 0.15,
            pointerEvents: "none",
            zIndex: 0,
          },
          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
        id="printable-receipt"
      >
        {/* Company Name */}
        <Typography variant="h4" sx={styles.headerBlue}>
          A.A AJIBEST LAND VENDORS LIMITED
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ color: "red", mb: 1, fontStyle: "italic", fontSize: "1.2rem" }}
        >
          Property, Estate Developer, Contract and General Merchant
        </Typography>
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          {/* Left: RC and Address */}
          <Box sx={{ fontSize: "0.75rem", color: "#0033cc", flex: 1 }}>
            <Typography
              sx={{ fontWeight: "bold", color: "red", fontSize: "0.8rem" }}
            >
              RC 7354094
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Head Office:
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}>
              No. 12A Golden Plaza,
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}>
              Opp. El-Kanemi College of Islamic Theology,
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}>
              Maiduguri, Borno State
            </Typography>
          </Box>

          {/* Center: Logo */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Image
              src="/ajibestlogo.png"
              alt="Ajibest Logo"
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Right: Phone Numbers */}
          <Box
            sx={{
              fontSize: "1rem",
              color: "red",
              flex: 1,
              textAlign: "right",
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Tel No.
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
              08030741535
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
              09044446096
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
              08058232156
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: "red", fontWeight: "bold", my: 2 }}
        >
          OFFICIAL RECEIPT
        </Typography>

        {/* Date & Receipt No */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" width="45%">
            <span style={styles.label}>Date:</span>
            <span style={styles.line}>{data.date}</span>
          </Box>
          <Box display="flex" width="45%">
            <span style={styles.label}>Receipt No:</span>
            <span style={styles.line}>{id.substring(0, 8)}</span>
          </Box>
        </Box>

        {/* Main Fields */}
        <div style={styles.row}>
          <span style={styles.label}>Received From:</span>
          <span style={styles.line}>{data.receivedFrom}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Address:</span>
          <span style={styles.line}>{data.payerAddress}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>The Sum of:</span>
          <span style={styles.line}>{data.amountWords}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Naira Only (₦):</span>
          <span style={styles.line}>
            {data.amount?.toLocaleString("en-US")}
          </span>
        </div>

        {/* Being Payment For Checkboxes */}
        <div style={styles.row}>
          <span style={styles.label}>Being Payment For:</span>
          {(["House", "Land", "Farm", "Shop"] as const).map((item) => (
            <span key={item} style={styles.checkbox}>
              [ {data.paymentFor === item ? "✓" : " "} ] {item}
            </span>
          ))}
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Address/location:</span>
          <span style={styles.line}>{data.propertyAddress}</span>
        </div>

        <Box display="flex" mb={1} alignItems="flex-end">
          <span style={styles.label}>Plot No:</span>
          <span
            style={{
              ...styles.line,
              flexGrow: 0,
              width: "150px",
              marginRight: "20px",
            }}
          >
            {data.plotNo}
          </span>

          <span style={styles.label}>Method:</span>
          {(["Pay Once", "Installment"] as const).map((item) => (
            <span key={item} style={styles.checkbox}>
              [ {data.paymentMethod === item ? "✓" : " "} ] {item}
            </span>
          ))}
        </Box>

        <div style={styles.row}>
          <span style={styles.label}>Mode of Payment:</span>
          {(["Cash", "Bank Transfer", "Pos Card"] as const).map((item) => (
            <span key={item} style={styles.checkbox}>
              [ {data.paymentMode === item ? "✓" : " "} ] {item}
            </span>
          ))}
        </div>

        {/* Acknowledgment Section */}
        <Box sx={{ mt: 3, p: 1, border: "1px dashed #0033cc" }}>
          <Typography
            variant="h6"
            sx={{ ...styles.label, textDecoration: "underline", mb: 1 }}
          >
            Acknowledgment
          </Typography>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.8, fontSize: "0.9rem", color: "#000" }}
          >
            This Receipt is given Pursuant To The Sale Agreement Dated
            <span
              style={{
                borderBottom: "1px solid blue",
                padding: "0 10px",
                fontWeight: "bold",
              }}
            >
              {" "}
              {saDay}{" "}
            </span>
            Day of
            <span
              style={{
                borderBottom: "1px solid blue",
                padding: "0 10px",
                fontWeight: "bold",
              }}
            >
              {" "}
              {saMonth}{" "}
            </span>
            20
            <span
              style={{
                borderBottom: "1px solid blue",
                padding: "0 10px",
                fontWeight: "bold",
              }}
            >
              {" "}
              {saYear.toString().slice(-2)}{" "}
            </span>
            Between A.A Ajibest Land Vendors Ltd And The Buyer Named Above. All
            Payments Are Subject to the Terms and Warranties Contained In The
            Signed Sale Agreement.
          </Typography>
        </Box>

        {/* Footer Signatures & QR */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          mt={5}
        >
          <Box textAlign="center" width="30%">
            <div
              style={{
                borderBottom: "2px dotted #0033cc",
                marginBottom: "5px",
              }}
            ></div>
            <Typography variant="button" sx={{ fontWeight: "bold" }}>
              Manager's Sign
            </Typography>
          </Box>

          <Box textAlign="center">
            <QRCode
              value={VerificationURL}
              size={80}
              style={{ height: "auto", maxWidth: "100%", width: "80px" }}
              viewBox={`0 0 256 256`}
            />
          </Box>

          <Box textAlign="center" width="30%">
            <div
              style={{
                borderBottom: "2px dotted #0033cc",
                marginBottom: "5px",
              }}
            ></div>
            <Typography variant="button" sx={{ fontWeight: "bold" }}>
              Customer's Sign
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* <Box
        mt={3}
        display="flex"
        justifyContent="center"
        sx={{ "@media print": { display: "none" } }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.print()}
        >
          Print Receipt
        </Button>
      </Box> */}
    </Box>
  );
}

"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import QRCode from "react-qr-code";
import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";
import { IReceiptDetails, IReceipt } from "@/models/Receipt";
import html2pdf from "html2pdf.js";

// Global print styles
const printStyles = `
  @media print {
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    
    /* Hide all admin UI */
    [role="banner"] { display: none !important; }
    nav { display: none !important; }
    aside { display: none !important; }
    .MuiAppBar-root { display: none !important; }
    .MuiDrawer-root { display: none !important; }
    .print-navigation { display: none !important; }
    .print-button-container { display: none !important; }
    .print-activation-form { display: none !important; }
    
    /* Show receipt */
    .print-container {
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Receipt container */
    #receipt-print-container {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 0 !important;
      padding: 10mm !important;
      margin: 0 !important;
      width: 100% !important;
    }
    
    /* Individual receipt - A4 size */
    #printable-receipt {
      width: 180mm !important;
      height: auto !important;
      max-height: 297mm !important;
      margin: 0 !important;
      padding: 10mm !important;
      box-sizing: border-box !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    @page {
      size: A4 portrait;
      margin: 0;
      padding: 0;
    }
  }
`;

// Form Data Helper Type
type FormData = Omit<IReceiptDetails, "managerSignature">;

export default function AdminReceiptPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [receiptData, setReceiptData] = useState<IReceipt | null>(null);

  // Initial Form State matching the Schema
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    receivedFrom: "",
    payerAddress: "",
    amount: 0,
    amountWords: "",
    paymentFor: "Land",
    propertyAddress: "",
    plotNo: "",
    paymentMethod: "Pay Once",
    paymentMode: "Bank Transfer",
    saleAgreementDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const res = await axios.get<{ success: boolean; data: IReceipt }>(
        `/api/receipt/${id}`,
      );
      setReceiptData(res.data.data);
      if (res.data.data.status === "ACTIVE") {
        setFormData(res.data.data.details);
      }
    } catch (error) {
      console.error("Error fetching receipt", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put<{ success: boolean; data: IReceipt }>(
        `/api/receipt/${id}`,
        formData,
      );
      setReceiptData(res.data.data);
    } catch (error) {
      alert("Error activating receipt");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAndGeneratePDF = async () => {
    const element = document.getElementById("printable-receipt");
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `Receipt-${id.substring(0, 8)}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        format: "a4",
        orientation: "portrait" as const,
        compress: true,
      },
    };

    // Convert element to canvas first
    const canvas = await html2pdf()
      .set({ html2canvas: { scale: 2, useCORS: true } })
      .from(element)
      .toCanvas()
      .get("canvas");

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Create PDF and add first page
    const pdf = await html2pdf().set(opt).from(element).toPdf().get("pdf");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Account for margins
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Clear the first page and add image
    pdf.deletePage(1);
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 10, 10, pdfWidth, pdfHeight);

    // Add second page with same content
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 10, 10, pdfWidth, pdfHeight);

    pdf.save(`Receipt-${id.substring(0, 8)}.pdf`);
  };

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  if (!receiptData)
    return (
      <Typography p={4} color="error">
        Invalid Receipt ID
      </Typography>
    );

  return (
    <>
      <style>{printStyles}</style>
      <Box
        className="print-navigation"
        sx={{ display: { xs: "block", md: "flex" } }}
      >
        <Container
          maxWidth="md"
          sx={{ py: 4 }}
          className="print-activation-form"
        >
          {receiptData.status === "INACTIVE" ? (
            <ActivationForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              id={id}
            />
          ) : null}
        </Container>
      </Box>
      <Box
        className="print-container"
        sx={{ display: receiptData.status === "ACTIVE" ? "block" : "none" }}
      >
        {/* Single Print Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            "@media print": { display: "none !important" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrintAndGeneratePDF}
          >
            Generate & Download PDF
          </Button>
        </Box>

        {/* Receipt Grid */}
        <Box
          id="receipt-print-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
            padding: "10mm",
            maxWidth: "180mm",
            margin: "0 auto",
            "@media print": {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 0,
              padding: "10mm",
              width: "100%",
              height: "100%",
              margin: 0,
            },
          }}
        >
          <ReceiptView data={formData} id={id} hidePrintButton={true} />
        </Box>
      </Box>
    </>
  );
}

// --- ACTIVATION FORM ---
interface FormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSubmit: (e: FormEvent) => void;
  id: string;
}

function ActivationForm({
  formData,
  setFormData,
  handleSubmit,
  id,
}: FormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Admin Activation Panel
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Receipt ID: {id}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Section 1: Basic Info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Receipt Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Amount (₦)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="The Sum of (Words)"
              name="amountWords"
              value={formData.amountWords}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Received From"
              name="receivedFrom"
              value={formData.receivedFrom}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Payer Address"
              name="payerAddress"
              value={formData.payerAddress}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Section 2: Property Details */}
          <Grid size={{ xs: 12 }}>
            <Divider>Property Details</Divider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl>
              <FormLabel>Being Payment For:</FormLabel>
              <RadioGroup
                row
                name="paymentFor"
                value={formData.paymentFor}
                onChange={handleChange}
              >
                {(["House", "Land", "Farm", "Shop"] as const).map((opt) => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Address/Location (Property)"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Plot No"
              name="plotNo"
              value={formData.plotNo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl>
              <FormLabel>Method:</FormLabel>
              <RadioGroup
                row
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                {(["Pay Once", "Installment"] as const).map((opt) => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Section 3: Payment & Agreement */}
          <Grid size={{ xs: 12 }}>
            <Divider>Payment & Agreement</Divider>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl>
              <FormLabel>Mode of Payment:</FormLabel>
              <RadioGroup
                row
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                {(["Cash", "Bank Transfer", "Pos Card"] as const).map((opt) => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Sale Agreement Date"
              type="date"
              name="saleAgreementDate"
              value={formData.saleAgreementDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2, height: 50 }}
            >
              ACTIVATE RECEIPT
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

// --- RECEIPT VIEW (The Digital Twin) ---
function ReceiptView({
  data,
  id,
  hidePrintButton,
}: {
  data: FormData;
  id: string;
  hidePrintButton?: boolean;
}) {
  // Parsing Sale Agreement Date
  const saDate = new Date(data.saleAgreementDate);
  const saDay = saDate.getDate(); // 1-31
  const saMonth = saDate.toLocaleString("default", { month: "long" }); // January
  const saYear = saDate.getFullYear(); // 2026

  const styles = {
    container: {
      border: "4px solid #0033cc",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
      color: "#0033cc",
      fontFamily: "Times New Roman, serif",
      position: "relative" as const,
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
      fontWeight: "700", // Increased from '500' to bold
      fontSize: "1.1rem", // Added font size matches label
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
        <Typography
          variant="h4"
          sx={{
            ...styles.headerBlue,
          }}
        >
          A.A AJIBEST LAND VENDORS LTD
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
                fontSize: "1rem",
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
                fontSize: "1rem",
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

      {/* Print Button - Only show if not hiding */}
      {!hidePrintButton && (
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
          className="print-button-container"
          sx={{ "@media print": { display: "none !important" } }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </Box>
      )}
    </Box>
  );
}

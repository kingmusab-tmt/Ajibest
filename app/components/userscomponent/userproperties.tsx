// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Alert,
//   Container,
//   Card,
//   CardContent,
//   CardActions,
//   Typography,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   TextField,
//   Grid,
//   Box,
//   Chip,
//   Stack,
//   Paper,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   alpha,
//   IconButton,
//   Tabs,
//   Tab,
//   Avatar,
//   LinearProgress,
// } from "@mui/material";
// import { PaystackButton } from "react-paystack";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import PropertyDetail from "./propertydetail";
// import {
//   Home,
//   CalendarToday,
//   Payments,
//   Visibility,
//   CheckCircle,
//   Schedule,
//   AccountBalanceWallet,
//   ArrowForward,
//   Favorite,
//   Share,
//   LocationOn,
//   SquareFoot,
//   Bed,
//   Bathroom,
//   Cancel,
// } from "@mui/icons-material";
// import LoadingSpinner from "../generalcomponents/loadingSpinner";

// interface paymentHistory {
//   paymentDate: Date;
//   nextPaymentDate: Date;
//   amount: number;
//   propertyPrice: number;
//   totalPaymentMade: number;
//   remainingBalance: number;
//   paymentCompleted: boolean;
// }

// interface Property {
//   title: string;
//   propertyId: string;
//   paymentDate?: Date;
//   propertyPrice: number;
//   propertyType: "House" | "Land" | "Farm";
//   paymentMethod: "installment" | "payOnce";
//   listingPurpose: "For Sale" | "For Renting";
//   paymentHistory?: paymentHistory[];
//   description: string;
//   location: string;
//   initialPayment: number;
//   bedrooms: number;
//   amenities: string[];
//   purchased: boolean;
//   rented: boolean;
//   utilities: string[];
//   image?: string;
// }

// interface UserProperties {
//   propertyPurOrRented: Property[];
//   propertyUnderPayment: Property[];
// }

// interface User {
//   propertyPurOrRented: Property[];
//   propertyUnderPayment: Property[];
// }

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`property-tabpanel-${index}`}
//       aria-labelledby={`property-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: { xs: 1, md: 2 } }}>{children}</Box>}
//     </div>
//   );
// }

// const MyProperty = () => {
//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [userProperties, setUserProperties] = useState<UserProperties | null>(
//     null
//   );
//   const [userData, setUserData] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [amountError, setAmountError] = useState<string | null>(null);
//   const [open, setOpen] = useState<boolean>(false);
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(
//     null
//   );
//   const [amount, setAmount] = useState<number | null>(null);
//   const [detailOpen, setDetailOpen] = useState<boolean>(false);
//   const [detailProperty, setDetailProperty] = useState<Property | null>(null);
//   const [tabValue, setTabValue] = useState(0);
//   const { data: session } = useSession();

//   useEffect(() => {
//     const fetchUserProperties = async () => {
//       try {
//         const response = await axios.get("/api/users/userproperty", {
//           headers: {
//             "Cache-Control": "no-store",
//           },
//         });

//         setUserData(response.data.user);
//       } catch (error) {
//         setError("Error fetching user properties");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProperties();
//   }, []);

//   useEffect(() => {
//     if (userData) {
//       setUserProperties({
//         propertyPurOrRented: userData.propertyPurOrRented,
//         propertyUnderPayment: userData.propertyUnderPayment,
//       });
//     }
//   }, [userData]);

//   const handleSuccess = async (reference: any, property: Property) => {
//     try {
//       const data = {
//         reference,
//         propertyId: property.propertyId,
//         amount: Number(amount?.toFixed(0)),
//         email: session?.user.email,
//         propertyType: property.propertyType,
//         paymentMethod: property.paymentMethod,
//         listingPurpose: property.listingPurpose,
//       };
//       const response = await axios.post("/api/verifyTransaction", data);
//       if (response.status === 200) {
//         router.push("/userprofile");
//       } else {
//         setError("Transaction Failed. Please try again.");
//       }
//     } catch (error) {
//       setError(`Error processing payment: ${error}`);
//     }
//   };

//   const config = (property: Property, amount: number) => ({
//     email: session?.user.email as string,
//     amount: amount * 100,
//     publicKey: "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73",
//   });

//   const componentProps = (property: Property, amount: number) => ({
//     ...config(property, amount),
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Name",
//           variable_name: "name",
//           value: session?.user.name,
//         },
//       ],
//     },
//     text: "Pay Now",
//     onSuccess: ({ reference }) => handleSuccess(reference, property),
//     onClose: () => console.log("Payment closed"),
//   });

//   const handleClickOpen = (property: Property) => {
//     setSelectedProperty(property);
//     setAmountError(null);
//     if (property.paymentHistory && property.paymentHistory.length > 0) {
//       setAmount(
//         property.paymentHistory[property.paymentHistory.length - 1].amount || 0
//       );
//     } else {
//       setAmount(0);
//     }
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedProperty(null);
//     setAmount(null);
//     setAmountError(null);
//   };

//   const handleDetailOpen = (property: Property) => {
//     setDetailProperty(property);
//     setDetailOpen(true);
//   };

//   const handleDetailClose = () => {
//     setDetailOpen(false);
//     setDetailProperty(null);
//   };

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//   });

//   const formatDate = (date: Date | string) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getPaymentProgress = (property: Property) => {
//     if (!property.paymentHistory || property.paymentHistory.length === 0)
//       return 0;
//     const lastPayment =
//       property.paymentHistory[property.paymentHistory.length - 1];
//     const totalPaid = lastPayment.totalPaymentMade;
//     const totalPrice = lastPayment.propertyPrice;
//     return totalPrice > 0 ? (totalPaid / totalPrice) * 100 : 0;
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert
//           severity="error"
//           sx={{
//             mb: 3,
//             borderRadius: 2,
//             fontSize: { xs: "0.9rem", md: "1rem" },
//           }}
//         >
//           {error}
//         </Alert>
//         <Button
//           onClick={() => window.location.reload()}
//           variant="contained"
//           size={isMobile ? "medium" : "large"}
//         >
//           Try Again
//         </Button>
//       </Container>
//     );
//   }

//   const ownedProperties = userProperties?.propertyPurOrRented || [];
//   const paymentProperties = userProperties?.propertyUnderPayment || [];

//   return (
//     <Container maxWidth="lg">
//       {/* Header */}
//       <Box sx={{ mb: { xs: 3, md: 4 } }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           sx={{
//             fontSize: { xs: "1.75rem", md: "2.125rem" },
//             fontWeight: "bold",
//           }}
//         >
//           My Properties
//         </Typography>
//         <Typography
//           variant="body1"
//           color="text.secondary"
//           sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
//         >
//           Manage your property portfolio and payments
//         </Typography>
//       </Box>

//       {/* Tabs */}
//       <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           variant={isMobile ? "fullWidth" : "standard"}
//           sx={{
//             borderBottom: `1px solid ${theme.palette.divider}`,
//             "& .MuiTab-root": {
//               py: 1.5,
//               minHeight: 48,
//               fontSize: { xs: "0.8rem", md: "0.875rem" },
//             },
//           }}
//         >
//           <Tab
//             icon={<CheckCircle sx={{ fontSize: { xs: 20, md: 24 } }} />}
//             label={`Owned (${ownedProperties.length})`}
//           />
//           <Tab
//             icon={<Schedule sx={{ fontSize: { xs: 20, md: 24 } }} />}
//             label={`In Progress (${paymentProperties.length})`}
//           />
//           <Tab
//             icon={<Cancel sx={{ fontSize: { xs: 20, md: 24 } }} />}
//             label={`Withdrawn (${paymentProperties.length})`}
//           />
//         </Tabs>

//         {/* Owned Properties Tab */}
//         <TabPanel value={tabValue} index={0}>
//           {ownedProperties.length === 0 ? (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: { xs: 4, md: 6 },
//                 textAlign: "center",
//                 background: alpha(theme.palette.background.paper, 0.5),
//                 borderRadius: 3,
//               }}
//             >
//               <CheckCircle
//                 sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
//               />
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
//               >
//                 No owned properties yet
//               </Typography>
//               <Typography
//                 variant="body1"
//                 color="text.secondary"
//                 sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
//               >
//                 Complete your first purchase to see it here!
//               </Typography>
//               {/* <Button
//                 href="/properties"
//                 variant="contained"
//                 size={isMobile ? "medium" : "large"}
//                 startIcon={<Home />}
//               >
//                 Browse Properties
//               </Button> */}
//             </Paper>
//           ) : (
//             <Grid container spacing={isMobile ? 2 : 3}>
//               {ownedProperties.map((property) => (
//                 <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
//                   <Card
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         transform: "translateY(-4px)",
//                         boxShadow: theme.shadows[8],
//                       },
//                       borderRadius: 2,
//                       overflow: "hidden",
//                     }}
//                   >
//                     {/* Property Image */}
//                     <Box sx={{ position: "relative", height: 160 }}>
//                       <Avatar
//                         variant="rounded"
//                         src={property.image}
//                         sx={{
//                           width: "100%",
//                           height: "100%",
//                           bgcolor: theme.palette.primary.light,
//                         }}
//                       >
//                         <Home sx={{ fontSize: 48 }} />
//                       </Avatar>
//                       <Chip
//                         label="Fully Owned"
//                         color="success"
//                         size="small"
//                         sx={{
//                           position: "absolute",
//                           top: 12,
//                           left: 12,
//                           fontWeight: "bold",
//                         }}
//                       />
//                     </Box>

//                     <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
//                       <Typography
//                         variant="h6"
//                         component="h2"
//                         sx={{
//                           fontSize: { xs: "1.1rem", md: "1.25rem" },
//                           fontWeight: "bold",
//                           mb: 1,
//                         }}
//                       >
//                         {property.title}
//                       </Typography>

//                       <Box
//                         sx={{ display: "flex", alignItems: "center", mb: 2 }}
//                       >
//                         <LocationOn
//                           color="action"
//                           sx={{ fontSize: 18, mr: 0.5 }}
//                         />
//                         <Typography variant="body2" color="text.secondary">
//                           {property.location}
//                         </Typography>
//                       </Box>

//                       <Stack
//                         direction="row"
//                         spacing={1}
//                         sx={{ mb: 2 }}
//                         flexWrap="wrap"
//                         useFlexGap
//                       >
//                         <Chip
//                           label={property.propertyType}
//                           size="small"
//                           color="primary"
//                           variant="outlined"
//                         />
//                         <Chip
//                           icon={<SquareFoot sx={{ fontSize: 16 }} />}
//                           label={
//                             property.bedrooms
//                               ? `${property.bedrooms} Bed`
//                               : "Land"
//                           }
//                           size="small"
//                           variant="outlined"
//                         />
//                       </Stack>

//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           color="primary"
//                           sx={{
//                             fontSize: { xs: "1.1rem", md: "1.25rem" },
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {formatter.format(property.propertyPrice)}
//                         </Typography>
//                         <Chip
//                           icon={<CheckCircle />}
//                           label="Paid"
//                           color="success"
//                           size="small"
//                         />
//                       </Box>

//                       {property.paymentDate && (
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           sx={{ mt: 1, display: "block" }}
//                         >
//                           Purchased: {formatDate(property.paymentDate)}
//                         </Typography>
//                       )}
//                     </CardContent>

//                     <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
//                       <Button
//                         size={isMobile ? "small" : "medium"}
//                         variant="outlined"
//                         fullWidth
//                         startIcon={<Visibility />}
//                         onClick={() => handleDetailOpen(property)}
//                         sx={{ borderRadius: 2 }}
//                       >
//                         View Details
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </TabPanel>

//         {/* Properties Under Payment Tab */}
//         <TabPanel value={tabValue} index={1}>
//           {paymentProperties.length === 0 ? (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: { xs: 4, md: 6 },
//                 textAlign: "center",
//                 background: alpha(theme.palette.background.paper, 0.5),
//                 borderRadius: 3,
//               }}
//             >
//               <Schedule
//                 sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
//               />
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
//               >
//                 No ongoing payments
//               </Typography>
//               <Typography
//                 variant="body1"
//                 color="text.secondary"
//                 sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
//               >
//                 Start a new property purchase to see it here!
//               </Typography>
//               {/* <Button
//                 href="/properties"
//                 variant="contained"
//                 size={isMobile ? "medium" : "large"}
//                 startIcon={<Home />}
//               >
//                 Browse Properties
//               </Button> */}
//             </Paper>
//           ) : (
//             <Grid container spacing={isMobile ? 2 : 3}>
//               {paymentProperties.map((property) => {
//                 const progress = getPaymentProgress(property);
//                 const lastPayment =
//                   property.paymentHistory?.[property.paymentHistory.length - 1];

//                 return (
//                   <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
//                     <Card
//                       sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           transform: "translateY(-4px)",
//                           boxShadow: theme.shadows[8],
//                         },
//                         borderRadius: 2,
//                         overflow: "hidden",
//                       }}
//                     >
//                       {/* Property Image */}
//                       <Box sx={{ position: "relative", height: 160 }}>
//                         <Avatar
//                           variant="rounded"
//                           src={property.image}
//                           sx={{
//                             width: "100%",
//                             height: "100%",
//                             bgcolor: theme.palette.warning.light,
//                           }}
//                         >
//                           <Home sx={{ fontSize: 48 }} />
//                         </Avatar>
//                         <Chip
//                           label="In Progress"
//                           color="warning"
//                           size="small"
//                           sx={{
//                             position: "absolute",
//                             top: 12,
//                             left: 12,
//                             fontWeight: "bold",
//                           }}
//                         />
//                       </Box>

//                       <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
//                         <Typography
//                           variant="h6"
//                           component="h2"
//                           sx={{
//                             fontSize: { xs: "1.1rem", md: "1.25rem" },
//                             fontWeight: "bold",
//                             mb: 1,
//                           }}
//                         >
//                           {property.title}
//                         </Typography>

//                         {/* Progress Bar */}
//                         <Box sx={{ mb: 2 }}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               mb: 1,
//                             }}
//                           >
//                             <Typography variant="body2" color="text.secondary">
//                               Payment Progress
//                             </Typography>
//                             <Typography variant="body2" fontWeight="bold">
//                               {progress.toFixed(0)}%
//                             </Typography>
//                           </Box>
//                           <LinearProgress
//                             variant="determinate"
//                             value={progress}
//                             sx={{
//                               height: 8,
//                               borderRadius: 4,
//                               backgroundColor: alpha(
//                                 theme.palette.warning.main,
//                                 0.2
//                               ),
//                               "& .MuiLinearProgress-bar": {
//                                 backgroundColor: theme.palette.warning.main,
//                               },
//                             }}
//                           />
//                         </Box>

//                         {/* Payment Info */}
//                         <Stack spacing={1} sx={{ mb: 2 }}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                             }}
//                           >
//                             <Typography variant="body2">Remaining:</Typography>
//                             <Typography variant="body2" fontWeight="bold">
//                               {lastPayment
//                                 ? formatter.format(lastPayment.remainingBalance)
//                                 : "N/A"}
//                             </Typography>
//                           </Box>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                             }}
//                           >
//                             <Typography variant="body2">
//                               Next Payment:
//                             </Typography>
//                             <Typography variant="body2">
//                               {lastPayment
//                                 ? formatDate(lastPayment.nextPaymentDate)
//                                 : "N/A"}
//                             </Typography>
//                           </Box>
//                         </Stack>

//                         <Typography
//                           variant="h6"
//                           color="primary"
//                           sx={{
//                             fontSize: { xs: "1.1rem", md: "1.25rem" },
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {lastPayment
//                             ? formatter.format(lastPayment.amount)
//                             : "N/A"}
//                         </Typography>
//                       </CardContent>

//                       <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0, gap: 1 }}>
//                         <Button
//                           size={isMobile ? "small" : "medium"}
//                           variant="contained"
//                           fullWidth
//                           startIcon={<Payments />}
//                           onClick={() => handleClickOpen(property)}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Pay Now
//                         </Button>
//                         <Button
//                           size={isMobile ? "small" : "medium"}
//                           variant="outlined"
//                           fullWidth
//                           startIcon={<Visibility />}
//                           onClick={() => handleDetailOpen(property)}
//                           sx={{ borderRadius: 2 }}
//                         >
//                           Details
//                         </Button>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           )}
//         </TabPanel>
//       </Paper>

//       {/* Payment Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2 },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             fontSize: { xs: "1.2rem", md: "1.5rem" },
//             fontWeight: "bold",
//             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//             color: "white",
//           }}
//         >
//           <Payments sx={{ mr: 1, verticalAlign: "middle" }} />
//           Make Payment
//         </DialogTitle>
//         <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
//           <DialogContentText
//             sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
//           >
//             Enter the amount you want to pay for{" "}
//             <strong>{selectedProperty?.title}</strong>
//           </DialogContentText>

//           <TextField
//             autoFocus
//             margin="dense"
//             label="Amount (₦)"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={amount || ""}
//             onChange={(e) => {
//               const value = Number(e.target.value);
//               setAmount(value);
//               setAmountError(null);
//             }}
//             error={!!amountError}
//             helperText={amountError}
//             sx={{ mb: 2 }}
//           />

//           {selectedProperty && (
//             <Paper
//               elevation={0}
//               sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}
//             >
//               <Typography variant="body2" fontWeight="bold" gutterBottom>
//                 Payment Summary:
//               </Typography>
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Property:</Typography>
//                 <Typography variant="body2">
//                   {selectedProperty.title}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Type:</Typography>
//                 <Typography variant="body2">
//                   {selectedProperty.propertyType}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Minimum Payment:</Typography>
//                 <Typography variant="body2">
//                   {formatter.format(selectedProperty.initialPayment)}
//                 </Typography>
//               </Box>
//             </Paper>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
//           <Button
//             onClick={handleClose}
//             variant="outlined"
//             size={isMobile ? "medium" : "large"}
//             sx={{ borderRadius: 2 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               const property = userProperties?.propertyUnderPayment.find(
//                 (property) =>
//                   property.propertyId === selectedProperty?.propertyId
//               );
//               if (property && amount! < property.initialPayment) {
//                 setAmountError("Amount cannot be less than initial payment");
//               } else {
//                 setAmountError(null);
//                 (
//                   document.querySelector(".paystack-button") as HTMLElement
//                 )?.click();
//               }
//             }}
//             variant="contained"
//             size={isMobile ? "medium" : "large"}
//             startIcon={<Payments />}
//             sx={{ borderRadius: 2 }}
//           >
//             Proceed to Pay
//           </Button>
//           <Box sx={{ display: "none" }}>
//             <PaystackButton
//               className="paystack-button"
//               {...componentProps(selectedProperty!, amount!)}
//             />
//           </Box>
//         </DialogActions>
//       </Dialog>

//       <PropertyDetail
//         open={detailOpen}
//         handleClose={handleDetailClose}
//         property={detailProperty}
//       />
//     </Container>
//   );
// };

// export default MyProperty;
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Box,
  Chip,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { PaystackButton } from "react-paystack";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PropertyDetail from "./propertydetail";
import {
  Home,
  CalendarToday,
  Payments,
  Visibility,
  CheckCircle,
  Schedule,
  AccountBalanceWallet,
  ArrowForward,
  Favorite,
  Share,
  LocationOn,
  SquareFoot,
  Bed,
  Bathroom,
  Cancel,
  ExitToApp,
} from "@mui/icons-material";
import LoadingSpinner from "../generalcomponents/loadingSpinner";

interface paymentHistory {
  paymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
}

interface Property {
  title: string;
  propertyId: string;
  paymentDate?: Date;
  propertyPrice: number;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  listingPurpose: "For Sale" | "For Renting";
  paymentHistory?: paymentHistory[];
  description: string;
  location: string;
  initialPayment: number;
  bedrooms: number;
  amenities: string[];
  purchased: boolean;
  rented: boolean;
  utilities: string[];
  image?: string;
  isWithdrawn?: boolean;
  isWithdrawnApproved?: boolean;
}

interface PropertyWithdrawn extends Property {
  withdrawnDate: Date;
  isWithdrawnApproved: boolean;
  withdrawalReason?: string;
}

interface UserProperties {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
  propertyWithdrawn: PropertyWithdrawn[];
}

interface User {
  propertyPurOrRented: Property[];
  propertyUnderPayment: Property[];
  propertyWithdrawn: PropertyWithdrawn[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, md: 2 } }}>{children}</Box>}
    </div>
  );
}

const MyProperty = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [userProperties, setUserProperties] = useState<UserProperties | null>(
    null
  );
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);
  const [withdrawProperty, setWithdrawProperty] = useState<Property | null>(
    null
  );
  const [withdrawalReason, setWithdrawalReason] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await axios.get("/api/users/userproperty", {
          headers: {
            "Cache-Control": "no-store",
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        setError("Error fetching user properties");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserProperties({
        propertyPurOrRented: userData.propertyPurOrRented,
        propertyUnderPayment: userData.propertyUnderPayment,
        propertyWithdrawn: userData.propertyWithdrawn || [],
      });
    }
  }, [userData]);

  const handleSuccess = async (reference: any, property: Property) => {
    try {
      const data = {
        reference,
        propertyId: property.propertyId,
        amount: Number(amount?.toFixed(0)),
        email: session?.user.email,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
      };
      const response = await axios.post("/api/verifyTransaction", data);
      if (response.status === 200) {
        router.push("/userprofile");
      } else {
        setError("Transaction Failed. Please try again.");
      }
    } catch (error) {
      setError(`Error processing payment: ${error}`);
    }
  };

  const handleWithdrawContract = async () => {
    if (!withdrawProperty || !withdrawalReason.trim()) {
      setError("Please provide a reason for withdrawal");
      return;
    }

    try {
      const response = await axios.post("/api/withdraw-contract", {
        propertyId: withdrawProperty.propertyId,
        userEmail: session?.user.email,
        withdrawalReason: withdrawalReason.trim(),
      });

      if (response.status === 200) {
        setSuccessMessage(
          "Withdrawal request submitted successfully. Waiting for admin approval."
        );
        setWithdrawOpen(false);
        setWithdrawalReason("");
        setWithdrawProperty(null);

        // Refresh user data
        const userResponse = await axios.get("/api/users/userproperty", {
          headers: {
            "Cache-Control": "no-store",
          },
        });
        setUserData(userResponse.data.user);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Error withdrawing contract");
    }
  };

  const config = (property: Property, amount: number) => ({
    email: session?.user.email as string,
    amount: amount * 100,
    publicKey: "pk_test_f6a081e9fa564f361f3a9a63de5cd4dc789cfc73",
  });

  const componentProps = (property: Property, amount: number) => ({
    ...config(property, amount),
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: session?.user.name,
        },
      ],
    },
    text: "Pay Now",
    onSuccess: ({ reference }) => handleSuccess(reference, property),
    onClose: () => console.log("Payment closed"),
  });

  const handleClickOpen = (property: Property) => {
    setSelectedProperty(property);
    setAmountError(null);
    if (property.paymentHistory && property.paymentHistory.length > 0) {
      setAmount(
        property.paymentHistory[property.paymentHistory.length - 1].amount || 0
      );
    } else {
      setAmount(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProperty(null);
    setAmount(null);
    setAmountError(null);
  };

  const handleDetailOpen = (property: Property) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailProperty(null);
  };

  const handleWithdrawOpen = (property: Property) => {
    setWithdrawProperty(property);
    setWithdrawalReason("");
    setWithdrawOpen(true);
  };

  const handleWithdrawClose = () => {
    setWithdrawOpen(false);
    setWithdrawProperty(null);
    setWithdrawalReason("");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentProgress = (property: Property) => {
    if (!property.paymentHistory || property.paymentHistory.length === 0)
      return 0;
    const lastPayment =
      property.paymentHistory[property.paymentHistory.length - 1];
    const totalPaid = lastPayment.totalPaymentMade;
    const totalPrice = lastPayment.propertyPrice;
    return totalPrice > 0 ? (totalPaid / totalPrice) * 100 : 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {error}
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          size={isMobile ? "medium" : "large"}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  const ownedProperties = userProperties?.propertyPurOrRented || [];
  const paymentProperties = userProperties?.propertyUnderPayment || [];
  const withdrawnProperties = userProperties?.propertyWithdrawn || [];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            fontWeight: "bold",
          }}
        >
          My Properties
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
        >
          Manage your property portfolio and payments
        </Typography>
      </Box>

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            "& .MuiTab-root": {
              py: 1.5,
              minHeight: 48,
              fontSize: { xs: "0.8rem", md: "0.875rem" },
            },
          }}
        >
          <Tab
            icon={<CheckCircle sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label={`Owned (${ownedProperties.length})`}
          />
          <Tab
            icon={<Schedule sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label={`In Progress (${paymentProperties.length})`}
          />
          <Tab
            icon={<Cancel sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label={`Withdrawn (${withdrawnProperties.length})`}
          />
        </Tabs>

        {/* Owned Properties Tab */}
        <TabPanel value={tabValue} index={0}>
          {ownedProperties.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
              }}
            >
              <CheckCircle
                sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
              >
                No owned properties yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Complete your first purchase to see it here!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {ownedProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {/* Property Image */}
                    <Box sx={{ position: "relative", height: 160 }}>
                      <Avatar
                        variant="rounded"
                        src={property.image}
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: theme.palette.primary.light,
                        }}
                      >
                        <Home sx={{ fontSize: 48 }} />
                      </Avatar>
                      <Chip
                        label="Fully Owned"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                          fontWeight: "bold",
                          mb: 1,
                        }}
                      >
                        {property.title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <LocationOn
                          color="action"
                          sx={{ fontSize: 18, mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {property.location}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 2 }}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip
                          label={property.propertyType}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<SquareFoot sx={{ fontSize: 16 }} />}
                          label={
                            property.bedrooms
                              ? `${property.bedrooms} Bed`
                              : "Land"
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {formatter.format(property.propertyPrice)}
                        </Typography>
                        <Chip
                          icon={<CheckCircle />}
                          label="Paid"
                          color="success"
                          size="small"
                        />
                      </Box>

                      {property.paymentDate && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Purchased: {formatDate(property.paymentDate)}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                      <Button
                        size={isMobile ? "small" : "medium"}
                        variant="outlined"
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => handleDetailOpen(property)}
                        sx={{ borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Properties Under Payment Tab */}
        <TabPanel value={tabValue} index={1}>
          {paymentProperties.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
              }}
            >
              <Schedule
                sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
              >
                No ongoing payments
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Start a new property purchase to see it here!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {paymentProperties.map((property) => {
                const progress = getPaymentProgress(property);
                const lastPayment =
                  property.paymentHistory?.[property.paymentHistory.length - 1];

                return (
                  <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[8],
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* Property Image */}
                      <Box sx={{ position: "relative", height: 160 }}>
                        <Avatar
                          variant="rounded"
                          src={property.image}
                          sx={{
                            width: "100%",
                            height: "100%",
                            bgcolor: theme.palette.warning.light,
                          }}
                        >
                          <Home sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Chip
                          label="In Progress"
                          color="warning"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: "bold",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          {property.title}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Payment Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(
                                theme.palette.warning.main,
                                0.2
                              ),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: theme.palette.warning.main,
                              },
                            }}
                          />
                        </Box>

                        {/* Payment Info */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">Remaining:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {lastPayment
                                ? formatter.format(lastPayment.remainingBalance)
                                : "N/A"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Next Payment:
                            </Typography>
                            <Typography variant="body2">
                              {lastPayment
                                ? formatDate(lastPayment.nextPaymentDate)
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {lastPayment
                            ? formatter.format(lastPayment.amount)
                            : "N/A"}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0, gap: 1 }}>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="contained"
                          fullWidth
                          startIcon={<Payments />}
                          onClick={() => handleClickOpen(property)}
                          sx={{ borderRadius: 2 }}
                        >
                          Pay Now
                        </Button>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="outlined"
                          color="error"
                          fullWidth
                          startIcon={<ExitToApp />}
                          onClick={() => handleWithdrawOpen(property)}
                          sx={{ borderRadius: 2 }}
                        >
                          Withdraw
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>

        {/* Withdrawn Properties Tab */}
        <TabPanel value={tabValue} index={2}>
          {withdrawnProperties.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
              }}
            >
              <Cancel
                sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
              />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}
              >
                No withdrawn properties
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Properties you withdraw will appear here after admin approval
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {withdrawnProperties.map((property) => {
                const progress = getPaymentProgress(property);
                const lastPayment =
                  property.paymentHistory?.[property.paymentHistory.length - 1];

                return (
                  <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[8],
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* Property Image */}
                      <Box sx={{ position: "relative", height: 160 }}>
                        <Avatar
                          variant="rounded"
                          src={property.image}
                          sx={{
                            width: "100%",
                            height: "100%",
                            bgcolor: theme.palette.error.light,
                          }}
                        >
                          <Home sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Chip
                          label={
                            property.isWithdrawnApproved
                              ? "Withdrawn"
                              : "Pending Approval"
                          }
                          color={
                            property.isWithdrawnApproved ? "error" : "warning"
                          }
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: "bold",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          {property.title}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <LocationOn
                            color="action"
                            sx={{ fontSize: 18, mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {property.location}
                          </Typography>
                        </Box>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Payment Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.2
                              ),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: theme.palette.error.main,
                              },
                            }}
                          />
                        </Box>

                        {/* Withdrawal Info */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">Status:</Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                property.isWithdrawnApproved
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {property.isWithdrawnApproved
                                ? "Approved"
                                : "Pending Approval"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Withdrawn Date:
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(property.withdrawnDate)}
                            </Typography>
                          </Box>
                          {property.withdrawalReason && (
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                Reason:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {property.withdrawalReason}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {lastPayment
                            ? formatter.format(lastPayment.totalPaymentMade)
                            : "N/A"}{" "}
                          Paid
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="outlined"
                          fullWidth
                          startIcon={<Visibility />}
                          onClick={() => handleDetailOpen(property)}
                          sx={{ borderRadius: 2 }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Payment Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Payments sx={{ mr: 1, verticalAlign: "middle" }} />
          Make Payment
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <DialogContentText
            sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Enter the amount you want to pay for{" "}
            <strong>{selectedProperty?.title}</strong>
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Amount (₦)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount || ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAmount(value);
              setAmountError(null);
            }}
            error={!!amountError}
            helperText={amountError}
            sx={{ mb: 2 }}
          />

          {selectedProperty && (
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Payment Summary:
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Property:</Typography>
                <Typography variant="body2">
                  {selectedProperty.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Type:</Typography>
                <Typography variant="body2">
                  {selectedProperty.propertyType}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Minimum Payment:</Typography>
                <Typography variant="body2">
                  {formatter.format(selectedProperty.initialPayment)}
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const property = userProperties?.propertyUnderPayment.find(
                (property) =>
                  property.propertyId === selectedProperty?.propertyId
              );
              if (property && amount! < property.initialPayment) {
                setAmountError("Amount cannot be less than initial payment");
              } else {
                setAmountError(null);
                (
                  document.querySelector(".paystack-button") as HTMLElement
                )?.click();
              }
            }}
            variant="contained"
            size={isMobile ? "medium" : "large"}
            startIcon={<Payments />}
            sx={{ borderRadius: 2 }}
          >
            Proceed to Pay
          </Button>
          <Box sx={{ display: "none" }}>
            <PaystackButton
              className="paystack-button"
              {...componentProps(selectedProperty!, amount!)}
            />
          </Box>
        </DialogActions>
      </Dialog>

      {/* Withdraw Contract Dialog */}
      <Dialog
        open={withdrawOpen}
        onClose={handleWithdrawClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: "white",
          }}
        >
          <ExitToApp sx={{ mr: 1, verticalAlign: "middle" }} />
          Withdraw Contract
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <DialogContentText
            sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Are you sure you want to withdraw from{" "}
            <strong>{withdrawProperty?.title}</strong>? This action will
            initiate a refund process and requires admin approval.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Reason for withdrawal"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={withdrawalReason}
            onChange={(e) => setWithdrawalReason(e.target.value)}
            placeholder="Please provide a reason for withdrawing from this contract..."
            sx={{ mb: 2 }}
          />

          {withdrawProperty && (
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Important Notes:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Your withdrawal request will be reviewed by admin
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Refunds may take 3-5 business days after approval
              </Typography>
              <Typography variant="body2">
                • You cannot make further payments once withdrawal is requested
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
          <Button
            onClick={handleWithdrawClose}
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdrawContract}
            variant="contained"
            color="error"
            size={isMobile ? "medium" : "large"}
            startIcon={<ExitToApp />}
            disabled={!withdrawalReason.trim()}
            sx={{ borderRadius: 2 }}
          >
            Confirm Withdrawal
          </Button>
        </DialogActions>
      </Dialog>

      <PropertyDetail
        open={detailOpen}
        handleClose={handleDetailClose}
        property={detailProperty}
      />
    </Container>
  );
};

export default MyProperty;

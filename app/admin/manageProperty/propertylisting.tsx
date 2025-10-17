// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
//   Paper,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   alpha,
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   Stack,
//   Avatar,
//   Fab,
// } from "@mui/material";
// import {
//   CheckCircle,
//   Edit,
//   MoreVert,
//   Delete,
//   LocationOn,
//   Home,
//   AttachMoney,
//   SquareFoot,
//   Add,
//   FilterList,
//   Refresh,
//   ShoppingCart,
//   House,
//   Landscape,
//   Agriculture,
//   LocalPostOffice,
//   Shop,
//   Business,
// } from "@mui/icons-material";
// import { Property } from "@/constants/interface";
// import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

// export default function Properties() {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
//     null
//   );
//   const [selectedPropertyForEdit, setSelectedPropertyForEdit] =
//     useState<Property | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [filter, setFilter] = useState({
//     rented: null as boolean | null,
//     purchased: null as boolean | null,
//     location: "",
//     size: "",
//     propertyType: "",
//   });

//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/property/getproperties", {
//         headers: {
//           "Cache-Control": "no-cache, no-store",
//         },
//       });
//       setProperties(response.data.data);
//     } catch (err) {
//       setError("Failed to load properties");
//       console.error("Error fetching properties:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredProperties = properties
//     .filter((property) => {
//       const isRented =
//         filter.rented === null ||
//         (filter.rented === true &&
//           property.rented === true &&
//           property.listingPurpose === "For Renting") ||
//         (filter.rented === false &&
//           property.rented === false &&
//           property.listingPurpose === "For Renting");
//       const isPurchased =
//         filter.purchased === null ||
//         (filter.purchased === true &&
//           property.purchased === true &&
//           property.listingPurpose === "For Sale") ||
//         (filter.purchased === false &&
//           property.purchased === false &&
//           property.listingPurpose === "For Sale");
//       const isLocation =
//         filter.location === "" ||
//         property.location.toLowerCase().includes(filter.location.toLowerCase());
//       const isSize =
//         filter.size === "" ||
//         (filter.size === "quarter" && property.size === "Quarter Plot") ||
//         (filter.size === "half" && property.size === "Half Plot") ||
//         (filter.size === "full" && property.size === "Full Plot");
//       const isType =
//         filter.propertyType === "" ||
//         property.propertyType
//           .toLowerCase()
//           .includes(filter.propertyType.toLowerCase());

//       return isRented && isPurchased && isLocation && isSize && isType;
//     })
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );

//   const rentedPurchasedCount = properties.filter(
//     (p) =>
//       (p.listingPurpose === "For Renting" && p.rented) ||
//       (p.listingPurpose === "For Sale" && p.purchased)
//   ).length;

//   const onRentSaleCount = properties.filter(
//     (p) =>
//       (p.listingPurpose === "For Renting" && !p.rented) ||
//       (p.listingPurpose === "For Sale" && !p.purchased)
//   ).length;

//   const totalPropertiesCount = properties.length;

//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//   });

//   const handleMenuOpen = (
//     event: React.MouseEvent<HTMLElement>,
//     propertyId: string
//   ) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedPropertyId(propertyId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedPropertyId(null);
//   };

//   const handleEdit = (propertyId: string) => {
//     const property = properties.find((p) => p._id === propertyId);
//     setSelectedPropertyForEdit(property || null);
//     setShowForm(true);
//     handleMenuClose();
//   };

//   const handleDeleteClick = (propertyId: string) => {
//     setPropertyToDelete(propertyId);
//     setDeleteDialogOpen(true);
//     handleMenuClose();
//   };

//   const handleDeleteConfirm = async () => {
//     if (propertyToDelete) {
//       try {
//         await axios.delete(
//           `/api/property/deleteproperty?id=${propertyToDelete}`
//         );
//         setProperties(
//           properties.filter((property) => property._id !== propertyToDelete)
//         );
//         setDeleteDialogOpen(false);
//         setPropertyToDelete(null);
//       } catch (error) {
//         setError("Failed to delete property");
//         console.error("Error deleting property:", error);
//       }
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setPropertyToDelete(null);
//   };

//   const getPropertyIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case "house":
//         return <House />;
//       case "land":
//         return <Landscape />;
//       case "farm":
//         return <Agriculture />;
//       case "commercial":
//         return <Business />;
//       case "office":
//         return <LocalPostOffice />;
//       case "shop":
//         return <Shop />;
//       default:
//         return <Home />;
//     }
//   };

//   const getStatusColor = (property: Property) => {
//     if (property.listingPurpose === "For Sale") {
//       return property.purchased ? "success" : "primary";
//     } else {
//       return property.rented ? "success" : "secondary";
//     }
//   };

//   const getStatusText = (property: Property) => {
//     if (property.listingPurpose === "For Sale") {
//       return property.purchased ? "Sold" : "For Sale";
//     } else {
//       return property.rented ? "Rented" : "For Rent";
//     }
//   };

//   const isUrl = (str: string) => {
//     if (typeof str !== "string") {
//       return false;
//     }
//     try {
//       new URL(str);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   if (loading) {
//     return (
//       <Container
//         maxWidth="lg"
//         sx={{
//           py: 4,
//           textAlign: "center",
//           minHeight: "60vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <LoadingSpinner />
//         <Typography
//           variant="h6"
//           sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
//         >
//           Loading Properties...
//         </Typography>
//       </Container>
//     );
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
//           action={
//             <Button color="inherit" size="small" onClick={fetchProperties}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container
//       maxWidth="lg"
//       // sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
//     >
//       {/* Header */}
//       <Box sx={{ mb: { xs: 3, md: 4 } }}>
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 fontSize: { xs: "1.75rem", md: "2.125rem" },
//                 fontWeight: "bold",
//                 mb: 1,
//               }}
//             >
//               Property Management
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Manage your property portfolio ({totalPropertiesCount} properties)
//             </Typography>
//           </Box>
//           {/* <Button
//             variant="contained"
//             startIcon={<Add />}
//             size={isMobile ? "medium" : "large"}
//             sx={{ borderRadius: 2 }}
//           >
//             Add Property
//           </Button> */}
//         </Stack>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.success.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <CheckCircle
//                 sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="success.main">
//                 {rentedPurchasedCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Rented/Sold
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.primary.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <ShoppingCart
//                 sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="primary.main">
//                 {onRentSaleCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 On Rent/Sale
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.info.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <Home
//                 sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="info.main">
//                 {totalPropertiesCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total Properties
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.warning.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <FilterList
//                 sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="warning.main">
//                 {filteredProperties.length}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Filtered Results
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Filters */}
//       <Paper
//         elevation={1}
//         sx={{
//           p: { xs: 2, md: 3 },
//           mb: 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ display: "flex", alignItems: "center", gap: 1 }}
//         >
//           <FilterList /> Filters
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Rented Status</InputLabel>
//               <Select
//                 value={
//                   filter.rented === null ? "any" : filter.rented.toString()
//                 }
//                 label="Rented Status"
//                 onChange={(e) =>
//                   setFilter({
//                     ...filter,
//                     rented:
//                       e.target.value === "any"
//                         ? null
//                         : e.target.value === "true",
//                   })
//                 }
//               >
//                 <MenuItem value="any">Any</MenuItem>
//                 <MenuItem value="true">Rented</MenuItem>
//                 <MenuItem value="false">Not Rented</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Purchased Status</InputLabel>
//               <Select
//                 value={
//                   filter.purchased === null
//                     ? "any"
//                     : filter.purchased.toString()
//                 }
//                 label="Purchased Status"
//                 onChange={(e) =>
//                   setFilter({
//                     ...filter,
//                     purchased:
//                       e.target.value === "any"
//                         ? null
//                         : e.target.value === "true",
//                   })
//                 }
//               >
//                 <MenuItem value="any">Any</MenuItem>
//                 <MenuItem value="true">Purchased</MenuItem>
//                 <MenuItem value="false">Not Purchased</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               size={isMobile ? "small" : "medium"}
//               label="Location"
//               value={filter.location}
//               onChange={(e) =>
//                 setFilter({ ...filter, location: e.target.value })
//               }
//               placeholder="Search location..."
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Size</InputLabel>
//               <Select
//                 value={filter.size}
//                 label="Size"
//                 onChange={(e) => setFilter({ ...filter, size: e.target.value })}
//               >
//                 <MenuItem value="">Any Size</MenuItem>
//                 <MenuItem value="quarter">Quarter Plot</MenuItem>
//                 <MenuItem value="half">Half Plot</MenuItem>
//                 <MenuItem value="full">Full Plot</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Property Type</InputLabel>
//               <Select
//                 value={filter.propertyType}
//                 label="Property Type"
//                 onChange={(e) =>
//                   setFilter({ ...filter, propertyType: e.target.value })
//                 }
//               >
//                 <MenuItem value="">Any Type</MenuItem>
//                 <MenuItem value="house">House</MenuItem>
//                 <MenuItem value="land">Land</MenuItem>
//                 <MenuItem value="farm">Farm</MenuItem>
//                 <MenuItem value="commercial">Commercial</MenuItem>
//                 <MenuItem value="office">Office</MenuItem>
//                 <MenuItem value="shop">Shop</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<Refresh />}
//               onClick={() =>
//                 setFilter({
//                   rented: null,
//                   purchased: null,
//                   location: "",
//                   size: "",
//                   propertyType: "",
//                 })
//               }
//               size={isMobile ? "small" : "medium"}
//             >
//               Clear Filters
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Properties List */}
//       {filteredProperties.length === 0 ? (
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 4, md: 6 },
//             textAlign: "center",
//             background: alpha(theme.palette.background.paper, 0.5),
//             borderRadius: 3,
//           }}
//         >
//           <Home
//             sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
//           />
//           <Typography variant="h5" gutterBottom>
//             No properties found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//             {properties.length === 0
//               ? "You haven't added any properties yet."
//               : "No properties match your current filters."}
//           </Typography>
//           <Button variant="contained" startIcon={<Add />}>
//             Add Your First Property
//           </Button>
//         </Paper>
//       ) : (
//         <Grid container spacing={isMobile ? 2 : 3}>
//           {filteredProperties.map((property) => (
//             <Grid item xs={12} key={property._id}>
//               <Card
//                 sx={{
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-2px)",
//                     boxShadow: theme.shadows[8],
//                   },
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//                   <Stack
//                     direction={{ xs: "column", md: "row" }}
//                     spacing={2}
//                     alignItems={{ xs: "flex-start", md: "center" }}
//                   >
//                     {/* Property Image */}
//                     <Avatar
//                       variant="rounded"
//                       src={
//                         isUrl(property.image)
//                           ? property.image
//                           : `/uploads/${property.image}`
//                       }
//                       sx={{
//                         width: { xs: "100%", md: 120 },
//                         height: { xs: 200, md: 120 },
//                         bgcolor: theme.palette.primary.light,
//                       }}
//                     >
//                       {getPropertyIcon(property.propertyType)}
//                     </Avatar>

//                     {/* Property Details */}
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Stack
//                         direction={{ xs: "column", sm: "row" }}
//                         spacing={1}
//                         alignItems={{ xs: "flex-start", sm: "center" }}
//                         justifyContent="space-between"
//                         sx={{ mb: 1 }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             fontSize: { xs: "1.1rem", md: "1.25rem" },
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {property.title}
//                         </Typography>
//                         <Chip
//                           label={getStatusText(property)}
//                           color={getStatusColor(property)}
//                           size="small"
//                           variant="filled"
//                         />
//                       </Stack>

//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <LocationOn color="action" sx={{ fontSize: 20 }} />
//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                               noWrap
//                             >
//                               {property.location}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             {getPropertyIcon(property.propertyType)}
//                             <Typography variant="body2" color="text.secondary">
//                               {property.propertyType}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <SquareFoot color="action" sx={{ fontSize: 20 }} />
//                             <Typography variant="body2" color="text.secondary">
//                               {property.size}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <AttachMoney color="action" sx={{ fontSize: 20 }} />
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color="primary.main"
//                             >
//                               {formatter.format(Number(property.price))}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{ display: "flex", justifyContent: "flex-end" }}
//                           >
//                             <IconButton
//                               onClick={(e) => handleMenuOpen(e, property._id)}
//                               size={isMobile ? "small" : "medium"}
//                             >
//                               <MoreVert />
//                             </IconButton>
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Action Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           sx: { borderRadius: 2, minWidth: 120 },
//         }}
//       >
//         <MenuItem
//           onClick={() => selectedPropertyId && handleEdit(selectedPropertyId)}
//         >
//           <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             selectedPropertyId && handleDeleteClick(selectedPropertyId)
//           }
//         >
//           <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
//         </MenuItem>
//       </Menu>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleDeleteCancel}
//         PaperProps={{
//           sx: { borderRadius: 2 },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this property? This action cannot be
//             undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDeleteCancel} variant="outlined">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteConfirm}
//             variant="contained"
//             color="error"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Floating Action Button for Mobile */}
//       {isMobile && (
//         <Fab
//           color="primary"
//           aria-label="add property"
//           sx={{
//             position: "fixed",
//             bottom: 16,
//             right: 16,
//             zIndex: 1000,
//           }}
//         >
//           <Add />
//         </Fab>
//       )}
//     </Container>
//   );
// }
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
//   Paper,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   alpha,
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   Stack,
//   Avatar,
//   Fab,
//   DialogContentText,
// } from "@mui/material";
// import {
//   CheckCircle,
//   Edit,
//   MoreVert,
//   Delete,
//   LocationOn,
//   Home,
//   AttachMoney,
//   SquareFoot,
//   Add,
//   FilterList,
//   Refresh,
//   ShoppingCart,
//   House,
//   Landscape,
//   Agriculture,
//   LocalPostOffice,
//   Shop,
//   Business,
//   Close,
// } from "@mui/icons-material";
// import { Property } from "@/constants/interface";
// import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";
// import UpdateProperty from "./updateProperty";

// export default function Properties() {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
//     null
//   );
//   const [selectedPropertyForEdit, setSelectedPropertyForEdit] =
//     useState<Property | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [filter, setFilter] = useState({
//     rented: null as boolean | null,
//     purchased: null as boolean | null,
//     location: "",
//     size: "",
//     propertyType: "",
//   });

//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/property/getproperties", {
//         headers: {
//           "Cache-Control": "no-cache, no-store",
//         },
//       });
//       setProperties(response.data.data);
//     } catch (err) {
//       setError("Failed to load properties");
//       console.error("Error fetching properties:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredProperties = properties
//     .filter((property) => {
//       const isRented =
//         filter.rented === null ||
//         (filter.rented === true &&
//           property.rented === true &&
//           property.listingPurpose === "For Renting") ||
//         (filter.rented === false &&
//           property.rented === false &&
//           property.listingPurpose === "For Renting");
//       const isPurchased =
//         filter.purchased === null ||
//         (filter.purchased === true &&
//           property.purchased === true &&
//           property.listingPurpose === "For Sale") ||
//         (filter.purchased === false &&
//           property.purchased === false &&
//           property.listingPurpose === "For Sale");
//       const isLocation =
//         filter.location === "" ||
//         property.location.toLowerCase().includes(filter.location.toLowerCase());
//       const isSize =
//         filter.size === "" ||
//         (filter.size === "quarter" && property.size === "Quarter Plot") ||
//         (filter.size === "half" && property.size === "Half Plot") ||
//         (filter.size === "full" && property.size === "Full Plot");
//       const isType =
//         filter.propertyType === "" ||
//         property.propertyType
//           .toLowerCase()
//           .includes(filter.propertyType.toLowerCase());

//       return isRented && isPurchased && isLocation && isSize && isType;
//     })
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );

//   const rentedPurchasedCount = properties.filter(
//     (p) =>
//       (p.listingPurpose === "For Renting" && p.rented) ||
//       (p.listingPurpose === "For Sale" && p.purchased)
//   ).length;

//   const onRentSaleCount = properties.filter(
//     (p) =>
//       (p.listingPurpose === "For Renting" && !p.rented) ||
//       (p.listingPurpose === "For Sale" && !p.purchased)
//   ).length;

//   const totalPropertiesCount = properties.length;

//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//   });

//   const handleMenuOpen = (
//     event: React.MouseEvent<HTMLElement>,
//     propertyId: string
//   ) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedPropertyId(propertyId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedPropertyId(null);
//   };

//   const handleEdit = (propertyId: string) => {
//     const property = properties.find((p) => p._id === propertyId);
//     if (property) {
//       setSelectedPropertyForEdit(property);
//       setShowForm(true);
//     }
//     handleMenuClose();
//   };

//   const handleDeleteClick = (propertyId: string) => {
//     setPropertyToDelete(propertyId);
//     setDeleteDialogOpen(true);
//     handleMenuClose();
//   };

//   const handleDeleteConfirm = async () => {
//     if (propertyToDelete) {
//       try {
//         await axios.delete(
//           `/api/property/deleteproperty?id=${propertyToDelete}`
//         );
//         setProperties(
//           properties.filter((property) => property._id !== propertyToDelete)
//         );
//         setDeleteDialogOpen(false);
//         setPropertyToDelete(null);
//       } catch (error) {
//         setError("Failed to delete property");
//         console.error("Error deleting property:", error);
//       }
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setPropertyToDelete(null);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setSelectedPropertyForEdit(null);
//     // Refresh the properties list when the edit dialog is closed
//     fetchProperties();
//   };

//   const handleUpdateSuccess = () => {
//     // Refresh the properties list after successful update
//     fetchProperties();
//     handleFormClose();
//   };

//   const getPropertyIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case "house":
//         return <House />;
//       case "land":
//         return <Landscape />;
//       case "farm":
//         return <Agriculture />;
//       case "commercial":
//         return <Business />;
//       case "office":
//         return <LocalPostOffice />;
//       case "shop":
//         return <Shop />;
//       default:
//         return <Home />;
//     }
//   };

//   const getStatusColor = (property: Property) => {
//     if (property.listingPurpose === "For Sale") {
//       return property.purchased ? "success" : "primary";
//     } else {
//       return property.rented ? "success" : "secondary";
//     }
//   };

//   const getStatusText = (property: Property) => {
//     if (property.listingPurpose === "For Sale") {
//       return property.purchased ? "Sold" : "For Sale";
//     } else {
//       return property.rented ? "Rented" : "For Rent";
//     }
//   };

//   const isUrl = (str: string) => {
//     if (typeof str !== "string") {
//       return false;
//     }
//     try {
//       new URL(str);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   if (loading) {
//     return (
//       <Container
//         maxWidth="lg"
//         sx={{
//           py: 4,
//           textAlign: "center",
//           minHeight: "60vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <LoadingSpinner />
//         <Typography
//           variant="h6"
//           sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
//         >
//           Loading Properties...
//         </Typography>
//       </Container>
//     );
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
//           action={
//             <Button color="inherit" size="small" onClick={fetchProperties}>
//               Retry
//             </Button>
//           }
//         >
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container
//       maxWidth="lg"
//       // sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
//     >
//       {/* Header */}
//       <Box sx={{ mb: { xs: 3, md: 4 } }}>
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", sm: "center" }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 fontSize: { xs: "1.75rem", md: "2.125rem" },
//                 fontWeight: "bold",
//                 mb: 1,
//               }}
//             >
//               Property Management
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Manage your property portfolio ({totalPropertiesCount} properties)
//             </Typography>
//           </Box>
//         </Stack>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.success.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <CheckCircle
//                 sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="success.main">
//                 {rentedPurchasedCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Rented/Sold
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.primary.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <ShoppingCart
//                 sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="primary.main">
//                 {onRentSaleCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 On Rent/Sale
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.info.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <Home
//                 sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="info.main">
//                 {totalPropertiesCount}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total Properties
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card
//             elevation={2}
//             sx={{
//               background: `linear-gradient(135deg, ${alpha(
//                 theme.palette.warning.main,
//                 0.1
//               )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
//               border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
//               borderRadius: 2,
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", p: 3 }}>
//               <FilterList
//                 sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }}
//               />
//               <Typography variant="h4" fontWeight="bold" color="warning.main">
//                 {filteredProperties.length}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Filtered Results
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Filters */}
//       <Paper
//         elevation={1}
//         sx={{
//           p: { xs: 2, md: 3 },
//           mb: 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ display: "flex", alignItems: "center", gap: 1 }}
//         >
//           <FilterList /> Filters
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Rented Status</InputLabel>
//               <Select
//                 value={
//                   filter.rented === null ? "any" : filter.rented.toString()
//                 }
//                 label="Rented Status"
//                 onChange={(e) =>
//                   setFilter({
//                     ...filter,
//                     rented:
//                       e.target.value === "any"
//                         ? null
//                         : e.target.value === "true",
//                   })
//                 }
//               >
//                 <MenuItem value="any">Any</MenuItem>
//                 <MenuItem value="true">Rented</MenuItem>
//                 <MenuItem value="false">Not Rented</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Purchased Status</InputLabel>
//               <Select
//                 value={
//                   filter.purchased === null
//                     ? "any"
//                     : filter.purchased.toString()
//                 }
//                 label="Purchased Status"
//                 onChange={(e) =>
//                   setFilter({
//                     ...filter,
//                     purchased:
//                       e.target.value === "any"
//                         ? null
//                         : e.target.value === "true",
//                   })
//                 }
//               >
//                 <MenuItem value="any">Any</MenuItem>
//                 <MenuItem value="true">Purchased</MenuItem>
//                 <MenuItem value="false">Not Purchased</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               size={isMobile ? "small" : "medium"}
//               label="Location"
//               value={filter.location}
//               onChange={(e) =>
//                 setFilter({ ...filter, location: e.target.value })
//               }
//               placeholder="Search location..."
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Size</InputLabel>
//               <Select
//                 value={filter.size}
//                 label="Size"
//                 onChange={(e) => setFilter({ ...filter, size: e.target.value })}
//               >
//                 <MenuItem value="">Any Size</MenuItem>
//                 <MenuItem value="quarter">Quarter Plot</MenuItem>
//                 <MenuItem value="half">Half Plot</MenuItem>
//                 <MenuItem value="full">Full Plot</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth size={isMobile ? "small" : "medium"}>
//               <InputLabel>Property Type</InputLabel>
//               <Select
//                 value={filter.propertyType}
//                 label="Property Type"
//                 onChange={(e) =>
//                   setFilter({ ...filter, propertyType: e.target.value })
//                 }
//               >
//                 <MenuItem value="">Any Type</MenuItem>
//                 <MenuItem value="house">House</MenuItem>
//                 <MenuItem value="land">Land</MenuItem>
//                 <MenuItem value="farm">Farm</MenuItem>
//                 <MenuItem value="commercial">Commercial</MenuItem>
//                 <MenuItem value="office">Office</MenuItem>
//                 <MenuItem value="shop">Shop</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<Refresh />}
//               onClick={() =>
//                 setFilter({
//                   rented: null,
//                   purchased: null,
//                   location: "",
//                   size: "",
//                   propertyType: "",
//                 })
//               }
//               size={isMobile ? "small" : "medium"}
//             >
//               Clear Filters
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Properties List */}
//       {filteredProperties.length === 0 ? (
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 4, md: 6 },
//             textAlign: "center",
//             background: alpha(theme.palette.background.paper, 0.5),
//             borderRadius: 3,
//           }}
//         >
//           <Home
//             sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
//           />
//           <Typography variant="h5" gutterBottom>
//             No properties found
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//             {properties.length === 0
//               ? "You haven't added any properties yet."
//               : "No properties match your current filters."}
//           </Typography>
//           <Button variant="contained" startIcon={<Add />}>
//             Add Your First Property
//           </Button>
//         </Paper>
//       ) : (
//         <Grid container spacing={isMobile ? 2 : 3}>
//           {filteredProperties.map((property) => (
//             <Grid item xs={12} key={property._id}>
//               <Card
//                 sx={{
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     transform: "translateY(-2px)",
//                     boxShadow: theme.shadows[8],
//                   },
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//                   <Stack
//                     direction={{ xs: "column", md: "row" }}
//                     spacing={2}
//                     alignItems={{ xs: "flex-start", md: "center" }}
//                   >
//                     {/* Property Image */}
//                     <Avatar
//                       variant="rounded"
//                       src={
//                         isUrl(property.image)
//                           ? property.image
//                           : `/uploads/${property.image}`
//                       }
//                       sx={{
//                         width: { xs: "100%", md: 120 },
//                         height: { xs: 200, md: 120 },
//                         bgcolor: theme.palette.primary.light,
//                       }}
//                     >
//                       {getPropertyIcon(property.propertyType)}
//                     </Avatar>

//                     {/* Property Details */}
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Stack
//                         direction={{ xs: "column", sm: "row" }}
//                         spacing={1}
//                         alignItems={{ xs: "flex-start", sm: "center" }}
//                         justifyContent="space-between"
//                         sx={{ mb: 1 }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             fontSize: { xs: "1.1rem", md: "1.25rem" },
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {property.title}
//                         </Typography>
//                         <Chip
//                           label={getStatusText(property)}
//                           color={getStatusColor(property)}
//                           size="small"
//                           variant="filled"
//                         />
//                       </Stack>

//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <LocationOn color="action" sx={{ fontSize: 20 }} />
//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                               noWrap
//                             >
//                               {property.location}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             {getPropertyIcon(property.propertyType)}
//                             <Typography variant="body2" color="text.secondary">
//                               {property.propertyType}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <SquareFoot color="action" sx={{ fontSize: 20 }} />
//                             <Typography variant="body2" color="text.secondary">
//                               {property.size}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={3}>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <AttachMoney color="action" sx={{ fontSize: 20 }} />
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color="primary.main"
//                             >
//                               {formatter.format(Number(property.price))}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={2}>
//                           <Box
//                             sx={{ display: "flex", justifyContent: "flex-end" }}
//                           >
//                             <IconButton
//                               onClick={(e) => handleMenuOpen(e, property._id)}
//                               size={isMobile ? "small" : "medium"}
//                             >
//                               <MoreVert />
//                             </IconButton>
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Action Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           sx: { borderRadius: 2, minWidth: 120 },
//         }}
//       >
//         <MenuItem
//           onClick={() => selectedPropertyId && handleEdit(selectedPropertyId)}
//         >
//           <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
//         </MenuItem>
//         <MenuItem
//           onClick={() =>
//             selectedPropertyId && handleDeleteClick(selectedPropertyId)
//           }
//         >
//           <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
//         </MenuItem>
//       </Menu>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleDeleteCancel}
//         PaperProps={{
//           sx: { borderRadius: 2 },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this property? This action cannot be
//             undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDeleteCancel} variant="outlined">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteConfirm}
//             variant="contained"
//             color="error"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Property Dialog */}
//       <Dialog
//         open={showForm}
//         onClose={handleFormClose}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2 },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: theme.palette.primary.main,
//             color: "white",
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             Edit Property
//           </Typography>
//           <IconButton
//             onClick={handleFormClose}
//             sx={{ color: "white" }}
//             size="small"
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedPropertyForEdit && (
//             <UpdateProperty propertyId={selectedPropertyForEdit._id} />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Floating Action Button for Mobile */}
//       {isMobile && (
//         <Fab
//           color="primary"
//           aria-label="add property"
//           sx={{
//             position: "fixed",
//             bottom: 16,
//             right: 16,
//             zIndex: 1000,
//           }}
//         >
//           <Add />
//         </Fab>
//       )}
//     </Container>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Avatar,
  Fab,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Edit,
  MoreVert,
  Delete,
  LocationOn,
  Home,
  AttachMoney,
  SquareFoot,
  Add,
  FilterList,
  Refresh,
  ShoppingCart,
  House,
  Landscape,
  Agriculture,
  LocalPostOffice,
  Shop,
  Business,
  Close,
} from "@mui/icons-material";
import { Property } from "@/constants/interface";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";
import UpdateProperty from "./updateProperty";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] =
    useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const [filter, setFilter] = useState({
    rented: null as boolean | null,
    purchased: null as boolean | null,
    location: "",
    size: "",
    propertyType: "",
  });

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/property/getproperties", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });
      setProperties(response.data.data);
    } catch (err) {
      setError("Failed to load properties");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties
    .filter((property) => {
      const isRented =
        filter.rented === null ||
        (filter.rented === true &&
          property.rented === true &&
          property.listingPurpose === "For Renting") ||
        (filter.rented === false &&
          property.rented === false &&
          property.listingPurpose === "For Renting");
      const isPurchased =
        filter.purchased === null ||
        (filter.purchased === true &&
          property.purchased === true &&
          property.listingPurpose === "For Sale") ||
        (filter.purchased === false &&
          property.purchased === false &&
          property.listingPurpose === "For Sale");
      const isLocation =
        filter.location === "" ||
        property.location.toLowerCase().includes(filter.location.toLowerCase());
      const isSize =
        filter.size === "" ||
        (filter.size === "quarter" && property.size === "Quarter Plot") ||
        (filter.size === "half" && property.size === "Half Plot") ||
        (filter.size === "full" && property.size === "Full Plot");
      const isType =
        filter.propertyType === "" ||
        property.propertyType
          .toLowerCase()
          .includes(filter.propertyType.toLowerCase());

      return isRented && isPurchased && isLocation && isSize && isType;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const rentedPurchasedCount = properties.filter(
    (p) =>
      (p.listingPurpose === "For Renting" && p.rented) ||
      (p.listingPurpose === "For Sale" && p.purchased)
  ).length;

  const onRentSaleCount = properties.filter(
    (p) =>
      (p.listingPurpose === "For Renting" && !p.rented) ||
      (p.listingPurpose === "For Sale" && !p.purchased)
  ).length;

  const totalPropertiesCount = properties.length;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    propertyId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPropertyId(propertyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPropertyId(null);
  };

  const handleEdit = (propertyId: string) => {
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      setSelectedPropertyForEdit(property);
      setShowForm(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      try {
        await axios.delete(
          `/api/property/deleteproperty?id=${propertyToDelete}`
        );
        setProperties(
          properties.filter((property) => property._id !== propertyToDelete)
        );
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
        showSnackbar("Property deleted successfully", "success");
      } catch (error) {
        setError("Failed to delete property");
        console.error("Error deleting property:", error);
        showSnackbar("Failed to delete property", "error");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPropertyForEdit(null);
  };

  const handleUpdateSuccess = () => {
    // Refresh the properties list after successful update
    fetchProperties();
    handleFormClose();
    showSnackbar("Property updated successfully", "success");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return <House />;
      case "land":
        return <Landscape />;
      case "farm":
        return <Agriculture />;
      case "commercial":
        return <Business />;
      case "office":
        return <LocalPostOffice />;
      case "shop":
        return <Shop />;
      default:
        return <Home />;
    }
  };

  const getStatusColor = (property: Property) => {
    if (property.listingPurpose === "For Sale") {
      return property.purchased ? "success" : "primary";
    } else {
      return property.rented ? "success" : "secondary";
    }
  };

  const getStatusText = (property: Property) => {
    if (property.listingPurpose === "For Sale") {
      return property.purchased ? "Sold" : "For Sale";
    } else {
      return property.rented ? "Rented" : "For Rent";
    }
  };

  const isUrl = (str: string) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
        <Typography
          variant="h6"
          sx={{ mt: 3, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
        >
          Loading Properties...
        </Typography>
      </Container>
    );
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
          action={
            <Button color="inherit" size="small" onClick={fetchProperties}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.125rem" },
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Property Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your property portfolio ({totalPropertiesCount} properties)
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <CheckCircle
                sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {rentedPurchasedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rented/Sold
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <ShoppingCart
                sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {onRentSaleCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                On Rent/Sale
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Home
                sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {totalPropertiesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.main,
                0.1
              )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <FilterList
                sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {filteredProperties.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterList /> Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Rented Status</InputLabel>
              <Select
                value={
                  filter.rented === null ? "any" : filter.rented.toString()
                }
                label="Rented Status"
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    rented:
                      e.target.value === "any"
                        ? null
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="true">Rented</MenuItem>
                <MenuItem value="false">Not Rented</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Purchased Status</InputLabel>
              <Select
                value={
                  filter.purchased === null
                    ? "any"
                    : filter.purchased.toString()
                }
                label="Purchased Status"
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    purchased:
                      e.target.value === "any"
                        ? null
                        : e.target.value === "true",
                  })
                }
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="true">Purchased</MenuItem>
                <MenuItem value="false">Not Purchased</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size={isMobile ? "small" : "medium"}
              label="Location"
              value={filter.location}
              onChange={(e) =>
                setFilter({ ...filter, location: e.target.value })
              }
              placeholder="Search location..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Size</InputLabel>
              <Select
                value={filter.size}
                label="Size"
                onChange={(e) => setFilter({ ...filter, size: e.target.value })}
              >
                <MenuItem value="">Any Size</MenuItem>
                <MenuItem value="quarter">Quarter Plot</MenuItem>
                <MenuItem value="half">Half Plot</MenuItem>
                <MenuItem value="full">Full Plot</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filter.propertyType}
                label="Property Type"
                onChange={(e) =>
                  setFilter({ ...filter, propertyType: e.target.value })
                }
              >
                <MenuItem value="">Any Type</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="farm">Farm</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="office">Office</MenuItem>
                <MenuItem value="shop">Shop</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() =>
                setFilter({
                  rented: null,
                  purchased: null,
                  location: "",
                  size: "",
                  propertyType: "",
                })
              }
              size={isMobile ? "small" : "medium"}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            background: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 3,
          }}
        >
          <Home
            sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            No properties found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {properties.length === 0
              ? "You haven't added any properties yet."
              : "No properties match your current filters."}
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Add Your First Property
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} key={property._id}>
              <Card
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[8],
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                  >
                    {/* Property Image */}
                    <Avatar
                      variant="rounded"
                      src={
                        isUrl(property.image)
                          ? property.image
                          : `/uploads/${property.image}`
                      }
                      sx={{
                        width: { xs: "100%", md: 120 },
                        height: { xs: 200, md: 120 },
                        bgcolor: theme.palette.primary.light,
                      }}
                    >
                      {getPropertyIcon(property.propertyType)}
                    </Avatar>

                    {/* Property Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {property.title}
                        </Typography>
                        <Chip
                          label={getStatusText(property)}
                          color={getStatusColor(property)}
                          size="small"
                          variant="filled"
                        />
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocationOn color="action" sx={{ fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {property.location}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getPropertyIcon(property.propertyType)}
                            <Typography variant="body2" color="text.secondary">
                              {property.propertyType}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SquareFoot color="action" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              {property.size}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AttachMoney color="action" sx={{ fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {formatter.format(Number(property.price))}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, property._id)}
                              size={isMobile ? "small" : "medium"}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 120 },
        }}
      >
        <MenuItem
          onClick={() => selectedPropertyId && handleEdit(selectedPropertyId)}
        >
          <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedPropertyId && handleDeleteClick(selectedPropertyId)
          }
        >
          <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog
        open={showForm}
        onClose={handleFormClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Property
          </Typography>
          <IconButton
            onClick={handleFormClose}
            sx={{ color: "white" }}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedPropertyForEdit && (
            <UpdateProperty
              propertyId={selectedPropertyForEdit._id}
              onSuccess={handleUpdateSuccess}
              onClose={handleFormClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add property"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
}

"use client";
import { FC, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  AccountBalance,
  Payment,
  Home,
  Favorite,
  Schedule,
  Cancel,
  ExpandMore,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Security,
  TrendingUp,
  AccountBalanceWallet,
  People,
  Badge,
  Business,
} from "@mui/icons-material";

interface PaymentHistory {
  paymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  propertyPrice: number;
  totalPaymentMade: number;
  remainingBalance: number;
  paymentCompleted: boolean;
}

interface PropertyUnderPayment {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: string;
  propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
  listingPurpose: "For Renting" | "For Sale";
  paymentMethod: "installment" | "payOnce";
  initialPayment: number;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  state: string;
  size?: "Quarter Plot" | "Half Plot" | "Full Plot";
  instalmentAllowed: boolean;
  paymentHistory: PaymentHistory[];
  isWithdrawn: boolean;
  isWithdrawnApproved: boolean;
}

interface PropertyPurOrRented {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: string;
  paymentDate: Date;
  propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
  listingPurpose: "For Renting" | "For Sale";
  paymentMethod: "installment" | "payOnce";
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  state: string;
  size?: "Quarter Plot" | "Half Plot" | "Full Plot";
  rentalDuration?: number;
  instalmentAllowed: boolean;
}

interface PropertyWithdrawn {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: string;
  propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
  listingPurpose: "For Renting" | "For Sale";
  paymentMethod: "installment" | "payOnce";
  initialPayment: number;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  state: string;
  size?: "Quarter Plot" | "Half Plot" | "Full Plot";
  instalmentAllowed: boolean;
  paymentHistory: PaymentHistory[];
  withdrawnDate: Date;
  isWithdrawnApproved: boolean;
  withdrawalReason?: string;
  isWithdrawn: boolean;
}

interface NextOfKin {
  name: string;
  phoneNumber: string;
  address: string;
  image: string;
  email: string;
  userAccountNumber: string;
  userBankName: string;
  userAccountName: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  bvnOrNin: string;
  role: string;
  country: string;
  state: string;
  lga: string;
  address: string;
  nextOfKin: NextOfKin;
  userAccountNumber: string;
  userBankName: string;
  userAccountName: string;
  image: string;
  dateOfRegistration: Date;
  lastLoginTime?: Date;
  favouriteProperties: string[];
  remainingBalance: number;
  isActive: boolean;
  emailToken: string;
  totalPropertyPurchased: number;
  totalPaymentMade: number;
  totalPaymentToBeMade: number;
  propertyUnderPayment: PropertyUnderPayment[];
  propertyPurOrRented: PropertyPurOrRented[];
  propertyWithdrawn: PropertyWithdrawn[];
  referralEarnings: number;
  numberOfReferrals: number;
}

interface UserProfileProps {
  user: User;
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const imageSrc = isUrl(user.image) ? user.image : `/uploads/${user.image}`;
  const nextOfKinImageSrc = user.nextOfKin?.image
    ? isUrl(user.nextOfKin.image)
      ? user.nextOfKin.image
      : `/uploads/${user.nextOfKin.image}`
    : null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentProgress = (
    property: PropertyUnderPayment | PropertyWithdrawn
  ) => {
    if (!property.paymentHistory || property.paymentHistory.length === 0)
      return 0;
    const lastPayment =
      property.paymentHistory[property.paymentHistory.length - 1];
    const totalPaid = lastPayment.totalPaymentMade;
    const totalPrice = lastPayment.propertyPrice;
    return totalPrice > 0 ? (totalPaid / totalPrice) * 100 : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      case "admin":
        return "primary";
      case "user":
        return "secondary";
      case "agent":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: { xs: 1, md: 3 } }}>
      {/* Header Section */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Avatar
                src={imageSrc}
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  margin: "0 auto",
                  border: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Person sx={{ fontSize: 48 }} />
              </Avatar>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {user.name}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Chip
                  label={user.role}
                  color={getStatusColor(user.role) as any}
                  size="small"
                />
                <Chip
                  label={user.isActive ? "Active" : "Inactive"}
                  color={user.isActive ? "success" : "error"}
                  size="small"
                />
                <Chip
                  label={`${user.numberOfReferrals} Referrals`}
                  color="info"
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Email
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Phone
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">
                    {user.phoneNumber || "Not provided"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <LocationOn
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">
                    {[user.address, user.lga, user.state, user.country]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.light",
                  color: "white",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Member Since
                </Typography>
                <CalendarToday sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  {formatDate(user.dateOfRegistration)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", borderRadius: 2 }}>
            <CardContent>
              <AccountBalanceWallet
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6" color="text.secondary">
                Total Balance
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(user.remainingBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", borderRadius: 2 }}>
            <CardContent>
              <Payment sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                Total Paid
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(user.totalPaymentMade)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", borderRadius: 2 }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                Referral Earnings
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatCurrency(user.referralEarnings)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", borderRadius: 2 }}>
            <CardContent>
              <People sx={{ fontSize: 40, color: "secondary.main", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                Properties Owned
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="secondary.main">
                {user.propertyPurOrRented.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader
          title="User Details"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        />
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Personal Info" />
          <Tab icon={<AccountBalance />} label="Bank Details" />
          <Tab icon={<Security />} label="Next of Kin" />
          <Tab icon={<Home />} label="Properties" />
          <Tab icon={<Payment />} label="Payment History" />
        </Tabs>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Badge sx={{ mr: 1 }} />
                  Basic Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Username"
                      secondary={user.username || "Not set"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="BVN/NIN"
                      secondary={user.bvnOrNin || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Account Status"
                      secondary={
                        <Chip
                          label={
                            user.isActive ? "Verified" : "Pending Verification"
                          }
                          color={user.isActive ? "success" : "warning"}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Last Login"
                      secondary={
                        user.lastLoginTime
                          ? formatDate(user.lastLoginTime)
                          : "Never logged in"
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LocationOn sx={{ mr: 1 }} />
                  Location Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Address"
                      secondary={user.address || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="LGA"
                      secondary={user.lga || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="State"
                      secondary={user.state || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Country"
                      secondary={user.country || "Not provided"}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Bank Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Business sx={{ mr: 1 }} />
                  Bank Account Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Account Number"
                      secondary={user.userAccountNumber || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Bank Name"
                      secondary={user.userBankName || "Not provided"}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Account Name"
                      secondary={user.userAccountName || "Not provided"}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Properties Purchased:</Typography>
                    <Typography fontWeight="bold">
                      {user.totalPropertyPurchased}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Total Payment Made:</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      {formatCurrency(user.totalPaymentMade)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Remaining Balance:</Typography>
                    <Typography fontWeight="bold" color="primary.main">
                      {formatCurrency(user.remainingBalance)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Total Payment To Be Made:</Typography>
                    <Typography fontWeight="bold">
                      {formatCurrency(user.totalPaymentToBeMade)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Next of Kin Tab */}
        <TabPanel value={tabValue} index={2}>
          {user.nextOfKin ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Avatar
                    src={nextOfKinImageSrc || ""}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: "0 auto",
                      border: `4px solid ${theme.palette.secondary.main}`,
                    }}
                  >
                    <Person sx={{ fontSize: 48 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {user.nextOfKin.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Next of Kin Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.phoneNumber}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.email}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.address}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.userAccountNumber}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Bank Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.userBankName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Account Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.nextOfKin.userAccountName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Next of Kin Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This user hasn&apos;t provided next of kin details yet.
              </Typography>
            </Paper>
          )}
        </TabPanel>

        {/* Properties Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Portfolio Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "success.light",
                    color: "white",
                  }}
                >
                  <Home sx={{ mb: 1 }} />
                  <Typography variant="h6">
                    {user.propertyPurOrRented.length}
                  </Typography>
                  <Typography variant="body2">Owned/Rented</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "warning.light",
                    color: "white",
                  }}
                >
                  <Schedule sx={{ mb: 1 }} />
                  <Typography variant="h6">
                    {user.propertyUnderPayment.length}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "error.light",
                    color: "white",
                  }}
                >
                  <Cancel sx={{ mb: 1 }} />
                  <Typography variant="h6">
                    {user.propertyWithdrawn.length}
                  </Typography>
                  <Typography variant="body2">Withdrawn</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "info.light",
                    color: "white",
                  }}
                >
                  <Favorite sx={{ mb: 1 }} />
                  <Typography variant="h6">
                    {user.favouriteProperties.length}
                  </Typography>
                  <Typography variant="body2">Favorites</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Owned/Rented Properties ({user.propertyPurOrRented.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user.propertyPurOrRented.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Purchase Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.propertyPurOrRented.map((property, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar src={property.image} sx={{ mr: 2 }}>
                                <Home />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {property.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {property.location}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={property.propertyType} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.listingPurpose}
                              color={
                                property.listingPurpose === "For Sale"
                                  ? "primary"
                                  : "secondary"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {formatCurrency(property.price)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {formatDate(property.paymentDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" align="center">
                  No owned or rented properties
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Properties Under Payment ({user.propertyUnderPayment.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user.propertyUnderPayment.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Paid/Total</TableCell>
                        <TableCell>Next Payment</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.propertyUnderPayment.map((property, index) => {
                        const progress = getPaymentProgress(property);
                        const lastPayment =
                          property.paymentHistory[
                            property.paymentHistory.length - 1
                          ];
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar src={property.image} sx={{ mr: 2 }}>
                                  <Home />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {property.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.location}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box sx={{ width: "100%", mr: 1 }}>
                                  <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={24}
                                    color={
                                      progress >= 100 ? "success" : "primary"
                                    }
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {Math.round(progress)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatCurrency(
                                  lastPayment?.totalPaymentMade || 0
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                of {formatCurrency(property.price)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {lastPayment
                                ? formatDate(lastPayment.nextPaymentDate)
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  property.isWithdrawn
                                    ? "Withdrawal Requested"
                                    : "Active"
                                }
                                color={
                                  property.isWithdrawn ? "warning" : "success"
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" align="center">
                  No properties under payment
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Withdrawn Properties ({user.propertyWithdrawn.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user.propertyWithdrawn.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Withdrawn Date</TableCell>
                        <TableCell>Amount Paid</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.propertyWithdrawn.map((property, index) => {
                        const lastPayment =
                          property.paymentHistory[
                            property.paymentHistory.length - 1
                          ];
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar src={property.image} sx={{ mr: 2 }}>
                                  <Home />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {property.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.location}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {formatDate(property.withdrawnDate)}
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  lastPayment?.totalPaymentMade || 0
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  property.isWithdrawnApproved
                                    ? "Approved"
                                    : "Pending"
                                }
                                color={
                                  property.isWithdrawnApproved
                                    ? "success"
                                    : "warning"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ maxWidth: 200 }}
                              >
                                {property.withdrawalReason ||
                                  "No reason provided"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" align="center">
                  No withdrawn properties
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Payment History Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Recent Payment Activity
          </Typography>
          {user.propertyUnderPayment.length > 0 ||
          user.propertyPurOrRented.length > 0 ? (
            <List>
              {user.propertyUnderPayment.map((property, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Home sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {property.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.propertyType} • {property.listingPurpose}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${getPaymentProgress(property).toFixed(
                          0
                        )}% Paid`}
                        color={
                          getPaymentProgress(property) >= 100
                            ? "success"
                            : "primary"
                        }
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Next Payment</TableCell>
                            <TableCell>Total Paid</TableCell>
                            <TableCell>Remaining</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {property.paymentHistory.map(
                            (payment, paymentIndex) => (
                              <TableRow key={paymentIndex}>
                                <TableCell>
                                  {formatDate(payment.paymentDate)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(payment.amount)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(payment.nextPaymentDate)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(payment.totalPaymentMade)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(payment.remainingBalance)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Payment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This user hasn&apos;t made any payments yet.
              </Typography>
            </Paper>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};

export default UserProfile;

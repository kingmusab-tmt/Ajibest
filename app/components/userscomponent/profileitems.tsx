// "use client";
// import React, { useState, useEffect } from "react";
// import { User } from "@/types/usertypes";
// import { useSession } from "next-auth/react";

// const UserInfo: React.FC = () => {
//   const { data: session, status } = useSession();
//   const [userData, setUserData] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (session?.user?.email) {
//         try {
//           const response = await fetch("/api/users/searchbyemail", {
//             headers: {
//               "Cache-Control": "no-cache, no-store",
//             },
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setUserData({ ...data.user });
//           } else {
//             return;
//           }
//         } catch (error) {
//           throw error;
//         }
//       }
//     };
//     if (status === "authenticated") {
//       fetchUserData();
//     }
//   }, [session, status]);

//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//   });

//   return (
//     <div className="container mx-auto p-4">
//       {/* <h2 className="text-xl font-bold mb-4">User Information</h2> */}
//       <div className="flex space-x-5 w-full mb-10">
//         <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-green-600 ">
//           <span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-12"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
//               />
//             </svg>
//           </span>
//           <h3 className="text-base sm:text-lg font-semibold mb-2">
//             Remaining Balance
//           </h3>
//           <p className="text-sm sm:text-lg">
//             {formatter.format(userData?.remainingBalance ?? 0)}
//           </p>
//         </div>
//         <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-blue-600">
//           <span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-12"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
//               />
//             </svg>
//           </span>
//           <h3 className="text-base sm:text-lg font-semibold mb-2">
//             Total Property Purchased
//           </h3>
//           <p className="text-lg">{userData?.totalPropertyPurchased}</p>
//         </div>
//       </div>
//       <div className="flex space-x-5 w-full mb-10">
//         <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-yellow-600">
//           <span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-12"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
//               />
//             </svg>
//           </span>
//           <h3 className="text-base sm:text-lg font-semibold mb-2">
//             Total Payment Made
//           </h3>
//           <p className="text-sm sm:text-lg">
//             {" "}
//             {userData?.totalPaymentMade
//               ? formatter.format(userData.totalPaymentMade)
//               : formatter.format(0)}{" "}
//           </p>
//         </div>
//         <div className="w-1/2 bg-white dark:bg-slate-800 dark:shadow-white border rounded-lg p-4 shadow-lg shadow-yellow-600">
//           <span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-12"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
//               />
//             </svg>
//           </span>
//           <h3 className="text-base sm:text-lg font-semibold mb-2">
//             Total Payment To be Made
//           </h3>
//           <p className="text-sm sm:text-lg">
//             {" "}
//             {userData?.totalPaymentToBeMade
//               ? formatter.format(userData.totalPaymentToBeMade)
//               : formatter.format(0)}{" "}
//           </p>
//         </div>
//         {session?.user.role === "Agent" && (
//           <>
//             <div className="w-1/2 bg-white border rounded-lg p-4 shadow-lg shadow-green-600">
//               <span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="size-12"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
//                   />
//                 </svg>
//               </span>
//               <h3 className="text-lg font-semibold mb-2">Referral Earnings</h3>
//               <p className="text-lg">{userData?.referralEarnings}</p>
//             </div>
//             <div className="w-1/2 bg-white border rounded-lg p-4 shadow-lg shadow-green-600">
//               <span>
//                 <svg
//                   version="1.1"
//                   baseProfile="tiny"
//                   id="Layer_1"
//                   xmlns="http://www.w3.org/2000/svg"
//                   x="0px"
//                   y="0px"
//                   width="50px"
//                   height="50px"
//                   viewBox="0 0 24 24"
//                   overflow="visible"
//                 >
//                   <g>
//                     <rect y="0" fill="none" width="24" height="24" />
//                     <g transform="translate(2.000000, 2.000000)">
//                       <path
//                         fill-rule="evenodd"
//                         fill="#5C85DE"
//                         d="M10,10c2.9,0,5.2-2.3,5.2-5.2c0-2.9-2.3-5.2-5.2-5.2S4.8,1.9,4.8,4.8
// 			C4.8,7.7,7.1,10,10,10L10,10z"
//                       />
//                       <path
//                         fill-rule="evenodd"
//                         fill="#5C85DE"
//                         d="M10,12.7c-3.5,0-10.5,1.7-10.5,5.2v2.6h21v-2.6C20.5,14.4,13.5,12.7,10,12.7L10,12.7z
// 			"
//                       />
//                       <path
//                         fill-rule="evenodd"
//                         fill="#3367D6"
//                         d="M10,10c2.9,0,5.2-2.3,5.2-5.2c0-2.9-2.3-5.2-5.2-5.2V10L10,10z"
//                       />
//                       <path
//                         fill-rule="evenodd"
//                         fill="#3367D6"
//                         d="M10,12.7v7.8h10.5v-2.6C20.5,14.4,13.5,12.7,10,12.7L10,12.7z"
//                       />
//                     </g>
//                   </g>
//                 </svg>
//               </span>
//               <h3 className="text-lg font-semibold mb-2">
//                 Number of Referrals
//               </h3>
//               <p className="text-lg">{userData?.numberOfReferrals}</p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserInfo;
// "use client";
// import React, { useState, useEffect } from "react";
// import { User } from "@/types/usertypes";
// import { useSession } from "next-auth/react";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Avatar,
//   Chip,
//   Divider,
//   Paper,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Tab,
//   Tabs,
//   useTheme,
//   useMediaQuery,
//   alpha,
// } from "@mui/material";
// import {
//   AccountBalanceWallet,
//   Apartment,
//   Payments,
//   Schedule,
//   Person,
//   Email,
//   Phone,
//   LocationOn,
//   Security,
//   AccountBalance,
//   People,
//   Star,
//   CalendarToday,
//   TrendingUp,
// } from "@mui/icons-material";

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
//       id={`user-tabpanel-${index}`}
//       aria-labelledby={`user-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// const UserInfo: React.FC = () => {
//   const { data: session, status } = useSession();
//   const [userData, setUserData] = useState<User | null>(null);
//   const [tabValue, setTabValue] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (session?.user?.email) {
//         try {
//           const response = await fetch("/api/users/searchbyemail", {
//             headers: {
//               "Cache-Control": "no-cache, no-store",
//             },
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setUserData({ ...data.user });
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };
//     if (status === "authenticated") {
//       fetchUserData();
//     }
//   }, [session, status]);

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
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const statsCards = [
//     {
//       title: "Remaining Balance",
//       value: userData?.remainingBalance ?? 0,
//       format: "currency",
//       icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
//       color: theme.palette.success.main,
//       gradient: `linear-gradient(135deg, ${alpha(
//         theme.palette.success.main,
//         0.1
//       )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
//     },
//     {
//       title: "Total Properties",
//       value: userData?.totalPropertyPurchased ?? 0,
//       format: "number",
//       icon: <Apartment sx={{ fontSize: 40 }} />,
//       color: theme.palette.primary.main,
//       gradient: `linear-gradient(135deg, ${alpha(
//         theme.palette.primary.main,
//         0.1
//       )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
//     },
//     {
//       title: "Total Paid",
//       value: userData?.totalPaymentMade ?? 0,
//       format: "currency",
//       icon: <Payments sx={{ fontSize: 40 }} />,
//       color: theme.palette.warning.main,
//       gradient: `linear-gradient(135deg, ${alpha(
//         theme.palette.warning.main,
//         0.1
//       )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
//     },
//     {
//       title: "Pending Payments",
//       value: userData?.totalPaymentToBeMade ?? 0,
//       format: "currency",
//       icon: <Schedule sx={{ fontSize: 40 }} />,
//       color: theme.palette.error.main,
//       gradient: `linear-gradient(135deg, ${alpha(
//         theme.palette.error.main,
//         0.1
//       )} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`,
//     },
//     ...(session?.user.role === "Agent"
//       ? [
//           {
//             title: "Referral Earnings",
//             value: userData?.referralEarnings ?? 0,
//             format: "currency",
//             icon: <TrendingUp sx={{ fontSize: 40 }} />,
//             color: theme.palette.info.main,
//             gradient: `linear-gradient(135deg, ${alpha(
//               theme.palette.info.main,
//               0.1
//             )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
//           },
//           {
//             title: "Referrals",
//             value: userData?.numberOfReferrals ?? 0,
//             format: "number",
//             icon: <People sx={{ fontSize: 40 }} />,
//             color: theme.palette.secondary.main,
//             gradient: `linear-gradient(135deg, ${alpha(
//               theme.palette.secondary.main,
//               0.1
//             )} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
//           },
//         ]
//       : []),
//   ];

//   if (status === "loading") {
//     return (
//       <Container maxWidth="xl" sx={{ py: 4 }}>
//         <LinearProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Header Section */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 4,
//           mb: 4,
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//           color: "white",
//           borderRadius: 3,
//         }}
//       >
//         <Grid container spacing={3} alignItems="center">
//           <Grid item>
//             <Avatar
//               src={userData?.image || session?.user?.image || ""}
//               sx={{
//                 width: 80,
//                 height: 80,
//                 border: "4px solid white",
//               }}
//             >
//               {userData?.name?.[0] || session?.user?.name?.[0] || "U"}
//             </Avatar>
//           </Grid>
//           <Grid item xs>
//             <Typography variant="h4" fontWeight="bold" gutterBottom>
//               {userData?.name || session?.user?.name || "User"}
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 1,
//                 alignItems: "center",
//               }}
//             >
//               <Chip
//                 label={userData?.role || "User"}
//                 color="secondary"
//                 size="small"
//                 sx={{
//                   backgroundColor: "white",
//                   color: theme.palette.primary.main,
//                 }}
//               />
//               <Chip
//                 label={userData?.isActive ? "Verified" : "Pending Verification"}
//                 color={userData?.isActive ? "success" : "warning"}
//                 size="small"
//                 variant="outlined"
//               />
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Member since{" "}
//                 {formatDate(userData?.dateOfRegistration || new Date())}
//               </Typography>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {statsCards.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
//             <Card
//               elevation={2}
//               sx={{
//                 height: "100%",
//                 background: stat.gradient,
//                 border: `1px solid ${alpha(stat.color, 0.2)}`,
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   transform: "translateY(-4px)",
//                   boxShadow: `0 8px 24px ${alpha(stat.color, 0.2)}`,
//                 },
//               }}
//             >
//               <CardContent sx={{ textAlign: "center", p: 3 }}>
//                 <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom>
//                   {stat.format === "currency"
//                     ? formatter.format(stat.value as number)
//                     : stat.value}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {stat.title}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Tabs Section */}
//       <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           variant={isMobile ? "scrollable" : "fullWidth"}
//           scrollButtons={isMobile ? "auto" : false}
//           sx={{
//             borderBottom: `1px solid ${theme.palette.divider}`,
//             "& .MuiTab-root": { py: 2, minHeight: 64 },
//           }}
//         >
//           <Tab icon={<Person />} label="Profile Info" />
//           <Tab icon={<Security />} label="Next of Kin" />
//           <Tab icon={<AccountBalance />} label="Financial Details" />
//           <Tab icon={<Apartment />} label="Properties" />
//         </Tabs>

//         {/* Profile Info Tab */}
//         <TabPanel value={tabValue} index={0}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                   >
//                     <Person color="primary" /> Personal Information
//                   </Typography>
//                   <List dense>
//                     <ListItem>
//                       <ListItemIcon>
//                         <Email color="action" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary="Email"
//                         secondary={userData?.email || session?.user?.email}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemIcon>
//                         <Phone color="action" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary="Phone"
//                         secondary={userData?.phoneNumber || "Not provided"}
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemIcon>
//                         <LocationOn color="action" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary="Address"
//                         secondary={
//                           userData?.address
//                             ? `${userData.address}, ${userData.lga}, ${userData.state}, ${userData.country}`
//                             : "Not provided"
//                         }
//                       />
//                     </ListItem>
//                     <ListItem>
//                       <ListItemIcon>
//                         <CalendarToday color="action" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary="Last Login"
//                         secondary={
//                           userData?.lastLoginTime
//                             ? formatDate(userData.lastLoginTime)
//                             : "Never"
//                         }
//                       />
//                     </ListItem>
//                   </List>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                   >
//                     <Star color="primary" /> Account Status
//                   </Typography>
//                   <Box
//                     sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//                   >
//                     <Box
//                       sx={{ display: "flex", justifyContent: "space-between" }}
//                     >
//                       <Typography variant="body2">Status</Typography>
//                       <Chip
//                         label={userData?.isActive ? "Active" : "Inactive"}
//                         color={userData?.isActive ? "success" : "default"}
//                         size="small"
//                       />
//                     </Box>
//                     <Box
//                       sx={{ display: "flex", justifyContent: "space-between" }}
//                     >
//                       <Typography variant="body2">Registration Date</Typography>
//                       <Typography variant="body2">
//                         {formatDate(userData?.dateOfRegistration || new Date())}
//                       </Typography>
//                     </Box>
//                     <Box
//                       sx={{ display: "flex", justifyContent: "space-between" }}
//                     >
//                       <Typography variant="body2">
//                         Favorite Properties
//                       </Typography>
//                       <Typography variant="body2">
//                         {userData?.favouriteProperties?.length || 0}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>

//         {/* Next of Kin Tab */}
//         <TabPanel value={tabValue} index={1}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Next of Kin Details
//                   </Typography>
//                   {userData?.nextOfKin ? (
//                     <List>
//                       <ListItem>
//                         <ListItemText
//                           primary="Name"
//                           secondary={userData.nextOfKin.name}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemText
//                           primary="Phone"
//                           secondary={userData.nextOfKin.phoneNumber}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemText
//                           primary="Email"
//                           secondary={userData.nextOfKin.email}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemText
//                           primary="Address"
//                           secondary={userData.nextOfKin.address}
//                         />
//                       </ListItem>
//                     </List>
//                   ) : (
//                     <Typography color="text.secondary">
//                       No next of kin information provided
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>

//         {/* Financial Details Tab */}
//         <TabPanel value={tabValue} index={2}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Bank Account Details
//                   </Typography>
//                   {userData?.userAccountNumber ? (
//                     <List>
//                       <ListItem>
//                         <ListItemText
//                           primary="Account Number"
//                           secondary={userData.userAccountNumber}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemText
//                           primary="Bank Name"
//                           secondary={userData.userBankName}
//                         />
//                       </ListItem>
//                       <ListItem>
//                         <ListItemText
//                           primary="Account Name"
//                           secondary={userData.userAccountName}
//                         />
//                       </ListItem>
//                     </List>
//                   ) : (
//                     <Typography color="text.secondary">
//                       No bank account information provided
//                     </Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>

//         {/* Properties Tab */}
//         <TabPanel value={tabValue} index={3}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Properties Under Payment (
//                     {userData?.propertyUnderPayment?.length || 0})
//                   </Typography>
//                   {userData?.propertyUnderPayment?.map((property, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         mb: 2,
//                         p: 2,
//                         border: `1px solid ${theme.palette.divider}`,
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography variant="subtitle1">
//                         {property.title}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {property.propertyType} • {property.paymentPurpose}
//                       </Typography>
//                       <LinearProgress
//                         variant="determinate"
//                         value={
//                           Math.round(
//                             ((property.paymentHisotry?.[0]?.totalPaymentMade ??
//                               0) /
//                               (property.paymentHisotry?.[0]?.propertyPrice ??
//                                 1)) *
//                               100
//                           ) || 0
//                         }
//                         sx={{ mt: 1 }}
//                       />
//                     </Box>
//                   ))}
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Card
//                 elevation={0}
//                 sx={{ border: `1px solid ${theme.palette.divider}` }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Owned Properties (
//                     {userData?.propertyPurOrRented?.length || 0})
//                   </Typography>
//                   {userData?.propertyPurOrRented?.map((property, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         mb: 2,
//                         p: 2,
//                         border: `1px solid ${theme.palette.divider}`,
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography variant="subtitle1">
//                         {property.title}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {property.propertyType} •{" "}
//                         {formatter.format(property.propertyPrice)}
//                       </Typography>
//                       <Typography variant="caption">
//                         Purchased: {formatDate(property.paymentDate)}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </TabPanel>
//       </Paper>
//     </Container>
//   );
// };

// export default UserInfo;
"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/types/usertypes";
import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
  Stack,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Apartment,
  Payments,
  Schedule,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  TrendingUp,
  People,
  Home,
  CheckCircle,
  Payment,
} from "@mui/icons-material";

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
      {value === index && <Box sx={{ p: { xs: 1, md: 3 } }}>{children}</Box>}
    </div>
  );
}

const UserInfo: React.FC = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/users/searchbyemail", {
            headers: {
              "Cache-Control": "no-cache, no-store",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData({ ...data.user });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status]);

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

  const statsCards = [
    {
      title: "Remaining Balance",
      value: userData?.remainingBalance ?? 0,
      format: "currency",
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.success.main,
        0.1
      )} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
    },
    {
      title: "Total Properties",
      value: userData?.totalPropertyPurchased ?? 0,
      format: "number",
      icon: <Apartment sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.1
      )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
    },
    {
      title: "Total Paid",
      value: userData?.totalPaymentMade ?? 0,
      format: "currency",
      icon: <Payments sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.warning.main,
        0.1
      )} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
    },
    {
      title: "Pending Payments",
      value: userData?.totalPaymentToBeMade ?? 0,
      format: "currency",
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.error.main,
        0.1
      )} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`,
    },
    ...(session?.user.role === "Agent"
      ? [
          {
            title: "Referral Earnings",
            value: userData?.referralEarnings ?? 0,
            format: "currency",
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: theme.palette.info.main,
            gradient: `linear-gradient(135deg, ${alpha(
              theme.palette.info.main,
              0.1
            )} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
          },
          {
            title: "Referrals",
            value: userData?.numberOfReferrals ?? 0,
            format: "number",
            icon: <People sx={{ fontSize: 40 }} />,
            color: theme.palette.secondary.main,
            gradient: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
          },
        ]
      : []),
  ];

  const propertiesUnderPayment = userData?.propertyUnderPayment || [];
  const ownedProperties = userData?.propertyPurOrRented || [];

  if (status === "loading") {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={userData?.image || session?.user?.image || ""}
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                border: "3px solid white",
              }}
            >
              {userData?.name?.[0] || session?.user?.name?.[0] || "U"}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
            >
              {userData?.name || session?.user?.name || "User"}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Chip
                label={userData?.role || "User"}
                color="secondary"
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                }}
              />
              <Chip
                label={userData?.isActive ? "Verified" : "Pending Verification"}
                color={userData?.isActive ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, mt: { xs: 0.5, sm: 0 } }}
              >
                Member since{" "}
                {formatDate(userData?.dateOfRegistration || new Date())}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card
              elevation={1}
              sx={{
                height: "100%",
                background: stat.gradient,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <Box sx={{ color: stat.color, mb: 1 }}>
                  {React.cloneElement(stat.icon, {
                    sx: { fontSize: { xs: 30, md: 40 } },
                  })}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", md: "1.25rem" } }}
                >
                  {stat.format === "currency"
                    ? formatter.format(stat.value as number)
                    : stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                >
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Section */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
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
            icon={<Person sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label="Profile Info"
          />
          <Tab
            icon={<Home sx={{ fontSize: { xs: 20, md: 24 } }} />}
            label="My Properties"
          />
        </Tabs>

        {/* Profile Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    <Person color="primary" /> Personal Information
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Email color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={userData?.email || session?.user?.email}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Phone color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={userData?.phoneNumber || "Not provided"}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={
                          userData?.address
                            ? `${userData.address}, ${userData.lga}, ${userData.state}, ${userData.country}`
                            : "Not provided"
                        }
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CalendarToday color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Login"
                        secondary={
                          userData?.lastLoginTime
                            ? formatDate(userData.lastLoginTime)
                            : "Never"
                        }
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "body1" }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    <CalendarToday color="primary" /> Account Summary
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Status</Typography>
                      <Chip
                        label={userData?.isActive ? "Active" : "Inactive"}
                        color={userData?.isActive ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Registration Date</Typography>
                      <Typography variant="body2" textAlign="right">
                        {formatDate(userData?.dateOfRegistration || new Date())}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">
                        Favorite Properties
                      </Typography>
                      <Typography variant="body2">
                        {userData?.favouriteProperties?.length || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Properties Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {/* Properties Under Payment Card */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={1}
                sx={{
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Payment color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      Properties Under Payment ({propertiesUnderPayment.length})
                    </Typography>
                  </Box>

                  {propertiesUnderPayment.length > 0 ? (
                    <Stack spacing={2}>
                      {propertiesUnderPayment.map((property, index) => {
                        const totalPrice =
                          property.paymentHisotry[0]?.propertyPrice || 0;
                        const paidAmount =
                          ((property as any).initialPayment ?? 0) +
                          (property.paymentHisotry?.reduce(
                            (sum, payment) => sum + payment.amount,
                            0
                          ) ?? 0);
                        const progress =
                          totalPrice > 0 ? (paidAmount / totalPrice) * 100 : 0;

                        return (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              background: alpha(
                                theme.palette.warning.light,
                                0.05
                              ),
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {property.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Chip
                                label={property.propertyType}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={property.paymentPurpose}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                mb: 1,
                                backgroundColor: alpha(
                                  theme.palette.warning.main,
                                  0.2
                                ),
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: theme.palette.warning.main,
                                },
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.875rem",
                              }}
                            >
                              <Typography variant="body2">
                                Paid: {formatter.format(paidAmount)}
                              </Typography>
                              <Typography variant="body2">
                                Total: {formatter.format(totalPrice)}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{ mt: 1 }}
                              startIcon={<Payment />}
                            >
                              Continue Payment
                            </Button>
                          </Paper>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Payment
                        sx={{
                          fontSize: 48,
                          color: theme.palette.text.disabled,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No properties under payment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start your property journey today!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Owned Properties Card */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={1}
                sx={{
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CheckCircle color="success" />
                    <Typography variant="h6" fontWeight="bold">
                      Owned Properties ({ownedProperties.length})
                    </Typography>
                  </Box>

                  {ownedProperties.length > 0 ? (
                    <Stack spacing={2}>
                      {ownedProperties.map((property, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            background: alpha(
                              theme.palette.success.light,
                              0.05
                            ),
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {property.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Chip
                              label={property.propertyType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label="Fully Paid"
                              size="small"
                              color="success"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {formatter.format(property.propertyPrice)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(property.paymentDate)}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            startIcon={<Home />}
                          >
                            View Property
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Home
                        sx={{
                          fontSize: 48,
                          color: theme.palette.text.disabled,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No owned properties yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Complete your first purchase to see it here!
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserInfo;

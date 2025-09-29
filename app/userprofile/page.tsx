// "use client";
// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import UserDashboardSidebar from "../components/userscomponent/usernav";
// import ProfileTopNavBar from "../components/userscomponent/profiletopnav";
// import CalculatorOnProfile from "../components/userscomponent/accounttab";
// import UserInfo from "../components/userscomponent/profileitems";
// import TransactionHistory from "../components/generalcomponents/transactionhistory";
// import UpdateProfile from "../components/userscomponent/updateProfile";
// import PropertyListing from "../components/userscomponent/propertyListing";
// import MyProperty from "../components/userscomponent/userproperties";
// import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";
// import SupportTab from "../components/userscomponent/SupportTab";

// interface Notification {
//   id: number;
//   message: string;
// }

// interface User {
//   name: string;
//   email: string;
//   image?: string;
//   role?: string;
//   // accountBalance: string;
//   isLoggedIn: boolean;
// }

// const Userprofile = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [selectedComponent, setSelectedComponent] = useState("UserInfo");
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch("/api/notify", {
//           headers: {
//             "Cache-Control": "no-cache, no-store",
//           },
//         });

//         const fetchedNotifications = await response.json();
//         const filteredNotifications = fetchedNotifications.data.filter(
//           (notification) =>
//             notification.recipient === "all" ||
//             notification.recipient === session?.user?.email
//         );
//         setNotifications(filteredNotifications);
//       } catch (error) {
//         throw error;
//       }
//     };
//     if (status === "authenticated") {
//       fetchNotifications();
//     }
//   }, [session?.user?.email, status]);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     const handleComponentChange = () => {
//       router.replace(`/userprofile?#${selectedComponent}`);
//     };
//     handleComponentChange();
//   }, [selectedComponent, router]);

//   if (!session?.user) {
//     return null; // This will never be reached because of the redirection above
//   }
//   const user: User = {
//     name: session.user.name || "Unknown User",
//     email: session.user.email || "No Email",
//     image: session.user.image || "/public/ajibestlogo.png",
//     role: session.user.role || "",
//     // accountBalance: "",
//     isLoggedIn: false,
//   };

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "UserInfo":
//         return (
//           <>
//             <UserInfo />
//             <CalculatorOnProfile />
//           </>
//         );
//       case "MyProperty":
//         return <MyProperty />;
//       case "PropertyListing":
//         return <PropertyListing />;
//       case "TransactionHistory":
//         return <TransactionHistory />;
//       case "UpdateProfile":
//         return <UpdateProfile />;
//       case "SupportTab":
//         return <SupportTab />;
//       default:
//         return <UserInfo />;
//     }
//   };

//   return (
//     <ProtectedRoute roles={["User", "Agent", "Admin"]}>
//       <div className="flex h-screen overflow-hidden">
//         {isClient ? (
//           <>
//             <UserDashboardSidebar
//               user={user}
//               isOpen={isSidebarOpen}
//               toggleSidebar={toggleSidebar}
//               setSelectedComponent={setSelectedComponent}
//             />
//             <div
//               className={`flex flex-col flex-grow transition-margin duration-300 ${
//                 isSidebarOpen ? "ml-64" : "ml-0 sm:ml-24"
//               }`}
//             >
//               <ProfileTopNavBar
//                 user={user}
//                 notifications={notifications}
//                 setSelectedComponent={setSelectedComponent}
//               />
//               <main className=" flex-grow p-4 bg-white dark:bg-slate-800 overflow-auto max-h-svh">
//                 {renderComponent()}
//               </main>
//             </div>
//           </>
//         ) : (
//           <>
//             <UserDashboardSidebar
//               user={user}
//               isOpen={isSidebarOpen}
//               toggleSidebar={toggleSidebar}
//               setSelectedComponent={setSelectedComponent}
//             />
//             <div
//               className={`flex flex-col flex-grow transition-margin duration-300 ${
//                 isSidebarOpen ? "ml-64" : "ml-0 sm:ml-24"
//               }`}
//             >
//               <ProfileTopNavBar
//                 user={user}
//                 notifications={notifications}
//                 setSelectedComponent={setSelectedComponent}
//               />
//               <main className=" flex-grow bg-white overflow-auto max-h-svh">
//                 {renderComponent()}
//               </main>
//             </div>
//           </>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default Userprofile;
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import UserDashboardSidebar from "../components/userscomponent/usernav";
import ProfileTopNavBar from "../components/userscomponent/profiletopnav";
import CalculatorOnProfile from "../components/userscomponent/accounttab";
import UserInfo from "../components/userscomponent/profileitems";
import TransactionHistory from "../components/generalcomponents/transactionhistory";
import UpdateProfile from "../components/userscomponent/updateProfile";
import PropertyListing from "../components/userscomponent/propertyListing";
import MyProperty from "../components/userscomponent/userproperties";
import ProtectedRoute from "../components/generalcomponents/ProtectedRoute";
import SupportTab from "../components/userscomponent/SupportTab";

interface Notification {
  id: number;
  message: string;
}

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
  isLoggedIn: boolean;
}

const Userprofile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedComponent, setSelectedComponent] = useState("UserInfo");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notify", {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });

        const fetchedNotifications = await response.json();
        const filteredNotifications = fetchedNotifications.data.filter(
          (notification) =>
            notification.recipient === "all" ||
            notification.recipient === session?.user?.email
        );
        setNotifications(filteredNotifications);
      } catch (error) {
        throw error;
      }
    };
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [session?.user?.email, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const handleComponentChange = () => {
      router.replace(`/userprofile?#${selectedComponent}`);
    };
    handleComponentChange();
  }, [selectedComponent, router]);

  if (status === "loading" || !isClient) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user: User = {
    name: session.user.name || "Unknown User",
    email: session.user.email || "No Email",
    image: session.user.image || "/public/ajibestlogo.png",
    role: session.user.role || "",
    isLoggedIn: false,
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "UserInfo":
        return (
          <>
            <UserInfo />
            <CalculatorOnProfile />
          </>
        );
      case "MyProperty":
        return <MyProperty />;
      case "PropertyListing":
        return <PropertyListing />;
      case "TransactionHistory":
        return <TransactionHistory />;
      case "UpdateProfile":
        return <UpdateProfile />;
      case "SupportTab":
        return <SupportTab />;
      default:
        return <UserInfo />;
    }
  };

  // Calculate margin left based on sidebar state and screen size
  const getMarginLeft = () => {
    if (isSidebarOpen) {
      return { xs: "256px", sm: "256px" }; // ml-64 equivalent
    } else {
      return { xs: "0px", sm: "96px" }; // ml-0 sm:ml-24 equivalent (24 * 4 = 96px)
    }
  };

  return (
    <ProtectedRoute roles={["User", "Agent", "Admin"]}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <UserDashboardSidebar
          user={user}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setSelectedComponent={setSelectedComponent}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: getMarginLeft(),
            transition: theme.transitions.create("margin", {
              duration: 300, // matches duration-300
            }),
            width: {
              xs: `calc(100% - ${isSidebarOpen ? "256px" : "0px"})`,
              sm: `calc(100% - ${isSidebarOpen ? "256px" : "96px"})`,
            },
          }}
        >
          <ProfileTopNavBar
            user={user}
            notifications={notifications}
            setSelectedComponent={setSelectedComponent}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3, // equivalent to p-4
              backgroundColor:
                theme.palette.mode === "dark" ? "grey.900" : "background.paper",
              overflow: "auto",
              maxHeight: "100vh",
            }}
          >
            {renderComponent()}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Userprofile;

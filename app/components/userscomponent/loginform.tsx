// "use client";

// import { Mail, Lock } from "lucide-react";
// import Image from "next/image";
// import logo from "@/public/ajibestlogo.png";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";

// function Login() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [error, setError] = useState("");
//   const [user, setUser] = useState({
//     email: "",
//     password: "",
//   });
//   const { data: session } = useSession();

//   if (session) {
//     if (session.user.role === "Admin") {
//       router.push("/admin");
//       return null; // Ensure no further code is executed
//     }
//     router.push("/userprofile");
//     return null; // Ensure no further code is executed
//   }

//   const handleInputChange = (event: any) => {
//     const { name, value } = event.target;
//     return setUser((prevInfo) => ({ ...prevInfo, [name]: value }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (!user.email || !user.password) {
//         setError("Please fill all the fields");
//         setLoading(false);
//         return;
//       }

//       const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
//       if (!emailRegex.test(user.email)) {
//         setError("Invalid email id");
//         setLoading(false);
//         return;
//       }

//       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
//       if (!passwordRegex.test(user.password)) {
//         setError(
//           [
//             "Password must be at least 8 characters long",
//             "and contain at least one uppercase letter,",
//             "one lowercase letter, and one special character.",
//           ].join("\n")
//         );

//         setLoading(false);
//         return;
//       }

//       const res = await signIn("credentials", {
//         email: user.email,
//         password: user.password,
//         redirect: false,
//       });

//       if (res?.error) {
//         setError("Invalid email or password");
//       } else {
//         setError("");
//         router.push("/userprofile");
//       }
//     } catch (error) {
//       setError("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//       setUser({
//         email: "",
//         password: "",
//       });

//       // Clear error message after 5 seconds
//       setTimeout(() => {
//         setError("");
//       }, 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="grid place-items-center mx-auto max-w-4xl w-full py-10 min-h-screen">
//         <div className="flex justify-center items-center lg:flex-row flex-col gap-6 lg:gap-0 w-full shadow-md rounded-2xl">
//           <div className="w-full flex flex-col justify-center items-center py-6 bg-white dark:bg-slate-800 shadow-lg shadow-blue-600">
//             <div className="rounded px-4 py-2">
//               <Image
//                 src={logo}
//                 alt="bg"
//                 height={100}
//                 className="w-auto, h-auto"
//               />
//             </div>
//             <div className="text-blue-900 dark:text-white font-medium text-xl py-5">
//               Hello! Welcome Back
//             </div>

//             <form
//               className="w-full px-5 py-6 space-y-6"
//               onSubmit={handleSubmit}
//             >
//               <div className="flex flex-col w-full lg:px-5">
//                 <label className="text-sm">Email</label>
//                 <div className="bg-white flex justify-start items-start py-3 px-4 rounded text-slate-600 text-lg mt-1">
//                   <Mail className="w-7 h-7 text-blue-700" />
//                   <input
//                     type={"email"}
//                     placeholder="example@123.com"
//                     name="email"
//                     className="outline-none w-full px-4 bg-white"
//                     value={user.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col w-full lg:px-5">
//                 <label className="text-sm">Password</label>
//                 <div className="bg-white flex justify-start items-start py-3 px-4 rounded text-slate-600 text-lg mt-1">
//                   <Lock className="w-7 h-7 text-blue-700" />
//                   <input
//                     type={"password"}
//                     placeholder="**********"
//                     name="password"
//                     className="outline-none w-full px-4 bg-white"
//                     value={user.password}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="grid place-items-center w-full mx-auto pt-7">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-[#5D7DF3] text-white text-lg w-full px-8 py-3 rounded-md uppercase font-semibold"
//                   >
//                     {loading ? "Signing in..." : "Login"}
//                   </button>
//                 </div>
//                 {error && (
//                   <p className="text-red-500 text-center max-w-sm">{error}</p>
//                 )}
//                 <div className="flex justify-center w-full items-center gap-3 py-3">
//                   <div className="border-b border-gray-800 dark:border-white py-2 w-full px-6" />
//                   <div className="mt-3">or</div>
//                   <div className="border-b border-gray-800 dark:border-white py-2 w-full px-6" />
//                 </div>
//                 <div className="flex justify-center items-center w-full gap-8 pb-8">
//                   <button
//                     className="gsi-material-button"
//                     onClick={() => signIn("google")}
//                   >
//                     <div className="gsi-material-button-state"></div>
//                     <div className="gsi-material-button-content-wrapper">
//                       <div className="gsi-material-button-icon">
//                         <svg
//                           version="1.1"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 48 48"
//                           xmlnsXlink="http://www.w3.org/1999/xlink"
//                           style={{ display: "block" }}
//                         >
//                           <path
//                             fill="#EA4335"
//                             d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
//                           ></path>
//                           <path
//                             fill="#4285F4"
//                             d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
//                           ></path>
//                           <path
//                             fill="#FBBC05"
//                             d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
//                           ></path>
//                           <path
//                             fill="#34A853"
//                             d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
//                           ></path>
//                           <path fill="none" d="M0 0h48v48H0z"></path>
//                         </svg>
//                       </div>
//                       <span className="gsi-material-button-contents">
//                         Sign in with Google
//                       </span>
//                       <span style={{ display: "none" }}>
//                         Sign in with Google
//                       </span>
//                     </div>
//                   </button>
//                 </div>
//                 <div className="text-lg text-slate-900 font-medium">
//                   <span>Don&apos;t have an account?</span>
//                   <Link
//                     href="/signup"
//                     className="text-[#5D7DF3] pl-3 hover:underline"
//                   >
//                     Create an account
//                   </Link>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
"use client";

import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import logo from "@/public/ajibestlogo.png";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { data: session } = useSession();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Session redirection effect
  useEffect(() => {
    if (session) {
      if (session.user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/userprofile");
      }
    }
  }, [session, router]);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!user.email || !user.password) {
        setError("Please fill all the fields");
        setLoading(false);
        return;
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(user.email)) {
        setError("Invalid email address");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        setUser({ email: "", password: "" });
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/userprofile" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Don't render if session exists (will redirect)
  if (session) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1000,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Left Side - Branding */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "WhiteSmoke",
            color: "blue",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            gap: 3,
          }}
        >
          <Image
            src={logo}
            alt="Company Logo"
            width={120}
            height={120}
            style={{ objectFit: "contain" }}
          />
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Welcome Back!
          </Typography>
          <Typography variant="body1" textAlign="center">
            Sign in to access your account and continue your journey with us.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Image
              src={logo}
              alt="Company Logo"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary.main"
            textAlign={{ xs: "center", md: "left" }}
          >
            Sign In
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
            textAlign={{ xs: "center", md: "left" }}
          >
            Enter your credentials to access your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={user.email}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail color={theme.palette.primary.main} size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color={theme.palette.primary.main} size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              startIcon={
                googleLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    style={{ display: "block" }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )
              }
              sx={{
                py: 1.5,
                mb: 3,
                fontSize: "1rem",
              }}
            >
              Sign in with Google
            </Button>

            <Box textAlign="center">
              <Typography variant="body1">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;

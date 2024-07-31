// "use client";
// import { useState, useEffect } from "react";

// interface Notification {
//   _id: string;
//   message: string;
//   recipient: string;
//   createdAt: Date;
// }

// const NotificationForm = () => {
//   const [message, setMessage] = useState("");
//   const [recipient, setRecipient] = useState("all");
//   const [users, setUsers] = useState<{ email: string }[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [editId, setEditId] = useState<string>("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch("/api/users/getUsers");
//       const data = await response.json();
//       setUsers(data.data);
//     };

//     const fetchNotifications = async () => {
//       const response = await fetch("/api/notify");
//       const data = await response.json();
//       setNotifications(data.data);
//     };

//     fetchUsers();
//     fetchNotifications();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const url = editMode ? `/api/notify?id=${editId}` : "/api/notify";
//     const method = editMode ? "PUT" : "POST";

//     const response = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ message, recipient }),
//     });

//     if (response.ok) {
//       alert("Notification sent successfully");
//       setMessage("");
//       setRecipient("all");
//       setEditMode(false);
//       setEditId("");
//       // Refresh notifications
//       const res = await fetch("/api/notify");
//       const data = await res.json();
//       setNotifications(data.data);
//     } else {
//       alert("Failed to send notification");
//     }
//   };

//   const handleEdit = (notification: Notification) => {
//     setMessage(notification.message);
//     setRecipient(notification.recipient);
//     setEditMode(true);
//     setEditId(notification._id);
//   };

//   const handleDelete = async (id: string) => {
//     const response = await fetch(`/api/notify?id=${id}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       alert("Notification deleted successfully");
//       // Refresh notifications
//       setNotifications(notifications.filter((n) => n._id !== id));
//     } else {
//       alert("Failed to delete notification");
//     }
//   };

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-lg mx-auto p-4 bg-white shadow-md rounded mb-8"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="message"
//           >
//             Message
//           </label>
//           <textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           ></textarea>
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="recipient"
//           >
//             Recipient
//           </label>
//           <select
//             id="recipient"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           >
//             <option value="all">All Users</option>
//             {users.map((user) => (
//               <option key={user.email} value={user.email}>
//                 {user.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             {editMode ? "Update Notification" : "Send Notification"}
//           </button>
//         </div>
//       </form>

//       <div className="max-w-lg mx-auto">
//         <h2 className="text-xl font-bold mb-4">Existing Notifications</h2>
//         {notifications.map((notification) => (
//           <div
//             key={notification._id}
//             className="p-4 mb-4 bg-gray-100 shadow-md rounded"
//           >
//             <p className="text-gray-700">{notification.message}</p>
//             <p className="text-gray-500 text-sm">
//               Recipient: {notification.recipient}
//             </p>
//             <p className="text-gray-500 text-sm">
//               Created At: {new Date(notification.createdAt).toLocaleString()}
//             </p>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => handleEdit(notification)}
//                 className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(notification._id)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationForm;
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface User {
//   email: string;
//   phoneNumber: string;
// }

// interface Notification {
//   _id: string;
//   message: string;
//   recipient: string;
//   createdAt: Date;
// }

// const NotificationForm = () => {
//   const [message, setMessage] = useState("");
//   const [recipient, setRecipient] = useState("all");
//   const [users, setUsers] = useState<User[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [editId, setEditId] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch("/api/users/getUsers");
//       const data = await response.json();
//       setUsers(data.data);
//     };

//     const fetchNotifications = async () => {
//       const response = await fetch("/api/notify");
//       const data = await response.json();
//       setNotifications(data.data);
//     };

//     fetchUsers();
//     fetchNotifications();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const url = editMode ? `/api/notify?id=${editId}` : "/api/notify";
//     const method = editMode ? "PUT" : "POST";

//     const response = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ message, recipient }),
//     });

//     if (response.ok) {
//       alert("Notification sent successfully");
//       setMessage("");
//       setRecipient("all");
//       setEditMode(false);
//       setEditId("");
//       // Refresh notifications
//       const res = await fetch("/api/notify");
//       const data = await res.json();
//       setNotifications(data.data);

//       // Send SMS
//       const phoneNumbers =
//         recipient === "all"
//           ? users.map((user) => user.phoneNumber).join(",")
//           : users.find((user) => user.email === recipient)?.phoneNumber || "";

//       if (phoneNumbers) {
//         const smsResponse = await sendSMS(phoneNumbers, message);
//         if (!smsResponse.success) {
//           setError(`Failed to send SMS: ${smsResponse.message}`);
//         }
//       }
//     } else {
//       setError("Failed to send notification");
//     }
//   };

//   const sendSMS = async (recipient: string, message: string) => {
//     const senderName = process.env.NEXT_PUBLIC_SMS_SENDER as string;
//     const headers = {
//       "X-Token": process.env.NEXT_PUBLIC_VT_TOKEN as string,
//       "X-Secret": process.env.NEXT_PUBLIC_VT_SECRET as string,
//     };

//     try {
//       const response = await axios.get(
//         "https://messaging.vtpass.com/api/sms/sendsms",
//         {
//           params: {
//             sender: senderName,
//             recipient,
//             message,
//             responsetype: "json",
//           },
//           headers,
//         }
//       );

//       const responseCode = response.data?.code;
//       if (responseCode === "0000" || responseCode === "1111") {
//         return { success: true, message: "SMS sent successfully" };
//       } else {
//         return {
//           success: false,
//           message: response.data?.message || "Failed to send SMS",
//         };
//       }
//     } catch (error) {
//       return { success: false, message: "Error sending SMS" };
//     }
//   };

//   const handleEdit = (notification: Notification) => {
//     setMessage(notification.message);
//     setRecipient(notification.recipient);
//     setEditMode(true);
//     setEditId(notification._id);
//   };

//   const handleDelete = async (id: string) => {
//     const response = await fetch(`/api/notify?id=${id}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       alert("Notification deleted successfully");
//       setNotifications(notifications.filter((n) => n._id !== id));
//     } else {
//       alert("Failed to delete notification");
//     }
//   };

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-lg mx-auto p-4 bg-white shadow-md rounded mb-8"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="message"
//           >
//             Message
//           </label>
//           <textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           ></textarea>
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="recipient"
//           >
//             Recipient
//           </label>
//           <select
//             id="recipient"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           >
//             <option value="all">All Users</option>
//             {users.map((user) => (
//               <option key={user.email} value={user.email}>
//                 {user.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             {editMode ? "Update Notification" : "Send Notification"}
//           </button>
//         </div>
//       </form>

//       <div className="max-w-lg mx-auto">
//         <h2 className="text-xl font-bold mb-4">Existing Notifications</h2>
//         {notifications.map((notification) => (
//           <div
//             key={notification._id}
//             className="p-4 mb-4 bg-gray-100 shadow-md rounded"
//           >
//             <p className="text-gray-700">{notification.message}</p>
//             <p className="text-gray-500 text-sm">
//               Recipient: {notification.recipient}
//             </p>
//             <p className="text-gray-500 text-sm">
//               Created At: {new Date(notification.createdAt).toLocaleString()}
//             </p>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => handleEdit(notification)}
//                 className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(notification._id)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationForm;
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

interface User {
  email: string;
  phoneNumber: string;
}

interface Notification {
  _id: string;
  message: string;
  recipient: string;
  createdAt: Date;
}

const NotificationForm = () => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const smsResponseMessages: { [key: string]: string } = {
    TG00: "MESSAGE PROCESSED",
    TG11: "Invalid Authentication Credentials",
    TG14: "Empty Recipients",
    TG15: "Empty Message",
    TG17: "Not Enough Units Balance",
    TG20: "Recipients above the maximum target",
    "0000": "MESSAGE SENT TO PROVIDER",
    "1111": "MESSAGE DELIVERED TO HANDSET",
    "2222": "MESSAGE REJECTED",
    "0014": "MESSAGE SENT THROUGH COOPERATE",
    "3333": "DND_REJECTED_NUMBER",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/getUsers", {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        setError("Failed to fetch users.");
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notify", {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });

        const data = await response.json();
        setNotifications(data.data);
      } catch (error) {
        setError("Failed to fetch notifications.");
      }
    };

    fetchUsers();
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editMode ? `/api/notify?id=${editId}` : "/api/notify";
    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, recipient }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send notification");
      }

      setSuccess("Notification sent successfully");
      setMessage("");
      setRecipient("all");
      setEditMode(false);
      setEditId("");

      const res = await fetch("/api/notify");
      const data = await res.json();
      setNotifications(data.data);

      const phoneNumbers =
        recipient === "all"
          ? users.map((user) => user.phoneNumber).join(",")
          : users.find((user) => user.email === recipient)?.phoneNumber || "";

      if (phoneNumbers) {
        const smsResponse = await sendSMS(phoneNumbers, message);
        console.log(smsResponse);
        if (!smsResponse.success) {
          throw new Error(smsResponse.message);
        } else {
          setSuccess("SMS Sent successfully");
        }
      }
    } catch (error) {
      console.log(error);
      setError("Sending SMS Failed");
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (recipient: string, message: string) => {
    const senderName = process.env.NEXT_PUBLIC_SMS_SENDER as string;
    const headers = {
      "X-Token": process.env.NEXT_PUBLIC_VT_TOKEN as string,
      "X-Secret": process.env.NEXT_PUBLIC_VT_SECRET as string,
    };

    try {
      const response = await axios.get(
        "https://messaging.vtpass.com/api/sms/sendsms",
        {
          params: {
            sender: senderName,
            recipient,
            message,
            responsetype: "json",
          },
          headers,
        }
      );

      const responseCode = response.data?.responseCode;
      const responseMessage =
        smsResponseMessages[responseCode] || "Failed to send SMS";

      if (responseCode === "TG00") {
        const messageDetails = response.data.messages[0];
        const messageStatus = messageDetails.statusCode;

        if (messageStatus === "0000" || messageStatus === "1111") {
          return { success: true, message: messageDetails.description };
        } else {
          return { success: false, message: messageDetails.description };
        }
      } else {
        return { success: false, message: responseMessage };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || "Error sending SMS",
        };
      } else {
        return {
          success: false,
          message: "Unexpected error occurred while sending SMS",
        };
      }
    }
  };

  const handleEdit = (notification: Notification) => {
    setMessage(notification.message);
    setRecipient(notification.recipient);
    setEditMode(true);
    setEditId(notification._id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notify?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete notification");
      }

      setSuccess("Notification deleted successfully");
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      // setError(error.message);
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notification Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Select
            label="Recipient"
            fullWidth
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <MenuItem value="all">All Users</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.email} value={user.email}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : editMode ? (
              "Update Notification"
            ) : (
              "Send Notification"
            )}
          </Button>
        </form>
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
        >
          <Alert onClose={() => setSuccess("")} severity="success">
            {success}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
        <Box mt={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Existing Notifications
          </Typography>
          {notifications.map((notification) => (
            <Box
              key={notification._id}
              p={2}
              mb={2}
              bgcolor="grey.100"
              boxShadow={2}
              borderRadius={2}
            >
              <Typography>{notification.message}</Typography>
              <Typography variant="body2" color="textSecondary">
                Recipient: {notification.recipient}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created At: {new Date(notification.createdAt).toLocaleString()}
              </Typography>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(notification)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(notification._id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default NotificationForm;

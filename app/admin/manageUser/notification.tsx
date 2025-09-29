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
          headers: {
            ...headers,
            "Cache-Control": "no-cache, no-store",
          },
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

"use client";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/aapi/users/getUsers", {
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
        const smsResponse = await fetch("/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: phoneNumbers,
            message: message,
          }),
        });

        const smsData = await smsResponse.json();

        if (!smsData.success) {
          throw new Error(smsData.message);
        } else {
          setSuccess("Notification and SMS sent successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Sending SMS Failed");
    } finally {
      setLoading(false);
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
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification");
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
            sx={{ mt: 2 }}
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
              <LoadingSpinner />
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

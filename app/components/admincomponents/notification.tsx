"use client";
import { useState, useEffect } from "react";

interface Notification {
  _id: string;
  message: string;
  recipient: string;
  createdAt: Date;
}

const NotificationForm = () => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [users, setUsers] = useState<{ email: string }[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users/getUsers");
      const data = await response.json();
      setUsers(data.data);
    };

    const fetchNotifications = async () => {
      const response = await fetch("/api/notify");
      const data = await response.json();
      setNotifications(data.data);
    };

    fetchUsers();
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editMode ? `/api/notify?id=${editId}` : "/api/notify";
    const method = editMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, recipient }),
    });

    if (response.ok) {
      alert("Notification sent successfully");
      setMessage("");
      setRecipient("all");
      setEditMode(false);
      setEditId("");
      // Refresh notifications
      const res = await fetch("/api/notify");
      const data = await res.json();
      setNotifications(data.data);
    } else {
      alert("Failed to send notification");
    }
  };

  const handleEdit = (notification: Notification) => {
    setMessage(notification.message);
    setRecipient(notification.recipient);
    setEditMode(true);
    setEditId(notification._id);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/notify?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Notification deleted successfully");
      // Refresh notifications
      setNotifications(notifications.filter((n) => n._id !== id));
    } else {
      alert("Failed to delete notification");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white shadow-md rounded mb-8"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="recipient"
          >
            Recipient
          </label>
          <select
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.email} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editMode ? "Update Notification" : "Send Notification"}
          </button>
        </div>
      </form>

      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Existing Notifications</h2>
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="p-4 mb-4 bg-gray-100 shadow-md rounded"
          >
            <p className="text-gray-700">{notification.message}</p>
            <p className="text-gray-500 text-sm">
              Recipient: {notification.recipient}
            </p>
            <p className="text-gray-500 text-sm">
              Created At: {new Date(notification.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleEdit(notification)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(notification._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationForm;

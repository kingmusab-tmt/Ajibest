"use client";
import { useState, useEffect } from "react";
import UserCard from "./userCard";
import UserProfile from "./userprofile";
import { User } from "../../../constants/interface";
import {
  Box,
  Container,
  Grid,
  Modal,
  IconButton,
  Button,
  Typography,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close, Refresh } from "@mui/icons-material";
import LoadingSpinner from "@/app/components/generalcomponents/loadingSpinner";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/aapi/users/getUsers", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user || null);
  };

  const handleEditUser = (userId: string) => {
    // Handle edit user
    // console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // Handle delete user
    // console.log("Delete user:", userId);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={fetchUsers}>
              <Refresh />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Failed to load users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please check your connection and try again
          </Typography>
          <IconButton
            onClick={fetchUsers}
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <Refresh sx={{ mr: 1 }} />
            Retry
          </IconButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Manage and view all user accounts in the system
        </Typography>

        {/* Stats Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {users.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {users.filter((u) => u.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {users.filter((u) => u.role === "Admin").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrators
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {users.reduce(
                    (total, user) => total + user.numberOfReferrals,
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Referrals
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Users Grid */}
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user._id}>
            <UserCard
              user={user}
              onViewProfile={handleViewProfile}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {users.length === 0 && (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Users Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            There are no users in the system yet.
          </Typography>
          <IconButton
            onClick={fetchUsers}
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <Refresh sx={{ mr: 1 }} />
            Refresh
          </IconButton>
        </Paper>
      )}

      {/* User Profile Modal */}
      <Modal
        open={!!selectedUser}
        onClose={handleCloseProfile}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "50vw",
            height: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main,
              color: "white",
            }}
          >
            <Typography variant="h6" component="h2">
              User Profile - {selectedUser?.name}
            </Typography>
            <IconButton
              onClick={handleCloseProfile}
              sx={{ color: "white" }}
              size="large"
            >
              <Close />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: { xs: 1, md: 0 },
            }}
          >
            {selectedUser && <UserProfile user={selectedUser} />}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseProfile}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UsersPage;

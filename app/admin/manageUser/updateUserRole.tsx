"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

interface User {
  _id: number;
  name: string;
  role: "User" | "Agent" | "Admin";
}

const UserRoleComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/aapi/users/getUsers", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users: ", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: number, newRole: User["role"]) => {
    setLoading(true);
    try {
      await axios.patch(`/api/aapi/users/updateuser?id=${id}`, {
        role: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(`Failed to update role for user ID ${id}: `, error);
      setError(`Failed to update role for user`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Agent":
        return "warning";
      case "User":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users by name"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Current Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Change Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:hover": { backgroundColor: "grey.50" } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon color="action" />
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value as User["role"])
                    }
                  >
                    <FormControlLabel
                      value="User"
                      control={<Radio />}
                      label="User"
                    />
                    <FormControlLabel
                      value="Agent"
                      control={<Radio />}
                      label="Agent"
                    />
                    <FormControlLabel
                      value="Admin"
                      control={<Radio />}
                      label="Admin"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredUsers.length / usersPerPage)}
          page={currentPage + 1}
          onChange={(event, page) => setCurrentPage(page - 1)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default UserRoleComponent;

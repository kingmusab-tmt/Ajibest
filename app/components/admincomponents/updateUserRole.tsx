"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

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
    try {
      const response = await axios.get("/api/users/getUsers", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      }); // Replace with your API endpoint

      setUsers(response.data.data); // Assuming response.data contains an array of users
    } catch (error) {
      console.error("Failed to fetch users: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: number, newRole: User["role"]) => {
    setLoading(true);
    try {
      await axios.patch(`/api/users/updateuser?id=${id}`, { role: newRole }); // Replace with your API endpoint for updating user role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(`Failed to update role for user ID ${id}: `, error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <div className="overflow-x-auto p-4">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full sm:w-1/2 lg:w-1/3"
      />
      <div className="overflow-y-auto overflow-x-auto max-h-screen max-w-80 sm:max-w-full ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Agent
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={user.role === "User"}
                    onChange={() => handleRoleChange(user._id, "User")}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={user.role === "Agent"}
                    onChange={() => handleRoleChange(user._id, "Agent")}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={user.role === "Admin"}
                    onChange={() => handleRoleChange(user._id, "Admin")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={
            "pagination flex justify-center items-center mt-4"
          }
          activeClassName={"active"}
          pageClassName={"page-item mx-1"}
          pageLinkClassName={
            "page-link px-2 py-1 border rounded-md hover:bg-gray-200"
          }
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={
            "page-link px-2 py-1 border rounded-md hover:bg-gray-200"
          }
          nextLinkClassName={
            "page-link px-2 py-1 border rounded-md hover:bg-gray-200"
          }
        />
      </div>
    </div>
  );
};

export default UserRoleComponent;

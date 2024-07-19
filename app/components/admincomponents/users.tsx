import { useState, useEffect } from "react";
import UserCard from "./userCard";
import UserProfile from "./userprofile";
import { User } from "../../../constants/interface";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users/getUsers");
      const data = await res.json();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  const handleViewProfile = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user || null);
  };

  const handleEditUser = (userId: string) => {
    // Handle edit user
  };

  const handleDeleteUser = (userId: string) => {
    // Handle delete user
  };

  return (
    <div className="p-4 shadow rounded-md container mx-auto h-screen flex flex-col">
      <div className="overflow-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onViewProfile={handleViewProfile}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <UserProfile user={selectedUser} />
            <button
              className="mt-4 bg-red-500 text-white w-full py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

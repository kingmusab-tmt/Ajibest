import { FC, useState } from "react";
import Image from "next/image";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    role: string;
    address: string;
    email: string;
    phoneNumber: string;
    image: string;
  };
  onViewProfile: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserCard: FC<UserCardProps> = ({
  user,
  onViewProfile,
  onEdit,
  onDelete,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const isUrl = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(user.image) ? user.image : `/uploads/${user.image}`;
  return (
    <div className="border rounded-lg p-4 max-w-xs">
      <div className="relative mr-2">
        <button
          className="absolute top-0 right-0"
          onClick={() => {
            setShowDropdown(!showDropdown);
            setSelectedUserId(user._id);
          }}
        >
          <span className="text-black">⋮</span>
        </button>
        {showDropdown && selectedUserId === user._id && (
          <div className="absolute top-0 right-4 mt-0 bg-white shadow-lg rounded-lg">
            <button
              className="block px-4 py-2 text-sm text-gray-700"
              onClick={() => onEdit(user._id)}
            >
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm text-red-700"
              onClick={() => onDelete(user._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={user.name}
        width={100}
        height={100}
        className="rounded-full w-16 h-16 mx-auto"
      />

      <h2 className="text-center font-bold">{user.name}</h2>
      <p className="text-center text-gray-500">{user.role}</p>
      <div className="flex justify-between mt-4">
        <p className="text-sm text-gray-600">
          <strong>Location:</strong> {user.address}
        </p>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-600">
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white w-full py-2 rounded"
        onClick={() => onViewProfile(user._id)}
      >
        View Profile
      </button>
    </div>
  );
};

export default UserCard;

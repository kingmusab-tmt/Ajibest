"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditableImage from "../generalcomponents/Image";

const PersonalInformation = () => {
  const { data: session, status, update } = useSession();
  const [image, setImage] = useState(session?.user?.image || "");
  const [imageChanged, setImageChanged] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    bvnOrNin: "",
    country: "",
    state: "",
    lga: "",
    address: "",
    image: "",
  });
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/getSingleUser")
        .then((response) => response.json())
        .then((data) => {
          setProfile(data.data);
          setImage(data.data.image);
        });
    }
  }, [session, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSave = async () => {
    const updatedProfile = {};
    for (const key in profile) {
      if (changedFields[key]) {
        updatedProfile[key] = profile[key];
      }
    }

    if (imageChanged) {
      updatedProfile["image"] = image;
    }

    await fetch("/api/users/updateuser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          alert("Profile updated successfully");
          setChangedFields({}); // Reset changed fields after successful update
          setImageChanged(false); // Reset image changed flag
        } else {
          alert("Failed to update profile");
        }
      });
    update();
  };

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

  const imageSrc = isUrl(image) ? image : `/uploads/${image}`;

  return (
    <div className="p-4 bg-white dark:bg-slate-800 shadow rounded-md overflow-y-auto sm:overflow-y-auto sm:max-h-full">
      <div className="max-w-lg mx-auto mt-4 p-6 bg-white dark:bg-slate-800 dark:shadow-white  rounded-lg shadow-lg overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <div>
          <div className="p-2 rounded-lg relative max-w-[150px]">
            <EditableImage link={imageSrc} setLink={handleImageChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              Fullname
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">Email</label>
            <input
              type="email"
              disabled
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              BVN/NIN
            </label>
            <input
              type="text"
              name="bvnOrNin"
              value={profile.bvnOrNin}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={profile.country}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">State</label>
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">
              Local Government Area
            </label>
            <input
              type="text"
              name="lga"
              value={profile.lga}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PersonalInformation;

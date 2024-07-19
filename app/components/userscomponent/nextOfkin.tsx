// components/NextOfKinDetail.tsx

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditableImage from "../generalcomponents/Image";

const NextOfKinDetail: React.FC = () => {
  const { data: session, status } = useSession();
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [profile, setProfile] = useState({
    nextOfKin: {
      name: "",
      phoneNumber: "",
      address: "",
      email: "",
      userAccountNumber: "",
      userBankName: "",
      image: "",
    },
  });
  const [changedFields, setChangedFields] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/getSingleUser")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data && data.data.nextOfKin) {
            setProfile({ nextOfKin: data.data.nextOfKin });
            setImage(data.data.nextOfKin.image);
          }
        });
    }
  }, [session, status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      nextOfKin: { ...prevProfile.nextOfKin, [name]: value },
    }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSave = async () => {
    const updatedProfile: { [key: string]: any } = {};
    for (const key in profile.nextOfKin) {
      if (changedFields[key]) {
        updatedProfile[`nextOfKin.${key}`] = profile.nextOfKin[key];
      }
    }

    if (imageChanged) {
      updatedProfile["nextOfKin.image"] = image;
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
  };

  const isUrl = (str: string) => {
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
  const banks = [
    "Access Bank",
    "Citibank",
    "Diamond Bank",
    "Ecobank Nigeria",
    "Fidelity Bank Nigeria",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank Plc",
    "Jaiz Bank Plc",
    "Keystone Bank Limited",
    "Providus Bank Plc",
    "Polaris Bank",
    "Stanbic IBTC Bank Nigeria Limited",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Suntrust Bank Nigeria Limited",
    "Taj Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank Plc",
    "Wema Bank",
    "Zenith Bank",
  ];

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4">Next of Kin Detail</h2>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div>
          <div className="p-2 rounded-lg relative max-w-[150px]">
            <EditableImage link={imageSrc} setLink={handleImageChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.nextOfKin.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={profile.nextOfKin.address}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.nextOfKin.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.nextOfKin.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Account Number</label>
            <input
              type="text"
              name="userAccountNumber"
              value={profile.nextOfKin.userAccountNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Bank Name</label>
            <select
              name="userBankName"
              value={profile.nextOfKin.userBankName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NextOfKinDetail;

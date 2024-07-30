"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateProperty from "./updateProperty";
import { FaCheckSquare, FaEdit } from "react-icons/fa";
import { Property } from "@/constants/interface";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [selectedPropertyForEditById, setSelectedPropertyForEditById] =
    useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [filter, setFilter] = useState({
    rented: null as boolean | null,
    purchased: null as boolean | null,
    location: "",
    size: "",
  });
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/property/getproperties", {
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      })
      .then((response) => {
        setProperties(response.data.data);
      });
  }, []);

  const filteredProperties = properties
    .filter((property) => {
      const isRented =
        filter.rented === null ||
        (filter.rented === true &&
          property.rented === true &&
          property.listingPurpose === "For Renting") ||
        (filter.rented === false &&
          property.rented === false &&
          property.listingPurpose === "For Renting");
      const isPurchased =
        filter.purchased === null ||
        (filter.purchased === true &&
          property.purchased === true &&
          property.listingPurpose === "For Sale") ||
        (filter.purchased === false &&
          property.purchased === false &&
          property.listingPurpose === "For Sale");
      const isLocation =
        filter.location === "" || property.location.includes(filter.location);
      const isSize =
        filter.size === "" ||
        (filter.size === "quarter" && property.size === "Quarter Plot") ||
        (filter.size === "half" && property.size === "Half Plot") ||
        (filter.size === "full" && property.size === "Full Plot");
      return isRented && isPurchased && isLocation && isSize;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const rentedPurchasedCount = properties.filter(
    (p) =>
      (p.listingPurpose === "For Renting" && p.rented) ||
      (p.listingPurpose === "For Sale" && p.purchased)
  ).length;
  const onRentSaleCount = properties.filter(
    (p) =>
      (p.listingPurpose === "For Renting" && !p.rented) ||
      (p.listingPurpose === "For Sale" && !p.purchased)
  ).length;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const handleDelete = (_id: string) => {
    axios.delete(`/api/property/deleteproperty?id=${_id}`).then(() => {
      setProperties(properties.filter((property) => property._id !== _id));
    });
  };

  const handleEdit = (propertyId: string) => {
    setSelectedPropertyForEditById(propertyId);
    setShowForm(true);
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

  return (
    <div className="shadow rounded-md container mx-auto h-screen flex flex-col">
      <div className="flex flex-wrap justify-around">
        <div className="flex-col bg-white p-4 rounded-md mb-2 flex items-center">
          <FaCheckSquare className="w-6 h-6 text-green-600" />
          <h3 className="text-green-600">Rented/Sold: </h3>
          <p className="text-green-800 text-2xl">{rentedPurchasedCount}</p>
        </div>
        <div className="flex-col bg-white p-4 rounded-md mb-2 flex items-center">
          <FaEdit className="w-6 h-6 text-purple-600" />
          <h3 className="text-purple-600">On-Rent/Sale: </h3>
          <p className="text-purple-800 text-2xl">{onRentSaleCount}</p>
        </div>
      </div>

      <div className="mx-4 flex flex-wrap justify-between mb-4 space-y-2 sm:space-y-0">
        <select
          className="border p-2 rounded mb-2 sm:mb-0"
          onChange={(e) =>
            setFilter({
              ...filter,
              rented:
                e.target.value === "any" ? null : e.target.value === "true",
            })
          }
        >
          <option value="any">Rented Status</option>
          <option value="true">Rented</option>
          <option value="false">Not Rented</option>
        </select>
        <select
          className="border p-2 rounded mb-2 sm:mb-0"
          onChange={(e) =>
            setFilter({
              ...filter,
              purchased:
                e.target.value === "any" ? null : e.target.value === "true",
            })
          }
        >
          <option value="any">Purchased Status</option>
          <option value="true">Purchased</option>
          <option value="false">Not Purchased</option>
        </select>
        <input
          type="text"
          className="border p-2 rounded mb-2 sm:mb-0"
          placeholder="Location"
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
        />
        <select
          className="border p-2 rounded mb-2 sm:mb-0"
          onChange={(e) => setFilter({ ...filter, size: e.target.value })}
        >
          <option value="">Size</option>
          <option value="quarter">Quarter</option>
          <option value="half">Half</option>
          <option value="full">Full</option>
        </select>
      </div>

      <div className="m-4 space-y-4 overflow-y-auto flex-1">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="flex flex-col sm:flex-row border rounded-md p-4"
          >
            <Image
              src={
                isUrl(property.image)
                  ? property.image
                  : `/uploads/${property.image}`
              }
              alt={property.title}
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-md mr-4 mb-2 sm:mb-0"
            />
            <div className="flex flex-col justify-between flex-1">
              <div className="flex sm:flex-row flex-col justify-between mr-10">
                <div>
                  <h3 className="sm:text-xl font-semibold sm:mb-2">Title</h3>
                  <p className="text-gray-600">{property.title}</p>
                </div>
                <div>
                  <h3 className="sm:text-xl font-semibold sm:mb-2">Location</h3>
                  <p className="text-gray-600">{property.location}</p>
                </div>
                <div>
                  <h3 className="sm:text-xl font-semibold sm:mb-2">
                    Property Type
                  </h3>
                  <p className="text-gray-600">{property.propertyType}</p>
                </div>
                <div>
                  <h3 className="sm:text-xl font-semibold sm:mb-2">Price</h3>
                  <p className="text-gray-800 font-semibold">
                    {formatter.format(Number(property.price))}
                  </p>
                </div>
                <div>
                  <h3 className="sm:text-xl font-semibold mb-2">
                    Property Size
                  </h3>
                  <p className="text-gray-600">{property.size}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto">
              <p
                className={`text-white p-2 rounded-md ${
                  property.listingPurpose === "For Sale"
                    ? "bg-purple-500"
                    : "bg-blue-500"
                }`}
              >
                {property.listingPurpose === "For Sale"
                  ? property.purchased
                    ? "Sold"
                    : "For Sale"
                  : property.listingPurpose === "For Renting"
                  ? property.rented
                    ? "Rented"
                    : "On-Rent"
                  : ""}
              </p>
              <div className="relative ml-4 sm:ml-10">
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setSelectedPropertyId(property._id);
                  }}
                  className="text-3xl text-gray-500 hover:text-gray-700"
                >
                  ...
                </button>
                {showDropdown && selectedPropertyId === property._id && (
                  <div className="absolute right-0 bg-white shadow-md rounded-md mt-2">
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      onClick={() => handleEdit(property._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      onClick={() => handleDelete(property._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && selectedPropertyId && (
        <UpdateProperty propertyId={selectedPropertyId} />
      )}
    </div>
  );
}

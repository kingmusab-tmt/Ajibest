"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditableImage from "../generalcomponents/Image";
import MessageModal from "../generalcomponents/messageModal";

interface PropertyFormProps {
  propertyId: string;
}

const UpdateProperty: React.FC<PropertyFormProps> = ({ propertyId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [changedFields, setChangedFields] = useState({});
  const router = useRouter();

  const [property, setProperty] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    propertyType: "House",
    price: 0,
    listingPurpose: "For Renting",
    bedrooms: 0,
    rentalDuration: 0,
    bathrooms: 0,
    amenities: "",
    plotNumber: 0,
    utilities: "",
    purchased: false,
    rented: false,
    size: "",
    createdAt: new Date(),
  });

  const handleSuccess = (title: string, message: string) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleError = (title: string, message: string) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const useErrorHandling = () => {
    const [errors, setErrors] = useState({});

    const setErrorWithTimeout = (message: string) => {
      setErrors(message);
      setTimeout(() => {
        setErrors("");
      }, 5000);
    };

    return { errors, setErrorWithTimeout };
  };
  const { errors, setErrorWithTimeout } = useErrorHandling();

  useEffect(() => {
    if (propertyId) {
      axios
        .get(`/api/property/getsingleproperty?id=${propertyId}`)
        .then((response) => {
          setProperty(response.data.data);
          setImage(response.data.data.image);
        });
    }
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProperty((prevProperty) => ({ ...prevProperty, [name]: checked }));
    } else {
      setProperty((prevProperty) => ({ ...prevProperty, [name]: value }));
    }
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSubmit = () => {
    const updateProperty = {};
    for (const key in property) {
      if (changedFields[key]) {
        updateProperty[key] = property[key];
      }
    }
    if (imageChanged) {
      updateProperty["image"] = image;
    }
    axios
      .put(
        `/api/property/updateproperty?id=${propertyId}`,
        JSON.stringify(updateProperty),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        handleSuccess("Property Updated Successfully", "Close to Continue");
        // router.push("/properties"); // Redirect to properties list after successful update
      })
      .catch((error) => {
        setErrorWithTimeout(error);
        console.error("Failed to update property", error);
      });
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
  const listPurposes = ["For Renting", "For Sale"];
  const propTypes = ["House", "Farm", "Land"];
  const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
  const bedrooms = [1, 2, 3, 4];

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Update the Selected Property
        </h2>
        <div>
          <div className="p-2 rounded-lg relative max-w-[150px]">
            <EditableImage link={imageSrc} setLink={handleImageChange} />
            {errors["image"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["image"].message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Property Title</label>
            <input
              type="text"
              name="title"
              value={property.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["title"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["title"].message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Property Description</label>
            <input
              type="text"
              name="description"
              value={property.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["description"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["description"].message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Property Address</label>
            <input
              type="text"
              name="location"
              value={property.location}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["location"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["location"].message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Listing Purpose</label>
            <select
              name="listingPurpose"
              value={property.listingPurpose}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Listing Purpose</option>
              {listPurposes.map((listPurpose) => (
                <option key={listPurpose} value={listPurpose}>
                  {listPurpose}
                </option>
              ))}
            </select>
            {errors["listingPurpose"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["listingPurpose"].message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Property Price</label>
            <input
              type="number"
              name="price"
              value={property.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["price"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["price"].message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Property Plot Size </label>
            <select
              name="size"
              value={property.size}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Property Size</option>
              {propSizes.map((propSize) => (
                <option key={propSize} value={propSize}>
                  {propSize}
                </option>
              ))}
            </select>
            {errors["size"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["size"].message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Rent Duration</label>
            <input
              type="number"
              name="rentalDuration"
              value={property.rentalDuration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors["rentalDuration"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["rentalDuration"].message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amenities</label>
            <input
              type="text"
              name="amenities"
              value={property.amenities}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["amenities"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["amenities"].message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Purchased</label>
            <input
              type="checkbox"
              name="purchased"
              checked={property.purchased}
              onChange={handleChange}
              className="mt-1"
            />
            {errors["purchased"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["purchased"].message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rented</label>
            <input
              type="checkbox"
              name="rented"
              checked={property.rented}
              onChange={handleChange}
              className="mt-1"
            />
            {errors["rented"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["rented"].message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-6">
            <label className="block text-gray-700">Property Type</label>
            <select
              name="propertyType"
              value={property.propertyType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Property Type</option>
              {propTypes.map((propType) => (
                <option key={propType} value={propType}>
                  {propType}
                </option>
              ))}
            </select>
            {errors["propertyType"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["propertyType"].message}
              </p>
            )}
          </div>
          <div className="mb-4">
            {(property.propertyType === "Land" ||
              property.propertyType === "Farm") && (
              <div className="mb-4">
                <label className="block text-gray-700">Plot Number</label>
                <input
                  type="number"
                  name="price"
                  value={property.plotNumber}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
                {errors["plotNumber"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["plotNumber"].message}
                  </p>
                )}
              </div>
            )}
            {property.propertyType === "House" && (
              <div className="mb-6">
                <label className="block text-gray-700">No of Bedrooms</label>
                <select
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select No of Bedroom(s)</option>
                  {bedrooms.map((bedroom) => (
                    <option key={bedroom} value={bedroom}>
                      {bedroom}
                    </option>
                  ))}
                </select>
                {errors["bedrooms"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["bedrooms"].message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            onClick={() => handleSubmit()}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
          >
            Update Property
          </button>
          <MessageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalTitle}
            message={modalMessage}
            type={modalType}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateProperty;

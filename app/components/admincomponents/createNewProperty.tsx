"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditableImage from "../generalcomponents/Image";
import MessageModal from "../generalcomponents/messageModal";

const NewProperty = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [property, setProperty] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    propertyType: "",
    price: "",
    listingPurpose: "",
    bedrooms: "",
    rentalDuration: "",
    bathrooms: "",
    amenities: "",
    plotNumber: "",
    utilities: "",
    purchased: false,
    rented: false,
    instamentAllowed: true,
    size: "",
  });
  const [changedFields, setChangedFields] = useState({});
  // const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: type === "checkbox" ? checked : value,
    }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: true,
    }));
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const handleSave = async (action) => {
    const createProperty = {};
    for (const key in property) {
      if (changedFields[key]) {
        createProperty[key] = property[key];
      }
    }

    if (imageChanged) {
      createProperty["image"] = image;
    }

    try {
      const response = await fetch("/api/property/newproperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createProperty),
      });

      const data = await response.json();
      if (response.ok) {
        handleSuccess("Property Listed Successfully", "Close to Continue");
        if (action === "createAnother") {
          setProperty({
            title: "",
            description: "",
            location: "",
            image: "",
            propertyType: "",
            price: "",
            listingPurpose: "",
            bedrooms: "",
            rentalDuration: "",
            bathrooms: "",
            amenities: "",
            plotNumber: "",
            utilities: "",
            purchased: false,
            rented: false,
            instamentAllowed: true,
            size: "",
          });
          setChangedFields({});
          setImageChanged(false);
          setErrorWithTimeout("");
        } else if (action === "exit") {
          router.push("/admin");
        }
      } else {
        setErrorWithTimeout(data.details.errors);
      }
    } catch (error) {
      console.log(error);
    }
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
        <h2 className="text-2xl font-bold mb-4">List a New Property</h2>
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
        {property.listingPurpose === "For Renting" && (
          <div className="mb-6">
            <label className="block text-gray-700">Rental Duration</label>
            <input
              type="text"
              name="rentalDuration"
              value={property.rentalDuration}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors["rentalDuration"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["rentalDuration"].message}
              </p>
            )}
          </div>
        )}
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
            <label className="block text-gray-700">Property Plot Size</label>
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
                  name="plotNumber"
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
              <>
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
                <div className="mb-6">
                  <label className="block text-gray-700">No of Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  {errors["bathrooms"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["bathrooms"].message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
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
                <div className="mb-6">
                  <label className="block text-gray-700">Utilities</label>
                  <input
                    type="text"
                    name="utilities"
                    value={property.utilities}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  {errors["utilities"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["utilities"].message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Purchased</label>
          <input
            type="checkbox"
            name="purchased"
            checked={property.purchased}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Rented</label>
          <input
            type="checkbox"
            name="rented"
            checked={property.rented}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Instalment Allowed</label>
          <input
            type="checkbox"
            name="instamentAllowed"
            checked={property.instamentAllowed}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleSave("createAnother")}
            className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-md"
          >
            Save and Create Another
          </button>
          <button
            onClick={() => handleSave("exit")}
            className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-md"
          >
            Save and Exit
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

export default NewProperty;

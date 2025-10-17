// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import EditableImage from "../../components/generalcomponents/Image";
// import MessageModal from "../../components/generalcomponents/messageModal";

// const NewProperty = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<
//     "success" | "error" | "info" | "warning"
//   >("success");
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");

//   const router = useRouter();
//   const [image, setImage] = useState("");
//   const [imageChanged, setImageChanged] = useState(false);
//   const [property, setProperty] = useState({
//     title: "",
//     description: "",
//     location: "",
//     image: "",
//     propertyType: "",
//     price: "",
//     listingPurpose: "",
//     bedrooms: "",
//     rentalDuration: "",
//     bathrooms: "",
//     amenities: "",
//     plotNumber: "",
//     utilities: "",
//     purchased: false,
//     rented: false,
//     instamentAllowed: true,
//     size: "",
//   });
//   const [changedFields, setChangedFields] = useState({});
//   // const [errors, setErrors] = useState({});

//   const handleSuccess = (title: string, message: string) => {
//     setModalType("success");
//     setModalTitle(title);
//     setModalMessage(message);
//     setIsModalOpen(true);
//   };

//   const handleError = (title: string, message: string) => {
//     setModalType("error");
//     setModalTitle(title);
//     setModalMessage(message);
//     setIsModalOpen(true);
//   };

//   const useErrorHandling = () => {
//     const [errors, setErrors] = useState({});

//     const setErrorWithTimeout = (message: string) => {
//       setErrors(message);
//       setTimeout(() => {
//         setErrors("");
//       }, 5000);
//     };

//     return { errors, setErrorWithTimeout };
//   };
//   const { errors, setErrorWithTimeout } = useErrorHandling();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProperty((prevProperty) => ({
//       ...prevProperty,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setChangedFields((prevChangedFields) => ({
//       ...prevChangedFields,
//       [name]: true,
//     }));
//   };

//   const handleImageChange = (newImage) => {
//     setImage(newImage);
//     setImageChanged(true);
//   };

//   const handleSave = async (action) => {
//     const createProperty = {};
//     for (const key in property) {
//       if (changedFields[key]) {
//         createProperty[key] = property[key];
//       }
//     }

//     if (imageChanged) {
//       createProperty["image"] = image;
//     }

//     try {
//       const response = await fetch("/api/property/newproperty", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Cache-Control": "no-cache, no-store",
//         },
//         body: JSON.stringify(createProperty),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         handleSuccess("Property Listed Successfully", "Close to Continue");
//         if (action === "createAnother") {
//           setProperty({
//             title: "",
//             description: "",
//             location: "",
//             image: "",
//             propertyType: "",
//             price: "",
//             listingPurpose: "",
//             bedrooms: "",
//             rentalDuration: "",
//             bathrooms: "",
//             amenities: "",
//             plotNumber: "",
//             utilities: "",
//             purchased: false,
//             rented: false,
//             instamentAllowed: true,
//             size: "",
//           });
//           setChangedFields({});
//           setImageChanged(false);
//           setErrorWithTimeout("");
//         } else if (action === "exit") {
//           router.push("/admin");
//         }
//       } else {
//         setErrorWithTimeout(data.details.errors);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const isUrl = (str) => {
//     if (typeof str !== "string") {
//       return false;
//     }
//     try {
//       new URL(str);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const imageSrc = isUrl(image) ? image : `/uploads/${image}`;

//   const listPurposes = ["For Renting", "For Sale"];
//   const propTypes = ["House", "Farm", "Land", "Commercial", "Office", "Shop"];
//   const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
//   const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//   return (
//     <div className="p-4 bg-white shadow rounded-md">
//       <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-4">List a New Property</h2>
//         <div>
//           <div className="p-2 rounded-lg relative max-w-[150px]">
//             <EditableImage link={imageSrc} setLink={handleImageChange} />
//             {errors["image"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["image"].message}
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-4">
//             <label className="block text-gray-700">Property Title</label>
//             <input
//               type="text"
//               name="title"
//               value={property.title}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             />
//             {errors["title"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["title"].message}
//               </p>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Property Description</label>
//             <input
//               type="text"
//               name="description"
//               value={property.description}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             />
//             {errors["description"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["description"].message}
//               </p>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Property Address</label>
//             <input
//               type="text"
//               name="location"
//               value={property.location}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             />
//             {errors["location"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["location"].message}
//               </p>
//             )}
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700">Listing Purpose</label>
//             <select
//               name="listingPurpose"
//               value={property.listingPurpose}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Listing Purpose</option>
//               {listPurposes.map((listPurpose) => (
//                 <option key={listPurpose} value={listPurpose}>
//                   {listPurpose}
//                 </option>
//               ))}
//             </select>
//             {errors["listingPurpose"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["listingPurpose"].message}
//               </p>
//             )}
//           </div>
//         </div>
//         {property.listingPurpose === "For Renting" && (
//           <div className="mb-6">
//             <label className="block text-gray-700">Rental Duration</label>
//             <input
//               type="text"
//               name="rentalDuration"
//               value={property.rentalDuration}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             />
//             {errors["rentalDuration"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["rentalDuration"].message}
//               </p>
//             )}
//           </div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-4">
//             <label className="block text-gray-700">Property Price</label>
//             <input
//               type="number"
//               name="price"
//               value={property.price}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             />
//             {errors["price"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["price"].message}
//               </p>
//             )}
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700">Property Plot Size</label>
//             <select
//               name="size"
//               value={property.size}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Property Size</option>
//               {propSizes.map((propSize) => (
//                 <option key={propSize} value={propSize}>
//                   {propSize}
//                 </option>
//               ))}
//             </select>
//             {errors["size"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["size"].message}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-6">
//             <label className="block text-gray-700">Property Type</label>
//             <select
//               name="propertyType"
//               value={property.propertyType}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Property Type</option>
//               {propTypes.map((propType) => (
//                 <option key={propType} value={propType}>
//                   {propType}
//                 </option>
//               ))}
//             </select>
//             {errors["propertyType"] && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors["propertyType"].message}
//               </p>
//             )}
//           </div>
//           <div className="mb-4">
//             {(property.propertyType === "Land" ||
//               property.propertyType === "Farm") && (
//               <div className="mb-4">
//                 <label className="block text-gray-700">Plot Number</label>
//                 <input
//                   type="number"
//                   name="plotNumber"
//                   value={property.plotNumber}
//                   onChange={handleChange}
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//                 />
//                 {errors["plotNumber"] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors["plotNumber"].message}
//                   </p>
//                 )}
//               </div>
//             )}
//             {(property.propertyType === "House" ||
//               property.propertyType === "Shop" ||
//               property.propertyType === "Office") && (
//               <>
//                 <div className="mb-6">
//                   <label className="block text-gray-700">No of Bedrooms</label>
//                   <select
//                     name="bedrooms"
//                     value={property.bedrooms}
//                     onChange={handleChange}
//                     className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">Select No of Bedroom(s)</option>
//                     {bedrooms.map((bedroom) => (
//                       <option key={bedroom} value={bedroom}>
//                         {bedroom}
//                       </option>
//                     ))}
//                   </select>
//                   {errors["bedrooms"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["bedrooms"].message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6">
//                   <label className="block text-gray-700">No of Bathrooms</label>
//                   <input
//                     type="number"
//                     name="bathrooms"
//                     value={property.bathrooms}
//                     onChange={handleChange}
//                     className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//                   />
//                   {errors["bathrooms"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["bathrooms"].message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6">
//                   <label className="block text-gray-700">Amenities</label>
//                   <input
//                     type="text"
//                     name="amenities"
//                     value={property.amenities}
//                     onChange={handleChange}
//                     className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//                   />
//                   {errors["amenities"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["amenities"].message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="mb-6">
//                   <label className="block text-gray-700">Utilities</label>
//                   <input
//                     type="text"
//                     name="utilities"
//                     value={property.utilities}
//                     onChange={handleChange}
//                     className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//                   />
//                   {errors["utilities"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["utilities"].message}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700">Purchased</label>
//           <input
//             type="checkbox"
//             name="purchased"
//             checked={property.purchased}
//             onChange={handleChange}
//             className="mr-2 leading-tight"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700">Rented</label>
//           <input
//             type="checkbox"
//             name="rented"
//             checked={property.rented}
//             onChange={handleChange}
//             className="mr-2 leading-tight"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700">Instalment Allowed</label>
//           <input
//             type="checkbox"
//             name="instamentAllowed"
//             checked={property.instamentAllowed}
//             onChange={handleChange}
//             className="mr-2 leading-tight"
//           />
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={() => handleSave("createAnother")}
//             className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-md"
//           >
//             Save and Create Another
//           </button>
//           <button
//             onClick={() => handleSave("exit")}
//             className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-md"
//           >
//             Save and Exit
//           </button>
//           <MessageModal
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             title={modalTitle}
//             message={modalMessage}
//             type={modalType}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewProperty;
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import EditableImage from "../../components/generalcomponents/Image";
// import MessageModal from "../../components/generalcomponents/messageModal";

// const NewProperty = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<
//     "success" | "error" | "info" | "warning"
//   >("success");
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");

//   const router = useRouter();
//   const [image, setImage] = useState("");
//   const [imageChanged, setImageChanged] = useState(false);
//   const [property, setProperty] = useState({
//     title: "",
//     description: "",
//     location: "",
//     image: "",
//     propertyType: "",
//     price: "",
//     listingPurpose: "",
//     bedrooms: "",
//     rentalDuration: "",
//     bathrooms: "",
//     amenities: "",
//     plotNumber: "",
//     utilities: "",
//     purchased: false,
//     rented: false,
//     instamentAllowed: true,
//     size: "",
//   });
//   const [changedFields, setChangedFields] = useState({});

//   const handleSuccess = (title: string, message: string) => {
//     setModalType("success");
//     setModalTitle(title);
//     setModalMessage(message);
//     setIsModalOpen(true);
//   };

//   const handleError = (title: string, message: string) => {
//     setModalType("error");
//     setModalTitle(title);
//     setModalMessage(message);
//     setIsModalOpen(true);
//   };

//   const useErrorHandling = () => {
//     const [errors, setErrors] = useState({});

//     const setErrorWithTimeout = (message: string) => {
//       setErrors(message);
//       setTimeout(() => {
//         setErrors("");
//       }, 5000);
//     };

//     return { errors, setErrorWithTimeout };
//   };
//   const { errors, setErrorWithTimeout } = useErrorHandling();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProperty((prevProperty) => ({
//       ...prevProperty,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setChangedFields((prevChangedFields) => ({
//       ...prevChangedFields,
//       [name]: true,
//     }));
//   };

//   const handleImageChange = (newImage) => {
//     setImage(newImage);
//     setImageChanged(true);
//   };

//   const handleSave = async (action) => {
//     const createProperty = {};
//     for (const key in property) {
//       if (changedFields[key]) {
//         createProperty[key] = property[key];
//       }
//     }

//     if (imageChanged) {
//       createProperty["image"] = image;
//     }

//     try {
//       const response = await fetch("/api/property/newproperty", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Cache-Control": "no-cache, no-store",
//         },
//         body: JSON.stringify(createProperty),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         handleSuccess("Property Listed Successfully", "Close to Continue");
//         if (action === "createAnother") {
//           setProperty({
//             title: "",
//             description: "",
//             location: "",
//             image: "",
//             propertyType: "",
//             price: "",
//             listingPurpose: "",
//             bedrooms: "",
//             rentalDuration: "",
//             bathrooms: "",
//             amenities: "",
//             plotNumber: "",
//             utilities: "",
//             purchased: false,
//             rented: false,
//             instamentAllowed: true,
//             size: "",
//           });
//           setChangedFields({});
//           setImageChanged(false);
//           setErrorWithTimeout("");
//         } else if (action === "exit") {
//           router.push("/admin");
//         }
//       } else {
//         setErrorWithTimeout(data.details.errors);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const isUrl = (str) => {
//     if (typeof str !== "string") {
//       return false;
//     }
//     try {
//       new URL(str);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const imageSrc = isUrl(image) ? image : `/uploads/${image}`;

//   const listPurposes = ["For Renting", "For Sale"];
//   const propTypes = ["House", "Farm", "Land", "Commercial", "Office", "Shop"];
//   const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
//   const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             List a New Property
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Fill in the details below to add a new property to your listings
//           </p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-6 sm:p-8">
//             {/* Image Upload Section */}
//             <div className="mb-8">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
//                 Property Image
//               </label>
//               <div className="flex justify-center">
//                 <div className="relative">
//                   <EditableImage link={imageSrc} setLink={handleImageChange} />
//                   {errors["image"] && (
//                     <p className="text-red-500 text-sm mt-2 text-center">
//                       {errors["image"].message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Basic Information Section */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
//                 Basic Information
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Property Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={property.title}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                     placeholder="Enter property title"
//                   />
//                   {errors["title"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["title"].message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Property Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Type *
//                   </label>
//                   <select
//                     name="propertyType"
//                     value={property.propertyType}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                   >
//                     <option value="">Select Property Type</option>
//                     {propTypes.map((propType) => (
//                       <option key={propType} value={propType}>
//                         {propType}
//                       </option>
//                     ))}
//                   </select>
//                   {errors["propertyType"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["propertyType"].message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={property.location}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                     placeholder="Enter property address"
//                   />
//                   {errors["location"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["location"].message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Listing Purpose */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Listing Purpose *
//                   </label>
//                   <select
//                     name="listingPurpose"
//                     value={property.listingPurpose}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                   >
//                     <option value="">Select Listing Purpose</option>
//                     {listPurposes.map((listPurpose) => (
//                       <option key={listPurpose} value={listPurpose}>
//                         {listPurpose}
//                       </option>
//                     ))}
//                   </select>
//                   {errors["listingPurpose"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["listingPurpose"].message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Rental Duration - Conditionally Rendered */}
//                 {property.listingPurpose === "For Renting" && (
//                   <div className="lg:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Rental Duration
//                     </label>
//                     <input
//                       type="text"
//                       name="rentalDuration"
//                       value={property.rentalDuration}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                       placeholder="e.g., 12 months, 6 months"
//                     />
//                     {errors["rentalDuration"] && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors["rentalDuration"].message}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Description */}
//                 <div className="lg:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Description *
//                   </label>
//                   <textarea
//                     name="description"
//                     value={property.description}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
//                     placeholder="Describe the property features, location advantages, etc."
//                   />
//                   {errors["description"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["description"].message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Pricing & Details Section */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
//                 Pricing & Details
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Price *
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       name="price"
//                       value={property.price}
//                       onChange={handleChange}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                       placeholder="0.00"
//                     />
//                   </div>
//                   {errors["price"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["price"].message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Plot Size */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Property Size
//                   </label>
//                   <select
//                     name="size"
//                     value={property.size}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                   >
//                     <option value="">Select Property Size</option>
//                     {propSizes.map((propSize) => (
//                       <option key={propSize} value={propSize}>
//                         {propSize}
//                       </option>
//                     ))}
//                   </select>
//                   {errors["size"] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors["size"].message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Property Specific Details */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
//                 Property Details
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Plot Number for Land/Farm */}
//                 {(property.propertyType === "Land" ||
//                   property.propertyType === "Farm") && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Plot Number
//                     </label>
//                     <input
//                       type="number"
//                       name="plotNumber"
//                       value={property.plotNumber}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                       placeholder="Enter plot number"
//                     />
//                     {errors["plotNumber"] && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors["plotNumber"].message}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Bedrooms and Bathrooms for House/Shop/Office */}
//                 {(property.propertyType === "House" ||
//                   property.propertyType === "Shop" ||
//                   property.propertyType === "Office") && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Bedrooms
//                       </label>
//                       <select
//                         name="bedrooms"
//                         value={property.bedrooms}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                       >
//                         <option value="">Select Bedrooms</option>
//                         {bedrooms.map((bedroom) => (
//                           <option key={bedroom} value={bedroom}>
//                             {bedroom} {bedroom === 1 ? "Bedroom" : "Bedrooms"}
//                           </option>
//                         ))}
//                       </select>
//                       {errors["bedrooms"] && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors["bedrooms"].message}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Bathrooms
//                       </label>
//                       <input
//                         type="number"
//                         name="bathrooms"
//                         value={property.bathrooms}
//                         onChange={handleChange}
//                         min="0"
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                         placeholder="Number of bathrooms"
//                       />
//                       {errors["bathrooms"] && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors["bathrooms"].message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="lg:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Amenities
//                       </label>
//                       <input
//                         type="text"
//                         name="amenities"
//                         value={property.amenities}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                         placeholder="e.g., Swimming Pool, Gym, Parking"
//                       />
//                       {errors["amenities"] && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors["amenities"].message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="lg:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Utilities
//                       </label>
//                       <input
//                         type="text"
//                         name="utilities"
//                         value={property.utilities}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
//                         placeholder="e.g., Water, Electricity, Internet"
//                       />
//                       {errors["utilities"] && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {errors["utilities"].message}
//                         </p>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Status Section */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
//                 Property Status
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 {/* Purchased */}
//                 <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="purchased"
//                     checked={property.purchased}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
//                   />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Purchased
//                   </span>
//                 </label>

//                 {/* Rented */}
//                 <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="rented"
//                     checked={property.rented}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
//                   />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Rented
//                   </span>
//                 </label>

//                 {/* Instalment Allowed */}
//                 <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="instamentAllowed"
//                     checked={property.instamentAllowed}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
//                   />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Installment Allowed
//                   </span>
//                 </label>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => handleSave("createAnother")}
//                 className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               >
//                 Save and Create Another
//               </button>
//               <button
//                 onClick={() => handleSave("exit")}
//                 className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//               >
//                 Save and Exit
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <MessageModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={modalTitle}
//         message={modalMessage}
//         type={modalType}
//       />
//     </div>
//   );
// };

// export default NewProperty;
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditableImage from "../../components/generalcomponents/Image";
import MessageModal from "../../components/generalcomponents/messageModal";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

interface PropertyState {
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: string;
  price: string;
  listingPurpose: string;
  bedrooms: string;
  rentalDuration: string;
  bathrooms: string;
  amenities: string;
  plotNumber: string;
  utilities: string;
  purchased: boolean;
  rented: boolean;
  instamentAllowed: boolean;
  size: string;
}

const NewProperty = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState({
    createAnother: false,
    exit: false,
  });

  const router = useRouter();
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [property, setProperty] = useState<PropertyState>({
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
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

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

  const setErrorWithTimeout = (errorMessages: any) => {
    setErrors(errorMessages);
    setTimeout(() => {
      setErrors({});
    }, 5000);
  };

  // Handle input changes for TextField components
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Handle select changes for Select components
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name as string]: value,
    }));
    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name as string]: true,
    }));
  };

  const handleImageChange = (newImage: string) => {
    setImage(newImage);
    setImageChanged(true);
  };

  const resetForm = () => {
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
    setImage("");
    setErrors({});
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Clear form when modal is closed after successful submission
    if (modalType === "success") {
      resetForm();
    }
  };

  const handleSave = async (action: "createAnother" | "exit") => {
    setLoading((prev) => ({ ...prev, [action]: true }));

    const createProperty: any = {};
    for (const key in property) {
      if (changedFields[key]) {
        createProperty[key] = property[key as keyof PropertyState];
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
          "Cache-Control": "no-cache, no-store",
        },
        body: JSON.stringify(createProperty),
      });

      const data = await response.json();
      if (response.ok) {
        handleSuccess("Property Listed Successfully", "Close to Continue");
        if (action === "createAnother") {
          // Form will be cleared when modal is closed
        } else if (action === "exit") {
          // Form will be cleared when modal is closed, then redirect
          setTimeout(() => {
            router.push("/admin");
          }, 1000);
        }
      } else {
        setErrorWithTimeout(data.details?.errors || {});
      }
    } catch (error) {
      console.log(error);
      handleError("Error", "An error occurred while saving the property");
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
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

  const listPurposes = ["For Renting", "For Sale"];
  const propTypes = ["House", "Farm", "Land", "Commercial", "Office", "Shop"];
  const propSizes = ["Quarter Plot", "Half Plot", "Full Plot"];
  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          List a New Property
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Fill in the details below to add a new property to your listings
        </Typography>
      </Box>

      <StyledPaper elevation={3}>
        {/* Image Upload Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Property Image
          </Typography>
          <Box display="flex" justifyContent="center">
            <Card sx={{ maxWidth: 200 }}>
              <CardContent>
                <EditableImage link={imageSrc} setLink={handleImageChange} />
                {errors["image"] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors["image"].message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Basic Information Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Basic Information</SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={property.title}
                onChange={handleInputChange}
                error={!!errors["title"]}
                helperText={errors["title"]?.message}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["propertyType"]}>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleSelectChange}
                  label="Property Type"
                >
                  <MenuItem value="">Select Property Type</MenuItem>
                  {propTypes.map((propType) => (
                    <MenuItem key={propType} value={propType}>
                      {propType}
                    </MenuItem>
                  ))}
                </Select>
                {errors["propertyType"] && (
                  <Typography color="error" variant="caption">
                    {errors["propertyType"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Address"
                name="location"
                value={property.location}
                onChange={handleInputChange}
                error={!!errors["location"]}
                helperText={errors["location"]?.message}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["listingPurpose"]}>
                <InputLabel>Listing Purpose</InputLabel>
                <Select
                  name="listingPurpose"
                  value={property.listingPurpose}
                  onChange={handleSelectChange}
                  label="Listing Purpose"
                >
                  <MenuItem value="">Select Listing Purpose</MenuItem>
                  {listPurposes.map((listPurpose) => (
                    <MenuItem key={listPurpose} value={listPurpose}>
                      {listPurpose}
                    </MenuItem>
                  ))}
                </Select>
                {errors["listingPurpose"] && (
                  <Typography color="error" variant="caption">
                    {errors["listingPurpose"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {property.listingPurpose === "For Renting" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rental Duration"
                  name="rentalDuration"
                  value={property.rentalDuration}
                  onChange={handleInputChange}
                  error={!!errors["rentalDuration"]}
                  helperText={errors["rentalDuration"]?.message}
                  placeholder="e.g., 12 months, 6 months"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Property Description"
                name="description"
                value={property.description}
                onChange={handleInputChange}
                error={!!errors["description"]}
                helperText={errors["description"]?.message}
                required
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Pricing & Details Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Pricing & Details</SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Property Price"
                name="price"
                value={property.price}
                onChange={handleInputChange}
                error={!!errors["price"]}
                helperText={errors["price"]?.message}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors["size"]}>
                <InputLabel>Property Size</InputLabel>
                <Select
                  name="size"
                  value={property.size}
                  onChange={handleSelectChange}
                  label="Property Size"
                >
                  <MenuItem value="">Select Property Size</MenuItem>
                  {propSizes.map((propSize) => (
                    <MenuItem key={propSize} value={propSize}>
                      {propSize}
                    </MenuItem>
                  ))}
                </Select>
                {errors["size"] && (
                  <Typography color="error" variant="caption">
                    {errors["size"].message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Property Specific Details */}
        <Box mb={4}>
          <SectionTitle variant="h5">Property Details</SectionTitle>

          <Grid container spacing={3}>
            {/* Plot Number for Land/Farm */}
            {(property.propertyType === "Land" ||
              property.propertyType === "Farm") && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Plot Number"
                  name="plotNumber"
                  value={property.plotNumber}
                  onChange={handleInputChange}
                  error={!!errors["plotNumber"]}
                  helperText={errors["plotNumber"]?.message}
                />
              </Grid>
            )}

            {/* Bedrooms and Bathrooms for House/Shop/Office */}
            {(property.propertyType === "House" ||
              property.propertyType === "Shop" ||
              property.propertyType === "Office") && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors["bedrooms"]}>
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      name="bedrooms"
                      value={property.bedrooms}
                      onChange={handleSelectChange}
                      label="Bedrooms"
                    >
                      <MenuItem value="">Select Bedrooms</MenuItem>
                      {bedrooms.map((bedroom) => (
                        <MenuItem key={bedroom} value={bedroom.toString()}>
                          {bedroom} {bedroom === 1 ? "Bedroom" : "Bedrooms"}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["bedrooms"] && (
                      <Typography color="error" variant="caption">
                        {errors["bedrooms"].message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bathrooms"
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={handleInputChange}
                    error={!!errors["bathrooms"]}
                    helperText={errors["bathrooms"]?.message}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amenities"
                    name="amenities"
                    value={property.amenities}
                    onChange={handleInputChange}
                    error={!!errors["amenities"]}
                    helperText={errors["amenities"]?.message}
                    placeholder="e.g., Swimming Pool, Gym, Parking"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Utilities"
                    name="utilities"
                    value={property.utilities}
                    onChange={handleInputChange}
                    error={!!errors["utilities"]}
                    helperText={errors["utilities"]?.message}
                    placeholder="e.g., Water, Electricity, Internet"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Status Section */}
        <Box mb={4}>
          <SectionTitle variant="h5">Property Status</SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="purchased"
                    checked={property.purchased}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Purchased"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rented"
                    checked={property.rented}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Rented"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="instamentAllowed"
                    checked={property.instamentAllowed}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Installment Allowed"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleSave("createAnother")}
                disabled={loading.createAnother || loading.exit}
                startIcon={
                  loading.createAnother ? <CircularProgress size={20} /> : null
                }
                sx={{ py: 1.5 }}
              >
                {loading.createAnother
                  ? "Saving..."
                  : "Save and Create Another"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => handleSave("exit")}
                disabled={loading.createAnother || loading.exit}
                startIcon={loading.exit ? <CircularProgress size={20} /> : null}
                sx={{ py: 1.5 }}
              >
                {loading.exit ? "Saving..." : "Save and Exit"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>

      {/* Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </Container>
  );
};

export default NewProperty;

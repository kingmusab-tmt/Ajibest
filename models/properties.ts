import mongoose, { Schema, Model, Document } from "mongoose";

interface IProperty extends Document {
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: "House" | "Farm" | "Land";
  price: number;
  listingPurpose: "For Renting" | "For Sale";
  bedrooms?: number;
  rentalDuration?: number;
  bathrooms?: number;
  amenities?: string;
  plotNumber: number;
  utilities?: string;
  purchased: boolean;
  rented: boolean;
  size?: string;
  createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  location: { type: String, required: [true, "Location is required"] },
  image: { type: String, required: [true, "Image is need for the property"] },
  propertyType: {
    type: String,
    required: [true, "Property Type is required"],
    enum: ["House", "Farm", "Land"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  plotNumber: {
    type: Number,
    min: [0, "Number must be positive"],
  },
  listingPurpose: {
    type: String,
    required: [true, "Listing Purpose is required"],
    enum: ["For Renting", "For Sale"],
  },
  bedrooms: { type: Number, min: [0, "Bedrooms must be positive"] },
  rentalDuration: {
    type: Number,
    min: [0, "Rental Duration must be positive"],
  },
  bathrooms: { type: Number, min: [0, "Bathrooms must be positive"] },
  amenities: [{ type: String }],
  utilities: [{ type: String }],
  size: {
    type: String,
    enum: ["Quarter Plot", "Half Plot", "Full Plot"],
  },
  purchased: {
    type: Boolean,
    default: false,
  },
  rented: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
export default Property;

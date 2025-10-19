import mongoose, { Schema, Model, Document } from "mongoose";

interface IProperty extends Document {
  title: string;
  description: string;
  location: string;
  image: string;
  propertyType: "House" | "Farm" | "Land" | "Commercial" | "Office" | "Shop";
  price: number;
  listingPurpose: "For Renting" | "For Sale";
  bedrooms?: number;
  rentalDuration?: number;
  bathrooms?: number;
  amenities?: string;
  plotNumber: string;
  utilities?: string;
  state: string;
  city: string;
  status: "available" | "sold" | "rented";
  purchased: boolean;
  rented: boolean;

  instalmentAllowed: boolean;
  size?: "Quarter Plot" | "Half Plot" | "Full Plot";
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      index: true,
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
      enum: ["House", "Farm", "Land", "Commercial", "Office", "Shop"],
    },
    state: {
      type: String,
      enum: [
        "abia",
        "adamawa",
        "akwa ibom",
        "anambra",
        "bauchi",
        "bayelsa",
        "benue",
        "borno",
        "cross river",
        "delta",
        "ebonyi",
        "edo",
        "ekiti",
        "enugu",
        "gombe",
        "imo",
        "jigawa",
        "kaduna",
        "kano",
        "katsina",
        "kebbi",
        "kogi",
        "kwara",
        "lagos",
        "nasarawa",
        "niger",
        "ogun",
        "ondo",
        "osun",
        "oyo",
        "plateau",
        "rivers",
        "sokoto",
        "taraba",
        "yobe",
        "zamfara",
        "fct",
      ],
      lowercase: true,
    },
    city: {
      type: String,
      enum: [
        "umuahia",
        "yola",
        "uyo",
        "awka",
        "bauchi",
        "yenagoa",
        "makurdi",
        "maiduguri",
        "calabar",
        "asaba",
        "abakaliki",
        "benin state",
        "ado-ekiti",
        "enugu",
        "gombe",
        "owerri",
        "dutse",
        "kaduna",
        "kano",
        "katsina",
        "birnin kebbi",
        "lokoja",
        "ilorin",
        "lagos",
        "lafia",
        "minna",
        "abeokuta",
        "akure",
        "osogbo",
        "ibadan",
        "jos",
        "port harcourt",
        "sokoto",
        "jalingo",
        "damaturu",
        "gusau",
        "abuja",
      ],
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    plotNumber: {
      type: String,
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
    amenities: { type: String },
    utilities: { type: String },
    size: {
      type: String,
      enum: ["Quarter Plot", "Half Plot", "Full Plot"],
    },
    purchased: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    rented: {
      type: Boolean,
      default: false,
    },
    instalmentAllowed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ state: 1, propertyType: 1, price: 1, status: 1 });

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
export default Property;

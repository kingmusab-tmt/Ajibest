import mongoose, { Schema, Document, Model } from "mongoose";

interface ITransaction extends Document {
  userName: string;
  title: string;
  email: string;
  transactionId: string;
  referenceId?: string;
  propertyPrice: number;
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  propertyType: "House" | "Farm" | "Land" | "Commercial" | "Office" | "Shop";
  paymentMethod: "installment" | "payOnce";
  listingPurpose: "For Sale" | "For Renting";
  amount: number;
  status: "pending" | "successful" | "failed" | "canceled";
  paymentType: "automatic" | "manual";
}

const transactionSchema = new Schema<ITransaction>(
  {
    userName: { type: String },
    email: { type: String },
    title: { type: String },
    transactionId: { type: String, unique: true, required: true },
    referenceId: { type: String, unique: true },
    propertyPrice: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["House", "Land", "Farm", "Commercial", "Office", "Shop"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["installment", "payOnce"],
      required: true,
    },
    listingPurpose: {
      type: String,
      enum: ["For Renting", "For Sale"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "canceled"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["automatic", "manual"],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;

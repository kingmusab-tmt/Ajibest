import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface for the receipt details (Matching your text exactly)
export interface IReceiptDetails {
  date: string; // Receipt Date
  receivedFrom: string;
  payerAddress: string; // "Address" under Received From
  amount: number; // Numeric Amount
  amountWords: string; // "The Sum of"

  // "Being Payment For"
  paymentFor: "House" | "Land" | "Farm" | "Shop";

  // "Address/location" (Property location)
  propertyAddress: string;

  plotNo: string;

  // "Method"
  paymentMethod: "Pay Once" | "Installment";

  // "Mode of Payment"
  paymentMode: "Cash" | "Bank Transfer" | "Pos Card";

  // "Pursuant To The Sale Agreement Dated..."
  saleAgreementDate: string;

  managerSignature: boolean;
}

// 2. Interface for the main document
export interface IReceipt extends Document {
  receiptId: string;
  status: "INACTIVE" | "ACTIVE" | "VOIDED";
  details: IReceiptDetails;
  activatedAt?: Date;
  activatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Schema Definition
const ReceiptSchema: Schema = new Schema(
  {
    receiptId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["INACTIVE", "ACTIVE", "VOIDED"],
      default: "INACTIVE",
    },
    details: {
      date: String,
      receivedFrom: String,
      payerAddress: String,
      amount: Number,
      amountWords: String,
      paymentFor: {
        type: String,
        enum: ["House", "Land", "Farm", "Shop"],
      },
      propertyAddress: String,
      plotNo: String,
      paymentMethod: {
        type: String,
        enum: ["Pay Once", "Installment"],
      },
      paymentMode: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Pos Card"],
      },
      saleAgreementDate: String,
      managerSignature: Boolean,
    },
    activatedAt: Date,
    activatedBy: String,
  },
  { timestamps: true },
);

const Receipt: Model<IReceipt> =
  mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema);

export default Receipt;

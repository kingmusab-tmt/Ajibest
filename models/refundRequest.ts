// models/refundRequest.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRefundRequest extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  propertyId: mongoose.Types.ObjectId;
  propertyTitle: string;
  totalRefundAmount: number;
  refundSchedule: {
    amount: number;
    dueDate: Date;
    isPaid: boolean;
    paidAt: Date | null;
    paymentMethod: string;
  }[];
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin who approved the withdrawal
  completedAt?: Date;
  notes?: string;
}

const refundScheduleSchema = new Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date, default: null },
  paymentMethod: { type: String, default: "bank_transfer" },
});

const refundRequestSchema = new Schema<IRefundRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyTitle: { type: String, required: true },
    totalRefundAmount: { type: Number, required: true },
    refundSchedule: [refundScheduleSchema],
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    createdBy: { type: String, required: true },
    completedAt: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
refundRequestSchema.index({ userId: 1, status: 1 });
refundRequestSchema.index({ "refundSchedule.dueDate": 1 });
refundRequestSchema.index({ status: 1 });

const RefundRequest: Model<IRefundRequest> =
  mongoose.models.RefundRequest ||
  mongoose.model<IRefundRequest>("RefundRequest", refundRequestSchema);

export default RefundRequest;

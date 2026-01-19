import mongoose, { Schema, Model, Document } from "mongoose";

interface IPropertyVisit extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  visitDate: Date;
  visitTime?: string; // HH:mm 24h format
  status: "scheduled" | "completed" | "cancelled" | "released";
  createdAt: Date;
  updatedAt: Date;
  notificationSent: boolean;
  completedDate?: Date;
  releaseDate?: Date;
}

const propertyVisitSchema = new Schema<IPropertyVisit>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    visitDate: {
      type: Date,
      required: true,
      index: true,
    },
    visitTime: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "released"],
      default: "scheduled",
      index: true,
    },
    notificationSent: { type: Boolean, default: false },
    completedDate: { type: Date },
    releaseDate: { type: Date },
  },
  { timestamps: true },
);

// Index for finding user's under-visit properties
propertyVisitSchema.index({ userId: 1, status: 1 });

// Index for finding visit by property
propertyVisitSchema.index({ propertyId: 1, status: 1 });

const PropertyVisit: Model<IPropertyVisit> =
  mongoose.models.PropertyVisit ||
  mongoose.model<IPropertyVisit>("PropertyVisit", propertyVisitSchema);

export default PropertyVisit;

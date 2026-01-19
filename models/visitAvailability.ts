import mongoose, { Schema, Model, Document } from "mongoose";

interface IVisitSlot {
  date: string; // YYYY-MM-DD
  times: string[]; // e.g. ["09:00", "14:30"] 24h format
  capacity: number; // max visitors for this date
}

interface IVisitAvailability extends Document {
  availableSlots: IVisitSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const visitAvailabilitySchema = new Schema<IVisitAvailability>(
  {
    availableSlots: {
      type: [
        {
          date: { type: String, required: true },
          times: { type: [String], default: [] },
          capacity: { type: Number, default: 5, min: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// Ensure the model always uses the latest schema (important after schema changes)
if (mongoose.models.VisitAvailability) {
  delete mongoose.models.VisitAvailability;
}

const VisitAvailability: Model<IVisitAvailability> =
  mongoose.model<IVisitAvailability>(
    "VisitAvailability",
    visitAvailabilitySchema,
  );

export default VisitAvailability;

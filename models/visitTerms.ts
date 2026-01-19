import mongoose, { Schema, Model, Document } from "mongoose";

interface IVisitTerms extends Document {
  title: string;
  content: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const visitTermsSchema = new Schema<IVisitTerms>(
  {
    title: {
      type: String,
      required: [true, "Terms title is required"],
      default: "Property Visit Terms and Conditions",
    },
    content: {
      type: String,
      required: [true, "Terms content is required"],
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

// Ensure only one terms record exists
if (mongoose.models.VisitTerms) {
  delete mongoose.models.VisitTerms;
}

const VisitTerms: Model<IVisitTerms> = mongoose.model<IVisitTerms>(
  "VisitTerms",
  visitTermsSchema,
);

export default VisitTerms;

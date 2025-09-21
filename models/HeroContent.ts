import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the HeroContent document
export interface IHeroContent extends Document {
  title: string;
  subtitle: string;
  buttonText: string;
  backgrounds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const HeroContentSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    backgrounds: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting
const HeroContent: Model<IHeroContent> =
  mongoose.models.HeroContent ||
  mongoose.model<IHeroContent>("HeroContent", HeroContentSchema);

export default HeroContent;

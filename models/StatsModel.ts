import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  comment: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatItem extends Document {
  title: string;
  value: number;
  icon: string;
  color: string;
  suffix: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatsContent extends Document {
  testimonials: ITestimonial[];
  stats: IStatItem[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StatItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    icon: {
      type: String,
      required: true,
      enum: ["Home", "People", "TrendingUp", "CalendarMonth", "Star"],
    },
    color: {
      type: String,
      required: true,
      enum: ["primary", "secondary", "success", "warning", "info", "error"],
    },
    suffix: {
      type: String,
      default: "+",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StatsContentSchema = new Schema(
  {
    testimonials: [TestimonialSchema],
    stats: [StatItemSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Check if the model already exists to prevent overwriting
export const StatsContent =
  mongoose.models.StatsContent ||
  mongoose.model<IStatsContent>("StatsContent", StatsContentSchema);
export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export const StatItem =
  mongoose.models.StatItem ||
  mongoose.model<IStatItem>("StatItem", StatItemSchema);

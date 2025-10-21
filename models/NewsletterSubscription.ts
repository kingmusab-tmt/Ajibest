import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewsletterSubscription extends Document {
  email: string;
  name?: string;
  isSubscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  subscriptionSource: string; // e.g., 'website', 'app', 'admin'
  userAgent?: string;
  ipAddress?: string;
  tags: string[];
}

const newsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    name: {
      type: String,
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    subscriptionSource: {
      type: String,
      default: "website",
      enum: ["website", "app", "admin", "api"],
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
newsletterSubscriptionSchema.index({ isSubscribed: 1 });
newsletterSubscriptionSchema.index({ subscribedAt: -1 });

const NewsletterSubscription: Model<INewsletterSubscription> =
  mongoose.models.NewsletterSubscription ||
  mongoose.model<INewsletterSubscription>(
    "NewsletterSubscription",
    newsletterSubscriptionSchema
  );

export default NewsletterSubscription;

import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcrypt";

interface INextOfKin {
  name: string;
  phoneNumber: string;
  address: string;
  image: string;
  email: string;
  userAccountNumber: string;
  userBankName: string;
  userAccountName: string;
}

interface IPropertyWithdrawn {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: mongoose.Types.ObjectId;
  propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
  listingPurpose: "For Renting" | "For Sale";
  paymentMethod: "installment" | "payOnce";
  initialPayment: number;
  propertyPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  state: string;
  size?: "Quarter Plot" | "Half Plot" | "Full Plot";
  instalmentAllowed: boolean;
  paymentHistory: {
    paymentDate: Date;
    nextPaymentDate: Date;
    amount: number;
    propertyPrice: number;
    totalPaymentMade: number;
    remainingBalance: number;
    paymentCompleted: boolean;
  }[];
  withdrawnDate: Date;
  approvedAt: Date;
  isWithdrawnApproved: boolean;
  withdrawalReason?: string;
  isWithdrawn: boolean;
  approvedBy: string;
}

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  bvnOrNin: string;
  role: string;
  otp: string;
  otpExpiry: Date;
  resetToken: string;
  resetTokenExpiry: Date;
  country: string;
  state: string;
  lga: string;
  address: string;
  nextOfKin: INextOfKin;
  userAccountNumber: string;
  userBankName: string;
  userAccountName: string;
  image: string;
  dateOfRegistration: Date;
  lastLoginTime?: Date;
  favouriteProperties: mongoose.Types.ObjectId[];
  remainingBalance: number;
  isActive: boolean;
  emailToken: string;
  totalPropertyPurchased: number;
  totalPaymentMade: number;
  totalPaymentToBeMade: number;
  totalPaymentsGross: number;
  propertyUnderPayment: {
    title: string;
    description: string;
    location: string;
    image: string;
    userEmail: string;
    propertyId: mongoose.Types.ObjectId;
    propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
    listingPurpose: "For Renting" | "For Sale";
    paymentMethod: "installment" | "payOnce";
    initialPayment: number;
    propertyPrice: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string;
    utilities?: string;
    plotNumber: string;
    state: string;
    size?: "Quarter Plot" | "Half Plot" | "Full Plot";
    instalmentAllowed: boolean;
    paymentHistory: {
      paymentDate: Date;
      nextPaymentDate: Date;
      amount: number;
      propertyPrice: number;
      totalPaymentMade: number;
      remainingBalance: number;
      paymentCompleted: boolean;
    }[];
    isWithdrawn: boolean;
    isWithdrawnApproved: boolean;
    withdrawalReason?: string;
    approvedAt?: Date;
    approvedBy?: string;
  }[];
  propertyPurOrRented: {
    title: string;
    description: string;
    location: string;
    image: string;
    userEmail: string;
    propertyId: mongoose.Types.ObjectId;
    paymentDate: Date;
    propertyType: "House" | "Land" | "Farm" | "Commercial" | "Office" | "Shop";
    listingPurpose: "For Renting" | "For Sale";
    paymentMethod: "installment" | "payOnce";
    propertyPrice: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string;
    utilities?: string;
    plotNumber: string;
    state: string;
    size?: "Quarter Plot" | "Half Plot" | "Full Plot";
    rentalDuration?: number;
    instalmentAllowed: boolean;
  }[];
  propertyWithdrawn: IPropertyWithdrawn[];
  referralEarnings: number;
  numberOfReferrals: number;
}

const nextOfKinSchema = new Schema<INextOfKin>({
  name: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  image: { type: String },
  email: { type: String },
  userAccountNumber: { type: String },
  userBankName: { type: String },
  userAccountName: { type: String },
});

const propertyWithdrawnSchema = new Schema<IPropertyWithdrawn>({
  title: { type: String },
  description: { type: String },
  location: { type: String },
  image: { type: String },
  userEmail: { type: String },
  propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
  propertyType: {
    type: String,
    enum: ["House", "Land", "Farm", "Commercial", "Office", "Shop"],
  },
  listingPurpose: { type: String, enum: ["For Renting", "For Sale"] },
  paymentMethod: { type: String, enum: ["installment", "payOnce"] },
  initialPayment: { type: Number },
  propertyPrice: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  amenities: { type: String },
  utilities: { type: String },
  plotNumber: { type: String },
  state: { type: String },
  size: {
    type: String,
    enum: ["Quarter Plot", "Half Plot", "Full Plot"],
  },
  instalmentAllowed: { type: Boolean },
  paymentHistory: [
    {
      paymentDate: { type: Date },
      nextPaymentDate: { type: Date },
      amount: { type: Number },
      propertyPrice: { type: Number },
      totalPaymentMade: { type: Number },
      remainingBalance: { type: Number },
      paymentCompleted: { type: Boolean },
    },
  ],
  withdrawnDate: { type: Date, default: Date.now },
  isWithdrawnApproved: { type: Boolean, default: false },
  withdrawalReason: { type: String },
  isWithdrawn: { type: Boolean, default: false },
  approvedAt: { type: Date },
  approvedBy: { type: String },
});

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      index: true,
    },
    name: { type: String },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      index: true,
    },
    image: { type: String, maxlength: 128 },
    emailToken: {
      type: String,
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    isActive: {
      type: Boolean,
      required: [true, "Please verify your Email"],
      default: false,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      maxlength: 128,
    },
    bvnOrNin: {
      type: String,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Agent"],
      default: "User",
    },
    nextOfKin: {
      type: nextOfKinSchema,
      required: false,
    },
    userAccountNumber: { type: String },
    userBankName: { type: String },
    userAccountName: { type: String },
    state: { type: String },
    country: { type: String },
    lga: { type: String },
    address: { type: String },
    dateOfRegistration: {
      type: Date,
      default: Date.now,
    },
    lastLoginTime: Date,
    favouriteProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    propertyPurOrRented: [
      {
        title: { type: String },
        description: { type: String },
        location: { type: String },
        image: { type: String },
        userEmail: { type: String },
        propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
        paymentDate: { type: Date },
        propertyType: {
          type: String,
          enum: ["House", "Land", "Farm", "Commercial", "Office", "Shop"],
        },
        listingPurpose: { type: String, enum: ["For Renting", "For Sale"] },
        paymentMethod: { type: String, enum: ["installment", "payOnce"] },
        propertyPrice: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        amenities: { type: String },
        utilities: { type: String },
        plotNumber: { type: String },
        state: { type: String },
        size: {
          type: String,
          enum: ["Quarter Plot", "Half Plot", "Full Plot"],
        },
        rentalDuration: { type: Number },
        instalmentAllowed: { type: Boolean },
      },
    ],
    remainingBalance: {
      type: Number,
      default: 0,
    },
    totalPaymentToBeMade: {
      type: Number,
      default: 0,
    },
    totalPropertyPurchased: {
      type: Number,
      default: 0,
    },
    totalPaymentMade: {
      type: Number,
      default: 0,
    },
    totalPaymentsGross: {
      type: Number,
      default: 0,
    },
    propertyUnderPayment: [
      {
        title: { type: String },
        description: { type: String },
        location: { type: String },
        image: { type: String },
        userEmail: { type: String },
        propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
        propertyType: {
          type: String,
          enum: ["House", "Land", "Farm", "Commercial", "Office", "Shop"],
        },
        listingPurpose: { type: String, enum: ["For Renting", "For Sale"] },
        paymentMethod: { type: String, enum: ["installment", "payOnce"] },
        initialPayment: { type: Number },
        propertyPrice: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        amenities: { type: String },
        utilities: { type: String },
        plotNumber: { type: String },
        state: { type: String },
        size: {
          type: String,
          enum: ["Quarter Plot", "Half Plot", "Full Plot"],
        },
        instalmentAllowed: { type: Boolean },
        paymentHistory: [
          {
            paymentDate: { type: Date },
            nextPaymentDate: { type: Date },
            amount: { type: Number },
            propertyPrice: { type: Number },
            totalPaymentMade: { type: Number },
            remainingBalance: { type: Number },
            paymentCompleted: { type: Boolean },
          },
        ],
        isWithdrawn: { type: Boolean, default: false },
        isWithdrawnApproved: { type: Boolean, default: false },
        withdrawalReason: { type: String },
        approvedAt: { type: Date },
        approvedBy: { type: String },
      },
    ],
    propertyWithdrawn: [propertyWithdrawnSchema],
    referralEarnings: {
      type: Number,
      default: 0,
    },
    numberOfReferrals: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || /\$2[ayb]\$/.test(this.password)) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;

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

interface IUser extends Document {
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
  propertyUnderPayment: {
    title: string;
    userEmail: string;
    propertyId: mongoose.Types.ObjectId;
    propertyType: "House" | "Land" | "Farm";
    paymentMethod: "installment" | "payOnce";
    paymentPurpose: "For Sale" | "For Renting";
    initialPayment: number;
    paymentHisotry: {
      paymentDate: Date;
      nextPaymentDate: Date;
      amount: number;
      propertyPrice: number;
      totalPaymentMade: number;
      remainingBalance: number;
      paymentCompleted: boolean;
    }[];
  }[];
  propertyPurOrRented: {
    title: string;
    userEmail: string;
    propertyId: mongoose.Types.ObjectId;
    paymentDate: Date;
    propertyType: "House" | "Land" | "Farm";
    paymentMethod: "installment" | "payOnce";
    paymentPurpose: "For Sale" | "For Renting";
    propertyPrice: number;
  }[];
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
        userEmail: { type: String },
        propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
        paymentDate: { type: Date },
        propertyType: { type: String, enum: ["House", "Land", "Farm"] },
        paymentMethod: { type: String, enum: ["installment", "payOnce"] },
        paymentPurpose: { type: String, enum: ["For Sale", "For Renting"] },
        propertyPrice: { type: Number },
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
    propertyUnderPayment: [
      {
        userEmail: { type: String },
        title: { type: String },
        propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
        propertyType: { type: String, enum: ["House", "Land", "Farm"] },
        paymentMethod: { type: String, enum: ["installment", "payOnce"] },
        paymentPurpose: { type: String, enum: ["For Sale", "For Renting"] },
        initialPayment: { type: Number },
        paymentHisotry: [
          {
            paymentDate: { type: Date },
            nextPaymentDate: { type: Date },
            amount: { type: Number },
            propertyPrice: { type: Number },
            remainingBalance: { type: Number },
            paymentCompleted: { type: Boolean },
          },
        ],
      },
    ],
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

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || /\$2[ayb]\$/.test(this.password)) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
  next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;

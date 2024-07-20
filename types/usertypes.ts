import mongoose from "mongoose";

export interface User {
  id: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  bvnOrNin: string;
  role: string;
  state: string;
  lga: string;
  address: string;
  image: string;
  dateOfRegistration: Date;
  lastLoginTime?: Date;
  favouriteProperties: mongoose.Types.ObjectId[];
  walletBalance: number;
  isActive: boolean;
  emailToken: string;
  totalPropertyPurchased: number;
  totalPaymentToBeMade: number;
  totalPaymentMade: number;
  isLoggedIn: boolean;
  nextPaymentDueDate: Date;
  referralEarnings: number;
  numberOfReferrals: number;
  propertyPurchased: mongoose.Types.ObjectId[];
  propertyUnderPayment: mongoose.Types.ObjectId[];
  propertyRented: mongoose.Types.ObjectId[];
}

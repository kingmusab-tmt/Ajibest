interface IPropertyWithdrawn {
  title: string;
  description: string;
  location: string;
  image: string;
  userEmail: string;
  propertyId: string;
  propertyType: "House" | "Land" | "Farm";
  listingPurpose: "For Renting" | "For Sale";
  paymentMethod: "installment" | "payOnce";
  initialPayment: number;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  plotNumber: string;
  city: string;
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
  isWithdrawnApproved: boolean;
  withdrawalReason?: string;
  isWithdrawn: boolean;
}

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

export interface User {
  _id: string;
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
  favouriteProperties: string[];
  remainingBalance: number;
  isActive: boolean;
  emailToken: string;
  totalPropertyPurchased: number;
  totalPaymentMade: number;
  totalPaymentToBeMade: number;
  propertyUnderPayment: {
    title: string;
    description: string;
    location: string;
    image: string;
    userEmail: string;
    propertyId: string;
    propertyType: "House" | "Land" | "Farm";
    listingPurpose: "For Renting" | "For Sale";
    paymentMethod: "installment" | "payOnce";
    initialPayment: number;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string;
    utilities?: string;
    plotNumber: string;
    city: string;
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
  }[];
  propertyPurOrRented: {
    title: string;
    description: string;
    location: string;
    image: string;
    userEmail: string;
    propertyId: string;
    paymentDate: Date;
    propertyType: "House" | "Land" | "Farm";
    listingPurpose: "For Renting" | "For Sale";
    paymentMethod: "installment" | "payOnce";
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string;
    utilities?: string;
    plotNumber: string;
    city: string;
    size?: "Quarter Plot" | "Half Plot" | "Full Plot";
    rentalDuration?: number;
    instalmentAllowed: boolean;
  }[];
  propertyWithdrawn: IPropertyWithdrawn[];
  referralEarnings: number;
  numberOfReferrals: number;
}

export interface Property {
  instalmentAllowed: boolean;
  _id: string;
  title: string;
  description: string;
  location: string;
  createdAt: Date;
  image: string;
  propertyType: "House" | "Farm" | "Land";
  price: number;
  listingPurpose: "For Renting" | "For Sale";
  bedrooms?: number;
  rentalDuration?: number;
  bathrooms?: number;
  amenities?: string;
  utilities?: string;
  purchased: boolean;
  rented: boolean;
  size?: string;
}

export interface Transaction {
  title: string;
  createdAt: string | number | Date;
  _id;
  userName: string;
  email: string;
  transactionId: string;
  referenceId?: string;
  propertyPrice: number;
  userId: string;
  propertyId: string;
  propertyType: "House" | "Land" | "Farm";
  paymentMethod: "installment" | "payOnce";
  listingPurpose: "For Sale" | "For Renting";
  amount: number;
  status: string;
  date: Date;
}

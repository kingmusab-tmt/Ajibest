export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  bvnOrNin: string;
  role: string;
  country: string;
  state: string;
  lga: string;
  address: string;
  nextOfKin: {
    name: string;
    phoneNumber: string;
    address: string;
    image: string;
    email: string;
    userAccountNumber: string;
    userBankName: string;
    userAccountName: string;
  };
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
  referralEarnings: number;
  numberOfReferrals: number;
  propertyUnderPayment: {
    title: string;
    userEmail: string;
    propertyId: string;
    propertyType: "House" | "Land" | "Farm";
    paymentMethod: "installment" | "payOnce";
    paymentPurpose: "For Sale" | "For Renting";
    paymentHisotry: {
      paymentDate: Date;
      nextPaymentDate: Date;
      amount: number;
      propertyPrice: number;
      totalPaymentMade: number;
      remainingBalance: number;
      paymentCompleted: boolean;
    };
  };
  propertyPurOrRented: {
    title: string;
    userEmail: string;
    propertyId: string;
    paymentDate: Date;
    propertyType: "House" | "Land" | "Farm";
    paymentMethod: "installment" | "payOnce";
    paymentPurpose: "For Sale" | "For Renting";
    propertyPrice: number;
  };
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
  paymentPurpose: "For Sale" | "For Renting";
  amount: number;
  status: string;
  date: Date;
}

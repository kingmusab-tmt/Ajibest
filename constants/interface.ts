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
  walletBalance: number;
  isActive: boolean;
  emailToken: string;
  totalPropertyPurchased: number;
  totalPaymentMade: number;
  totalPaymentToBeMade: number;
  referralEarnings: number;
  numberOfReferrals: number;
  propertyPurOrRented: {
    propertyId: string;
    date: Date;
    propertyType: string;
    paymentMethod: string;
    propertyPrice: number;
  };
  propertyUnderPayment: {
    propertyId: string;
    nextPaymentDate: Date;
    propertyType: string;
    paymentMethod: string;
    propertyPrice: number;
    amount: number;
  };
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
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
  title: ReactNode;
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
  status: "pending" | "successful" | "failed" | "canceled";
  date: Date;
}

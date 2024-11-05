import { FC } from "react";
import Image from "next/image";

interface UserProfileProps {
  user: {
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
  };
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  const isUrl = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(user.image) ? user.image : `/uploads/${user.image}`;

  return (
    <div
      className=" h-80 w-auto overflow-auto p-4 mx-auto bg-white shadow-lg rounded-lg"
      id="UpdateProfile"
    >
      <div className="flex flex-col items-center">
        <Image
          src={imageSrc}
          alt={user.name}
          width={128}
          height={128}
          className="rounded-full"
        />
        <h2 className="text-center text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-center text-gray-500">{user.role}</p>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p>
            <strong>Username: </strong> {user.username}
          </p>
          <p>
            <strong>Email: </strong> {user.email}
          </p>
          <p>
            <strong>Phone Number: </strong> {user.phoneNumber}
          </p>
          <p>
            <strong>BVN/NIN: </strong> {user.bvnOrNin}
          </p>
          <p>
            <strong>Location: </strong> {user.address}, {user.lga}, {user.state}
            , {user.country}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Account Information</h3>
          <p>
            <strong>Account Number: </strong> {user.userAccountNumber}
          </p>
          <p>
            <strong>Bank Name: </strong> {user.userBankName}
          </p>
          <p>
            <strong>Account Name: </strong> {user.userAccountName}
          </p>
          <p>
            <strong>Date of Registration:</strong>{" "}
            {user.dateOfRegistration.toString()}
          </p>
          {user.lastLoginTime && (
            <p>
              <strong>Last Login Time: </strong> {user.lastLoginTime.toString()}
            </p>
          )}
          <p>
            <strong>Remaining: </strong> ${user.remainingBalance.toFixed(2)}
          </p>
          <p>
            <strong>Active: </strong> {user.isActive ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Next of Kin</h3>
          <Image
            src={
              isUrl(user.nextOfKin?.image)
                ? user.nextOfKin?.image
                : `/uploads/${user.nextOfKin?.image}`
            }
            alt={user.nextOfKin?.name}
            width={64}
            height={64}
            className="rounded-full"
          />
          <p>
            <strong>Name: </strong> {user.nextOfKin?.name}
          </p>
          <p>
            <strong>Phone Number: </strong> {user.nextOfKin?.phoneNumber}
          </p>
          <p>
            <strong>Address: </strong> {user.nextOfKin?.address}
          </p>
          <p>
            <strong>Email: </strong> {user.nextOfKin?.email}
          </p>
          <p>
            <strong>Account Number: </strong>{" "}
            {user.nextOfKin?.userAccountNumber}
          </p>
          <p>
            <strong>Bank Name: </strong> {user.nextOfKin?.userBankName}
          </p>
          <p>
            <strong>Account Name: </strong> {user.nextOfKin?.userAccountName}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Properties</h3>
          <p>
            <strong>Favourite Properties:</strong>{" "}
            {user.favouriteProperties.join(", ")}
          </p>
          <p>
            <strong>Total Purchased/Rented Properties:</strong>{" "}
            {Object.keys(user.propertyPurOrRented).length}
          </p>
          <p>
            <strong>Properties Under Payment:</strong>{" "}
            {Object.keys(user.propertyUnderPayment).length}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Financial Information</h3>
          <p>
            <strong>Total Property Purchased:</strong> NGN
            {user.totalPropertyPurchased.toFixed(2)}
          </p>
          <p>
            <strong>Total Payment Made:</strong> NGN
            {user.totalPaymentMade.toFixed(2)}
          </p>
          <p>
            <strong>Next Payment Due Date:</strong>{" "}
            {user.propertyUnderPayment[
              "paymentHisotry"
            ]?.nextPaymentDate?.toString()}
          </p>
          <p>
            <strong>Referral Earnings:</strong> NGN
            {user.referralEarnings?.toFixed(2)}
          </p>
          <p>
            <strong>Number of Referrals:</strong> {user.numberOfReferrals}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (typeof email !== "string") {
    return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    // Fetch user without populating property data since we store it directly
    const user = await User.findOne({ email }).select(
      "-password -otp -resetToken -emailToken -favouriteProperties"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not Found" },
        { status: 404 }
      );
    }

    // Calculate property counts using listingPurpose
    const purchasedProperties =
      user.propertyPurOrRented?.filter(
        (property) => property.listingPurpose === "For Sale"
      ) || [];

    const rentedProperties =
      user.propertyPurOrRented?.filter(
        (property) => property.listingPurpose === "For Renting"
      ) || [];

    const purchasedUnderPayment =
      user.propertyUnderPayment?.filter(
        (property) => property.listingPurpose === "For Sale"
      ) || [];

    const rentedUnderPayment =
      user.propertyUnderPayment?.filter(
        (property) => property.listingPurpose === "For Renting"
      ) || [];

    // Calculate next payment information
    let nextPaymentDate: Date | null = null;
    let nextPaymentAmount = 0;

    // Find the earliest upcoming payment from all properties under payment
    user.propertyUnderPayment?.forEach((property) => {
      property.paymentHistory?.forEach((payment) => {
        if (!payment.paymentCompleted && payment.nextPaymentDate) {
          const paymentDate = new Date(payment.nextPaymentDate);
          const now = new Date();

          if (paymentDate > now) {
            if (!nextPaymentDate || paymentDate < new Date(nextPaymentDate)) {
              nextPaymentDate = paymentDate;
              nextPaymentAmount = payment.amount;
            }
          }
        }
      });
    });

    // Structure the analytics data
    const analyticsData = {
      // Property Statistics
      propertyStatistics: {
        totalPropertiesPurchased: purchasedProperties.length,
        totalPropertiesRented: rentedProperties.length,
        totalPaymentMade: user.totalPaymentMade || 0,
        totalPaymentToBeMade: user.totalPaymentToBeMade || 0,
        purchasedPropertiesUnderPayment: purchasedUnderPayment.length,
        rentedPropertiesUnderPayment: rentedUnderPayment.length,
        remainingBalance: user.remainingBalance || 0,
        referralEarnings: user.referralEarnings || 0,
        numberOfReferrals: user.numberOfReferrals || 0,
      },

      // Personal Information
      personalInformation: {
        email: user.email,
        image: user.image,
        role: user.role,
        phone: user.phoneNumber,
        address: user.address,
        country: user.country,
        state: user.state,
        lga: user.lga,
        username: user.username,
        name: user.name,
        dateOfRegistration: user.dateOfRegistration,
        lastLogin: user.lastLoginTime,
        isActive: user.isActive,
        userAccountName: user.userAccountName,
        userAccountNumber: user.userAccountNumber,
        userBankName: user.userBankName,
        nextOfKin: user.nextOfKin,
      },

      // Account Summary
      accountSummary: {
        status: user.isActive ? "Active" : "Inactive",
        registrationDate: user.dateOfRegistration,
        nextPaymentDate: nextPaymentDate,
        nextPaymentAmountDue: nextPaymentAmount,
        totalPropertyPurchased: user.totalPropertyPurchased || 0,
      },

      // Properties Under Payment (Detailed)
      propertiesUnderPayment:
        user.propertyUnderPayment?.map((property) => {
          const totalPaid =
            property.paymentHistory?.reduce(
              (sum, payment) =>
                sum + (payment.paymentCompleted ? payment.amount : 0),
              0
            ) || 0;

          const nextPayment = property.paymentHistory?.find(
            (payment) => !payment.paymentCompleted
          );

          const totalPayments = property.paymentHistory?.length || 0;
          const paymentsMade =
            property.paymentHistory?.filter((p) => p.paymentCompleted).length ||
            0;

          return {
            title: property.title,
            description: property.description,
            location: property.location,
            image: property.image,
            propertyId: property.propertyId,
            propertyType: property.propertyType,
            listingPurpose: property.listingPurpose,
            paymentMethod: property.paymentMethod,
            initialPayment: property.initialPayment || 0,
            propertPrice: property.propertyPrice || 0,
            totalPaid: totalPaid,
            remainingBalance:
              nextPayment?.remainingBalance ||
              property.propertyPrice - totalPaid,
            nextPaymentDate: nextPayment?.nextPaymentDate,
            nextPaymentAmount: nextPayment?.amount,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            amenities: property.amenities,
            utilities: property.utilities,
            plotNumber: property.plotNumber,
            state: property.state,
            size: property.size,
            instalmentAllowed: property.instalmentAllowed,
            paymentProgress: {
              percentage: property.propertyPrice
                ? Math.round((totalPaid / property.propertyPrice) * 100)
                : 0,
              paymentsMade: paymentsMade,
              totalPayments: totalPayments,
            },
            paymentHistory:
              property.paymentHistory?.map((payment) => ({
                paymentDate: payment.paymentDate,
                nextPaymentDate: payment.nextPaymentDate,
                amount: payment.amount,
                propertyPrice: payment.propertyPrice,
                totalPaymentMade: payment.totalPaymentMade,
                remainingBalance: payment.remainingBalance,
                paymentCompleted: payment.paymentCompleted,
              })) || [],
          };
        }) || [],

      // Properties Purchased (Detailed)
      propertiesPurchased: purchasedProperties.map((property) => ({
        title: property.title,
        description: property.description,
        location: property.location,
        image: property.image,
        propertyId: property.propertyId,
        propertyType: property.propertyType,
        paymentDate: property.paymentDate,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
        propertyPrice: property.propertyPrice || 0,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        utilities: property.utilities,
        plotNumber: property.plotNumber,
        state: property.state,
        size: property.size,
        instalmentAllowed: property.instalmentAllowed,
        status: "Completed",
      })),

      // Properties Rented (Detailed)
      propertiesRented: rentedProperties.map((property) => ({
        title: property.title,
        description: property.description,
        location: property.location,
        image: property.image,
        propertyId: property.propertyId,
        propertyType: property.propertyType,
        paymentDate: property.paymentDate,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
        propertyPrice: property.propertyPrice || 0,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        utilities: property.utilities,
        plotNumber: property.plotNumber,
        state: property.state,
        size: property.size,
        rentalDuration: property.rentalDuration,
        instalmentAllowed: property.instalmentAllowed,
        status: "Active Rental",
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data: analyticsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

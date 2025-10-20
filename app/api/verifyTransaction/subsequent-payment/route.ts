// app/api/transactions/subsequent-payment/route.ts
import Transaction from "@/models/transaction";
import Property from "@/models/properties";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  await dbConnect();

  const body = await req.json();
  const { amount, email, reference, propertyId } = body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({
        message: "User not found",
        status: 404,
        success: false,
      });
    }

    // Find the property in user's propertyUnderPayment
    const propertyUnderPayment = user.propertyUnderPayment.find(
      (p) => p.propertyId.toString() === propertyId.toString()
    );

    if (!propertyUnderPayment) {
      return Response.json({
        message: "Property not found in your ongoing payments",
        status: 404,
        success: false,
      });
    }

    const transactionId = uuidv4();
    const referenceId = reference || uuidv4();

    // Create transaction record
    const transaction = await Transaction.create({
      userName: user.name,
      email,
      transactionId,
      referenceId,
      userId: user._id,
      title: propertyUnderPayment.title,
      propertyId: propertyUnderPayment.propertyId,
      propertyType: propertyUnderPayment.propertyType,
      paymentType: "automatic",
      paymentMethod: "installment",
      propertyPrice: propertyUnderPayment.propertyPrice,
      listingPurpose: propertyUnderPayment.listingPurpose,
      amount,
      status: "pending",
    });

    // Calculate new totals for the specific property
    const totalPaymentMadeForProperty =
      propertyUnderPayment.paymentHistory.reduce(
        (acc, payment) => acc + payment.amount,
        0
      ) + amount;

    const remainingBalanceForProperty =
      propertyUnderPayment.propertyPrice - totalPaymentMadeForProperty;
    const isPaymentCompleted = remainingBalanceForProperty <= 0;

    // Calculate next payment date (30 days from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    // Update user's propertyUnderPayment
    const updatedPaymentHistory = [
      ...propertyUnderPayment.paymentHistory,
      {
        paymentDate: new Date(),
        nextPaymentDate: isPaymentCompleted ? null : nextPaymentDate,
        amount,
        propertyPrice: propertyUnderPayment.propertyPrice,
        totalPaymentMade: totalPaymentMadeForProperty,
        remainingBalance: Math.max(0, remainingBalanceForProperty),
        paymentCompleted: isPaymentCompleted,
      },
    ];

    // Update user's overall financial totals
    const newTotalPaymentMade = user.totalPaymentMade + amount;
    const newTotalPaymentToBeMade =
      user.totalPaymentsGross - newTotalPaymentMade;

    if (isPaymentCompleted) {
      // Move property from propertyUnderPayment to propertyPurOrRented
      await User.findByIdAndUpdate(user._id, {
        $set: {
          totalPaymentMade: newTotalPaymentMade,
          totalPaymentToBeMade: newTotalPaymentToBeMade,
          remainingBalance: newTotalPaymentToBeMade,
        },
        $pull: {
          propertyUnderPayment: { propertyId: propertyId },
        },
        $push: {
          propertyPurOrRented: {
            propertyId: propertyUnderPayment.propertyId,
            title: propertyUnderPayment.title,
            description: propertyUnderPayment.description,
            location: propertyUnderPayment.location,
            image: propertyUnderPayment.image,
            propertyType: propertyUnderPayment.propertyType,
            listingPurpose: propertyUnderPayment.listingPurpose,
            paymentMethod: propertyUnderPayment.paymentMethod,
            propertyPrice: propertyUnderPayment.propertyPrice,
            bedrooms: propertyUnderPayment.bedrooms,
            bathrooms: propertyUnderPayment.bathrooms,
            amenities: propertyUnderPayment.amenities,
            utilities: propertyUnderPayment.utilities,
            plotNumber: propertyUnderPayment.plotNumber,
            state: propertyUnderPayment.state,
            size: propertyUnderPayment.size,
            userEmail: email,
            paymentDate: new Date(),
            // rentalDuration: propertyUnderPayment.rentalDuration,
            instalmentAllowed: propertyUnderPayment.instalmentAllowed,
          },
        },
      });

      // Update property status
      const propertyUpdate =
        propertyUnderPayment.listingPurpose === "For Renting"
          ? {
              rented: true,
              rentedBy: user._id,
              underPayment: false,
            }
          : {
              purchased: true,
              purchasedBy: user._id,
              underPayment: false,
            };

      await Property.findByIdAndUpdate(propertyId, propertyUpdate);
    } else {
      // Update propertyUnderPayment with new payment history
      await User.findOneAndUpdate(
        {
          _id: user._id,
          "propertyUnderPayment.propertyId": propertyId,
        },
        {
          $set: {
            totalPaymentMade: newTotalPaymentMade,
            totalPaymentToBeMade: newTotalPaymentToBeMade,
            remainingBalance: newTotalPaymentToBeMade,
            "propertyUnderPayment.$.paymentHistory": updatedPaymentHistory,
          },
        }
      );
    }

    return Response.json({
      message: `Payment successful${
        isPaymentCompleted ? " - Property fully paid!" : ""
      }`,
      status: 200,
      success: true,
      transactionId: transaction._id,
      remainingBalance: remainingBalanceForProperty,
      isPaymentCompleted,
    });
  } catch (error) {
    console.error("Error in subsequent payment:", error);
    return Response.json({
      message: "Error in payment processing",
      status: 500,
      success: false,
    });
  }
}

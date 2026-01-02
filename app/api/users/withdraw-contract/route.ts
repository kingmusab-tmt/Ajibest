import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";
import mongoose from "mongoose";
import { logPropertyWithdrawal } from "@/utils/auditLogger";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { propertyId, withdrawalReason } = await request.json();
    const userEmail = session.user.email;

    // Find user and the property in propertyUnderPayment
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const propertyIndex = user.propertyUnderPayment.findIndex(
      (property: any) => property.propertyId.toString() === propertyId
    );

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: "Property not found in your ongoing payments" },
        { status: 404 }
      );
    }

    const property = user.propertyUnderPayment[propertyIndex];

    // Check if already withdrawn
    if (property.isWithdrawn) {
      return NextResponse.json(
        { error: "Property already has a withdrawal request" },
        { status: 400 }
      );
    }

    // Create withdrawn property record with all available data
    const withdrawnProperty = {
      // Basic property information
      title: property.title || "",
      description: property.description || "",
      location: property.location || "",
      image: property.image || "",
      userEmail: property.userEmail || userEmail,
      propertyId: property.propertyId,
      propertyType: property.propertyType,
      listingPurpose: property.listingPurpose,
      paymentMethod: property.paymentMethod,

      // Financial information
      initialPayment: property.initialPayment || 0,
      price: property.propertyPrice || 0,

      // Property details
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: property.amenities || "",
      utilities: property.utilities || "",
      plotNumber: property.plotNumber || "",
      state: property.state || "",
      size: property.size,
      instalmentAllowed: property.instalmentAllowed || false,

      // Payment history
      paymentHistory: property.paymentHistory || [],

      // Withdrawal information
      withdrawnDate: new Date(),
      isWithdrawn: true,
      isWithdrawnApproved: false,
      withdrawalReason: withdrawalReason || "",
      approvedAt: property.approvedAt || null,
      approvedBy: property.approvedBy || "",
    };

    // Update user's financial totals
    const totalPaidForProperty =
      property.paymentHistory?.reduce(
        (total: number, payment: any) => total + (payment.amount || 0),
        0
      ) || 0;

    const newTotalPaymentMade = Math.max(
      0,
      user.totalPaymentMade - totalPaidForProperty
    );
    const newTotalPaymentToBeMade = Math.max(
      0,
      user.totalPaymentToBeMade - (property.propertyPrice || 0)
    );
    const newRemainingBalance = Math.max(
      0,
      newTotalPaymentToBeMade - newTotalPaymentMade
    );
    const newTotalPropertyPurchased = Math.max(
      0,
      user.totalPropertyPurchased - 1
    );

    // Update user document
    await User.findByIdAndUpdate(user._id, {
      $set: {
        totalPaymentMade: newTotalPaymentMade,
        totalPaymentToBeMade: newTotalPaymentToBeMade,
        remainingBalance: newRemainingBalance,
        totalPropertyPurchased: newTotalPropertyPurchased,
      },
      $pull: {
        propertyUnderPayment: {
          propertyId: new mongoose.Types.ObjectId(propertyId),
        },
      },
      $push: {
        propertyWithdrawn: withdrawnProperty,
      },
    });

    // Log property withdrawal request
    await logPropertyWithdrawal(
      user._id.toString(),
      userEmail,
      propertyId,
      withdrawalReason,
      request
    );

    return NextResponse.json(
      {
        message: "Withdrawal request submitted successfully",
        property: withdrawnProperty,
        financialUpdate: {
          totalPaymentMade: newTotalPaymentMade,
          totalPaymentToBeMade: newTotalPaymentToBeMade,
          remainingBalance: newRemainingBalance,
          totalPropertyPurchased: newTotalPropertyPurchased,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

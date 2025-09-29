import dbConnect from "../../../../utils/connectDB";
import Property from "../../../../models/properties";
import User from "../../../../models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();
    const {
      userId,
      propertyId,
      paymentMethod,
      initialPayment,
      paymentCompleted,
      nextPaymentDate,
      remainingBalance,
    } = data;

    // Validate required fields
    if (!userId || !propertyId) {
      return NextResponse.json(
        { success: false, error: "User ID and Property ID are required" },
        { status: 400 }
      );
    }

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const propertyPrice = property.price;
    const currentDate = new Date();

    // Create payment history entry
    const paymentHistoryEntry = {
      paymentDate: currentDate,
      nextPaymentDate: nextPaymentDate || currentDate,
      amount: initialPayment,
      propertyPrice: propertyPrice,
      totalPaymentMade: initialPayment,
      remainingBalance: remainingBalance,
      paymentCompleted: paymentCompleted,
    };

    // Convert propertyId to ObjectId
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);

    if (paymentCompleted) {
      // Add to purchased/rented properties
      user.propertyPurOrRented.push({
        title: property.title,
        userEmail: user.email,
        propertyId: propertyObjectId,
        paymentDate: currentDate,
        propertyType: property.propertyType,
        paymentMethod: paymentMethod,
        paymentPurpose: property.listingPurpose,
        propertyPrice: propertyPrice,
      });

      // Update user totals
      user.totalPropertyPurchased += 1;
      user.totalPaymentMade += initialPayment;
      user.totalPaymentToBeMade += propertyPrice;

      // Update property status
      if (property.listingPurpose === "For Sale") {
        property.status = "sold";
        property.purchased = true;
      } else {
        property.status = "rented";
        property.rented = true;
      }
    } else {
      // Add to properties under payment
      user.propertyUnderPayment.push({
        userEmail: user.email,
        title: property.title,
        propertyId: propertyObjectId,
        propertyType: property.propertyType,
        paymentMethod: paymentMethod,
        paymentPurpose: property.listingPurpose,
        initialPayment: initialPayment,
        paymentHisotry: [paymentHistoryEntry],
      });

      // Update user financials
      user.remainingBalance += remainingBalance;
      user.totalPaymentMade += initialPayment;
      user.totalPaymentToBeMade += propertyPrice;
    }

    // Save user updates
    await user.save();

    // Update property status if not completed
    if (!paymentCompleted) {
      property.status =
        property.listingPurpose === "For Sale" ? "sold" : "rented";
      if (property.listingPurpose === "For Sale") {
        property.purchased = true;
      } else {
        property.rented = true;
      }
    }

    await property.save();

    return NextResponse.json(
      {
        success: true,
        message: "Property assigned successfully",
        data: {
          user: user._id,
          property: property._id,
          paymentMethod,
          initialPayment,
          remainingBalance,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning property:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign property",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

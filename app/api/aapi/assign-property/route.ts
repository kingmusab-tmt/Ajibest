import dbConnect from "../../../../utils/connectDB";
import Property from "../../../../models/properties";
import User from "../../../../models/user";
import Transaction from "../../../../models/transaction";
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
      remainingBalance: remainingBalance || propertyPrice - initialPayment,
      paymentCompleted: paymentCompleted || false,
    };

    // Convert propertyId to ObjectId
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Generate unique transaction ID
    const transactionId = `manual_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create transaction record in Transaction model
    const transaction = new Transaction({
      userName: user.name || user.username,
      title: property.title,
      email: user.email,
      transactionId: transactionId,
      propertyPrice: propertyPrice,
      userId: userObjectId,
      propertyId: propertyObjectId,
      propertyType: property.propertyType,
      paymentMethod: paymentMethod,
      listingPurpose: property.listingPurpose,
      amount: initialPayment,
      status: paymentCompleted ? "successful" : "pending",
      paymentType: "manual",
    });

    // Save transaction
    await transaction.save();

    if (paymentCompleted) {
      // Add to purchased/rented properties
      user.propertyPurOrRented.push({
        title: property.title,
        description: property.description,
        location: property.location,
        image: property.image,
        userEmail: user.email,
        propertyId: propertyObjectId,
        paymentDate: currentDate,
        propertyType: property.propertyType,
        paymentMethod: paymentMethod,
        listingPurpose: property.listingPurpose,
        price: propertyPrice,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        utilities: property.utilities,
        plotNumber: property.plotNumber,
        city: property.city,
        size: property.size,
        rentalDuration: property.rentalDuration,
        instalmentAllowed: property.instalmentAllowed,
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
        title: property.title,
        description: property.description,
        location: property.location,
        image: property.image,
        userEmail: user.email,
        propertyId: propertyObjectId,
        propertyType: property.propertyType,
        listingPurpose: property.listingPurpose,
        paymentMethod: paymentMethod,
        initialPayment: initialPayment,
        price: propertyPrice,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        utilities: property.utilities,
        plotNumber: property.plotNumber,
        city: property.city,
        size: property.size,
        instalmentAllowed: property.instalmentAllowed,
        paymentHistory: [paymentHistoryEntry],
        isWithdrawn: false,
        isWithdrawnApproved: false,
      });

      // Update user financials
      user.remainingBalance =
        remainingBalance || propertyPrice - initialPayment;
      user.totalPaymentMade += initialPayment;
      user.totalPaymentToBeMade += propertyPrice;
    }

    // Save user updates
    await user.save();

    // Update property status
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
          remainingBalance: remainingBalance || propertyPrice - initialPayment,
          transactionId: transaction._id,
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

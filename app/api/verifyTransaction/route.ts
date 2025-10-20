import Transaction from "@/models/transaction";
import Property from "@/models/properties";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
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
  const {
    amount,
    propertyPrice,
    email,
    reference,
    propertyId,
    propertyType,
    paymentMethod,
    listingPurpose,
  } = body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({
        message: "User not found",
        status: 404,
        success: false,
      });
    }

    // console.log("propertyId:", propertyId);

    // Find property
    let property;
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      property = await Property.findById(propertyId);
    } else {
      property = await Property.findOne({ propertyId: propertyId });
    }

    if (!property) {
      return Response.json({
        message: "Property not found",
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
      title: property.title,
      propertyId: property._id,
      propertyType,
      paymentType: "automatic",
      paymentMethod,
      propertyPrice: propertyPrice || property.price,
      listingPurpose,
      amount,
      status: "pending", // Changed to completed since payment was successful
    });

    // Check if this is a new purchase or subsequent payment
    const existingPropertyUnderPayment = user.propertyUnderPayment.find(
      (p) => p.propertyId.toString() === property._id.toString()
    );

    const existingPropertyPurOrRented = user.propertyPurOrRented.find(
      (p) => p.propertyId.toString() === property._id.toString()
    );

    // If property already exists in either array, this is a subsequent payment
    if (existingPropertyUnderPayment || existingPropertyPurOrRented) {
      return Response.json({
        message: "Property already purchased or under payment",
        status: 400,
        success: false,
      });
    }

    // NEW PURCHASE - First time buying this property
    if (paymentMethod === "payOnce") {
      // Pay Once - Full payment
      const newTotalPaymentMade = user.totalPaymentMade + amount;
      const newTotalPaymentsGross = user.totalPaymentsGross + propertyPrice;
      const newTotalPaymentToBeMade =
        newTotalPaymentsGross - newTotalPaymentMade;

      await User.findByIdAndUpdate(user._id, {
        $inc: { totalPropertyPurchased: 1 },
        $set: {
          totalPaymentsGross: newTotalPaymentsGross,
          totalPaymentMade: newTotalPaymentMade,
          totalPaymentToBeMade: newTotalPaymentToBeMade,
          remainingBalance: newTotalPaymentToBeMade,
        },
        $push: {
          propertyPurOrRented: {
            propertyId: property._id,
            title: property.title,
            description: property.description,
            location: property.location,
            image: property.image,
            propertyType,
            listingPurpose,
            paymentMethod,
            propertyPrice: propertyPrice,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            amenities: property.amenities,
            utilities: property.utilities,
            plotNumber: property.plotNumber,
            state: property.state,
            size: property.size,
            userEmail: email,
            paymentDate: new Date(),
            rentalDuration: property.rentalDuration,
            instalmentAllowed: property.instalmentAllowed,
          },
        },
      });

      // Update property status
      const propertyUpdate =
        listingPurpose === "For Renting"
          ? { rented: true, rentedBy: user._id }
          : { purchased: true, purchasedBy: user._id };

      await Property.findByIdAndUpdate(property._id, propertyUpdate);
    } else if (paymentMethod === "installment") {
      // Installment Payment - First payment
      const newTotalPaymentMade = user.totalPaymentMade + amount;
      const newTotalPaymentsGross = user.totalPaymentsGross + propertyPrice;
      const newTotalPaymentToBeMade =
        newTotalPaymentsGross - newTotalPaymentMade;

      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      await User.findByIdAndUpdate(user._id, {
        $inc: { totalPropertyPurchased: 1 },
        $set: {
          totalPaymentsGross: newTotalPaymentsGross,
          totalPaymentMade: newTotalPaymentMade,
          totalPaymentToBeMade: newTotalPaymentToBeMade,
          remainingBalance: newTotalPaymentToBeMade,
        },
        $push: {
          propertyUnderPayment: {
            propertyId: property._id,
            title: property.title,
            description: property.description,
            location: property.location,
            image: property.image,
            propertyType,
            listingPurpose,
            paymentMethod,
            initialPayment: amount,
            propertyPrice: propertyPrice,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            amenities: property.amenities,
            utilities: property.utilities,
            plotNumber: property.plotNumber,
            state: property.state,
            size: property.size,
            userEmail: email,
            instalmentAllowed: true,
            paymentHistory: [
              {
                paymentDate: new Date(),
                nextPaymentDate: nextPaymentDate,
                amount: amount,
                propertyPrice: propertyPrice,
                totalPaymentMade: amount,
                remainingBalance: propertyPrice - amount,
                paymentCompleted: false,
              },
            ],
          },
        },
      });

      // Update property status to indicate it's under payment
      await Property.findByIdAndUpdate(property._id, {
        underPayment: true,
        underPaymentBy: user._id,
      });
    }

    return Response.json({
      message: "Transaction successful",
      status: 200,
      success: true,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    return Response.json({
      message: "Error in transaction",
      status: 500,
      success: false,
    });
  }
}

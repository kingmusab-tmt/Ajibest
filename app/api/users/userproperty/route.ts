import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
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

    // Only select the fields needed by the MyProperty component
    const user = await User.findOne({ email })
      .select("propertyPurOrRented propertyUnderPayment")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not Found" },
        { status: 404 }
      );
    }

    // Transform propertyPurOrRented data to match component interface
    const propertyPurOrRented =
      user.propertyPurOrRented?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        paymentDate: property.paymentDate,
        propertyPrice: property.price || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose, // Map listingPurpose to listingPurpose
        description: property.description || "",
        location: property.location || "",
        initialPayment: 0, // Not available in propertyPurOrRented in new schema
        bedrooms: property.bedrooms || 0,
        amenities: property.amenities ? [property.amenities] : [], // Convert string to array
        purchased: property.listingPurpose === "For Sale",
        rented: property.listingPurpose === "For Renting",
        utilities: property.utilities ? [property.utilities] : [], // Convert string to array
        image: property.image || "",
      })) || [];

    // Transform propertyUnderPayment data to match component interface
    const propertyUnderPayment =
      user.propertyUnderPayment?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        propertyPrice: property.price || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose, // Map listingPurpose to listingPurpose
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
        description: property.description || "",
        location: property.location || "",
        initialPayment: property.initialPayment || 0,

        bedrooms: property.bedrooms || 0,
        amenities: property.amenities ? [property.amenities] : [], // Convert string to array
        purchased: property.listingPurpose === "For Sale",
        rented: property.listingPurpose === "For Renting",
        utilities: property.utilities ? [property.utilities] : [], // Convert string to array
        image: property.image || "",
      })) || [];

    const responseData = {
      propertyPurOrRented,
      propertyUnderPayment,
    };

    return NextResponse.json(
      {
        success: true,
        user: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MyProperty API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

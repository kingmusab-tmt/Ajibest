import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const email = session?.user?.email;

  if (typeof email !== "string") {
    return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    // Select the fields needed by the MyProperty component including propertyWithdrawn
    const user = await User.findOne({ email })
      .select("propertyPurOrRented propertyUnderPayment propertyWithdrawn")
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
        propertyPrice: property.propertyPrice || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
        description: property.description || "",
        location: property.location || "",
        initialPayment: 0,
        bedrooms: property.bedrooms || 0,
        amenities: property.amenities ? [property.amenities] : [],
        utilities: property.utilities ? [property.utilities] : [],
        image: property.image || "",
      })) || [];

    // Transform propertyUnderPayment data to match component interface
    const propertyUnderPayment =
      user.propertyUnderPayment?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        propertyPrice: property.propertyPrice || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
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
        amenities: property.amenities ? [property.amenities] : [],

        utilities: property.utilities ? [property.utilities] : [],
        image: property.image || "",
      })) || [];

    // Transform propertyWithdrawn data to match component interface
    const propertyWithdrawn =
      user.propertyWithdrawn?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        propertyPrice: property.propertyPrice || property.propertyPrice || 0, // Note: schema uses 'price' field
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose,
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
        amenities: property.amenities ? [property.amenities] : [],
        utilities: property.utilities ? [property.utilities] : [],
        image: property.image || "",
        // Withdrawal specific fields
        withdrawnDate: property.withdrawnDate,
        isWithdrawnApproved: property.isWithdrawnApproved || false,
        withdrawalReason: property.withdrawalReason || "",
        approvedAt: property.approvedAt,
        approvedBy: property.approvedBy,
        isWithdrawn: property.isWithdrawn || false,
        // Additional fields from propertyWithdrawn schema
        userEmail: property.userEmail,
        plotNumber: property.plotNumber,
        state: property.state,
        size: property.size,
        instalmentAllowed: property.instalmentAllowed,
        bathrooms: property.bathrooms || 0,
      })) || [];

    const responseData = {
      propertyPurOrRented,
      propertyUnderPayment,
      propertyWithdrawn,
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

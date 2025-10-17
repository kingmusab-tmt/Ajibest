// app/api/withdraw-contract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

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
        { error: "Property not found" },
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

    // Mark property as withdrawn
    user.propertyUnderPayment[propertyIndex].isWithdrawn = true;
    user.propertyUnderPayment[propertyIndex].isWithdrawnApproved = false;

    // Create withdrawn property record
    const withdrawnProperty = {
      ...property,
      withdrawnDate: new Date(),
      isWithdrawnApproved: false,
      withdrawalReason,
      approvedAt: property.approvedAt ?? new Date(),
      approvedBy: property.approvedBy ?? "",
    };

    // Remove from propertyUnderPayment and add to propertyWithdrawn
    user.propertyUnderPayment.splice(propertyIndex, 1);
    user.propertyWithdrawn.push(withdrawnProperty);

    await user.save();

    return NextResponse.json(
      {
        message: "Withdrawal request submitted successfully",
        property: withdrawnProperty,
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

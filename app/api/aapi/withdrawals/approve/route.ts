// app/api/admin/withdrawals/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session?.user?.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { userId, propertyId, approve } = await request.json();

    // Validate required fields
    if (!userId || !propertyId || typeof approve === "undefined") {
      return NextResponse.json(
        { error: "Missing required fields: userId, propertyId, or approve" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if propertyWithdrawn exists and is an array
    if (!user.propertyWithdrawn || !Array.isArray(user.propertyWithdrawn)) {
      return NextResponse.json(
        { error: "No withdrawal requests found for this user" },
        { status: 404 }
      );
    }

    // Safe propertyId comparison with null/undefined checks
    const propertyIndex = user.propertyWithdrawn.findIndex((property: any) => {
      if (!property || !property.propertyId) {
        return false;
      }

      // Handle both string and ObjectId types
      const propId = property.propertyId.toString
        ? property.propertyId.toString()
        : String(property.propertyId);
      const searchId = propertyId.toString
        ? propertyId.toString()
        : String(propertyId);

      return propId === searchId;
    });

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const withdrawalProperty = user.propertyWithdrawn[propertyIndex];

    if (approve) {
      // Approve withdrawal - property stays in propertyWithdrawn with approved status
      withdrawalProperty.isWithdrawnApproved = true;
      withdrawalProperty.approvedAt = new Date();
      withdrawalProperty.approvedBy = session.user.email;

      // TODO: Process refund logic here
      // This would involve calling your payment provider's refund API
      console.log(`Processing refund for property: ${propertyId}`);

      // Move from propertyUnderPayment to propertyWithdrawn if it's still there
      const underPaymentIndex = user.propertyUnderPayment.findIndex(
        (property: any) => {
          if (!property || !property.propertyId) return false;
          const propId = property.propertyId.toString
            ? property.propertyId.toString()
            : String(property.propertyId);
          const searchId = propertyId.toString
            ? propertyId.toString()
            : String(propertyId);
          return propId === searchId;
        }
      );

      if (underPaymentIndex !== -1) {
        user.propertyUnderPayment.splice(underPaymentIndex, 1);
      }
    } else {
      // Deny withdrawal - move property back to propertyUnderPayment
      const source = (withdrawalProperty as any)?.toObject
        ? (withdrawalProperty as any).toObject()
        : JSON.parse(JSON.stringify(withdrawalProperty));
      const deniedProperty = { ...source };

      // Reset withdrawal flags
      deniedProperty.isWithdrawn = false;
      deniedProperty.isWithdrawnApproved = false;
      delete deniedProperty.withdrawnDate;
      delete deniedProperty.withdrawalReason;
      delete deniedProperty.approvedAt;
      delete deniedProperty.approvedBy;

      user.propertyUnderPayment.push(deniedProperty);
      user.propertyWithdrawn.splice(propertyIndex, 1);
    }

    await user.save();

    return NextResponse.json(
      {
        message: `Withdrawal ${approve ? "approved" : "denied"} successfully`,
        property: withdrawalProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

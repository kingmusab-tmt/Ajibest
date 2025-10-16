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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const propertyIndex = user.propertyWithdrawn.findIndex(
      (property: any) => property.propertyId.toString() === propertyId
    );

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    if (approve) {
      // Approve withdrawal - property stays in propertyWithdrawn with approved status
      user.propertyWithdrawn[propertyIndex].isWithdrawnApproved = true;

      // TODO: Process refund logic here
      // This would involve calling your payment provider's refund API
      console.log(`Processing refund for property: ${propertyId}`);
    } else {
      // Deny withdrawal - move property back to propertyUnderPayment
      const deniedProperty = user.propertyWithdrawn[propertyIndex];
      deniedProperty.isWithdrawn = false;
      deniedProperty.isWithdrawnApproved = false;

      user.propertyUnderPayment.push(deniedProperty);
      user.propertyWithdrawn.splice(propertyIndex, 1);
    }

    await user.save();

    return NextResponse.json(
      {
        message: `Withdrawal ${approve ? "approved" : "denied"} successfully`,
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

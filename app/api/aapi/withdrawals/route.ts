// app/api/admin/withdrawals/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

// Get all withdrawal requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session?.user?.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    // Find all users with pending withdrawal requests
    const usersWithWithdrawals = await User.find({
      "propertyWithdrawn.isWithdrawnApproved": false,
    }).select("name email propertyWithdrawn");

    const withdrawalRequests = usersWithWithdrawals.flatMap((user) =>
      user.propertyWithdrawn
        .filter((property: any) => !property.isWithdrawnApproved)
        .map((property: any) => ({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          ...property.toObject(),
        }))
    );

    return NextResponse.json({ withdrawalRequests }, { status: 200 });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

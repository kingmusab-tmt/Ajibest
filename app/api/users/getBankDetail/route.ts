import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../utils/connectDB";
import User from "../../../../models/user";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json(
      { success: false, message: "User Email not Found" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ email })
      .select("userAccountName userAccountNumber userBankName")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return only the specific account fields
    return NextResponse.json({
      success: true,
      data: {
        userAccountName: user.userAccountName,
        userAccountNumber: user.userAccountNumber,
        userBankName: user.userBankName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await getServerSession(authOptions); // Ensure the user is authenticated
    if (!session || !session.user || session.user.role != "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

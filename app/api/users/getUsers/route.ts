import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

import dbConnect from "@/utils/connectDB";
import Property from "@/models/properties";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const data = await req.json();
  try {
    const property = await Property.create(data);
    await property.save();
    return NextResponse.json(
      { success: true, data: property },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        details: error,
      },
      { status: 500 }
    );
  }
}

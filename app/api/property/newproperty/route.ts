import dbConnect from "../../../../utils/connectDB";
import Property from "../../../../models/properties";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
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

import dbConnect from "../../../../utils/connectDB";
import Property from "../../../../models/properties";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const properties = await Property.find({});
    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

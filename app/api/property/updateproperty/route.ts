import dbConnect from "../../../../utils/connectDB";
import Property from "../../../../models/properties";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");
  const { id, ...data } = await req.json();
  try {
    await Property.findByIdAndUpdate(_id, data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Update Property",
        details: error,
      },
      { status: 500 }
    );
  }
}

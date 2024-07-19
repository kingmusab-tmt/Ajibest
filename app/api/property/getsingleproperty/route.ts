// import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import Properties from "@/models/properties";
import { NextResponse } from "next/server";

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "No query parameter provided" },
      { status: 400 }
    );
  }

  await dbConnect();
  try {
    const property = await Properties.findOne({ _id: id });
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

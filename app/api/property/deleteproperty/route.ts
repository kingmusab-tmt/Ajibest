import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import Properties from "@/models/properties";
import authMiddleware from "../../../../utils/authMiddleware";
import roleMiddleware from "../../../../utils/roleMiddleware";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function DELETE(req) {
  const _id = req.nextUrl.searchParams.get("id");

  await dbConnect();

  try {
    const deletedPropety = await Properties.deleteOne({ _id });
    if (!deletedPropety) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

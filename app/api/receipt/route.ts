import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Receipt from "@/models/Receipt";

// GET - Fetch specific receipt or all receipts
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const receipts = await Receipt.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: receipts,
    });
  } catch (error: any) {
    console.error("Error fetching receipts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch receipts",
      },
      { status: 500 },
    );
  }
}

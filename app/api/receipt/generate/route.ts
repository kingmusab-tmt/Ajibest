import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Receipt from "@/models/Receipt";
import { v4 as uuidv4 } from "uuid";

// POST - Generate batch of receipts
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { count } = body;

    if (!count || count < 1 || count > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Count must be between 1 and 1000",
        },
        { status: 400 },
      );
    }

    const batch: Array<{
      receiptId: string;
      status: string;
      details: Record<string, any>;
    }> = [];
    const urls: string[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    for (let i = 0; i < count; i++) {
      const newId = uuidv4();

      batch.push({
        receiptId: newId,
        status: "INACTIVE",
        details: {},
      });

      urls.push(`${baseUrl}/admin/manageReciept/${newId}`);
    }

    await Receipt.insertMany(batch);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${count} receipts`,
      urls: urls,
    });
  } catch (error: any) {
    console.error("Error generating batch:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate receipt batch",
      },
      { status: 500 },
    );
  }
}

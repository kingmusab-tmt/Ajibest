import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Receipt from "@/models/Receipt";

// GET - Fetch single receipt by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const receipt = await Receipt.findOne({ receiptId: id });

    if (!receipt) {
      return NextResponse.json(
        {
          success: false,
          message: "Receipt not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (error: any) {
    console.error("Error fetching receipt:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch receipt",
      },
      { status: 500 },
    );
  }
}

// PUT - Update/Activate receipt
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    const receipt = await Receipt.findOne({ receiptId: id });

    if (!receipt) {
      return NextResponse.json(
        {
          success: false,
          message: "Receipt not found",
        },
        { status: 404 },
      );
    }

    // Update receipt details and activate
    receipt.details = body;
    receipt.status = "ACTIVE";
    receipt.activatedAt = new Date();

    await receipt.save();

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (error: any) {
    console.error("Error updating receipt:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update receipt",
      },
      { status: 500 },
    );
  }
}

// DELETE - Void receipt
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const receipt = await Receipt.findOne({ receiptId: id });

    if (!receipt) {
      return NextResponse.json(
        {
          success: false,
          message: "Receipt not found",
        },
        { status: 404 },
      );
    }

    receipt.status = "VOIDED";
    await receipt.save();

    return NextResponse.json({
      success: true,
      message: "Receipt voided successfully",
    });
  } catch (error: any) {
    console.error("Error voiding receipt:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to void receipt",
      },
      { status: 500 },
    );
  }
}

// app/api/admin/refund-requests/mark-paid/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import RefundRequest from "@/models/refundRequest";
import dbConnect from "@/utils/connectDB";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session?.user?.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { refundRequestId, scheduleIndex } = await request.json();

    if (!refundRequestId || typeof scheduleIndex === "undefined") {
      return NextResponse.json(
        { error: "Missing required fields: refundRequestId or scheduleIndex" },
        { status: 400 }
      );
    }

    const refundRequest = await RefundRequest.findById(refundRequestId);

    if (!refundRequest) {
      return NextResponse.json(
        { error: "Refund request not found" },
        { status: 404 }
      );
    }

    // Validate schedule index
    if (
      scheduleIndex < 0 ||
      scheduleIndex >= refundRequest.refundSchedule.length
    ) {
      return NextResponse.json(
        { error: "Invalid refund schedule index" },
        { status: 400 }
      );
    }

    // Mark the specific refund installment as paid
    refundRequest.refundSchedule[scheduleIndex].isPaid = true;
    refundRequest.refundSchedule[scheduleIndex].paidAt = new Date();

    // Check if all refunds are completed
    const allPaid = refundRequest.refundSchedule.every((item) => item.isPaid);
    if (allPaid) {
      refundRequest.status = "completed";
      refundRequest.completedAt = new Date();
    } else if (refundRequest.status === "pending") {
      refundRequest.status = "in-progress";
    }

    await refundRequest.save();

    return NextResponse.json(
      {
        message: "Refund marked as paid successfully",
        refundRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark refund as paid error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

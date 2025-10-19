import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import RefundRequest from "@/models/refundRequest";
import dbConnect from "@/utils/connectDB";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session?.user?.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { userId, propertyId, approve } = await request.json();

    // Validate required fields
    if (!userId || !propertyId || typeof approve === "undefined") {
      // console.log("Missing fields:", { userId, propertyId, approve });
      return NextResponse.json(
        { error: "Missing required fields: userId, propertyId, or approve" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if propertyWithdrawn exists and is an array
    if (!user.propertyWithdrawn || !Array.isArray(user.propertyWithdrawn)) {
      return NextResponse.json(
        { error: "No withdrawal requests found for this user" },
        { status: 404 }
      );
    }

    // Safe propertyId comparison with null/undefined checks
    const propertyIndex = user.propertyWithdrawn.findIndex((property: any) => {
      if (!property || !property.propertyId) {
        return false;
      }

      // Handle both string and ObjectId types
      const propId = property.propertyId.toString
        ? property.propertyId.toString()
        : String(property.propertyId);
      const searchId = propertyId.toString
        ? propertyId.toString()
        : String(propertyId);

      return propId === searchId;
    });

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const withdrawalProperty = user.propertyWithdrawn[propertyIndex];

    let savedRefundRequest: any = undefined;

    if (approve) {
      // Calculate total money paid by user from paymentHistory
      const totalPaid = withdrawalProperty.paymentHistory.reduce(
        (sum: number, payment: any) => sum + (Number(payment.amount) || 0),
        0
      );

      // Get the property price
      const propertyPrice =
        Number(withdrawalProperty.paymentHistory?.[0]?.propertyPrice) || 0;

      // Validate that we have valid numbers before proceeding
      if (isNaN(totalPaid) || isNaN(propertyPrice)) {
        console.error("Invalid financial data:", {
          totalPaid,
          propertyPrice,
          propertyPriceField: withdrawalProperty.propertyPrice,
        });
        return NextResponse.json(
          { error: "Invalid financial data in withdrawal property" },
          { status: 400 }
        );
      }

      // Ensure user financial fields are numbers and have fallback values
      const currentTotalPaymentsGross = Number(user.totalPaymentsGross) || 0;
      const currentTotalPaymentToBeMade =
        Number(user.totalPaymentToBeMade) || 0;

      // Update user's financial totals with validation
      // Only subtract propertyPrice from totalPaymentsGross (not from totalPaymentMade)
      user.totalPaymentsGross = Math.max(
        0,
        currentTotalPaymentsGross - propertyPrice
      );

      // Get remaining balance from last payment history entry
      const lastPayment =
        withdrawalProperty.paymentHistory[
          withdrawalProperty.paymentHistory.length - 1
        ];

      if (lastPayment && lastPayment.remainingBalance) {
        const remainingBalance = Number(lastPayment.remainingBalance) || 0;
        // Only subtract remaining balance from totalPaymentToBeMade
        user.totalPaymentToBeMade = Math.max(
          0,
          currentTotalPaymentToBeMade - remainingBalance
        );
      } else {
        // If no remaining balance in payment history, calculate it
        const calculatedRemainingBalance = propertyPrice - totalPaid;
        user.totalPaymentToBeMade = Math.max(
          0,
          currentTotalPaymentToBeMade - calculatedRemainingBalance
        );
      }

      // Update remainingBalance to match the new totalPaymentToBeMade
      user.remainingBalance = user.totalPaymentToBeMade;

      // Validate final values are not NaN
      if (
        isNaN(user.totalPaymentsGross) ||
        isNaN(user.totalPaymentToBeMade) ||
        isNaN(user.remainingBalance)
      ) {
        console.error("NaN detected in user financial fields:", {
          totalPaymentsGross: user.totalPaymentsGross,
          totalPaymentToBeMade: user.totalPaymentToBeMade,
          remainingBalance: user.remainingBalance,
        });
        return NextResponse.json(
          { error: "Invalid financial calculation" },
          { status: 500 }
        );
      }

      // Create refund schedule based on payment history
      const refundSchedule = createRefundSchedule(
        withdrawalProperty.paymentHistory
      );

      // Create and save refund request
      const refundReq = new RefundRequest({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        propertyId: propertyId,
        propertyTitle: withdrawalProperty.title,
        totalRefundAmount: totalPaid,
        refundSchedule: refundSchedule,
        status: "pending",
        createdAt: new Date(),
        createdBy: session.user.email,
      });

      savedRefundRequest = await refundReq.save();

      // Update withdrawal property status
      withdrawalProperty.isWithdrawnApproved = true;
      withdrawalProperty.approvedAt = new Date();
      withdrawalProperty.approvedBy = session.user.email;

      // Move from propertyUnderPayment to propertyWithdrawn if it's still there
      const underPaymentIndex = user.propertyUnderPayment.findIndex(
        (property: any) => {
          if (!property || !property.propertyId) return false;
          const propId = property.propertyId.toString
            ? property.propertyId.toString()
            : String(property.propertyId);
          const searchId = propertyId.toString
            ? propertyId.toString()
            : String(propertyId);
          return propId === searchId;
        }
      );

      if (underPaymentIndex !== -1) {
        user.propertyUnderPayment.splice(underPaymentIndex, 1);
      }
    } else {
      // Deny withdrawal - move property back to propertyUnderPayment
      const source = (withdrawalProperty as any)?.toObject
        ? (withdrawalProperty as any).toObject()
        : JSON.parse(JSON.stringify(withdrawalProperty));
      const deniedProperty = { ...source };

      // Reset withdrawal flags
      deniedProperty.isWithdrawn = false;
      deniedProperty.isWithdrawnApproved = false;
      delete deniedProperty.withdrawnDate;
      delete deniedProperty.withdrawalReason;
      delete deniedProperty.approvedAt;
      delete deniedProperty.approvedBy;

      user.propertyUnderPayment.push(deniedProperty);
      user.propertyWithdrawn.splice(propertyIndex, 1);
    }

    await user.save();

    return NextResponse.json(
      {
        message: `Withdrawal ${approve ? "approved" : "denied"} successfully`,
        property: withdrawalProperty,
        refundRequestId: savedRefundRequest
          ? savedRefundRequest._id
          : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to create refund schedule based on payment history
function createRefundSchedule(paymentHistory: any[]) {
  interface RefundScheduleItem {
    amount: number;
    dueDate: Date;
    isPaid: boolean;
    paidAt: Date | null;
    paymentMethod: string;
  }

  const refundSchedule: RefundScheduleItem[] = [];

  // Sort payment history by date
  const sortedPayments = [...paymentHistory].sort(
    (a, b) =>
      new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );

  // Start refunds one month from now
  let currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);

  for (const payment of sortedPayments) {
    const amount = Number(payment.amount) || 0;
    if (amount > 0) {
      refundSchedule.push({
        amount: amount,
        dueDate: new Date(currentDate),
        isPaid: false,
        paidAt: null,
        paymentMethod: "bank_transfer",
      });

      // Move to next month for next refund
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return refundSchedule;
}

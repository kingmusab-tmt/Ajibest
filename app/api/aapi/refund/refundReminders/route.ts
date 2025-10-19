// app/api/admin/refund-requests/reminders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import RefundRequest from "@/models/refundRequest";
import dbConnect from "@/utils/connectDB";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session?.user?.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Calculate date 10 days from now
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

    // Find refunds that are due in less than 10 days and not paid
    const upcomingRefunds = await RefundRequest.aggregate([
      { $unwind: "$refundSchedule" },
      {
        $match: {
          "refundSchedule.isPaid": false,
          "refundSchedule.dueDate": {
            $lte: tenDaysFromNow,
            $gte: new Date(), // From today onwards
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          userEmail: { $first: "$userEmail" },
          userName: { $first: "$userName" },
          propertyTitle: { $first: "$propertyTitle" },
          totalRefundAmount: { $first: "$totalRefundAmount" },
          upcomingPayments: {
            $push: {
              amount: "$refundSchedule.amount",
              dueDate: "$refundSchedule.dueDate",
              paymentMethod: "$refundSchedule.paymentMethod",
            },
          },
        },
      },
    ]);

    // Send notifications for upcoming refunds
    for (const refund of upcomingRefunds) {
      for (const payment of refund.upcomingPayments) {
        await sendRefundReminder(refund, payment);
      }
    }

    return NextResponse.json(
      {
        message: "Refund reminders processed",
        upcomingRefunds,
        totalReminders: upcomingRefunds.reduce(
          (sum, refund) => sum + refund.upcomingPayments.length,
          0
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get refund reminders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to send refund reminders
async function sendRefundReminder(refund: any, payment: any) {
  try {
    const daysUntilDue = Math.ceil(
      (new Date(payment.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const message = `REMINDER: Refund payment of $${payment.amount} for property "${refund.propertyTitle}" is due in ${daysUntilDue} days for user ${refund.userName} (${refund.userEmail}).`;

    // Send email notification
    await sendEmailNotification(refund, payment, daysUntilDue, message);

    // Send SMS notification
    await sendSMSNotification(refund, payment, daysUntilDue, message);

    // Send push notification
    await sendPushNotification(refund, payment, daysUntilDue, message);

    // console.log(`Refund reminder sent: ${message}`);
  } catch (error) {
    console.error("Error sending refund reminder:", error);
  }
}

// Stub functions for notifications (implement based on your notification service)
async function sendEmailNotification(
  refund: any,
  payment: any,
  daysUntilDue: number,
  message: string
) {
  // Implement your email service integration
  // console.log("Email:", message);
}

async function sendSMSNotification(
  refund: any,
  payment: any,
  daysUntilDue: number,
  message: string
) {
  // Implement your SMS service integration
  // console.log("SMS:", message);
}

async function sendPushNotification(
  refund: any,
  payment: any,
  daysUntilDue: number,
  message: string
) {
  // Implement your push notification service
  // console.log("Push:", message);
}

import Transaction from "../../../../../models/transaction";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { transactionId, status } = body;

  if (!session?.user && session?.user?.role !== "Admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    // First, find the transaction to get all the details
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    // If status is being set to failed, update user balances
    if (status === "failed" && transaction.status !== "failed") {
      const user = await User.findOne({ email: transaction.email });

      if (user) {
        // Subtract amount from totalPaymentMade
        user.totalPaymentMade = Math.max(
          0,
          user.totalPaymentMade - transaction.amount
        );

        // Add amount to totalPaymentToBeMade and remainingBalance
        user.totalPaymentToBeMade += transaction.amount;
        user.remainingBalance += transaction.amount;

        // Remove the payment from payment history in propertyUnderPayment
        user.propertyUnderPayment.forEach((property) => {
          if (
            property.propertyId.toString() === transaction.propertyId.toString()
          ) {
            // Find and remove the payment record that matches this transaction
            property.paymentHistory = property.paymentHistory.filter(
              (payment) => {
                // Remove payments that match this transaction's amount and date
                // You might want to adjust this logic based on how you identify specific payments
                return !(
                  payment.amount === transaction.amount &&
                  new Date(payment.paymentDate).getTime() ===
                    new Date(transaction.createdAt).getTime()
                );
              }
            );

            // Recalculate the property's payment totals after removal
            if (property.paymentHistory.length > 0) {
              const latestPayment =
                property.paymentHistory[property.paymentHistory.length - 1];
              property.paymentHistory[property.paymentHistory.length - 1] = {
                ...latestPayment,
                totalPaymentMade: user.totalPaymentMade,
                remainingBalance: user.remainingBalance,
              };
            }
          }
        });

        await user.save();
      }
    }

    // Now update the transaction status
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status: status },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        transaction: {
          _id: updatedTransaction?._id,
          status: updatedTransaction?.status,
        },
        userUpdated: status === "failed", // Indicate if user was updated
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Transaction Status" },
      { status: 400 }
    );
  }
}

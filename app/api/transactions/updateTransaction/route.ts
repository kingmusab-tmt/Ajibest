import Transaction from "../../../../models/transaction";
import dbConnect from "@/utils/connectDB";
import { NextResponse } from "next/server";


export const dynamic = 'force-dynamic';
export async function PUT(req, res) {
  const body = await req.json();
  const { transactionId, status } = body;

  await dbConnect();

  try {
    console.log(status);
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status: status },
      { new: true }
    );
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        transaction: {
          _id: transaction._id,
          status: transaction.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update Transaction Status" },
      { status: 400 }
    );
  }
}

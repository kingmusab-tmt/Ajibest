import Transaction from "../../../../models/transaction";
import dbConnect from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  const { id } = req.query;
  console.log(id);

  await dbConnect();

  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to update transaction status" });
  }
}

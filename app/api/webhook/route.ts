import dbConnect from "@/utils/connectDB";
import Transaction from "@/models/transaction";
import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const dynamic = "force-dynamic";
export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  await dbConnect();

  const event = await req.json();
  // // console.log(req.headers);
  // // console.log(event);

  const headers = new Headers(req.headers);
  const secret = headers.get("x-paystack-signature");

  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(event))
    .digest("hex");
  if (hash !== secret) {
    return NextResponse.json(
      { message: "Webhook Error: Invalid signature" },
      { status: 400 }
    );
  }

  // const event = JSON.parse(buf.toString());

  if (event.event === "charge.success") {
    const { reference, status, amount } = event.data;

    const transaction = await Transaction.findOne({ reference });

    if (transaction) {
      transaction.status = status === "success" ? "successful" : "failed";
      await transaction.save();
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}

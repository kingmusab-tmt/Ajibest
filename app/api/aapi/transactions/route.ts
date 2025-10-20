import Transaction from "@/models/transaction";
import dbConnect from "@/utils/connectDB";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const body = await req.nextUrl.searchParams;
  const sortField = body.get("sortField") || "date";
  const sortOrder = body.get("sortOrder") || "desc";
  const transactionType = body.get("transactionType");
  const transactionStatus = body.get("transactionStatus");

  if (!session?.user && session?.user?.role !== "Admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const sort = {};
  sort[sortField] = sortOrder === "desc" ? -1 : 1;

  let filters: any = {};
  if (session?.user?.role === "Admin") {
    filters = filters;
    // session?.user?.role === "Admin" ? {} :
  }
  if (transactionType) filters.paymentMethod = transactionType;
  if (transactionStatus) filters.status = transactionStatus;

  try {
    const transactions = await Transaction.find(filters).sort(sort);
    return NextResponse.json({ success: true, transactions, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to Fetch Transaction", details: error },
      { status: 500 }
    );
  }
}

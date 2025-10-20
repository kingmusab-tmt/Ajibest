import { NextResponse } from "next/server";
import { getNotification } from "@/models/notification";
import dbConnect from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }

  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");

  try {
    const notification = await getNotification(_id);
    return NextResponse.json({
      success: true,
      data: notification,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch notification",
      status: 500,
    });
  }
}

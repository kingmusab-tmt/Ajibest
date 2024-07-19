import { NextRequest, NextResponse } from "next/server";
import { getNotification } from "@/models/notification";

export async function GET(req: NextRequest, res: NextResponse) {
  const _id = req.nextUrl.searchParams.get("id");

  try {
    const notification = await getNotification(_id as string);
    return NextResponse.json({
      success: true,
      data: notification,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notification", status: 500 },
      { status: 500 }
    );
  }
}

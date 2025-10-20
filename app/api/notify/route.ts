import {
  getAllNotifications,
  updateNotification,
  deleteNotification,
  saveNotification,
} from "@/models/notification";
import { NextResponse } from "next/server";
import { sendNotification } from "@/app/actions";
import dbConnect from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  try {
    const notifications = await getAllNotifications();
    return NextResponse.json({
      success: true,
      data: notifications,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch notifications",
      status: 500,
    });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const body = await req.json();
  const { message, recipient } = body;

  try {
    await saveNotification(message, recipient);
    await sendNotification(message); // Send push notification after saving

    return NextResponse.json({
      success: true,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create notification",
      details: error,
      status: 500,
    });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");
  const body = await req.json();
  const { message, recipient } = body;

  try {
    await updateNotification(_id, message, recipient);
    await sendNotification(`Updated notification: ${message}`); // Send push notification after updating

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update notification",
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");

  try {
    await deleteNotification(_id);
    // await sendNotification("A notification was deleted"); // Optionally notify about deletion

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete notification",
      status: 500,
    });
  }
}

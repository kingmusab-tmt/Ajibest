// import {
//   getAllNotifications,
//   updateNotification,
//   deleteNotification,
//   saveNotification,
// } from "@/models/notification";
// import { NextResponse, NextRequest } from "next/server";

// export const dynamic = 'force-dynamic';
// export async function GET() {
//   try {
//     const notifications = await getAllNotifications();
//     return NextResponse.json({
//       success: true,
//       data: notifications,
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: "Failed to fetch notifications",
//       status: 500,
//     });
//   }
// }

// export async function POST(req: NextRequest, res: NextResponse) {
//   const body = await req.json();

//   const { message, recipient } = body;

//   try {
//     await saveNotification(message, recipient);
//     return NextResponse.json({
//       success: true,
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed create Notification",
//         details: error,
//       },
//       { status: 500 }
//     );
//   }
// }
// export async function PUT(req) {
//   const _id = req.nextUrl.searchParams.get("id");
//   const body = await req.json();

//   const { message, recipient } = body;

//   try {
//     await updateNotification(_id as string, message, recipient);
//     return NextResponse.json({
//       success: true,
//       message: "Notification updated successfully",
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: "Failed to update notification",
//       status: 500,
//     });
//   }
// }

// export async function DELETE(req: NextRequest, res: NextResponse) {
//   const _id = req.nextUrl.searchParams.get("id");
//   try {
//     await deleteNotification(_id as string);
//     return NextResponse.json({
//       success: true,
//       message: "Notification deleted successfully",
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: "Failed to delete notification",
//       status: 500,
//     });
//   }
// }
import {
  getAllNotifications,
  updateNotification,
  deleteNotification,
  saveNotification,
} from "@/models/notification";
import { NextResponse } from "next/server";
import { sendNotification } from "@/app/actions";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

export async function GET() {
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

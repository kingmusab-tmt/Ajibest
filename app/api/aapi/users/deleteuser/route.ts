import dbConnect from "../../../../../utils/connectDB";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import { logAdminAction } from "@/utils/auditLogger";

export const dynamic = "force-dynamic";
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("id");
  await dbConnect();

  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const email = session?.user?.email;
    if (!email) {
      return Response.json(
        { success: false, message: "User Email not Found" },
        { status: 401 }
      );
    }
    filterUser = { email };
  }

  try {
    const userToDelete = await User.findOne(filterUser);
    const deletedUser = await User.deleteOne(filterUser);
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Log admin action
    await logAdminAction(
      session.user.id || "",
      session.user.email || "",
      session.user.name || "",
      "USER_DELETED",
      "User",
      _id || userToDelete?._id?.toString(),
      userToDelete?.email,
      { deletedUserName: userToDelete?.name },
      req
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

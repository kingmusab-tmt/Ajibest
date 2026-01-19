import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";

export const dynamic = "force-dynamic";

// PATCH: Admin-only user updates (currently role changes)
export async function PATCH(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  // Only Admins can perform this action
  const actingUser = await User.findOne({ email: session.user.email });
  if (actingUser?.role !== "Admin") {
    return Response.json(
      { message: "Admin access required", success: false },
      { status: 403 },
    );
  }

  try {
    const data = await req.json();
    const { _id, role } = data || {};

    if (!_id) {
      return Response.json(
        { message: "User _id is required", success: false },
        { status: 400 },
      );
    }

    const allowedRoles = ["User", "Agent", "Admin"] as const;
    if (!allowedRoles.includes(role)) {
      return Response.json(
        { message: "Invalid role", success: false },
        { status: 400 },
      );
    }

    const user = await User.findById(_id);
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    user.role = role;
    await user.save();

    return Response.json(
      { message: "Role updated", success: true },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

import { authOptions } from "@/app/auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }

  await dbConnect();
  const data = await req.json();
  const { _id, ...UserInfo } = data;

  let filter = {};
  if (_id) {
    filter = { _id };
  } else {
    const email = session?.user?.email;
    filter = { email };
  }

  try {
    const user = await User.findOne(filter);
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      UserInfo.oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      return Response.json({
        success: false,
        message: "Old password is incorrect",
        status: 400,
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(UserInfo.newPassword, salt);
    await user.save();
    return Response.json({
      success: true,
      status: 200,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
}

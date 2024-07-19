import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../utils/connectDB";
import User from "../../../../models/user";
import authMiddleware from "../../../../utils/authMiddleware";
import roleMiddleware from "../../../../utils/roleMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const _id = req.nextUrl.searchParams.get("id");
  await dbConnect();

  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
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
    const user = await User.findOne(filterUser).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

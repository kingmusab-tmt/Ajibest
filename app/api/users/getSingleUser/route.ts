import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../utils/connectDB";
import User from "../../../../models/user";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const _id = req.nextUrl.searchParams.get("id");
  const email = req.nextUrl.searchParams.get("email");
  await dbConnect();

  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else if (email) {
    filterUser = { email };
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

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import User from "../../../../models/user";
import authMiddleware from "../../../../utils/authMiddleware";
import roleMiddleware from "../../../../utils/roleMiddleware";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth"

export const dynamic = 'force-dynamic';
export async function DELETE(req) {
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
    const deletedUser = await User.deleteOne(filterUser);
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

// export default authMiddleware(
//   roleMiddleware(
//     async (req: NextApiRequest, res: NextApiResponse) => {
//       const { method } = req;

//       switch (method) {
//         case "DELETE":
//           return await DELETE(req, res);
//         default:
//           return NextResponse.json(
//             { success: false, error: "Method not allowed" },
//             { status: 405 }
//           );
//       }
//     },
//     ["admin"]
//   )
// );

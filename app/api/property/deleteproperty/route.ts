import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import Properties from "@/models/properties";
import authMiddleware from "../../../../utils/authMiddleware";
import roleMiddleware from "../../../../utils/roleMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function DELETE(req) {
  const _id = req.nextUrl.searchParams.get("id");

  await dbConnect();

  try {
    const deletedPropety = await Properties.deleteOne({ _id });
    if (!deletedPropety) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "../../../../utils/connectDB";
// import Properties from "@/models/properties";
// import authMiddleware from "../../../../utils/authMiddleware";
// import roleMiddleware from "../../../../utils/roleMiddleware";
// import { NextResponse } from "next/server";

// export async function DELETE(req, res) {
//   const session = await req.session.get();
//   if (session?.user?.role !== "Admin") {
//     return NextResponse.json({
//       success: false,
//       message: "Only admins can delete properties",
//     }, {
//       status: 403
//     });
//   }

//   const _id = req.nextUrl.searchParams.get("id");
//   await dbConnect();

//   try {
//     const deletedProperty = await Properties.deleteOne({ _id });
//     if (!deletedProperty) {
//       return NextResponse.json({
//         success: false,
//         message: "Property not found",
//       }, {
//         status: 404
//       });
//     }
//     return NextResponse.json({ success: true, data: {} });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error }, { status: 400 });
//   }
// }
// export default authMiddleware(roleMiddleware(DELETE, ["admin"]));

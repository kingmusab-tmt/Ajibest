import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/connectDB";
import Properties from "@/models/properties";
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

  try {
    const deletedPropety = await Properties.deleteOne({ _id });
    if (!deletedPropety) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // Log admin action
    await logAdminAction(
      session.user.id || "",
      session.user.email || "",
      session.user.name || "",
      "PROPERTY_DELETED",
      "Property",
      _id,
      undefined,
      {},
      req
    );

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

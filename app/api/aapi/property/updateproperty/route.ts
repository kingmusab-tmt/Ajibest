import dbConnect from "@/utils/connectDB";
import Property from "@/models/properties";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import { logAdminAction } from "@/utils/auditLogger";

export const dynamic = "force-dynamic";

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
  const { id, ...data } = await req.json();
  try {
    await Property.findByIdAndUpdate(_id, data);

    // Log admin action
    await logAdminAction(
      session.user.id || "",
      session.user.email || "",
      session.user.name || "",
      "PROPERTY_UPDATED",
      "Property",
      _id,
      undefined,
      { updatedFields: Object.keys(data) },
      req
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Update Property",
        details: error,
      },
      { status: 500 }
    );
  }
}

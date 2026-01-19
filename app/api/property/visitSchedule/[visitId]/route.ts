import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import PropertyVisit from "@/models/propertyVisit";
import Property from "@/models/properties";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// PATCH: Update visit status
export async function PATCH(
  req: Request,
  context: { params: Promise<{ visitId: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    const { visitId } = await context.params;
    const { status } = await req.json();

    if (!["completed", "cancelled", "released"].includes(status)) {
      return Response.json(
        { message: "Invalid status", success: false },
        { status: 400 },
      );
    }

    const visit = await PropertyVisit.findById(visitId);

    if (!visit) {
      return Response.json(
        { message: "Visit not found", success: false },
        { status: 404 },
      );
    }

    // Check authorization
    if (visit.userEmail !== session.user.email) {
      return Response.json(
        { message: "Unauthorized", success: false },
        { status: 403 },
      );
    }

    const updateData: any = { status };

    if (status === "completed") {
      updateData.completedDate = new Date();
    } else if (status === "released") {
      updateData.releaseDate = new Date();
    }

    const updatedVisit = await PropertyVisit.findByIdAndUpdate(
      visitId,
      updateData,
      { new: true },
    );

    return Response.json(
      {
        message: "Visit updated successfully",
        success: true,
        data: updatedVisit,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import PropertyVisit from "@/models/propertyVisit";
import User from "@/models/user";
import VisitAvailability from "@/models/visitAvailability";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// PATCH: Admin update visit
export async function PATCH(
  req: Request,
  context: { params: Promise<{ visitId: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { visitId } = await context.params;

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (user?.role !== "Admin") {
      return Response.json(
        { message: "Admin access required", success: false },
        { status: 403 },
      );
    }

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

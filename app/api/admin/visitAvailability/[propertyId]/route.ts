import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import VisitAvailability from "@/models/visitAvailability";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// GET: Get available dates for a property
export async function GET(
  req: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { propertyId } = await context.params;

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

    const availability = await VisitAvailability.findOne({ propertyId });

    return Response.json(
      {
        message: "Available dates fetched",
        success: true,
        data: availability || {
          propertyId,
          availableSlots: [],
        },
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

// POST: Create or update available dates
export async function POST(
  req: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { propertyId } = await context.params;

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

    const { availableSlots } = await req.json();

    if (!Array.isArray(availableSlots)) {
      return Response.json(
        { message: "Available slots must be an array", success: false },
        { status: 400 },
      );
    }

    // Sanitize slots
    const sanitizedSlots = availableSlots
      .filter(
        (slot: any) =>
          slot?.date && Array.isArray(slot.times) && Number(slot.capacity) > 0,
      )
      .map((slot: any) => ({
        date: String(slot.date),
        times: slot.times.map((t: any) => String(t)).filter(Boolean),
        capacity: Number(slot.capacity) || 1,
      }));

    let availability = await VisitAvailability.findOne({ propertyId });

    if (availability) {
      availability.availableSlots = sanitizedSlots;
      await availability.save();
    } else {
      availability = new VisitAvailability({
        propertyId,
        availableSlots: sanitizedSlots,
      });
      await availability.save();
    }

    return Response.json(
      {
        message: "Available dates updated",
        success: true,
        data: availability,
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

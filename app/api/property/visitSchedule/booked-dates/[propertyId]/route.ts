import PropertyVisit from "@/models/propertyVisit";
import VisitAvailability from "@/models/visitAvailability";
import Property from "@/models/properties";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// GET: Get available visit dates for a property
export async function GET(
  req: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  await dbConnect();

  try {
    const { propertyId } = await context.params;

    // Verify property qualifies for visits (available, not rented, not purchased)
    const property = await Property.findById(propertyId);
    if (!property) {
      return Response.json(
        { message: "Property not found", success: false },
        { status: 404 },
      );
    }

    if (
      property.status !== "available" ||
      property.rented === true ||
      property.purchased === true
    ) {
      return Response.json(
        {
          message: "Property is not available for visits",
          success: false,
          data: { bookedCounts: {}, availableSlots: [] },
        },
        { status: 200 },
      );
    }

    // Get all scheduled visits for this property
    const visits = await PropertyVisit.find({
      propertyId,
      status: "scheduled",
    });

    // Count bookings per date
    const bookedCounts: Record<string, number> = {};
    visits.forEach((v) => {
      const dateKey = new Date(v.visitDate).toISOString().split("T")[0];
      bookedCounts[dateKey] = (bookedCounts[dateKey] || 0) + 1;
    });

    // Get global available slots configured by admin
    const availability = await VisitAvailability.findOne({});
    const availableSlots = availability?.availableSlots || [];

    return Response.json(
      {
        message: "Booked slots fetched",
        success: true,
        data: { bookedCounts, availableSlots },
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

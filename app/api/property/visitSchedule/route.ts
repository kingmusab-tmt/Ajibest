import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import PropertyVisit from "@/models/propertyVisit";
import User from "@/models/user";
import Property from "@/models/properties";
import VisitAvailability from "@/models/visitAvailability";
import dbConnect from "@/utils/connectDB";
import {
  sendVisitScheduledEmail,
  sendAdminVisitNotificationEmail,
} from "@/utils/emailService";
import { saveNotification } from "@/models/notification";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    const { propertyId, visitDate, visitTime } = await req.json();

    if (!propertyId || !visitDate || !visitTime) {
      return Response.json(
        {
          message: "Property ID, visit date, and visit time are required",
          success: false,
        },
        { status: 400 },
      );
    }

    // Normalize date to start of day for storage while keeping time separately
    const visitDateObj = new Date(visitDate);
    const normalizedDate = new Date(visitDateObj);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Check if user already has 2 properties under visit
    const existingVisits = await PropertyVisit.countDocuments({
      userEmail: session.user.email,
      status: "scheduled",
    });

    if (existingVisits >= 2) {
      return Response.json(
        {
          message: "Maximum 2 properties can be under visit at a time",
          success: false,
        },
        { status: 400 },
      );
    }

    // Check if user already scheduled a visit for this property
    const existingVisit = await PropertyVisit.findOne({
      propertyId,
      userEmail: session.user.email,
      status: "scheduled",
    });

    if (existingVisit) {
      return Response.json(
        {
          message: "You already have a scheduled visit for this property",
          success: false,
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: session.user.email });
    const property = await Property.findById(propertyId);

    if (!property) {
      return Response.json(
        { message: "Property not found", success: false },
        { status: 404 },
      );
    }

    // Verify property qualifies for visits
    if (
      property.status !== "available" ||
      property.rented === true ||
      property.purchased === true
    ) {
      return Response.json(
        {
          message: "Property is not available for visits",
          success: false,
        },
        { status: 400 },
      );
    }

    // Validate availability, time slot, and per-day capacity using global availability
    const availability = await VisitAvailability.findOne({});
    const availableSlots = availability?.availableSlots || [];
    const dateKey = normalizedDate.toISOString().split("T")[0];
    const slotForDate = availableSlots.find((slot) => slot.date === dateKey);

    if (!slotForDate || !slotForDate.times.includes(visitTime)) {
      return Response.json(
        {
          message: "Selected date/time is not available",
          success: false,
        },
        { status: 400 },
      );
    }

    const bookedCount = await PropertyVisit.countDocuments({
      propertyId,
      status: "scheduled",
      visitDate: normalizedDate,
    });

    if (bookedCount >= (slotForDate.capacity || 1)) {
      return Response.json(
        {
          message: "Selected date has reached its visitor capacity",
          success: false,
        },
        { status: 400 },
      );
    }

    const visit = new PropertyVisit({
      propertyId,
      userId: user?._id,
      userEmail: session.user.email,
      userName: user?.name || session.user.email,
      visitDate: normalizedDate,
      visitTime,
      status: "scheduled",
    });

    await visit.save();

    // Send email notifications to user
    try {
      await sendVisitScheduledEmail(
        session.user.email,
        user?.name || "User",
        property.title,
        normalizedDate,
        visitTime,
      );
    } catch (err) {
      // Email notification failed but continue
    }

    // Send notifications and emails to all admins
    try {
      const admins = await User.find({ role: "Admin" }).select("email name");

      const notificationMessage = `New visit scheduled: ${user?.name || session.user.email} has scheduled a visit for ${property.title} on ${normalizedDate.toLocaleDateString()} at ${visitTime}`;

      // Send in-app notifications to all admins
      for (const admin of admins) {
        try {
          await saveNotification(notificationMessage, admin.email);
        } catch (err) {
          // Notification save failed but continue
        }
      }

      // Send email notifications to all admins
      for (const admin of admins) {
        try {
          await sendAdminVisitNotificationEmail(
            admin.email,
            user?.name || session.user.email,
            session.user.email,
            property.title,
            normalizedDate,
            visitTime,
          );
        } catch (err) {
          // Admin email failed but continue
        }
      }
    } catch (err) {
      // Continue with success even if admin notifications fail
    }

    return Response.json(
      {
        message: "Visit scheduled successfully",
        success: true,
        data: visit,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

// GET: Get user's visits
export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { message: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = { userEmail: session.user.email };
    if (status) {
      query.status = status;
    }

    const visits = await PropertyVisit.find(query)
      .populate(
        "propertyId",
        "title description location state city image price listingPurpose propertyType bedrooms bathrooms size amenities utilities instalmentAllowed",
      )
      .sort({ visitDate: -1 });

    return Response.json(
      { message: "Visits fetched successfully", success: true, data: visits },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

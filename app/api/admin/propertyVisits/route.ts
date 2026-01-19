import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import PropertyVisit from "@/models/propertyVisit";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// GET: Get all property visits (admin only)
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
    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (user?.role !== "Admin") {
      return Response.json(
        { message: "Admin access required", success: false },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const visits = await PropertyVisit.find(query)
      .populate(
        "propertyId",
        "title description location state city image price listingPurpose propertyType bedrooms bathrooms size amenities utilities",
      )
      .populate("userId", "name email")
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PropertyVisit.countDocuments(query);

    return Response.json(
      {
        message: "Visits fetched successfully",
        success: true,
        data: visits,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
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

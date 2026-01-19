import PropertyVisit from "@/models/propertyVisit";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

// This endpoint is called automatically when users access their dashboard
// It checks for expired property visits and automatically releases them
export async function POST(req: Request) {
  try {
    await dbConnect();

    // Get the current date minus 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find all scheduled visits that are older than 3 days
    const expiredVisits = await PropertyVisit.updateMany(
      {
        status: "scheduled",
        visitDate: { $lt: threeDaysAgo },
      },
      {
        $set: {
          status: "released",
          releaseDate: new Date(),
        },
      },
    );

    return Response.json(
      {
        message: "Auto-release completed",
        success: true,
        released: expiredVisits.modifiedCount,
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

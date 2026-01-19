import dbConnect from "@/utils/connectDB";
import VisitTerms from "@/models/visitTerms";

export const dynamic = "force-dynamic";

// GET: Get current visit terms (public - no auth required)
export async function GET(req: Request) {
  await dbConnect();

  try {
    // Get the current terms (there should be only one)
    const terms = await VisitTerms.findOne({});

    return Response.json(
      {
        message: "Terms fetched successfully",
        success: true,
        data: terms || null,
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

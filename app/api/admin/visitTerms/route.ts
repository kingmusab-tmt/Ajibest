import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import VisitTerms from "@/models/visitTerms";

export const dynamic = "force-dynamic";

// GET: Get current visit terms (admin only)
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

// POST: Create or update visit terms (admin only)
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
    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (user?.role !== "Admin") {
      return Response.json(
        { message: "Admin access required", success: false },
        { status: 403 },
      );
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return Response.json(
        { message: "Title and content are required", success: false },
        { status: 400 },
      );
    }

    // Get existing terms or create new one
    let terms = await VisitTerms.findOne({});

    if (terms) {
      // Update existing
      terms.title = title;
      terms.content = content;
      terms.version = (terms.version || 1) + 1;
      await terms.save();
    } else {
      // Create new
      terms = new VisitTerms({
        title,
        content,
        version: 1,
      });
      await terms.save();
    }

    return Response.json(
      { message: "Terms saved successfully", success: true, data: terms },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

// DELETE: Delete visit terms (admin only)
export async function DELETE(req: Request) {
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

    await VisitTerms.deleteMany({});

    return Response.json(
      { message: "Terms deleted successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

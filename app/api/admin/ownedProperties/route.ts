import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

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
    const adminUser = await User.findOne({ email: session.user.email });
    if (adminUser?.role !== "Admin") {
      return Response.json(
        { message: "Admin access required", success: false },
        { status: 403 },
      );
    }

    // Fetch all users with properties in propertyPurOrRented or propertyUnderPayment arrays
    const usersWithProperties = await User.find({
      $or: [
        { "propertyPurOrRented.0": { $exists: true } },
        { "propertyUnderPayment.0": { $exists: true } },
      ],
    }).select("email name propertyPurOrRented propertyUnderPayment");

    // Combine both arrays into a single response format
    const formattedData = usersWithProperties.map((user) => {
      const allProperties = [
        ...(user.propertyPurOrRented || []).map((p: any) => ({
          ...p.toObject(),
          paymentStatus: "completed",
        })),
        ...(user.propertyUnderPayment || []).map((p: any) => ({
          ...p.toObject(),
          paymentStatus: "in-progress",
        })),
      ];

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        ownedProperties: allProperties,
      };
    });

    return Response.json(
      {
        message: "Owned properties fetched successfully",
        success: true,
        data: formattedData,
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

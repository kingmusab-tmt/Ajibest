import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import User from "@/models/user";
import Property from "@/models/properties";
import dbConnect from "@/utils/connectDB";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
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

    const { userEmail, propertyId, updates } = await req.json();

    if (!userEmail || !propertyId || !updates) {
      return Response.json(
        {
          message: "User email, property ID, and updates are required",
          success: false,
        },
        { status: 400 },
      );
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // Find the property in user's propertyPurOrRented or propertyUnderPayment
    let propertyIndex = -1;
    let sourceArray: "propertyPurOrRented" | "propertyUnderPayment" | null =
      null;

    // Check in propertyPurOrRented first
    propertyIndex = user.propertyPurOrRented.findIndex(
      (p: any) => p.propertyId.toString() === propertyId,
    );

    if (propertyIndex !== -1) {
      sourceArray = "propertyPurOrRented";
    } else {
      // Check in propertyUnderPayment
      propertyIndex = user.propertyUnderPayment.findIndex(
        (p: any) => p.propertyId.toString() === propertyId,
      );

      if (propertyIndex !== -1) {
        sourceArray = "propertyUnderPayment";
      }
    }

    if (propertyIndex === -1 || !sourceArray) {
      return Response.json(
        {
          message: "Property not found in user's owned properties",
          success: false,
        },
        { status: 404 },
      );
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "propertyPrice",
      "bedrooms",
      "bathrooms",
      "amenities",
      "utilities",
      "size",
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key) && updates[key] !== undefined) {
        user[sourceArray][propertyIndex][key] = updates[key];
      }
    });

    await user.save();

    // Also update the property in the Properties collection
    const propertyUpdates: any = {};
    allowedUpdates.forEach((key) => {
      if (updates[key] !== undefined) {
        propertyUpdates[key] = updates[key];
      }
    });

    if (Object.keys(propertyUpdates).length > 0) {
      await Property.findByIdAndUpdate(propertyId, propertyUpdates);
    }

    return Response.json(
      {
        message: "Property updated successfully",
        success: true,
        data: user[sourceArray][propertyIndex],
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

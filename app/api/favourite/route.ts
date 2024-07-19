import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/connectDB";
import mongoose from "mongoose";
import User from "@/models/user";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

dbConnect();

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Please Login to add Property to your Favourite",
      },
      { status: 401 }
    );
  }

  const propertyId = new mongoose.Types.ObjectId(req.body.propertyId);

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Property ID" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email: session?.user?.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not Found" },
        { status: 404 }
      );
    }

    const favoriteIndex = user.favouriteProperties.indexOf(propertyId);
    if (favoriteIndex === -1) {
      user.favouriteProperties.push(propertyId);
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "Favorite Added",
          data: user.favouriteProperties,
        },
        { status: 200 }
      );
    } else {
      user.favouriteProperties.splice(favoriteIndex, 1);
      await user.save();
      return NextResponse.json(
        { success: true, message: "Favorite Removed" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Please Login to view your Favourite Properties",
      },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ email: session?.user?.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not Found" },
        { status: 404 }
      );
    }

    const favoriteProperties = user.favouriteProperties;

    return NextResponse.json(
      {
        success: true,
        message: "Favorite Properties",
        data: favoriteProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

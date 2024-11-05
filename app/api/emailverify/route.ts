import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const POST = async (request: NextRequest) => {
  await dbConnect(); // Connect to the database

  try {
    const { token } = await request.json();

    const user = await User.findOne(
      { emailToken: token }
      // { $setField: { isActive: true, emailToken: null } },
      // { upsert: false } // Ensure we don't create a new document
    );

    if (!user || user.emailToken === "null") {
      // No user found with the provided token
      return new NextResponse(
        JSON.stringify({
          message: "Invalid token. or account already activated",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      user.isActive = true;
      user.emailToken = "null";

      await user.save(); // Save the updated user document

      return new NextResponse(
        JSON.stringify({ message: "Account has been activated." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error activating account." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

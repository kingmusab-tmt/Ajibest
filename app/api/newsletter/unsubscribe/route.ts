import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import NewsletterSubscription from "@/models/NewsletterSubscription";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const subscription = await NewsletterSubscription.findOne({ email });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Email not found in our newsletter list" },
        { status: 404 }
      );
    }

    if (!subscription.isSubscribed) {
      return NextResponse.json(
        { success: false, message: "This email is already unsubscribed" },
        { status: 409 }
      );
    }

    // Unsubscribe the user
    subscription.isSubscribed = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully unsubscribed from newsletter",
        data: {
          email: subscription.email,
          unsubscribedAt: subscription.unsubscribedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

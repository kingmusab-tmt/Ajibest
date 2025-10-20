import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import NewsletterSubscription from "@/models/NewsletterSubscription";
import { getClientIp } from "@/utils/ipUtils";

// Type guard for MongoDB duplicate key error
function isMongoDuplicateError(
  error: unknown
): error is { code: number; name: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "name" in error
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email, name, subscriptionSource = "website", tags = [] } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findOne({
      email,
    });

    if (existingSubscription) {
      if (existingSubscription.isSubscribed) {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already subscribed to our newsletter",
            data: { email: existingSubscription.email },
          },
          { status: 409 }
        );
      } else {
        // Resubscribe previously unsubscribed email
        existingSubscription.isSubscribed = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        existingSubscription.subscriptionSource = subscriptionSource;
        existingSubscription.name = name || existingSubscription.name;
        existingSubscription.tags = [
          ...new Set([...existingSubscription.tags, ...tags]),
        ];
        existingSubscription.userAgent = userAgent;
        existingSubscription.ipAddress = ipAddress;

        await existingSubscription.save();

        return NextResponse.json(
          {
            success: true,
            message: "Successfully resubscribed to newsletter",
            data: {
              email: existingSubscription.email,
              name: existingSubscription.name,
              subscribedAt: existingSubscription.subscribedAt,
            },
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const newSubscription = await NewsletterSubscription.create({
      email,
      name,
      subscriptionSource,
      tags,
      userAgent,
      ipAddress,
      isSubscribed: true,
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        data: {
          email: newSubscription.email,
          name: newSubscription.name,
          subscribedAt: newSubscription.subscribedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);

    // Handle duplicate key error (MongoDB)
    if (
      isMongoDuplicateError(error) &&
      (error.code === 11000 || error.name === "MongoServerError")
    ) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // 'subscribed', 'unsubscribed'
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (status === "subscribed") {
      query.isSubscribed = true;
    } else if (status === "unsubscribed") {
      query.isSubscribed = false;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Get subscribers with pagination
    const subscribers = await NewsletterSubscription.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-userAgent -ipAddress"); // Exclude sensitive fields

    // Get total count for pagination
    const total = await NewsletterSubscription.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          subscribers,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

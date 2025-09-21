import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import { StatsContent } from "@/models/StatsModel";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// Fallback content
const fallbackContent = {
  testimonials: [
    {
      name: "Jane Doe",
      comment:
        "Excellent service, highly recommended! They found tenants for my property within days.",
      rating: 5,
      isActive: true,
    },
    {
      name: "John Smith",
      comment:
        "I found my dream home thanks to them! The entire process was seamless and professional.",
      rating: 5,
      isActive: true,
    },
    {
      name: "Alice Johnson",
      comment:
        "The experience was smooth and stress-free. Their property management services are exceptional.",
      rating: 4,
      isActive: true,
    },
  ],
  stats: [
    {
      title: "Properties Managed",
      value: 500,
      icon: "Home",
      color: "primary",
      suffix: "+",
      isActive: true,
    },
    {
      title: "Satisfied Clients",
      value: 386,
      icon: "People",
      color: "success",
      suffix: "+",
      isActive: true,
    },
    {
      title: "Success Rate",
      value: 98,
      icon: "TrendingUp",
      color: "warning",
      suffix: "%",
      isActive: true,
    },
    {
      title: "Years Experience",
      value: 15,
      icon: "CalendarMonth",
      color: "info",
      suffix: "+",
      isActive: true,
    },
  ],
};

// GET endpoint to fetch stats content
export async function GET() {
  await dbConnect();

  try {
    // Try to find stats content in the database
    let statsContent = await StatsContent.findOne();

    // If no content exists, return fallback content with a flag
    if (!statsContent) {
      return NextResponse.json(
        {
          success: true,
          data: fallbackContent,
          isFallback: true,
          message: "Using fallback content",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: statsContent,
        isFallback: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats content:", error);

    // Return fallback content on error
    return NextResponse.json(
      {
        success: false,
        data: fallbackContent,
        isFallback: true,
        error: "Failed to fetch Stats Content",
        message: "Using fallback content due to error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 200 }
    ); // Still return 200 but with fallback flag
  }
}

// PUT endpoint to update stats content
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const data = await req.json();

    // Find the existing stats content or create new if doesn't exist
    let statsContent = await StatsContent.findOne();

    if (!statsContent) {
      statsContent = await StatsContent.create(data);
    } else {
      // Update the entire document
      statsContent.testimonials = data.testimonials || [];
      statsContent.stats = data.stats || [];
      statsContent.lastUpdated = new Date();

      await statsContent.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: statsContent,
        isFallback: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating stats content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Update Stats Content",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST endpoint to add a testimonial or stat
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { type, item } = await req.json();

    let statsContent = await StatsContent.findOne();

    if (!statsContent) {
      // Create new stats content if it doesn't exist
      statsContent = await StatsContent.create({
        testimonials: [],
        stats: [],
      });
    }

    if (type === "testimonial") {
      const newTestimonial = {
        ...item,
        _id: new mongoose.Types.ObjectId(),
      };
      statsContent.testimonials.push(newTestimonial);
    } else if (type === "stat") {
      const newStat = {
        ...item,
        _id: new mongoose.Types.ObjectId(),
      };
      statsContent.stats.push(newStat);
    }

    statsContent.lastUpdated = new Date();
    await statsContent.save();

    return NextResponse.json(
      {
        success: true,
        data: statsContent,
        isFallback: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Add Item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an item
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { type, id } = await req.json();

    const statsContent = await StatsContent.findOne();

    if (!statsContent) {
      return NextResponse.json(
        { success: false, error: "No stats content found" },
        { status: 404 }
      );
    }

    if (type === "testimonial") {
      statsContent.testimonials = statsContent.testimonials.filter(
        (t: any) => t._id.toString() !== id
      );
    } else if (type === "stat") {
      statsContent.stats = statsContent.stats.filter(
        (s: any) => s._id.toString() !== id
      );
    }

    statsContent.lastUpdated = new Date();
    await statsContent.save();

    return NextResponse.json(
      {
        success: true,
        data: statsContent,
        isFallback: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Delete Item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

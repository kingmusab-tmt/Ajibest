import dbConnect from "../../../../utils/connectDB";
import HeroContent from "@/models/HeroContent";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET endpoint to fetch hero content
export async function GET() {
  await dbConnect();

  try {
    // Try to find hero content in the database
    let heroContent = await HeroContent.findOne();

    // If no content exists, create default content
    if (!heroContent) {
      heroContent = await HeroContent.create({
        title: "Fulfill Your Dream & Become a Property Owner with Ease",
        subtitle: "Explore a wide range of Property for Sale or Rent",
        buttonText: "Register Now",
        backgrounds: [
          "/images/bgimage.webp",
          "/images/img2.webp",
          "/images/img3.webp",
          "/images/img4.webp",
          "/images/f.webp",
          "/images/b.jpeg",
          "/images/c.jpg",
          "/images/h.jpg",
          "/images/o.jpg",
        ],
      });
    }

    return NextResponse.json(heroContent, { status: 200 });
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Hero Content",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update hero content
export async function PUT(req) {
  await dbConnect();
  const data = await req.json();

  try {
    // Find the existing hero content or create new if doesn't exist
    let heroContent = await HeroContent.findOne();

    if (!heroContent) {
      heroContent = await HeroContent.create(data);
    } else {
      heroContent = await HeroContent.findOneAndUpdate({}, data, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(
      { success: true, data: heroContent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hero content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Update Hero Content",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

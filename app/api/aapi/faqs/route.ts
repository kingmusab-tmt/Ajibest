// app/api/faqs/route.ts
import dbConnect from "../../../../utils/connectDB";
import FAQ from "@/models/FAQ";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Default FAQs if collection is empty
const defaultFaqs = [
  {
    question: "Where are your property locations?",
    answer:
      "We currently have properties in Borno State. We plan to expand to all 36 states soon.",
    order: 1,
    isActive: true,
  },
  {
    question: "Can I pay on Installment Basis?",
    answer:
      "Yes you are allowed to pay on Installment basis, but you can also pay a lumpsum or at once.",
    order: 2,
    isActive: true,
  },
  {
    question: "How long does the installment plan take?",
    answer:
      "Our installment plans typically range from 6 to 24 months, depending on the property value.",
    order: 3,
    isActive: true,
  },
  {
    question: "What documents do I need to purchase a property?",
    answer:
      "You'll need a valid ID, proof of income, and initial deposit. We'll guide you through the entire process.",
    order: 4,
    isActive: true,
  },
];

// GET endpoint to fetch FAQs
export async function GET() {
  await dbConnect();

  try {
    // Try to find FAQs in the database
    let faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });

    // If no FAQs exist, create default FAQs
    if (!faqs || faqs.length === 0) {
      faqs = await FAQ.insertMany(defaultFaqs);
    }

    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch FAQs",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new FAQ
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();

  try {
    const faq = await FAQ.create(data);
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create FAQ",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update FAQs
export async function PUT(req: Request) {
  await dbConnect();
  const data = await req.json();

  try {
    // Update all FAQs in the request
    const updatePromises = data.map((faq: any) =>
      FAQ.findByIdAndUpdate(faq._id, faq, { new: true })
    );

    const updatedFaqs = await Promise.all(updatePromises);

    return NextResponse.json(
      { success: true, data: updatedFaqs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update FAQs",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a FAQ
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const deletedFaq = await FAQ.findByIdAndDelete(id);

    if (!deletedFaq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedFaq },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete FAQ",
        details:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

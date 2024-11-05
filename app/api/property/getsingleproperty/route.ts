// import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/connectDB";
import Properties from "@/models/properties";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");
  const title = req.nextUrl.searchParams.get("title");
  console.log(title);

  let filterProperty = {};
  if (id) {
    filterProperty = { _id: new Object(id) };
  }
  // else if (title) {
  //   filterProperty = { title };
  // }
  console.log(id);

  await dbConnect();
  try {
    const property = await Properties.findOne(filterProperty).lean();
    console.log(filterProperty);
    console.log(property);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

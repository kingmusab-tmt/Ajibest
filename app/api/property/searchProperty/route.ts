// app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import Property from "@/models/properties";

export const dynamic = "force-dynamic";

// Fallback properties data
const fallbackProperties = [
  {
    _id: "1",
    title: "Farm Land in Maiduguri",
    description:
      "Beautiful farm land with fertile soil, perfect for agriculture",
    location: "Maiduguri, Borno State",
    state: "maiduguri",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "farm land",
    price: 450000,
    listingPurpose: "For Sale",
    purchased: false,
    rented: false,
    size: "2 acres",
    status: "available",
  },
  {
    _id: "2",
    title: "Residential Plot in Gombe",
    description:
      "Prime residential plot in developing area with great potential",
    location: "Gombe, Gombe State",
    state: "gombe",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "residential land",
    price: 850000,
    listingPurpose: "For Sale",
    purchased: false,
    rented: false,
    size: "600 sqm",
    status: "available",
  },
  {
    _id: "3",
    title: "Luxury House for Sale in Damaturu",
    description: "Modern 4 bedroom house with all amenities in secure estate",
    location: "Damaturu, Yobe State",
    state: "damaturu",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "house for sell",
    price: 3500000,
    listingPurpose: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    amenities: "Swimming pool, Generator, Parking space",
    utilities: "24/7 Electristate, Water Supply",
    purchased: false,
    rented: false,
    size: "5 bedrooms",
    status: "available",
  },
  {
    _id: "4",
    title: "Commercial Property in Bauchi",
    description: "Commercial building suitable for office or retail business",
    location: "Bauchi, Bauchi State",
    state: "bauchi",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "house for rent",
    price: 1200000,
    listingPurpose: "For Renting",
    purchased: false,
    rented: false,
    size: "Commercial building",
    amenities: "High traffic area, Parking space, Modern facilities",
    status: "available",
    rentalDuration: 12,
  },
  {
    _id: "5",
    title: "Agricultural Land in Maiduguri",
    description: "Large agricultural land with irrigation system installed",
    location: "Maiduguri, Borno State",
    state: "maiduguri",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "farm land",
    price: 750000,
    listingPurpose: "For Sale",
    purchased: false,
    rented: false,
    size: "5 acres",
    amenities: "Irrigation system, Storage facility, Easy access",
    status: "available",
  },
  {
    _id: "6",
    title: "Affordable House for Rent in Gombe",
    description: "Cozy 2 bedroom apartment in quiet neighborhood",
    location: "Gombe, Gombe State",
    state: "gombe",
    image: "/ajibest1ca30fa2-a97f-4d72-bf2e-14c6345c455a.jpeg.jpeg",
    propertyType: "house for rent",
    price: 400000,
    listingPurpose: "For Renting",
    bedrooms: 2,
    bathrooms: 1,
    amenities: "Furnished, Water supply, Security",
    utilities: "Electristate, Water",
    purchased: false,
    rented: false,
    size: "2 bedrooms",
    status: "available",
    rentalDuration: 6,
  },
];

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const propertyType = searchParams.get("propertyType");
    const priceRange = searchParams.get("priceRange");
    const purpose = searchParams.get("purpose");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter object
    const filter: any = { status: "available" };

    if (state && state !== "all") filter.state = state;
    if (propertyType && propertyType !== "all")
      filter.propertyType = propertyType;
    if (purpose && purpose !== "all") {
      filter.listingPurpose = purpose === "sale" ? "For Sale" : "For Renting";
    }

    // Handle price range filter
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    let properties;
    let totalCount = 0;
    let isFallback = false;

    try {
      // Get total count for pagination
      totalCount = await Property.countDocuments(filter);

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Fetch properties with filters and pagination
      properties = await Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // If no properties found in database, use fallback
      if (!properties || properties.length === 0) {
        isFallback = true;
        properties = fallbackProperties;

        // Apply filters to fallback data
        if (state && state !== "all") {
          properties = properties.filter((p) => p.state === state);
        }
        if (propertyType && propertyType !== "all") {
          properties = properties.filter(
            (p) => p.propertyType === propertyType
          );
        }
        if (purpose && purpose !== "all") {
          const purposeFilter = purpose === "sale" ? "For Sale" : "For Renting";
          properties = properties.filter(
            (p) => p.listingPurpose === purposeFilter
          );
        }
        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split("-").map(Number);
          properties = properties.filter(
            (p) => p.price >= minPrice && p.price <= maxPrice
          );
        }

        // Apply pagination to fallback data
        totalCount = properties.length;
        const skip = (page - 1) * limit;
        properties = properties.slice(skip, skip + limit);
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Return fallback properties on database error
      isFallback = true;
      properties = fallbackProperties;
      totalCount = properties.length;
    }

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      isFallback,
      message: isFallback
        ? "Using fallback properties"
        : "Properties retrieved successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    // Return fallback properties on server error
    return NextResponse.json({
      success: true,
      data: fallbackProperties,
      pagination: {
        page: 1,
        limit: fallbackProperties.length,
        total: fallbackProperties.length,
        pages: 1,
      },
      isFallback: true,
      message: "Using fallback properties due to server error",
    });
  }
}

// POST endpoint to create a new property (for admin use)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    const property = await Property.create(data);

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: "Property created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create property",
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : String(error),
      },
      { status: 500 }
    );
  }
}

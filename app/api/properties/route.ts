import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import Property from "@/models/properties";

export const dynamic = "force-dynamic";

// Fallback properties data
const fallbackProperties = [
  {
    _id: "1",
    title: "Luxury Villa in Lekki",
    description:
      "Beautiful 5-bedroom villa with modern amenities and swimming pool",
    location: "Lekki, Lagos",
    state: "Lagos",
    image: "/ajibest1cff1055-ae88-4327-b05f-37c14084e1f7.jpeg",
    propertyType: "House",
    price: 85000000,
    listingPurpose: "sale",
    bedrooms: 5,
    bathrooms: 4,
    amenities: "Swimming Pool, Gym, Garden",
    utilities: "24/7 Electristate, Water Supply",
    purchased: false,
    rented: false,
    size: "4500 sq ft",
  },
  {
    _id: "2",
    title: "Commercial Farm Land",
    description: "Prime agricultural land suitable for large-scale farming",
    location: "Ogun State",
    state: "Ogun",
    image: "/a.jpg",
    propertyType: "Farm Land",
    price: 25000000,
    listingPurpose: "sale",
    purchased: false,
    rented: false,
    size: "10 acres",
  },
  {
    _id: "3",
    title: "Modern Apartment",
    description: "Spacious 3-bedroom apartment in a secure estate",
    location: "Victoria Island, Lagos",
    state: "Lagos",
    image: "/ajibestd0a28ef2-cecc-42cc-9415-9da445a2a23d.jpeg",
    propertyType: "Apartment",
    price: 3500000,
    listingPurpose: "rent",
    bedrooms: 3,
    bathrooms: 2,
    amenities: "Security, Parking, Elevator",
    utilities: "Water, Electristate",
    purchased: false,
    rented: false,
    size: "1800 sq ft",
    rentalDuration: 12,
  },
  {
    _id: "4",
    title: "Beachfront Property",
    description: "Stunning beach house with ocean views",
    location: "Badagry, Lagos",
    state: "Lagos",
    image: "/ajibest71de89d3-8775-482b-a229-f8d497fe1433.jpeg",
    propertyType: "House",
    price: 120000000,
    listingPurpose: "sale",
    bedrooms: 6,
    bathrooms: 5,
    amenities: "Beach Access, Pool, Garden",
    utilities: "Solar Power, Water",
    purchased: false,
    rented: false,
    size: "6000 sq ft",
  },
  {
    _id: "5",
    title: "Farm Land in Abia",
    description: "Agricultural land perfect for farming",
    location: "Umuahia, Abia",
    state: "Abia",
    image: "/farm-land.jpg",
    propertyType: "Farm Land",
    price: 400000,
    listingPurpose: "sale",
    purchased: false,
    rented: false,
    size: "5 acres",
  },
];

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const propertyType = searchParams.get("propertyType");
    const priceRange = searchParams.get("priceRange");
    const purpose = searchParams.get("listingPurpose");
    const page = parseInt(searchParams.get("page") || "1");

    const limit = 12; // Number of properties per page
    const skip = (page - 1) * limit;

    try {
      // Build filter object
      const filter: any = {};

      if (state && state !== "all") {
        filter.state = { $regex: new RegExp(state, "i") };
      }

      if (propertyType && propertyType !== "all") {
        // Handle URL-encoded spaces (replace '+' with ' ')
        const decodedPropertyType = propertyType.replace(/\+/g, " ");
        filter.propertyType = { $regex: new RegExp(decodedPropertyType, "i") };
      }

      if (purpose && purpose !== "all") {
        filter.listingPurpose = purpose;
      }

      if (priceRange && priceRange !== "all") {
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
      }

      // Get total count for pagination
      const total = await Property.countDocuments(filter);

      // Fetch properties with filters and pagination
      let properties = await Property.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      // If no properties found in database, use filtered fallback
      if (!properties || properties.length === 0) {
        let filteredFallback = [...fallbackProperties];

        // Apply similar filters to fallback data
        if (state && state !== "all") {
          filteredFallback = filteredFallback.filter((prop) =>
            prop.state?.toLowerCase().includes(state.toLowerCase())
          );
        }

        if (propertyType && propertyType !== "all") {
          const decodedPropertyType = propertyType.replace(/\+/g, " ");
          filteredFallback = filteredFallback.filter((prop) =>
            prop.propertyType
              ?.toLowerCase()
              .includes(decodedPropertyType.toLowerCase())
          );
        }

        if (purpose && purpose !== "all") {
          filteredFallback = filteredFallback.filter(
            (prop) => prop.listingPurpose === purpose
          );
        }

        if (priceRange && priceRange !== "all") {
          const [minPrice, maxPrice] = priceRange.split("-").map(Number);
          filteredFallback = filteredFallback.filter((prop) => {
            if (minPrice && maxPrice) {
              return prop.price >= minPrice && prop.price <= maxPrice;
            } else if (minPrice) {
              return prop.price >= minPrice;
            } else if (maxPrice) {
              return prop.price <= maxPrice;
            }
            return true;
          });
        }

        // Apply pagination to fallback
        const paginatedFallback = filteredFallback.slice(skip, skip + limit);

        return NextResponse.json({
          success: true,
          data: paginatedFallback,
          pagination: {
            page,
            limit,
            total: filteredFallback.length,
            pages: Math.ceil(filteredFallback.length / limit),
          },
          isFallback: true,
          message: "Using filtered fallback properties",
        });
      }

      return NextResponse.json({
        success: true,
        data: properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        isFallback: false,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);

      // Apply filters to fallback data on database error
      let filteredFallback = [...fallbackProperties];
      const limit = 12;
      const skip = (page - 1) * limit;

      if (state && state !== "all") {
        filteredFallback = filteredFallback.filter((prop) =>
          prop.state?.toLowerCase().includes(state.toLowerCase())
        );
      }

      if (propertyType && propertyType !== "all") {
        const decodedPropertyType = propertyType.replace(/\+/g, " ");
        filteredFallback = filteredFallback.filter((prop) =>
          prop.propertyType
            ?.toLowerCase()
            .includes(decodedPropertyType.toLowerCase())
        );
      }

      if (purpose && purpose !== "all") {
        filteredFallback = filteredFallback.filter(
          (prop) => prop.listingPurpose === purpose
        );
      }

      if (priceRange && priceRange !== "all") {
        const [minPrice, maxPrice] = priceRange.split("-").map(Number);
        filteredFallback = filteredFallback.filter((prop) => {
          if (minPrice && maxPrice) {
            return prop.price >= minPrice && prop.price <= maxPrice;
          } else if (minPrice) {
            return prop.price >= minPrice;
          } else if (maxPrice) {
            return prop.price <= maxPrice;
          }
          return true;
        });
      }

      const paginatedFallback = filteredFallback.slice(skip, skip + limit);

      return NextResponse.json({
        success: true,
        data: paginatedFallback,
        pagination: {
          page,
          limit,
          total: filteredFallback.length,
          pages: Math.ceil(filteredFallback.length / limit),
        },
        isFallback: true,
        message: "Using fallback properties due to database error",
      });
    }
  } catch (error) {
    console.error("Server error:", error);

    // Return filtered fallback properties on server error
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const propertyType = searchParams.get("propertyType");
    const priceRange = searchParams.get("priceRange");
    const purpose = searchParams.get("purpose");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;

    let filteredFallback = [...fallbackProperties];

    if (state && state !== "all") {
      filteredFallback = filteredFallback.filter((prop) =>
        prop.state?.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (propertyType && propertyType !== "all") {
      const decodedPropertyType = propertyType.replace(/\+/g, " ");
      filteredFallback = filteredFallback.filter((prop) =>
        prop.propertyType
          ?.toLowerCase()
          .includes(decodedPropertyType.toLowerCase())
      );
    }

    if (purpose && purpose !== "all") {
      filteredFallback = filteredFallback.filter(
        (prop) => prop.listingPurpose === purpose
      );
    }

    if (priceRange && priceRange !== "all") {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filteredFallback = filteredFallback.filter((prop) => {
        if (minPrice && maxPrice) {
          return prop.price >= minPrice && prop.price <= maxPrice;
        } else if (minPrice) {
          return prop.price >= minPrice;
        } else if (maxPrice) {
          return prop.price <= maxPrice;
        }
        return true;
      });
    }

    const paginatedFallback = filteredFallback.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedFallback,
      pagination: {
        page,
        limit,
        total: filteredFallback.length,
        pages: Math.ceil(filteredFallback.length / limit),
      },
      isFallback: true,
      message: "Using fallback properties due to server error",
    });
  }
}

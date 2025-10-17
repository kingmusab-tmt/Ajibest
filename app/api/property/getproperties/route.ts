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
    image: "/ajibest1cff1055-ae88-4327-b05f-37c14084e1f7.jpeg",
    propertyType: "House",
    price: 85000000,
    listingPurpose: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    amenities: "Swimming Pool, Gym, Garden",
    utilities: "24/7 Electricity, Water Supply",
    purchased: false,
    rented: false,
    size: "4500 sq ft",
  },
  {
    _id: "2",
    title: "Commercial Farm Land",
    description: "Prime agricultural land suitable for large-scale farming",
    location: "Ogun State",
    image: "/a.jpg",
    propertyType: "Land",
    price: 25000000,
    listingPurpose: "For Sale",
    purchased: false,
    rented: false,
    size: "10 acres",
  },
  {
    _id: "3",
    title: "Modern Apartment",
    description: "Spacious 3-bedroom apartment in a secure estate",
    location: "Victoria Island, Lagos",
    image: "/ajibestd0a28ef2-cecc-42cc-9415-9da445a2a23d.jpeg",
    propertyType: "House",
    price: 3500000,
    listingPurpose: "For Renting",
    bedrooms: 3,
    bathrooms: 2,
    amenities: "Security, Parking, Elevator",
    utilities: "Water, Electricity",
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
    image: "/ajibest71de89d3-8775-482b-a229-f8d497fe1433.jpeg",
    propertyType: "House",
    price: 120000000,
    listingPurpose: "For Sale",
    bedrooms: 6,
    bathrooms: 5,
    amenities: "Beach Access, Pool, Garden",
    utilities: "Solar Power, Water",
    purchased: false,
    rented: false,
    size: "6000 sq ft",
  },
];

export async function GET() {
  try {
    await dbConnect();

    let properties;
    try {
      properties = await Property.find({});

      // If no properties found in database, use fallback
      if (!properties || properties.length === 0) {
        return NextResponse.json({
          success: true,
          data: fallbackProperties,
          isFallback: true,
          message: "Using fallback properties",
        });
      }

      return NextResponse.json({
        success: true,
        data: properties,
        isFallback: false,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Return fallback properties on database error
      return NextResponse.json({
        success: true,
        data: fallbackProperties,
        isFallback: true,
        message: "Using fallback properties due to database error",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    // Return fallback properties on server error
    return NextResponse.json({
      success: true,
      data: fallbackProperties,
      isFallback: true,
      message: "Using fallback properties due to server error",
    });
  }
}

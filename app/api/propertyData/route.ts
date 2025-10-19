import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import Property from "@/models/properties";

export const dynamic = "force-dynamic";

// Fallback property prices based on typical market rates
const fallbackPropertyPrices = {
  land: {
    quarter: 175000,
    half: 350000,
    full: 700000,
  },
  house: {
    "2-bedroom": 2100000,
    "3-bedroom": 3100000,
    "4-bedroom": 4100000,
    "5-bedroom": 5100000,
    "6-bedroom": 6100000,
    "7-bedroom": 7100000,
  },
  farm: {
    "2-bedroom": 1900000,
    "3-bedroom": 2900000,
    "4-bedroom": 3900000,
    "5-bedroom": 4900000,
    "6-bedroom": 5900000,
    "7-bedroom": 6900000,
  },
  commercial: {
    "2-bedroom": 2500000,
    "3-bedroom": 3500000,
    "4-bedroom": 4500000,
    "5-bedroom": 5500000,
    "6-bedroom": 6500000,
    "7-bedroom": 7500000,
  },
  office: {
    "2-bedroom": 2300000,
    "3-bedroom": 3300000,
    "4-bedroom": 4300000,
    "5-bedroom": 5300000,
    "6-bedroom": 6300000,
    "7-bedroom": 7300000,
  },
  shop: {
    "2-bedroom": 2200000,
    "3-bedroom": 3200000,
    "4-bedroom": 4200000,
    "5-bedroom": 5200000,
    "6-bedroom": 6200000,
    "7-bedroom": 7200000,
  },
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get("propertyType");

    if (!propertyType) {
      return NextResponse.json(
        {
          success: false,
          message: "Property type is required",
          data: fallbackPropertyPrices,
        },
        { status: 400 }
      );
    }

    let propertyPrices;

    try {
      // Convert API propertyType to match schema (capitalize first letter)
      const schemaPropertyType =
        propertyType.charAt(0).toUpperCase() + propertyType.slice(1);

      // Fetch available properties of the specified type
      const properties = await Property.find({
        propertyType: schemaPropertyType,
        status: "available",
        instalmentAllowed: true, // Only consider properties that allow installment
      });

      if (properties.length > 0) {
        // Calculate average prices based on actual property data
        propertyPrices = calculateAveragePrices(properties, propertyType);
      } else {
        // Use fallback if no properties found
        propertyPrices =
          fallbackPropertyPrices[
            propertyType as keyof typeof fallbackPropertyPrices
          ] || fallbackPropertyPrices.house;
      }

      return NextResponse.json({
        success: true,
        data: propertyPrices,
        isFallback: properties.length === 0,
        message:
          properties.length > 0
            ? `Calculated installment prices based on ${properties.length} available ${propertyType} properties`
            : "Using estimated installment prices",
        propertiesUsed: properties.length,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Return fallback prices on database error
      return NextResponse.json({
        success: true,
        data:
          fallbackPropertyPrices[
            propertyType as keyof typeof fallbackPropertyPrices
          ] || fallbackPropertyPrices.house,
        isFallback: true,
        message: "Using estimated installment prices due to database error",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    // Return fallback prices on server error
    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get("propertyType");

    return NextResponse.json({
      success: true,
      data:
        fallbackPropertyPrices[
          propertyType as keyof typeof fallbackPropertyPrices
        ] || fallbackPropertyPrices.house,
      isFallback: true,
      message: "Using estimated installment prices due to server error",
    });
  }
}

// Helper function to calculate average prices from actual property data
function calculateAveragePrices(properties: any[], propertyType: string) {
  if (propertyType === "land") {
    return calculateLandPrices(properties);
  } else {
    return calculateBuildingPrices(properties, propertyType);
  }
}

function calculateLandPrices(properties: any[]) {
  // Calculate average price for full plots
  const fullPlotProperties = properties.filter(
    (property) =>
      property.size === "Full Plot" ||
      !property.size || // If no size specified, assume full plot
      (property.price && !property.size) // Price exists but no size
  );

  let averageFullPlotPrice = 0;

  if (fullPlotProperties.length > 0) {
    const totalPrice = fullPlotProperties.reduce(
      (sum, property) => sum + property.price,
      0
    );
    averageFullPlotPrice = Math.round(totalPrice / fullPlotProperties.length);
  } else {
    // If no full plot properties, calculate average of all land properties
    const totalPrice = properties.reduce(
      (sum, property) => sum + property.price,
      0
    );
    averageFullPlotPrice = Math.round(totalPrice / properties.length);
  }

  // If average is still 0, use fallback
  if (averageFullPlotPrice === 0) {
    averageFullPlotPrice = fallbackPropertyPrices.land.full;
  }

  // Calculate quarter and half based on full plot average
  return {
    quarter: Math.round(averageFullPlotPrice / 4),
    half: Math.round(averageFullPlotPrice / 2),
    full: averageFullPlotPrice,
  };
}

function calculateBuildingPrices(properties: any[], propertyType: string) {
  const buildingPrices: { [key: string]: number } = {
    "2-bedroom": 0,
    "3-bedroom": 0,
    "4-bedroom": 0,
    "5-bedroom": 0,
    "6-bedroom": 0,
    "7-bedroom": 0,
  };

  const bedroomCounts: { [key: string]: number } = {
    "2-bedroom": 0,
    "3-bedroom": 0,
    "4-bedroom": 0,
    "5-bedroom": 0,
    "6-bedroom": 0,
    "7-bedroom": 0,
  };

  // Calculate average prices for each bedroom count
  properties.forEach((property) => {
    const bedrooms = property.bedrooms || 0;
    const price = property.price || 0;

    if (bedrooms >= 2 && bedrooms <= 7) {
      const key = `${bedrooms}-bedroom`;
      if (buildingPrices[key] !== undefined) {
        buildingPrices[key] += price;
        bedroomCounts[key]++;
      }
    }
  });

  // Calculate averages
  const result: { [key: string]: number } = {};

  Object.keys(buildingPrices).forEach((key) => {
    if (bedroomCounts[key] > 0) {
      result[key] = Math.round(buildingPrices[key] / bedroomCounts[key]);
    }
  });

  // Fill missing bedroom counts with calculated values
  const availableBedroomKeys = Object.keys(result);
  if (availableBedroomKeys.length > 0) {
    // Calculate average price per bedroom across all available properties
    let totalPrice = 0;
    let totalBedrooms = 0;

    availableBedroomKeys.forEach((key) => {
      const bedrooms = parseInt(key.split("-")[0]);
      totalPrice += result[key] * bedroomCounts[key];
      totalBedrooms += bedrooms * bedroomCounts[key];
    });

    const averagePricePerBedroom = totalPrice / totalBedrooms;

    // Fill missing bedroom counts using the average price per bedroom
    for (let i = 2; i <= 7; i++) {
      const key = `${i}-bedroom`;
      if (!result[key]) {
        result[key] = Math.round(averagePricePerBedroom * i);
      }
    }
  } else {
    // If no bedroom data at all, use fallback
    return (
      fallbackPropertyPrices[
        propertyType as keyof typeof fallbackPropertyPrices
      ] || fallbackPropertyPrices.house
    );
  }

  return result;
}

// Optional: Get detailed installment calculation
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { propertyType, propertyDetail, durationMonths } = body;

    if (!propertyType || !propertyDetail || !durationMonths) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the price for the selected property
    const schemaPropertyType =
      propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
    const properties = await Property.find({
      propertyType: schemaPropertyType,
      status: "available",
      instalmentAllowed: true,
    });

    let price = 0;
    let isFallback = false;

    if (properties.length > 0) {
      const prices = calculateAveragePrices(properties, propertyType);
      price = prices[propertyDetail] || 0;

      if (price === 0) {
        price =
          fallbackPropertyPrices[
            propertyType as keyof typeof fallbackPropertyPrices
          ]?.[propertyDetail as keyof typeof fallbackPropertyPrices.house] || 0;
        isFallback = true;
      }
    } else {
      price =
        fallbackPropertyPrices[
          propertyType as keyof typeof fallbackPropertyPrices
        ]?.[propertyDetail as keyof typeof fallbackPropertyPrices.house] || 0;
      isFallback = true;
    }

    if (price === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not calculate price for selected property",
        },
        { status: 404 }
      );
    }

    // Calculate installment details
    const monthlyPayment = Math.round(price / durationMonths);
    const totalPayment = monthlyPayment * durationMonths;
    const difference = totalPayment - price; // Usually 0, but could be due to rounding

    const installmentPlan = {
      propertyType,
      propertyDetail,
      totalPrice: price,
      durationMonths,
      monthlyPayment,
      totalPayment,
      difference,
      isFallback,
      calculationDate: new Date().toISOString(),
      breakdown: Array.from({ length: durationMonths }, (_, i) => ({
        month: i + 1,
        amount: monthlyPayment,
        dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      })),
    };

    return NextResponse.json({
      success: true,
      data: installmentPlan,
      message: isFallback
        ? "Installment calculation using estimated prices"
        : "Installment calculation based on current property listings",
    });
  } catch (error) {
    console.error("Error in POST propertyData:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

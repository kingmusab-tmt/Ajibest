import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (typeof email !== "string") {
    return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    // Only select the fields needed by the MyProperty component
    const user = await User.findOne({ email })
      .select("propertyPurOrRented propertyUnderPayment")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not Found" },
        { status: 404 }
      );
    }

    // Transform propertyPurOrRented data to match component interface
    const propertyPurOrRented =
      user.propertyPurOrRented?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        paymentDate: property.paymentDate,
        propertyPrice: property.price || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose, // Map listingPurpose to listingPurpose
        description: property.description || "",
        location: property.location || "",
        initialPayment: 0, // Not available in propertyPurOrRented in new schema
        listingPurpose: property.listingPurpose || "",
        bedrooms: property.bedrooms || 0,
        amenities: property.amenities ? [property.amenities] : [], // Convert string to array
        purchased: property.listingPurpose === "For Sale",
        rented: property.listingPurpose === "For Renting",
        utilities: property.utilities ? [property.utilities] : [], // Convert string to array
        image: property.image || "",
      })) || [];

    // Transform propertyUnderPayment data to match component interface
    const propertyUnderPayment =
      user.propertyUnderPayment?.map((property) => ({
        title: property.title || "Untitled Property",
        propertyId: property.propertyId?.toString() || "",
        propertyPrice: property.price || 0,
        propertyType: property.propertyType,
        paymentMethod: property.paymentMethod,
        listingPurpose: property.listingPurpose, // Map listingPurpose to listingPurpose
        paymentHisotry:
          property.paymentHistory?.map((payment) => ({
            paymentDate: payment.paymentDate,
            nextPaymentDate: payment.nextPaymentDate,
            amount: payment.amount,
            propertyPrice: payment.propertyPrice,
            totalPaymentMade: payment.totalPaymentMade,
            remainingBalance: payment.remainingBalance,
            paymentCompleted: payment.paymentCompleted,
          })) || [],
        description: property.description || "",
        location: property.location || "",
        initialPayment: property.initialPayment || 0,
        listingPurpose: property.listingPurpose || "",
        bedrooms: property.bedrooms || 0,
        amenities: property.amenities ? [property.amenities] : [], // Convert string to array
        purchased: property.listingPurpose === "For Sale",
        rented: property.listingPurpose === "For Renting",
        utilities: property.utilities ? [property.utilities] : [], // Convert string to array
        image: property.image || "",
      })) || [];

    const responseData = {
      propertyPurOrRented,
      propertyUnderPayment,
    };

    return NextResponse.json(
      {
        success: true,
        user: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("MyProperty API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
// import dbConnect from "../../../../utils/connectDB";
// import User from "@/models/user";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "@/app/auth";
// import { getServerSession } from "next-auth";

// export const dynamic = "force-dynamic";

// // Define the Property document structure for TypeScript
// interface PropertyDocument {
//   _id: string;
//   title?: string;
//   description?: string;
//   location?: string;
//   bedrooms?: number;
//   amenities?: string[];
//   utilities?: string[];
//   images?: string[];
//   image?: string;
// }

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   if (typeof email !== "string") {
//     return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
//       status: 400,
//     });
//   }

//   try {
//     await dbConnect();

//     // Populate with proper typing
//     const user = await User.findOne({ email })
//       .select("propertyPurOrRented propertyUnderPayment")
//       .populate<{ propertyId: PropertyDocument }>(
//         "propertyPurOrRented.propertyId"
//       )
//       .populate<{ propertyId: PropertyDocument }>(
//         "propertyUnderPayment.propertyId"
//       );

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "User not Found" },
//         { status: 404 }
//       );
//     }

//     // Helper function to safely extract property data
//     const getPropertyData = (property: any) => {
//       const propertyData = property.propertyId as PropertyDocument;
//       return {
//         title: property.title || propertyData?.title || "Untitled Property",
//         propertyId:
//           propertyData?._id?.toString() ||
//           property.propertyId?.toString() ||
//           "",
//         paymentDate: property.paymentDate,
//         propertyPrice: property.propertyPrice || 0,
//         propertyType: property.propertyType,
//         paymentMethod: property.paymentMethod,
//         listingPurpose: property.listingPurpose,
//         description: propertyData?.description || "",
//         location: propertyData?.location || "",
//         initialPayment: property.initialPayment || 0,
//         listingPurpose: property.listingPurpose || "",
//         bedrooms: propertyData?.bedrooms || 0,
//         amenities: propertyData?.amenities || [],
//         purchased: property.listingPurpose === "For Sale",
//         rented: property.listingPurpose === "For Renting",
//         utilities: propertyData?.utilities || [],
//         image: propertyData?.images?.[0] || propertyData?.image || "",
//       };
//     };

//     // Transform the data to match exactly what the component needs
//     const responseData = {
//       propertyPurOrRented:
//         user.propertyPurOrRented?.map((property) =>
//           getPropertyData(property)
//         ) || [],

//       propertyUnderPayment:
//         user.propertyUnderPayment?.map((property) => ({
//           ...getPropertyData(property),
//           paymentHistory:
//             property.paymentHistory?.map((payment) => ({
//               paymentDate: payment.paymentDate,
//               nextPaymentDate: payment.nextPaymentDate,
//               amount: payment.amount,
//               propertyPrice: payment.propertyPrice,
//               totalPaymentMade: payment.totalPaymentMade,
//               remainingBalance: payment.remainingBalance,
//               paymentCompleted: payment.paymentCompleted,
//             })) || [],
//         })) || [],
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         user: responseData,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("MyProperty API Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

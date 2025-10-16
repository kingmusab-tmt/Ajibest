import { NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import Property from "@/models/properties";
import Transaction from "@/models/transaction";

export const dynamic = "force-dynamic";

// Mock data as fallback
const mockOverviewData = {
  stats: {
    totalUsers: 1245,
    totalProperties: 567,
    totalTransactions: 2890,
    totalRevenue: 1250000,
    activeListings: 234,
    pendingTransactions: 45,
    soldProperties: 89,
    rentedProperties: 156,
    totalPaymentsMade: 890000,
    totalPaymentsToBeMade: 360000,
    purchasedUnderPayment: 67,
    rentedUnderPayment: 42,
  },
  recentTransactions: [
    {
      id: "1",
      userName: "John Doe",
      email: "john@example.com",
      amount: 250000,
      status: "successful",
      propertyType: "House",
      paymentMethod: "payOnce",
      listingPurpose: "For Sale",
      date: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      userName: "Jane Smith",
      email: "jane@example.com",
      amount: 150000,
      status: "pending",
      propertyType: "Land",
      paymentMethod: "installment",
      listingPurpose: "For Sale",
      date: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      userName: "Mike Johnson",
      email: "mike@example.com",
      amount: 75000,
      status: "failed",
      propertyType: "Farm",
      paymentMethod: "payOnce",
      listingPurpose: "For Renting",
      date: "2024-01-13T09:15:00Z",
    },
  ],
  propertyDistribution: [
    { type: "House", count: 234, color: "#1976d2" },
    { type: "Land", count: 189, color: "#2e7d32" },
    { type: "Farm", count: 144, color: "#ed6c02" },
  ],
  revenueData: [
    { month: "Jan", revenue: 120000 },
    { month: "Feb", revenue: 180000 },
    { month: "Mar", revenue: 150000 },
    { month: "Apr", revenue: 220000 },
    { month: "May", revenue: 190000 },
    { month: "Jun", revenue: 250000 },
  ],
  userGrowth: [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 250 },
    { month: "Mar", users: 450 },
    { month: "Apr", users: 650 },
    { month: "May", users: 890 },
    { month: "Jun", users: 1245 },
  ],
};

// GET endpoint to fetch admin overview data
export async function GET() {
  await dbConnect();

  try {
    // Fetch real data from database using Promise.allSettled for graceful fallback
    const [
      totalUsers,
      totalProperties,
      totalTransactions,
      activeListings,
      pendingTransactions,
      soldProperties,
      rentedProperties,
      recentTransactions,
      propertyDistribution,
      totalRevenue,
      // New metrics
      totalPaymentsMade,
      totalPaymentsToBeMade,
      purchasedUnderPayment,
      rentedUnderPayment,
    ] = await Promise.allSettled([
      // Total Users
      User.countDocuments(),

      // Total Properties
      Property.countDocuments(),

      // Total Transactions
      Transaction.countDocuments(),

      // Active Listings (available properties)
      Property.countDocuments({ status: "available" }),

      // Pending Transactions
      Transaction.countDocuments({ status: "pending" }),

      // Sold Properties
      Property.countDocuments({ purchased: true, status: "sold" }),

      // Rented Properties
      Property.countDocuments({ rented: true, status: "rented" }),

      // Recent Transactions (last 10)
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "name email")
        .populate("propertyId", "title propertyType"),

      // Property Distribution by Type
      Property.aggregate([
        {
          $group: {
            _id: "$propertyType",
            count: { $sum: 1 },
          },
        },
      ]),

      // Total Revenue from successful transactions
      Transaction.aggregate([
        {
          $match: { status: "successful" },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // Total Payments Made (sum of totalPaymentMade from all users)
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPaymentMade" },
          },
        },
      ]),

      // Total Payment to be Made (sum of totalPaymentToBeMade from all users)
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPaymentToBeMade" },
          },
        },
      ]),

      // Purchased Properties Under Payment (properties with listingPurpose "For Sale" in propertyUnderPayment)
      User.aggregate([
        { $unwind: "$propertyUnderPayment" },
        {
          $match: {
            "propertyUnderPayment.listingPurpose": "For Sale",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]),

      // Rented Properties Under Payment (properties with listingPurpose "For Renting" in propertyUnderPayment)
      User.aggregate([
        { $unwind: "$propertyUnderPayment" },
        {
          $match: {
            "propertyUnderPayment.listingPurpose": "For Renting",
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Helper function to extract value from Promise.allSettled result
    const getValue = (result: any, defaultValue: any) =>
      result.status === "fulfilled" ? result.value : defaultValue;

    const getAggregateValue = (result: any, defaultValue: any) => {
      if (
        result.status === "fulfilled" &&
        Array.isArray(result.value) &&
        result.value.length > 0
      ) {
        return result.value[0].total || result.value[0].count || defaultValue;
      }
      return defaultValue;
    };

    // Process the stats data
    const stats = {
      totalUsers: getValue(totalUsers, mockOverviewData.stats.totalUsers),
      totalProperties: getValue(
        totalProperties,
        mockOverviewData.stats.totalProperties
      ),
      totalTransactions: getValue(
        totalTransactions,
        mockOverviewData.stats.totalTransactions
      ),
      totalRevenue: getAggregateValue(
        totalRevenue,
        mockOverviewData.stats.totalRevenue
      ),
      activeListings: getValue(
        activeListings,
        mockOverviewData.stats.activeListings
      ),
      pendingTransactions: getValue(
        pendingTransactions,
        mockOverviewData.stats.pendingTransactions
      ),
      soldProperties: getValue(
        soldProperties,
        mockOverviewData.stats.soldProperties
      ),
      rentedProperties: getValue(
        rentedProperties,
        mockOverviewData.stats.rentedProperties
      ),
      // New metrics
      totalPaymentsMade: getAggregateValue(
        totalPaymentsMade,
        mockOverviewData.stats.totalPaymentsMade
      ),
      totalPaymentsToBeMade: getAggregateValue(
        totalPaymentsToBeMade,
        mockOverviewData.stats.totalPaymentsToBeMade
      ),
      purchasedUnderPayment: getAggregateValue(
        purchasedUnderPayment,
        mockOverviewData.stats.purchasedUnderPayment
      ),
      rentedUnderPayment: getAggregateValue(
        rentedUnderPayment,
        mockOverviewData.stats.rentedUnderPayment
      ),
    };

    // Process recent transactions
    let processedRecentTransactions = mockOverviewData.recentTransactions;
    if (recentTransactions.status === "fulfilled") {
      try {
        processedRecentTransactions = recentTransactions.value.map(
          (transaction: any) => ({
            id: transaction._id?.toString() || Math.random().toString(),
            userName:
              transaction.userName ||
              transaction.userId?.name ||
              "Unknown User",
            email: transaction.email || transaction.userId?.email || "No email",
            amount: transaction.amount || 0,
            status: transaction.status || "pending",
            propertyType: transaction.propertyType || "Unknown",
            paymentMethod: transaction.paymentMethod || "payOnce",
            listingPurpose: transaction.listingPurpose || "For Sale",
            date:
              transaction.createdAt?.toISOString() || new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error("Error processing recent transactions:", error);
        processedRecentTransactions = mockOverviewData.recentTransactions;
      }
    }

    // Process property distribution
    let processedPropertyDistribution = mockOverviewData.propertyDistribution;
    if (propertyDistribution.status === "fulfilled") {
      try {
        processedPropertyDistribution = propertyDistribution.value.map(
          (item: any) => ({
            type: item._id,
            count: item.count,
            color:
              mockOverviewData.propertyDistribution.find(
                (p) => p.type === item._id
              )?.color || "#1976d2",
          })
        );
      } catch (error) {
        console.error("Error processing property distribution:", error);
        processedPropertyDistribution = mockOverviewData.propertyDistribution;
      }
    }

    // Determine data source
    const dataSource =
      recentTransactions.status === "fulfilled" &&
      propertyDistribution.status === "fulfilled"
        ? "database"
        : "mock";

    const responseData = {
      stats,
      recentTransactions: processedRecentTransactions,
      propertyDistribution: processedPropertyDistribution,
      revenueData: mockOverviewData.revenueData,
      userGrowth: mockOverviewData.userGrowth,
      timestamp: new Date().toISOString(),
      dataSource,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin overview:", error);

    // Return mock data as fallback with error information
    return NextResponse.json(
      {
        ...mockOverviewData,
        timestamp: new Date().toISOString(),
        dataSource: "mock-fallback",
        error: "Failed to fetch real data, using mock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}

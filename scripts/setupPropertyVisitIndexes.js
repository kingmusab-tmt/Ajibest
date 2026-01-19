/**
 * Database Setup Script for Property Visit System
 *
 * This script creates the necessary indexes for optimal database performance.
 * Run this after deploying the property visit system.
 *
 * Usage: node scripts/setupPropertyVisitIndexes.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ajibest",
    );
    console.log("  Connected to MongoDB");
  } catch (error) {
    console.error("  Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    console.log("\n📊 Creating PropertyVisit indexes...");

    // PropertyVisit collection indexes
    await db.collection("propertyvisits").createIndex({ userId: 1, status: 1 });
    console.log("    Created index: userId + status");

    await db
      .collection("propertyvisits")
      .createIndex({ propertyId: 1, status: 1 });
    console.log("    Created index: propertyId + status");

    await db.collection("propertyvisits").createIndex({ visitDate: 1 });
    console.log("    Created index: visitDate");

    await db.collection("propertyvisits").createIndex({ userEmail: 1 });
    console.log("    Created index: userEmail");

    await db.collection("propertyvisits").createIndex({ createdAt: 1 });
    console.log("    Created index: createdAt (TTL for cleanup)");

    console.log("\n📊 Creating VisitAvailability indexes...");

    // VisitAvailability collection indexes
    await db
      .collection("visitavailabilities")
      .createIndex({ propertyId: 1 }, { unique: true });
    console.log("    Created unique index: propertyId");

    console.log("\n  All indexes created successfully!");

    // Display index information
    console.log("\n📋 PropertyVisit Indexes:");
    const pvIndexes = await db.collection("propertyvisits").getIndexes();
    Object.entries(pvIndexes).forEach(([name, spec]) => {
      console.log(`   ${name}:`, spec);
    });

    console.log("\n📋 VisitAvailability Indexes:");
    const vaIndexes = await db.collection("visitavailabilities").getIndexes();
    Object.entries(vaIndexes).forEach(([name, spec]) => {
      console.log(`   ${name}:`, spec);
    });
  } catch (error) {
    console.error("  Error creating indexes:", error);
    process.exit(1);
  }
};

const main = async () => {
  console.log("🚀 Property Visit System - Database Setup");
  console.log("==========================================\n");

  await dbConnect();
  await createIndexes();

  console.log("\n  Setup completed successfully!");
  console.log("You can now start using the property visit system.\n");

  process.exit(0);
};

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

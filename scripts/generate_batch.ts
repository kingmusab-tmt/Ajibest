// You can run this with: npx ts-node scripts/generate_batch.ts
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import Receipt from "../models/Receipt"; // Ensure path is correct relative to script

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const generateBatch = async (count: number) => {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const batch: Array<{
    receiptId: string;
    status: string;
    details: Record<string, any>;
  }> = [];
  const urls: string[] = [];

  for (let i = 0; i < count; i++) {
    const newId = uuidv4();

    // Create the DB Entry
    batch.push({
      receiptId: newId,
      status: "INACTIVE",
      details: {}, // Empty details
    });

    // Save the URL for your printing team
    urls.push(
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/admin/manageReciept/${newId}`,
    );
  }

  try {
    // Bulk insert for performance
    await Receipt.insertMany(batch);
    console.log(`✅ Successfully generated ${count} blank receipts.`);

    // In a real scenario, you might write 'urls' to a CSV file here
    console.log("Sample Admin URL for Printing:", urls[0]);
  } catch (error) {
    console.error("Error generating batch:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Generate 50 blank receipts
generateBatch(50);

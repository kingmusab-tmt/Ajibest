import dbConnect from "../../../../utils/connectDB";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
// import validator from "validator"; // Optional: for stricter email validation
import { sendVerificationEmail } from "@/utils/mail";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  try {
    // Parse the JSON request body
    const body = await req.json();

    const {
      name,
      username,
      email,
      phoneNumber,
      password,
      bvnOrNin,
      country,
      state,
      lga,
      address,
    } = body;

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !bvnOrNin ||
      !country ||
      !state ||
      !lga
    ) {
      return NextResponse.json(
        { message: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email or username." },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(password, salt);
    const token = uuidv4();

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      bvnOrNin,
      country,
      state,
      lga,
      address,
      dateOfRegistration: new Date(),
      walletBalance: 0,
      emailToken: token,
      isActive: false,
      role: "User",
      image: null,
      lastLoginTime: null,
      favouriteProperties: [],
      totalPropertyPurchased: 0,
      totalPaymentMade: 0,
      nextPaymentDueDate: null,
      referralEarnings: 0,
      numberOfReferrals: 0,
      propertyPurchased: [],
      propertyUnderPayment: [],
      propertyRented: [],
    });
    // Save the user to the database
    await newUser.save();
    await sendVerificationEmail(email, token);
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

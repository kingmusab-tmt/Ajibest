import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import { sendEmail } from "@/utils/emailService";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Don't reveal if email exists or not for security
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json(
        { message: "If the email exists, an OTP has been sent" },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP, token and expiry to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // Create reset link with token
    const resetLink = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/forgotResetPassword?token=${token}`;

    // Send OTP email with reset link
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset OTP - Ajibest",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
              <h1 style="margin: 0; color: #333; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
            </div>
            <p style="margin: 20px 0;">
              <strong>Or click the link below to automatically fill the OTP:</strong>
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" 
                 style="background-color: #5D7DF3; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                Reset Your Password
              </a>
            </div>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        `,
      });
      // console.log("OTP email sent to:", email);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Still return success to prevent email enumeration
    }

    return NextResponse.json(
      { message: "If the email exists, an OTP has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { logPasswordResetComplete } from "@/utils/auditLogger";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { token, otp, newPassword } = await request.json();

    if ((!token && !otp) || !newPassword) {
      return NextResponse.json(
        { message: "Token/OTP and new password are required" },
        { status: 400 }
      );
    }

    let user;

    // Find user by token or OTP
    if (token) {
      // Find by reset token
      user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      });
    } else if (otp) {
      // Find by OTP (fallback for manual OTP entry)
      user = await User.findOne({
        otp: otp,
        otpExpiry: { $gt: new Date() },
      });
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token/OTP" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    // Log successful password reset
    await logPasswordResetComplete(user.email, request);

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Example: Admin User Deletion with CSRF Protection
 *
 * This example demonstrates maximum security for sensitive admin operations.
 *
 * Security Features:
 *   Strict rate limiting (3 requests/15 minutes)
 *   CSRF token validation
 *   Admin role verification
 *   Audit logging
 *   Soft delete (preserves data)
 *
 * @endpoint DELETE /api/admin/users/[userId]
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import { withRateLimitAndCSRF } from "@/utils/csrfProtection";
import { strictAuthLimiter } from "@/utils/rateLimiter";
import connectDB from "@/utils/connectDB";
import User from "@/models/user";
import AuditLog from "@/models/auditLog";

async function deleteUserHandler(req: NextRequest): Promise<NextResponse> {
  // Extract userId from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const userId = pathParts[pathParts.length - 1];
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Admin authorization check
    await connectDB();
    const adminUser = await User.findOne({ email: session.user.email });

    if (!adminUser || adminUser.role !== "Admin") {
      // Log unauthorized attempt
      await AuditLog.create({
        action: "ADMIN_DELETE_USER_UNAUTHORIZED",
        userId: (adminUser?._id || null) as any,
        userEmail: session.user.email,
        details: { attemptedToDelete: userId },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        status: "failed",
        timestamp: new Date(),
      } as any);

      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // 3. Get target user
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // 4. Prevent self-deletion
    if (targetUser._id.toString() === adminUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // 5. Prevent deletion of other admins (optional safeguard)
    if (targetUser.role === "Admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete admin accounts - contact super admin",
        },
        { status: 400 },
      );
    }

    // 6. Soft delete (deactivate instead of removing)
    targetUser.isActive = false;
    await targetUser.save();

    // 7. Log successful deletion
    await AuditLog.create({
      action: "ADMIN_DELETE_USER",
      userId: adminUser._id as any,
      userEmail: adminUser.email,
      details: {
        deletedUserId: targetUser._id,
        deletedUserEmail: targetUser.email,
        deletedUserRole: targetUser.role,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "success",
      timestamp: new Date(),
    } as any);

    // 8. Success response
    return NextResponse.json({
      success: true,
      message: "User deactivated successfully",
      user: {
        id: targetUser._id,
        email: targetUser.email,
        isActive: targetUser.isActive,
      },
    });
  } catch (error) {
    console.error("  [ADMIN] Delete user error:", error);

    return NextResponse.json(
      { success: false, message: "User deletion failed" },
      { status: 500 },
    );
  }
}

/**
 * Export protected endpoint
 *   Strict rate limiting: 3 requests per 15 minutes
 *   CSRF protection with single-use tokens
 */
export const DELETE = withRateLimitAndCSRF(
  deleteUserHandler,
  strictAuthLimiter,
);

/**
 * Client-side usage example:
 *
 * ```typescript
 * import { getCsrfToken } from "next-auth/react";
 *
 * async function deleteUser(userId: string) {
 *   // 1. Confirmation dialog
 *   const confirmed = confirm('Are you sure you want to delete this user?');
 *   if (!confirmed) return;
 *
 *   // 2. Get CSRF token
 *   const csrfToken = await getCsrfToken();
 *
 *   // 3. Make request
 *   const response = await fetch(`/api/admin/users/${userId}`, {
 *     method: 'DELETE',
 *     headers: {
 *       'X-CSRF-Token': csrfToken || '',
 *     },
 *   });
 *
 *   const data = await response.json();
 *
 *   if (!response.ok) {
 *     if (response.status === 403) {
 *       alert('CSRF validation failed or insufficient permissions');
 *     } else if (response.status === 429) {
 *       alert('Too many requests - please wait before trying again');
 *     }
 *     throw new Error(data.message);
 *   }
 *
 *   alert('User deleted successfully');
 *   return data;
 * }
 * ```
 */
